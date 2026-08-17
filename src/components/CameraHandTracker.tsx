/**
 * CameraHandTracker — Camera feed + AR Three.js overlay + MediaPipe hand tracking.
 *
 * Responsibilities (single-concern modules within the component):
 *   1. Webcam stream acquisition
 *   2. Three.js AR overlay (transparent WebGL canvas on top of video)
 *   3. MediaPipe Hands initialisation and per-frame inference
 *   4. Hand skeleton canvas draw (landmarks + connections)
 *   5. Gesture classification via GestureController
 *   6. Gesture → 3D-object interaction mapping (grab/move/rotate/scale)
 *   7. Finger drawing canvas
 *
 * Extends the existing architecture — does NOT replace any existing feature.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Hand, Sparkles, Paintbrush } from 'lucide-react';
import { RepresentationPayload } from '../types';
import { classifyGesture, gestureLabelFor, GestureResult } from '../services/gestureController';
import { PaintApp } from './PaintApp';

// ── MediaPipe type stubs (loaded dynamically via CDN) ──────────────────────
interface MPHandResults {
  multiHandLandmarks?: { x: number; y: number; z: number }[][];
  image: HTMLVideoElement | HTMLImageElement;
}
type MPHandsInstance = {
  setOptions: (o: object) => void;
  onResults: (cb: (r: MPHandResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
};

interface CameraHandTrackerProps {
  isCameraActive: boolean;
  isDrawingMode: boolean;
  brushColor: string;
  brushSize: number;
  activePayload: RepresentationPayload | null;
  onGestureDetected?: (gestureName: string, coords: { x: number; y: number }) => void;
}

// MediaPipe hand skeleton connections (21 landmarks)
const HAND_CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],
  [13,17],[0,17],[17,18],[18,19],[19,20],
];

export const CameraHandTracker: React.FC<CameraHandTrackerProps> = ({
  isCameraActive,
  isDrawingMode,
  brushColor,
  brushSize,
  activePayload,
  onGestureDetected,
}) => {
  const videoRef        = useRef<HTMLVideoElement>(null);
  const arCanvasRef     = useRef<HTMLCanvasElement>(null);
  const handCanvasRef   = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef= useRef<HTMLCanvasElement>(null);

  const rendererRef     = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef        = useRef<THREE.Scene | null>(null);
  const cameraRef       = useRef<THREE.PerspectiveCamera | null>(null);
  const objectGroupRef  = useRef<THREE.Group | null>(null);
  const animFrameRef    = useRef<number>(0);
  const handsRef        = useRef<MPHandsInstance | null>(null);
  const mpLoopRef       = useRef<number>(0);
  const streamRef       = useRef<MediaStream | null>(null);

  // Drag state for mouse fallback
  const isDraggingRef   = useRef(false);
  const prevMouseRef    = useRef({ x: 0, y: 0 });

  // Gesture-driven interaction state
  const grabActiveRef        = useRef(false);
  const grabStartPosRef      = useRef({ x: 0, y: 0 });
  const grabStartGroupPos    = useRef(new THREE.Vector3());
  const lastGestureRef       = useRef<GestureResult | null>(null);

  const [detectedGesture, setDetectedGesture] = useState<string>('Initialising...');
  const [mpReady, setMpReady] = useState(false);

  // Paint App state
  const [isPaintMode, setIsPaintMode]       = useState(false);
  const [currentHandLandmarks, setCurrentHandLandmarks] = useState<{ x: number; y: number; z: number }[] | null>(null);
  const layerStackRef = useRef<HTMLDivElement>(null);
  const hudRef        = useRef<HTMLDivElement>(null);

  // HUD gesture-click state
  const [hudHoveredItem, setHudHoveredItem] = useState<string | null>(null);
  const hudPinchFiredRef = useRef(false);

  // Drawing state
  const isDrawingRef    = useRef(false);
  const lastPointRef    = useRef<{ x: number; y: number } | null>(null);

  // ── 1. Webcam stream ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCameraActive) return;
    let cancelled = false;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 960, height: 540, facingMode: 'user' },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('[CameraHandTracker] Camera access denied:', err);
      }
    };

    startCamera();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [isCameraActive]);

  // ── 2. Three.js AR overlay ──────────────────────────────────────────────
  useEffect(() => {
    if (!isCameraActive || !arCanvasRef.current) return;

    const canvas = arCanvasRef.current;
    const W = 960, H = 540;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const cam = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    cam.position.set(0, 1.5, 6);
    cam.lookAt(0, 0, 0);
    cameraRef.current = cam;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0x06b6d4, 2.0);
    dir.position.set(3, 5, 4);
    dir.castShadow = true;
    scene.add(dir);
    const pt = new THREE.PointLight(0xa855f7, 1.5, 15);
    pt.position.set(-3, 2, 2);
    scene.add(pt);

    const group = new THREE.Group();
    objectGroupRef.current = group;
    scene.add(group);

    // Mouse-drag rotation fallback (active when no hand gesture is grabbing)
    const onDown = (e: MouseEvent) => {
      if (isDrawingMode || grabActiveRef.current) return;
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !group) return;
      group.rotation.y += (e.clientX - prevMouseRef.current.x) * 0.01;
      group.rotation.x += (e.clientY - prevMouseRef.current.y) * 0.01;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { isDraggingRef.current = false; };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (group && !isDraggingRef.current && !grabActiveRef.current) {
        group.rotation.y += 0.006;
      }
      renderer.render(scene, cam);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [isCameraActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3. Rebuild AR meshes when payload changes ───────────────────────────
  useEffect(() => {
    const group = objectGroupRef.current;
    if (!group) return;

    // Clear previous meshes
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (Array.isArray(child.material) ? child.material : [child.material])
          .forEach((m: THREE.Material) => m.dispose());
      }
    }

    if (!activePayload || activePayload.type !== '3d_scene' || !activePayload.threeDData) return;

    const primaryType = activePayload.threeDData.primaryObject || 'sphere';
    const obj0        = activePayload.threeDData.objects[0];
    const colorHex    = obj0?.properties?.color || '#06b6d4';
    const sizeScale   = obj0?.properties?.size || 1.0;
    const fillLevel   = obj0?.properties?.fillLevel ?? 0;

    buildARObject(group, primaryType, colorHex, sizeScale, fillLevel);
  }, [activePayload]);

  // ── 4. MediaPipe Hands initialisation (lazy CDN load) ──────────────────
  useEffect(() => {
    if (!isCameraActive) return;
    let cancelled = false;

    const initMediaPipe = async () => {
      try {
        // Dynamically load MediaPipe from CDN to avoid bundler WASM issues
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
        script.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
          script.onload  = () => resolve();
          script.onerror = () => reject(new Error('MediaPipe script failed to load'));
          document.head.appendChild(script);
        });

        if (cancelled) return;

        const HandsClass = (window as any).Hands;
        if (!HandsClass) { console.warn('[CameraHandTracker] MediaPipe Hands not available'); return; }

        const hands: MPHandsInstance = new HandsClass({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.5,
        });

        hands.onResults(handleHandResults);
        handsRef.current = hands;
        if (!cancelled) setMpReady(true);
        console.log('[CameraHandTracker] MediaPipe Hands ready (Dual Hand Enabled)');
      } catch (err) {
        console.warn('[CameraHandTracker] MediaPipe init failed, using mouse fallback:', err);
        setDetectedGesture('Mouse Mode');
      }
    };

    initMediaPipe();
    return () => { cancelled = true; };
  }, [isCameraActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 5. MediaPipe inference loop (runs at ~30fps after MP is ready) ──────
  useEffect(() => {
    if (!mpReady || !isCameraActive) return;
    let running = true;

    const runLoop = async () => {
      if (!running || !videoRef.current || videoRef.current.readyState < 2) {
        if (running) mpLoopRef.current = requestAnimationFrame(runLoop);
        return;
      }
      try {
        await handsRef.current?.send({ image: videoRef.current });
      } catch {/* ignore frames that error */ }
      if (running) mpLoopRef.current = requestAnimationFrame(runLoop);
    };

    mpLoopRef.current = requestAnimationFrame(runLoop);
    return () => {
      running = false;
      cancelAnimationFrame(mpLoopRef.current);
    };
  }, [mpReady, isCameraActive]);

  // ── 6. Process MediaPipe results ────────────────────────────────────────
  const handleHandResults = useCallback((results: MPHandResults) => {
    const hCanvas = handCanvasRef.current;
    if (!hCanvas) return;
    const ctx = hCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, hCanvas.width, hCanvas.height);

    if (!results.multiHandLandmarks?.length) {
      setDetectedGesture('No hands');
      grabActiveRef.current = false;
      setCurrentHandLandmarks(null);
      setHudHoveredItem(null);
      hudPinchFiredRef.current = false;
      return;
    }

    const W = hCanvas.width;
    const H = hCanvas.height;
    const detectedLabels: string[] = [];

    // Loop through ALL detected hands (Up to 2 hands)
    results.multiHandLandmarks.forEach((landmarks, handIdx) => {
      const colorHue = handIdx === 0 ? 'rgba(6, 182, 212, 0.8)' : 'rgba(236, 72, 153, 0.8)';
      const tipColor = handIdx === 0 ? '#a855f7' : '#f59e0b';

      // Draw skeleton connections for this hand
      ctx.strokeStyle = colorHue;
      ctx.lineWidth = 2.5;
      HAND_CONNECTIONS.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(landmarks[a].x * W, landmarks[a].y * H);
        ctx.lineTo(landmarks[b].x * W, landmarks[b].y * H);
        ctx.stroke();
      });

      // Draw landmark dots
      landmarks.forEach((lm, i) => {
        const isTip = [4, 8, 12, 16, 20].includes(i);
        ctx.beginPath();
        ctx.arc(lm.x * W, lm.y * H, isTip ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isTip ? tipColor : colorHue;
        ctx.fill();
      });

      // Classify gesture for primary hand and secondary hand
      const gesture = classifyGesture(landmarks);
      detectedLabels.push(`H${handIdx + 1}: ${gestureLabelFor(gesture.name)}`);

      if (handIdx === 0) {
        lastGestureRef.current = gesture;
        onGestureDetected?.(gesture.name, { x: gesture.x, y: gesture.y });
        applyGestureInteraction(gesture);
        setCurrentHandLandmarks(landmarks);

        // ── HUD gesture-click: detect pinch over HUD buttons ─────────────
        const PINCH_THRESH = 0.06;
        const PINCH_REL    = 0.10;
        const lm4 = landmarks[4]; // thumb tip
        const lm8 = landmarks[8]; // index tip
        const pinchDist = Math.sqrt((lm4.x - lm8.x) ** 2 + (lm4.y - lm8.y) ** 2);
        const isPinched = pinchDist < PINCH_THRESH;

        const stack = layerStackRef.current;
        const fingerScreenX = stack
          ? (1 - lm8.x) * stack.offsetWidth  + stack.getBoundingClientRect().left
          : 0;
        const fingerScreenY = stack
          ? lm8.y * stack.offsetHeight + stack.getBoundingClientRect().top
          : 0;

        // Check HUD buttons
        const hud = hudRef.current;
        let hudHit: string | null = null;
        if (hud) {
          hud.querySelectorAll('[data-hud-id]').forEach((el) => {
            const r = el.getBoundingClientRect();
            const pad = 10;
            if (
              fingerScreenX >= r.left - pad && fingerScreenX <= r.right  + pad &&
              fingerScreenY >= r.top  - pad && fingerScreenY <= r.bottom + pad
            ) { hudHit = el.getAttribute('data-hud-id'); }
          });
        }
        setHudHoveredItem(hudHit);

        if (isPinched && !hudPinchFiredRef.current) {
          hudPinchFiredRef.current = true;
          if (hudHit === 'paint-toggle') {
            setIsPaintMode(p => !p);
          }
        }
        if (!isPinched && pinchDist > PINCH_REL) {
          hudPinchFiredRef.current = false;
        }
      }
    });

    setDetectedGesture(detectedLabels.join(' | '));
  }, [onGestureDetected]);

  // ── 7. Map gesture to 3D object interaction ─────────────────────────────
  const applyGestureInteraction = (gesture: GestureResult) => {
    const group = objectGroupRef.current;
    if (!group) return;

    const { name, x, y } = gesture;

    if (name === 'GRAB' || name === 'PINCH') {
      if (!grabActiveRef.current) {
        // Start grab — snapshot current group position
        grabActiveRef.current = true;
        grabStartPosRef.current = { x, y };
        grabStartGroupPos.current.copy(group.position);
      } else {
        // Drag — translate the group relative to hand movement
        const dx = (x - grabStartPosRef.current.x) * 8;
        const dy = (y - grabStartPosRef.current.y) * 6;
        group.position.x = grabStartGroupPos.current.x + dx;
        group.position.y = grabStartGroupPos.current.y - dy;
      }
    } else if (name === 'OPEN_PALM' && grabActiveRef.current) {
      // Release
      grabActiveRef.current = false;
    } else if (name === 'POINT') {
      // Point → gentle rotation toward pointing direction
      group.rotation.y += (x - 0.5) * 0.05;
    }
  };

  // ── Drawing canvas handlers ─────────────────────────────────────────────
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !drawingCanvasRef.current) return;
    isDrawingRef.current = true;
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    lastPointRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !drawingCanvasRef.current || !lastPointRef.current) return;
    const ctx = drawingCanvasRef.current.getContext('2d');
    if (!ctx) return;
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth   = brushSize;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    lastPointRef.current = { x: cx, y: cy };
  };
  const stopDrawing  = () => { isDrawingRef.current = false; lastPointRef.current = null; };
  const clearDrawing = () => {
    if (!drawingCanvasRef.current) return;
    drawingCanvasRef.current.getContext('2d')
      ?.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
  };

  if (!isCameraActive && !isDrawingMode) return null;

  const has3DOverlay = activePayload?.type === '3d_scene' && isCameraActive;

  return (
    <div className="camera-ar-fullscreen">
      {isCameraActive && (
        <div className="ar-viewport-container">
          <div className="ar-hud-bar" ref={hudRef}>
            <span className="live-indicator">
              <span className="red-dot"></span> LIVE CAMERA + AR OVERLAY
            </span>
            <span className="gesture-status">
              <Hand size={14} /> {detectedGesture}
              {mpReady && <span className="mp-badge"> · MediaPipe ✓</span>}
            </span>
            {has3DOverlay && (
              <span className="ar-object-badge">
                <Sparkles size={12} /> 3D Active — Grab/Drag/Rotate
              </span>
            )}
            <button
              data-hud-id="paint-toggle"
              className={`paint-app-toggle-btn ${isPaintMode ? 'active' : ''} ${hudHoveredItem === 'paint-toggle' ? 'hand-hover' : ''}`}
              onClick={() => setIsPaintMode(p => !p)}
              title="Toggle Paint App (point finger + pinch to open)"
            >
              <Paintbrush size={14} />
              <span>{isPaintMode ? 'Close Paint' : 'Paint App'}</span>
            </button>
          </div>

          {/* Layered stack: video → 3D WebGL → hand skeleton → HUD */}
          <div className="ar-layer-stack" ref={layerStackRef}>
            {/* Layer 0: Live webcam video */}
            <video ref={videoRef} className="ar-video-layer" muted playsInline />

            {/* Layer 1: Three.js AR overlay */}
            <canvas ref={arCanvasRef} className="ar-3d-layer" width={960} height={540} />

            {/* Layer 2: MediaPipe hand skeleton drawing */}
            <canvas ref={handCanvasRef} className="ar-hand-layer" width={960} height={540} />

            {/* Layer 3: Paint App overlay */}
            <PaintApp
              isActive={isPaintMode}
              onClose={() => setIsPaintMode(false)}
              handLandmarks={currentHandLandmarks}
              viewportWidth={layerStackRef.current?.offsetWidth || 960}
              viewportHeight={layerStackRef.current?.offsetHeight || 540}
              layerStackTop={layerStackRef.current?.getBoundingClientRect().top || 0}
              layerStackLeft={layerStackRef.current?.getBoundingClientRect().left || 0}
            />

            {/* Properties HUD */}
            {has3DOverlay && activePayload.threeDData?.objects[0] && !isPaintMode && (
              <div className="ar-props-hud">
                <h4>AR Object</h4>
                <div className="ar-prop"><span>Type:</span>
                  <strong>{activePayload.threeDData.objects[0].type}</strong>
                </div>
                <div className="ar-prop"><span>Color:</span>
                  <strong style={{ color: activePayload.threeDData.objects[0].properties.color }}>
                    {activePayload.threeDData.objects[0].properties.color}
                  </strong>
                </div>
                {activePayload.threeDData.objects[0].properties.fillLevel !== undefined && (
                  <div className="ar-prop"><span>Fill:</span>
                    <strong>{activePayload.threeDData.objects[0].properties.fillLevel}%</strong>
                  </div>
                )}
                <div className="ar-prop"><span>Scale:</span>
                  <strong>{(activePayload.threeDData.objects[0].properties.size || 1).toFixed(1)}x</strong>
                </div>
                <div className="ar-prop gesture-hint">
                  <span>Gesture:</span><strong>{detectedGesture}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Finger drawing overlay */}
      {isDrawingMode && (
        <div className="drawing-canvas-overlay">
          <div className="drawing-hud-bar">
            <span><Sparkles size={14} /> Drawing Mode Active</span>
            <button className="clear-draw-btn" onClick={clearDrawing}>Clear</button>
          </div>
          <canvas
            ref={drawingCanvasRef}
            className="drawing-canvas"
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      )}
    </div>
  );
};

// ── AR mesh builder ───────────────────────────────────────────────────────────
function buildARObject(
  group: THREE.Group,
  type: string,
  colorHex: string,
  sizeScale: number,
  fillLevel: number
) {
  const color = new THREE.Color(colorHex);
  const metal = (c: THREE.ColorRepresentation, roughness = 0.2, metalness = 0.85) =>
    new THREE.MeshStandardMaterial({ color: c, roughness, metalness });
  const glass = (c: THREE.ColorRepresentation, opacity = 0.4) =>
    new THREE.MeshPhysicalMaterial({ color: c, transparent: true, opacity, roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide });
  const matte = (c: THREE.ColorRepresentation, roughness = 0.7) =>
    new THREE.MeshStandardMaterial({ color: c, roughness });
  const glow  = (c: THREE.ColorRepresentation, intensity = 1.5) =>
    new THREE.MeshStandardMaterial({ color: c, emissive: new THREE.Color(c), emissiveIntensity: intensity });

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, px=0,py=0,pz=0, rx=0,ry=0,rz=0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(px,py,pz); m.rotation.set(rx,ry,rz);
    group.add(m);
    return m;
  };

  // ── Water Bottle ──────────────────────────────────────────────────────────
  if (type === 'water_bottle') {
    add(new THREE.CylinderGeometry(0.6,0.6,2.4,32,1,true), glass(0xffffff,0.25));
    const bot = add(new THREE.CircleGeometry(0.6,32), glass(0xffffff,0.15)); bot.rotation.x=-Math.PI/2; bot.position.y=-1.2;
    add(new THREE.CylinderGeometry(0.35,0.45,0.35,32), metal(0x334155), 0,1.35,0);
    const liqH = Math.max(0.05,(fillLevel/100)*2.2);
    add(new THREE.CylinderGeometry(0.56,0.56,liqH,32), new THREE.MeshStandardMaterial({color,transparent:true,opacity:0.75,roughness:0.15}),0,-1.2+liqH/2,0);
    const rim = add(new THREE.TorusGeometry(0.6,0.03,16,48), glow(0x06b6d4,2),0,1.2,0); rim.rotation.x=Math.PI/2;

  // ── Car ───────────────────────────────────────────────────────────────────
  } else if (type === 'car') {
    add(new THREE.BoxGeometry(3.2,0.9,1.6), metal(color,0.25));
    add(new THREE.BoxGeometry(1.6,0.65,1.3), glass(0x0f172a,0.55), -0.15,0.78,0);
    const wg=new THREE.CylinderGeometry(0.35,0.35,0.3,20), wm=matte(0x111111);
    ([[1,-0.45,0.9],[-1,-0.45,0.9],[1,-0.45,-0.9],[-1,-0.45,-0.9]] as [number,number,number][])
      .forEach(p=>{ const w=new THREE.Mesh(wg,wm); w.rotation.x=Math.PI/2; w.position.set(...p); group.add(w); });

  // ── Building ──────────────────────────────────────────────────────────────
  } else if (type === 'building') {
    for(let i=0;i<14;i++){
      add(new THREE.BoxGeometry(1.8,0.22,1.8), metal(0x334155,0.7), 0,-1.5+i*0.3,0);
      add(new THREE.BoxGeometry(1.65,0.25,1.65), glass(0x38bdf8,0.45), 0,-1.5+i*0.3+0.12,0);
    }

  // ── Bag ───────────────────────────────────────────────────────────────────
  } else if (type === 'bag') {
    // Main body
    add(new THREE.BoxGeometry(1.8,1.4,0.7,4,4), matte(color,0.8));
    // Flap
    add(new THREE.BoxGeometry(1.8,0.55,0.05), matte(new THREE.Color(colorHex).offsetHSL(0,0,-0.15),0.8), 0,0.55,0.38);
    // Handle
    const hg=new THREE.TorusGeometry(0.5,0.06,8,20,Math.PI);
    const h=new THREE.Mesh(hg, metal(0x8B6914)); h.position.set(0,1.0,0); h.rotation.z=Math.PI; group.add(h);
    // Clasp
    add(new THREE.BoxGeometry(0.28,0.18,0.12), metal(0xd4af37,0.1,0.9), 0,0.22,0.40);
    // Strap lines
    add(new THREE.BoxGeometry(0.04,1.4,0.04), matte(0x5c3d11), -0.7,0,0.38);
    add(new THREE.BoxGeometry(0.04,1.4,0.04), matte(0x5c3d11),  0.7,0,0.38);

  // ── Phone ─────────────────────────────────────────────────────────────────
  } else if (type === 'phone') {
    // Body
    add(new THREE.BoxGeometry(0.85,1.75,0.09,2,2), matte(color,0.3));
    // Screen
    add(new THREE.BoxGeometry(0.76,1.6,0.02), new THREE.MeshStandardMaterial({color:0x050a14,roughness:0.05,metalness:0.2}), 0,0.04,0.055);
    // Screen glow
    add(new THREE.BoxGeometry(0.72,1.52,0.01), new THREE.MeshStandardMaterial({color:0x06b6d4,emissive:new THREE.Color(0x06b6d4),emissiveIntensity:0.15,transparent:true,opacity:0.8}), 0,0.04,0.065);
    // Camera
    add(new THREE.CylinderGeometry(0.07,0.07,0.02,16), metal(0x1a1a2e), 0,0.78,-0.055);
    // Home bar
    add(new THREE.BoxGeometry(0.3,0.04,0.02), metal(0x334155,0.3), 0,-0.82,0.058);

  // ── Laptop ────────────────────────────────────────────────────────────────
  } else if (type === 'laptop') {
    // Base
    add(new THREE.BoxGeometry(2.2,0.1,1.5), metal(color,0.2));
    // Keyboard area
    add(new THREE.BoxGeometry(1.9,0.02,1.1), matte(0x1a1a1a,0.9), 0,0.06,-0.1);
    // Trackpad
    add(new THREE.BoxGeometry(0.6,0.02,0.4), matte(0x2a2a2a,0.4), 0,0.065,0.4);
    // Screen (open ~110°)
    const screen = new THREE.Group();
    screen.add(new THREE.Mesh(new THREE.BoxGeometry(2.2,1.4,0.08), metal(color,0.2)));
    const disp = new THREE.Mesh(new THREE.BoxGeometry(2.0,1.25,0.02), new THREE.MeshStandardMaterial({color:0x050a14,roughness:0.05}));
    disp.position.set(0,0,0.05); screen.add(disp);
    const glowDisp = new THREE.Mesh(new THREE.BoxGeometry(1.95,1.2,0.01), glow(0x3b82f6,0.2));
    glowDisp.position.set(0,0,0.06); screen.add(glowDisp);
    screen.position.set(0,0.75,-0.65); screen.rotation.x=-Math.PI/5;
    group.add(screen);

  // ── Chair ─────────────────────────────────────────────────────────────────
  } else if (type === 'chair') {
    // Seat
    add(new THREE.BoxGeometry(1.5,0.12,1.5), matte(color,0.7));
    // Back
    add(new THREE.BoxGeometry(1.5,1.6,0.1), matte(color,0.7), 0,0.94,-0.7);
    // Legs
    ([[-0.65,-0.72,0.65],[0.65,-0.72,0.65],[-0.65,-0.72,-0.65],[0.65,-0.72,-0.65]] as [number,number,number][])
      .forEach(p=>add(new THREE.CylinderGeometry(0.07,0.07,1.4,8), metal(0x5c3d11), ...p));

  // ── Shoe ─────────────────────────────────────────────────────────────────
  } else if (type === 'shoe') {
    // Sole
    add(new THREE.BoxGeometry(1.8,0.2,0.7), matte(0x222222,0.9), 0,-0.4,0);
    // Midsole
    add(new THREE.BoxGeometry(1.75,0.18,0.65), matte(0xffffff,0.5), 0,-0.22,0);
    // Upper body
    add(new THREE.BoxGeometry(1.4,0.5,0.6), matte(color,0.6), -0.15,0.07,0);
    // Toe cap
    add(new THREE.SphereGeometry(0.38,16,8), matte(color,0.5), 0.7,0,0);
    // Heel
    add(new THREE.BoxGeometry(0.55,0.45,0.6), matte(color,0.7), -0.63,0.05,0);
    // Laces
    for(let i=0;i<4;i++) add(new THREE.BoxGeometry(0.55,0.03,0.55), matte(0xffffff,0.5), -0.1+i*0.01,0.32+i*0.0,0);

  // ── Watch ─────────────────────────────────────────────────────────────────
  } else if (type === 'watch') {
    // Case
    add(new THREE.CylinderGeometry(0.7,0.7,0.22,32), metal(color.getHex?color.getHex():0xd4af37,0.05,0.95));
    // Crystal (glass face)
    add(new THREE.CylinderGeometry(0.68,0.68,0.04,32), glass(0xffffff,0.15), 0,0.13,0);
    // Dial
    add(new THREE.CylinderGeometry(0.62,0.62,0.01,32), matte(0x0a0a0a,0.8), 0,0.12,0);
    // Hands
    add(new THREE.BoxGeometry(0.05,0.5,0.02), matte(0xffffff), 0,0.36,0);
    add(new THREE.BoxGeometry(0.04,0.3,0.02), matte(0xffffff), 0,0.27,0);
    // Glow ring
    const wr=add(new THREE.TorusGeometry(0.7,0.04,8,32), glow(0xd4af37,1.0)); wr.rotation.x=Math.PI/2;
    // Strap
    add(new THREE.BoxGeometry(0.55,1.0,0.18), matte(0x1a0a00,0.9), 0,-0.85,0);
    add(new THREE.BoxGeometry(0.55,1.0,0.18), matte(0x1a0a00,0.9), 0,0.85,0);

  // ── Tree ─────────────────────────────────────────────────────────────────
  } else if (type === 'tree') {
    // Trunk
    add(new THREE.CylinderGeometry(0.18,0.25,1.5,10), matte(0x6b3d0f,0.9), 0,-1.0,0);
    // Foliage layers
    add(new THREE.ConeGeometry(1.1,1.2,12), matte(color,0.8), 0,0.2,0);
    add(new THREE.ConeGeometry(0.85,1.0,12), matte(new THREE.Color(colorHex).offsetHSL(0,0.05,0.05),0.7), 0,0.85,0);
    add(new THREE.ConeGeometry(0.55,0.8,12), matte(new THREE.Color(colorHex).offsetHSL(0,0.1,0.1),0.7), 0,1.5,0);
    // Subtle glow
    const tg=add(new THREE.SphereGeometry(1.2,12,8), new THREE.MeshStandardMaterial({color,transparent:true,opacity:0.05,roughness:1}),0,0.5,0);
    void tg;

  // ── Crown ─────────────────────────────────────────────────────────────────
  } else if (type === 'crown') {
    // Base ring
    add(new THREE.TorusGeometry(1.0,0.2,8,32), metal(color.getHex ? color.getHex() : 0xf59e0b, 0.1, 0.9));
    // 5 points
    for(let i=0;i<5;i++){
      const a=((i/5)*Math.PI*2);
      const px=Math.sin(a)*0.95, pz=Math.cos(a)*0.95;
      add(new THREE.ConeGeometry(0.15,0.8,6), metal(color.getHex ? color.getHex() : 0xf59e0b, 0.1, 0.9), px,0.6,pz);
      // Gem on each spike
      add(new THREE.SphereGeometry(0.1,8,8), glow(i%2===0?0xe11d48:0x7c3aed, 2.0), px,1.08,pz);
    }

  // ── Rocket ───────────────────────────────────────────────────────────────
  } else if (type === 'rocket' || type === 'saturn') {
    add(new THREE.CylinderGeometry(0.4,0.45,2.8,32), metal(0xf8fafc,0.2));
    add(new THREE.ConeGeometry(0.4,0.9,32), matte(0xef4444), 0,1.85,0);
    add(new THREE.ConeGeometry(0.35,1.0,16), new THREE.MeshStandardMaterial({color:0xf97316,emissive:new THREE.Color(0xf97316),emissiveIntensity:2.0,transparent:true,opacity:0.85}), 0,-1.9,0, Math.PI,0,0);

  // ── Heart ────────────────────────────────────────────────────────────────
  } else if (type === 'heart') {
    add(new THREE.SphereGeometry(0.8,24,24), matte(0xef4444), 0,0.2,0);
    const aorta=add(new THREE.TorusGeometry(0.4,0.12,16,32,Math.PI), matte(0x3b82f6), 0,0.8,0);
    void aorta;

  // ── Atom ─────────────────────────────────────────────────────────────────
  } else if (type === 'atom') {
    add(new THREE.SphereGeometry(0.5,32,32), glow(0xef4444,0.8));
    [0,Math.PI/3,(2*Math.PI)/3].forEach(a=>{
      const r=add(new THREE.TorusGeometry(1.4,0.03,16,64), glow(0x06b6d4,1.5)); r.rotation.set(a,a*0.5,0);
    });

  // ── Solar System ─────────────────────────────────────────────────────────
  } else if (type === 'solar_system' || type === 'planet') {
    add(new THREE.SphereGeometry(0.7,32,32), glow(0xfbbf24,1.5)); // Sun
    const orbit1=new THREE.TorusGeometry(1.6,0.01,8,64); const o1=new THREE.Mesh(orbit1,matte(0x334155,1)); o1.rotation.x=Math.PI/2; group.add(o1);
    add(new THREE.SphereGeometry(0.28,16,16), matte(0x3b82f6), 1.6,0,0); // Earth
    const orbit2=new THREE.TorusGeometry(2.4,0.01,8,64); const o2=new THREE.Mesh(orbit2,matte(0x334155,1)); o2.rotation.x=Math.PI/2; group.add(o2);
    add(new THREE.SphereGeometry(0.2,16,16), matte(0xef4444), 2.4,0,0); // Mars

  // ── Solar Panel / Wing ───────────────────────────────────────────────────
  } else if (type === 'solar_panel' || type === 'airplane' || type === 'wing') {
    add(new THREE.BoxGeometry(3.0,0.1,1.6), metal(0x1e3a5f,0.1));

  // ── Generic Sphere (default) ─────────────────────────────────────────────
  } else {
    add(new THREE.SphereGeometry(1.1,32,32), new THREE.MeshStandardMaterial({color,roughness:0.25,metalness:0.6}));
    const aura=add(new THREE.TorusGeometry(1.4,0.04,16,48), glow(0x06b6d4,1.8)); aura.rotation.x=Math.PI/3;
  }

  group.scale.setScalar(sizeScale);
}

