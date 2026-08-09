/**
 * PaintApp — AR Paint overlay on camera feed.
 *
 * INTERACTION MODEL (gesture-driven, no mouse needed):
 *   ☝️  Index finger only extended (POINT gesture)  → draw on canvas
 *   🤏  Pinch (thumb tip ↔ index tip close together) → "virtual click"
 *       Point your finger at a toolbar button, then pinch → selects it
 *   ✋  All other gestures                           → idle / nothing
 *
 * PINCH DETECTION:
 *   - Normalised distance between thumb tip (lm[4]) and index tip (lm[8])
 *   - PINCH_THRESHOLD: distance < 0.06  (normalised units)
 *   - Fires once per pinch (edge-triggered, needs release before next pinch)
 *
 * DRAWING:
 *   - Index finger extended, middle finger folded → draw stroke on canvas
 *   - Color, size, tool all apply to drawing
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Paintbrush,
  Pencil,
  Eraser,
  Circle,
  Undo2,
  Trash2,
  X,
  Minus,
  Plus,
  Hand,
  Palette,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
export type PaintTool = 'pencil' | 'brush' | 'eraser';

export interface PaintColor {
  name: string;
  hex: string;
}

export const PAINT_COLORS: PaintColor[] = [
  { name: 'White',   hex: '#ffffff' },
  { name: 'Red',     hex: '#ef4444' },
  { name: 'Orange',  hex: '#f97316' },
  { name: 'Yellow',  hex: '#eab308' },
  { name: 'Green',   hex: '#22c55e' },
  { name: 'Cyan',    hex: '#06b6d4' },
  { name: 'Blue',    hex: '#3b82f6' },
  { name: 'Purple',  hex: '#a855f7' },
  { name: 'Pink',    hex: '#ec4899' },
  { name: 'Black',   hex: '#000000' },
];

const MIN_BRUSH     = 2;
const MAX_BRUSH     = 24;
const DEFAULT_BRUSH = 4;

/** Normalised distance below which a pinch is considered "clicked" */
const PINCH_THRESHOLD = 0.06;
/** Normalised distance above which pinch is fully "released" */
const PINCH_RELEASE   = 0.10;

type Landmark = { x: number; y: number; z: number };

interface PaintAppProps {
  isActive: boolean;
  onClose: () => void;
  handLandmarks: Landmark[] | null;
  viewportWidth: number;
  viewportHeight: number;
  layerStackTop: number;
  layerStackLeft: number;
}

