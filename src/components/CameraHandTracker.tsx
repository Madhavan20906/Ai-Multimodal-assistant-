import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Hand, Sparkles } from 'lucide-react';
import { RepresentationPayload } from '../types';

interface CameraHandTrackerProps {
  isCameraActive: boolean;
  isDrawingMode: boolean;
  brushColor: string;
  brushSize: number;
  activePayload: RepresentationPayload | null;
  onGestureDetected?: (gestureName: string, coords: { x: number; y: number }) => void;
}

export const CameraHandTracker: React.FC<CameraHandTrackerProps> = ({
  isCameraActive,
  isDrawingMode,
  brushColor,
  brushSize,
  activePayload,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const arCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number>(0);
  const [detectedGesture] = useState<string>('Tracking...');
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // 1. Initialize Webcam Stream
  useEffect(() => {
    if (!isCameraActive) return;
    let localStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 960, height: 540, facingMode: 'user' },
          audio: false,
        });
        localStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.warn('Camera access denied:', err);
      }
    };

    startCamera();
    return () => {
      if (localStream) localStream.getTracks().forEach((t) => t.stop());
    };
  }, [isCameraActive]);

  // 2. Initialize Three.js AR Overlay Scene (transparent background over video)
  useEffect(() => {
    if (!isCameraActive || !arCanvasRef.current) return;

    const canvas = arCanvasRef.current;
    const width = 960;
    const height = 540;

    // Renderer with ALPHA transparency so camera shows through
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // fully transparent background
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const cam = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    cam.position.set(0, 1.5, 6);
    cam.lookAt(0, 0, 0);
    cameraRef.current = cam;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x06b6d4, 2.0);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xa855f7, 1.5, 15);
    pointLight.position.set(-3, 2, 2);
    scene.add(pointLight);

    // Object group placeholder
    const group = new THREE.Group();
    objectGroupRef.current = group;
    scene.add(group);

    // Mouse drag rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onDown = (e: MouseEvent) => {
      if (isDrawingMode) return;
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: MouseEvent) => {
      if (!isDragging || !group) return;
      group.rotation.y += (e.clientX - prevMouse.x) * 0.01;
      group.rotation.x += (e.clientY - prevMouse.y) * 0.01;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (group && !isDragging) group.rotation.y += 0.006;
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
  }, [isCameraActive]);

  // 3. Update 3D objects when payload changes (rebuild meshes in AR overlay)
  useEffect(() => {
    const group = objectGroupRef.current;
    if (!group) return;

    // Clear previous meshes
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    if (!activePayload || activePayload.type !== '3d_scene' || !activePayload.threeDData) return;

    const primaryType = activePayload.threeDData.primaryObject || 'water_bottle';
    const primaryObj = activePayload.threeDData.objects[0];
    const colorHex = primaryObj?.properties?.color || '#06b6d4';
    const sizeScale = primaryObj?.properties?.size || 1.0;
    const fillLevel = primaryObj?.properties?.fillLevel ?? 0;

    if (primaryType === 'water_bottle') {
      // Glass container
      const bottleGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.4, 32, 1, true);
      const bottleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
        roughness: 0.05,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
      const bottle = new THREE.Mesh(bottleGeo, bottleMat);
      group.add(bottle);

      // Bottom cap
      const bottomGeo = new THREE.CircleGeometry(0.6, 32);
      const bottomMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
      const bottom = new THREE.Mesh(bottomGeo, bottomMat);
      bottom.rotation.x = -Math.PI / 2;
      bottom.position.y = -1.2;
      group.add(bottom);

      // Cap
      const capGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.35, 32);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 1.35;
      group.add(cap);

      // Water fill
      const liquidH = Math.max(0.05, (fillLevel / 100) * 2.2);
      const liquidGeo = new THREE.CylinderGeometry(0.56, 0.56, liquidH, 32);
      const liquidMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        transparent: true,
        opacity: 0.75,
        roughness: 0.15,
      });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = -1.2 + liquidH / 2;
      group.add(liquid);

      // Rim glow ring
      const rimGeo = new THREE.TorusGeometry(0.6, 0.03, 16, 48);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 2 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 1.2;
      group.add(rim);
    } else if (primaryType === 'car') {
      const bodyGeo = new THREE.BoxGeometry(3.2, 0.9, 1.6);
      const bodyMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: 0.25, metalness: 0.85 });
      group.add(new THREE.Mesh(bodyGeo, bodyMat));

      const cabinGeo = new THREE.BoxGeometry(1.6, 0.65, 1.3);
      const cabinMat = new THREE.MeshPhysicalMaterial({ color: 0x0f172a, transparent: true, opacity: 0.55 });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(-0.15, 0.78, 0);
      group.add(cabin);

      const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 20);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
      const positions: [number, number, number][] = [[1, -0.45, 0.9], [-1, -0.45, 0.9], [1, -0.45, -0.9], [-1, -0.45, -0.9]];
      positions.forEach((p) => {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.x = Math.PI / 2;
        w.position.set(...p);
        group.add(w);
      });
    } else if (primaryType === 'building') {
      const floors = primaryObj?.properties?.floors || 10;
      for (let i = 0; i < Math.min(floors, 14); i++) {
        const fg = new THREE.BoxGeometry(1.8, 0.22, 1.8);
        const fm = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
        const f = new THREE.Mesh(fg, fm);
        f.position.y = -1.5 + i * 0.3;
        group.add(f);

        const gg = new THREE.BoxGeometry(1.65, 0.25, 1.65);
        const gm = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
        const g = new THREE.Mesh(gg, gm);
        g.position.y = -1.5 + i * 0.3 + 0.12;
        group.add(g);
      }
    } else {
      // Generic sphere
      const sg = new THREE.SphereGeometry(1.2, 32, 32);
      const sm = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: 0.35, metalness: 0.5 });
      group.add(new THREE.Mesh(sg, sm));
    }

    group.scale.set(sizeScale, sizeScale, sizeScale);
  }, [activePayload]);

  // Drawing handlers
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
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    lastPointRef.current = { x: cx, y: cy };
  };
  const stopDrawing = () => { isDrawingRef.current = false; lastPointRef.current = null; };
  const clearDrawing = () => {
    if (!drawingCanvasRef.current) return;
    const ctx = drawingCanvasRef.current.getContext('2d');
    ctx?.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
  };

  if (!isCameraActive && !isDrawingMode) return null;

  const has3DOverlay = activePayload?.type === '3d_scene' && isCameraActive;

  return (
    <div className="camera-ar-fullscreen">
      {isCameraActive && (
        <div className="ar-viewport-container">
          <div className="ar-hud-bar">
            <span className="live-indicator"><span className="red-dot"></span> LIVE CAMERA + AR OVERLAY</span>
            <span className="gesture-status"><Hand size={14} /> {detectedGesture}</span>
            {has3DOverlay && (
              <span className="ar-object-badge">
                <Sparkles size={12} /> 3D Object Active — Drag to rotate
              </span>
            )}
          </div>

          {/* Layered Video + 3D Canvas Stack */}
          <div className="ar-layer-stack">
            {/* Layer 0: Live webcam video (background) */}
            <video ref={videoRef} className="ar-video-layer" muted playsInline />

            {/* Layer 1: Three.js transparent 3D overlay (on top of video) */}
            <canvas ref={arCanvasRef} className="ar-3d-layer" width={960} height={540} />

            {/* Properties HUD floating over AR */}
            {has3DOverlay && activePayload.threeDData?.objects[0] && (
              <div className="ar-props-hud">
                <h4>AR Object</h4>
                <div className="ar-prop"><span>Type:</span> <strong>{activePayload.threeDData.objects[0].type}</strong></div>
                <div className="ar-prop"><span>Color:</span> <strong style={{ color: activePayload.threeDData.objects[0].properties.color }}>{activePayload.threeDData.objects[0].properties.color}</strong></div>
                {activePayload.threeDData.objects[0].properties.fillLevel !== undefined && (
                  <div className="ar-prop"><span>Fill:</span> <strong>{activePayload.threeDData.objects[0].properties.fillLevel}%</strong></div>
                )}
                <div className="ar-prop"><span>Scale:</span> <strong>{(activePayload.threeDData.objects[0].properties.size || 1).toFixed(1)}x</strong></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drawing overlay */}
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
