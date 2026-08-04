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
import { Hand, Sparkles } from 'lucide-react';
import { RepresentationPayload } from '../types';
import { classifyGesture, gestureLabelFor, GestureResult } from '../services/gestureController';

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

    const primaryType = activePayload.threeDData.primaryObject || 'water_bottle';
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
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.6,
        });

        hands.onResults(handleHandResults);
        handsRef.current = hands;
        if (!cancelled) setMpReady(true);
        console.log('[CameraHandTracker] MediaPipe Hands ready');
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
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const W = hCanvas.width;
    const H = hCanvas.height;

    // Draw skeleton connections
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.lineWidth = 2;
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
      ctx.fillStyle = isTip ? '#a855f7' : 'rgba(6, 182, 212, 0.9)';
      ctx.fill();
    });

    // Classify gesture
    const gesture = classifyGesture(landmarks);
    lastGestureRef.current = gesture;
    setDetectedGesture(gestureLabelFor(gesture.name));

    // Fire external callback
    onGestureDetected?.(gesture.name, { x: gesture.x, y: gesture.y });

    // Gesture → AR object interaction
    applyGestureInteraction(gesture);
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
          <div className="ar-hud-bar">
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
          </div>

          {/* Layered stack: video → 3D WebGL → hand skeleton → HUD */}
          <div className="ar-layer-stack">
            {/* Layer 0: Live webcam video */}
            <video ref={videoRef} className="ar-video-layer" muted playsInline />

            {/* Layer 1: Three.js AR overlay */}
            <canvas ref={arCanvasRef} className="ar-3d-layer" width={960} height={540} />

            {/* Layer 2: MediaPipe hand skeleton drawing */}
            <canvas ref={handCanvasRef} className="ar-hand-layer" width={960} height={540} />

            {/* Properties HUD */}
            {has3DOverlay && activePayload.threeDData?.objects[0] && (
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

// ── AR mesh builder (kept outside component for readability) ──────────────
function buildARObject(
  group: THREE.Group,
  type: string,
  colorHex: string,
  sizeScale: number,
  fillLevel: number
) {
  const color = new THREE.Color(colorHex);

  if (type === 'water_bottle') {
    // Glass body (open cylinder)
    const bottleGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.4, 32, 1, true);
    const bottleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transparent: true, opacity: 0.25,
      roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide,
    });
    group.add(new THREE.Mesh(bottleGeo, bottleMat));

    // Bottom cap
    const bottomMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.6, 32),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })
    );
    bottomMesh.rotation.x = -Math.PI / 2;
    bottomMesh.position.y = -1.2;
    group.add(bottomMesh);

    // Metal cap
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.45, 0.35, 32),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 })
    );
    cap.position.y = 1.35;
    group.add(cap);

    // Liquid fill
    const liquidH = Math.max(0.05, (fillLevel / 100) * 2.2);
    const liquid  = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56, 0.56, liquidH, 32),
      new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.75, roughness: 0.15 })
    );
    liquid.position.y = -1.2 + liquidH / 2;
    group.add(liquid);

    // Glow rim
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.6, 0.03, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 2 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y  = 1.2;
    group.add(rim);

  } else if (type === 'car') {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.9, 1.6),
      new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.85 })
    );
    group.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.65, 1.3),
      new THREE.MeshPhysicalMaterial({ color: 0x0f172a, transparent: true, opacity: 0.55 })
    );
    cabin.position.set(-0.15, 0.78, 0);
    group.add(cabin);

    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 20);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    ([[1,-0.45,0.9],[-1,-0.45,0.9],[1,-0.45,-0.9],[-1,-0.45,-0.9]] as [number,number,number][])
      .forEach(p => {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.x = Math.PI / 2;
        w.position.set(...p);
        group.add(w);
      });

  } else if (type === 'building') {
    for (let i = 0; i < 14; i++) {
      const floor = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.22, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 })
      );
      floor.position.y = -1.5 + i * 0.3;
      group.add(floor);

      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(1.65, 0.25, 1.65),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 })
      );
      glass.position.y = -1.5 + i * 0.3 + 0.12;
      group.add(glass);
    }

  } else {
    // Generic sphere
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.5 })
    ));
  }

  group.scale.setScalar(sizeScale);
}