export const PaintApp: React.FC<PaintAppProps> = ({
  isActive,
  onClose,
  handLandmarks,
  viewportWidth,
  viewportHeight,
  layerStackTop,
  layerStackLeft,
}) => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [activeTool, setActiveTool]   = useState<PaintTool>('pencil');
  const [activeColor, setActiveColor] = useState<string>('#06b6d4');
  const [brushSize, setBrushSize]     = useState<number>(DEFAULT_BRUSH);
  const [showPalette, setShowPalette] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  /** 0-1: how close the pinch is (1 = fully pinched) */
  const [pinchDepth, setPinchDepth]   = useState(0);

  // Canvas ref for drawing
  const paintCanvasRef   = useRef<HTMLCanvasElement>(null);
  const undoStackRef     = useRef<ImageData[]>([]);
  const wasDrawingRef    = useRef(false);
  const lastDrawPointRef = useRef<{ x: number; y: number } | null>(null);
  const toolbarRef       = useRef<HTMLDivElement>(null);

  // Pinch state — edge-triggered so one pinch = one click
  const pinchFiredRef    = useRef(false);   // true while pinch is held

  // ── Gesture helpers ───────────────────────────────────────────────────────
  /** Euclidean distance between two landmarks (normalised) */
  const dist = (a: Landmark, b: Landmark) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  /** ☝️ Index extended, middle folded → draw mode */
  const isIndexExtended = useCallback((lm: Landmark[]): boolean => {
    if (!lm || lm.length < 21) return false;
    const indexUp  = lm[8].y < lm[6].y - 0.03;
    const middleDown = lm[12].y > lm[10].y - 0.02;
    return indexUp && middleDown;
  }, []);

  /** 🤏 Pinch: normalised dist thumb-tip ↔ index-tip */
  const getPinchDist = useCallback((lm: Landmark[]): number => {
    if (!lm || lm.length < 21) return 1;
    return dist(lm[4], lm[8]);
  }, []);

  // ── Drawing helpers ───────────────────────────────────────────────────────
  const getCtx = useCallback(() => {
    const c = paintCanvasRef.current;
    return c ? c.getContext('2d') : null;
  }, []);

  const pushUndo = useCallback(() => {
    const ctx = getCtx();
    const c   = paintCanvasRef.current;
    if (!ctx || !c) return;
    const img = ctx.getImageData(0, 0, c.width, c.height);
    undoStackRef.current.push(img);
    if (undoStackRef.current.length > 40) undoStackRef.current.shift();
  }, [getCtx]);

  const handleUndo = useCallback(() => {
    const ctx = getCtx();
    const c   = paintCanvasRef.current;
    if (!ctx || !c || undoStackRef.current.length === 0) return;
    ctx.putImageData(undoStackRef.current.pop()!, 0, 0);
  }, [getCtx]);

  const handleClear = useCallback(() => {
    pushUndo();
    const ctx = getCtx();
    const c   = paintCanvasRef.current;
    if (!ctx || !c) return;
    ctx.clearRect(0, 0, c.width, c.height);
  }, [getCtx, pushUndo]);

  const increaseBrush = useCallback(() => setBrushSize(s => Math.min(MAX_BRUSH, s + 2)), []);
  const decreaseBrush = useCallback(() => setBrushSize(s => Math.max(MIN_BRUSH, s - 2)), []);

  // ── Activate a toolbar item by its paint-id ───────────────────────────────
  const activateToolbarItem = useCallback((id: string) => {
    if      (id === 'pencil')    setActiveTool('pencil');
    else if (id === 'brush')     setActiveTool('brush');
    else if (id === 'eraser')    setActiveTool('eraser');
    else if (id === 'undo')      handleUndo();
    else if (id === 'clear')     handleClear();
    else if (id === 'close')     onClose();
    else if (id === 'size-up')   increaseBrush();
    else if (id === 'size-down') decreaseBrush();
    else if (id === 'palette')   setShowPalette(p => !p);
    else if (id.startsWith('color-')) {
      const hex = '#' + id.replace('color-', '');
      setActiveColor(hex);
      setShowPalette(false);
    }
  }, [handleUndo, handleClear, onClose, increaseBrush, decreaseBrush]);

  // ── Main hand-tracking loop ───────────────────────────────────────────────
  useEffect(() => {
    if (!isActive || !handLandmarks || handLandmarks.length < 21) {
      // No hand — reset everything
      setHoveredItem(null);
      setPinchDepth(0);
      pinchFiredRef.current = false;
      wasDrawingRef.current = false;
      lastDrawPointRef.current = null;
      return;
    }

    const lm          = handLandmarks;
    const pinchDist   = getPinchDist(lm);
    const isPinched   = pinchDist < PINCH_THRESHOLD;
    const indexUp     = isIndexExtended(lm);

    // ── Pinch depth for UI feedback ─────────────────────────────────────
    // Map distance from PINCH_RELEASE→PINCH_THRESHOLD to 0→1
    const depth = Math.max(0, Math.min(1,
      (PINCH_RELEASE - pinchDist) / (PINCH_RELEASE - PINCH_THRESHOLD)
    ));
    setPinchDepth(depth);

    // ── Index fingertip projected screen coords (mirrored for selfie cam) ─
    const indexTip     = lm[8];
    const fingerScreenX = (1 - indexTip.x) * viewportWidth  + layerStackLeft;
    const fingerScreenY = indexTip.y        * viewportHeight + layerStackTop;

    // ── Toolbar hover detection ─────────────────────────────────────────
    const toolbar = toolbarRef.current;
    let hitId: string | null = null;

    if (toolbar) {
      const items = toolbar.querySelectorAll('[data-paint-id]');
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const pad  = 10;
        if (
          fingerScreenX >= rect.left - pad &&
          fingerScreenX <= rect.right  + pad &&
          fingerScreenY >= rect.top    - pad &&
          fingerScreenY <= rect.bottom + pad
        ) {
          hitId = el.getAttribute('data-paint-id');
        }
      });
    }

    setHoveredItem(hitId);

    // ── Pinch-to-click (edge-triggered) ────────────────────────────────
    if (isPinched && !pinchFiredRef.current) {
      pinchFiredRef.current = true;    // lock — wait for release
      if (hitId) {
        // Clicked a toolbar item
        activateToolbarItem(hitId);
        wasDrawingRef.current = false;
        lastDrawPointRef.current = null;
        return;
      }
    }

    // Release pinch → allow next pinch
    if (!isPinched && pinchDist > PINCH_RELEASE) {
      pinchFiredRef.current = false;
    }

    // ── Drawing: index finger extended, NOT pinching ────────────────────
    if (isPinched || !indexUp) {
      // Stop drawing during pinch or when finger not extended
      wasDrawingRef.current = false;
      lastDrawPointRef.current = null;
      return;
    }

    // Map finger to canvas coords
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = (1 - indexTip.x) * canvas.width;
    const cy = indexTip.y * canvas.height;

    if (!wasDrawingRef.current) {
      pushUndo();
      wasDrawingRef.current = true;
      lastDrawPointRef.current = { x: cx, y: cy };
      return;
    }

    const last = lastDrawPointRef.current;
    if (!last) { lastDrawPointRef.current = { x: cx, y: cy }; return; }

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(cx, cy);

    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth   = brushSize * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = activeColor;
      ctx.lineWidth   = activeTool === 'brush' ? brushSize * 2 : brushSize;
    }

    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastDrawPointRef.current = { x: cx, y: cy };
  }, [
    handLandmarks, isActive, activeTool, activeColor, brushSize,
    isIndexExtended, getPinchDist, pushUndo, activateToolbarItem,
    viewportWidth, viewportHeight, layerStackTop, layerStackLeft,
  ]);

  // ── Resize canvas ─────────────────────────────────────────────────────────
  useEffect(() => {
    const c = paintCanvasRef.current;
    if (!c) return;
    c.width  = 960;
    c.height = 540;
  }, [isActive]);

  if (!isActive) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  const eraseWidth = brushSize * 3;
  const drawWidth  = activeTool === 'brush' ? brushSize * 2 : brushSize;
  const cursorSize = (activeTool === 'eraser' ? eraseWidth : drawWidth) + 8;

  // Pinch ring around fingertip: grows + turns purple when pinching
  const isPinching = pinchDepth > 0.3;

  return (
    <>
      {/* ── Drawing canvas ─────────────────────────────────────────────── */}
      <canvas
        ref={paintCanvasRef}
        className="paint-draw-layer"
        width={960}
        height={540}
      />

      {/* ── Finger cursor ──────────────────────────────────────────────── */}
      {handLandmarks && handLandmarks.length >= 21 && (
        <div
          className="paint-finger-cursor"
          style={{
            left:        `${(1 - handLandmarks[8].x) * 100}%`,
            top:         `${handLandmarks[8].y * 100}%`,
            width:       `${cursorSize}px`,
            height:      `${cursorSize}px`,
            borderColor: isPinching
              ? '#a855f7'
              : activeTool === 'eraser' ? '#ef4444' : activeColor,
            boxShadow: isPinching
              ? `0 0 ${16 + pinchDepth * 16}px rgba(168,85,247,0.8)`
              : `0 0 12px rgba(6,182,212,0.5)`,
            transform:   `translate(-50%,-50%) scale(${1 - pinchDepth * 0.2})`,
            transition:  'border-color 0.1s, box-shadow 0.1s, transform 0.1s',
          }}
        />
      )}

      {/* ── Pinch depth ring (thumb-tip indicator) ─────────────────────── */}
      {handLandmarks && handLandmarks.length >= 21 && pinchDepth > 0.05 && (
        <div
          style={{
            position:    'absolute',
            left:        `${(1 - handLandmarks[4].x) * 100}%`,
            top:         `${handLandmarks[4].y * 100}%`,
            width:       `${12 + pinchDepth * 16}px`,
            height:      `${12 + pinchDepth * 16}px`,
            borderRadius:'50%',
            border:      `2px solid rgba(168,85,247,${0.4 + pinchDepth * 0.6})`,
            background:  `rgba(168,85,247,${pinchDepth * 0.3})`,
            transform:   'translate(-50%,-50%)',
            pointerEvents:'none',
            zIndex:       6,
            transition:  'all 0.05s',
          }}
        />
      )}

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="paint-toolbar" ref={toolbarRef}>

        {/* Tools */}
        <div className="paint-toolbar-section">
          <span className="paint-section-label"><Palette size={12} /> Tools</span>
          <div className="paint-tool-group">
            <button
              data-paint-id="pencil"
              className={`paint-tool-btn ${activeTool === 'pencil' ? 'active' : ''} ${hoveredItem === 'pencil' ? 'hand-hover' : ''}`}
              onClick={() => setActiveTool('pencil')}
              title="Pencil"
            >
              <Pencil size={16} />
              <span>Pencil</span>
            </button>
            <button
              data-paint-id="brush"
              className={`paint-tool-btn ${activeTool === 'brush' ? 'active' : ''} ${hoveredItem === 'brush' ? 'hand-hover' : ''}`}
              onClick={() => setActiveTool('brush')}
              title="Brush"
            >
              <Paintbrush size={16} />
              <span>Brush</span>
            </button>
            <button
              data-paint-id="eraser"
              className={`paint-tool-btn ${activeTool === 'eraser' ? 'active' : ''} ${hoveredItem === 'eraser' ? 'hand-hover' : ''}`}
              onClick={() => setActiveTool('eraser')}
              title="Eraser"
            >
              <Eraser size={16} />
              <span>Eraser</span>
            </button>
          </div>
        </div>

        <div className="paint-toolbar-divider" />

        {/* Colors */}
        <div className="paint-toolbar-section">
          <span className="paint-section-label">Color</span>
          <div className="paint-tool-group">
            <button
              data-paint-id="palette"
              className={`paint-tool-btn color-preview-btn ${hoveredItem === 'palette' ? 'hand-hover' : ''}`}
              onClick={() => setShowPalette(p => !p)}
              title="Pick Color"
            >
              <div className="active-color-dot" style={{ background: activeColor }} />
              <span>Color</span>
            </button>
            {PAINT_COLORS.slice(0, 6).map((c) => (
              <button
                key={c.hex}
                data-paint-id={`color-${c.hex.replace('#', '')}`}
                className={`paint-color-swatch ${activeColor === c.hex ? 'active' : ''} ${hoveredItem === `color-${c.hex.replace('#', '')}` ? 'hand-hover' : ''}`}
                style={{ background: c.hex }}
                onClick={() => { setActiveColor(c.hex); setShowPalette(false); }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className="paint-toolbar-divider" />

        {/* Brush Size */}
        <div className="paint-toolbar-section">
          <span className="paint-section-label">Size</span>
          <div className="paint-tool-group">
            <button
              data-paint-id="size-down"
              className={`paint-tool-btn ${hoveredItem === 'size-down' ? 'hand-hover' : ''}`}
              onClick={decreaseBrush}
              title="Decrease Size"
            >
              <Minus size={14} />
            </button>
            <div className="paint-size-indicator">
              <Circle size={Math.max(8, brushSize)} strokeWidth={2} />
              <span>{brushSize}px</span>
            </div>
            <button
              data-paint-id="size-up"
              className={`paint-tool-btn ${hoveredItem === 'size-up' ? 'hand-hover' : ''}`}
              onClick={increaseBrush}
              title="Increase Size"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="paint-toolbar-divider" />

        {/* Actions */}
        <div className="paint-toolbar-section">
          <div className="paint-tool-group">
            <button
              data-paint-id="undo"
              className={`paint-tool-btn ${hoveredItem === 'undo' ? 'hand-hover' : ''}`}
              onClick={handleUndo}
              title="Undo"
            >
              <Undo2 size={16} />
              <span>Undo</span>
            </button>
            <button
              data-paint-id="clear"
              className={`paint-tool-btn danger ${hoveredItem === 'clear' ? 'hand-hover' : ''}`}
              onClick={handleClear}
              title="Clear All"
            >
              <Trash2 size={16} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          data-paint-id="close"
          className={`paint-close-btn ${hoveredItem === 'close' ? 'hand-hover' : ''}`}
          onClick={onClose}
          title="Close Paint App"
        >
          <X size={18} />
        </button>

        {/* Gesture hint */}
        <div className="paint-hand-hint">
          <Hand size={12} />
          <span>☝️ Point &amp; draw · 🤏 Pinch to select</span>
        </div>
      </div>

      {/* ── Full color palette dropdown ─────────────────────────────────── */}
      {showPalette && (
        <div className="paint-palette-dropdown">
          {PAINT_COLORS.map((c) => (
            <button
              key={c.hex}
              data-paint-id={`color-${c.hex.replace('#', '')}`}
              className={`paint-palette-swatch ${activeColor === c.hex ? 'active' : ''} ${hoveredItem === `color-${c.hex.replace('#', '')}` ? 'hand-hover' : ''}`}
              style={{ background: c.hex }}
              onClick={() => { setActiveColor(c.hex); setShowPalette(false); }}
              title={c.name}
            >
              <span className="palette-swatch-label">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};
