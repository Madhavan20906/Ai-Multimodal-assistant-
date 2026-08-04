import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RepresentationPayload } from '../../types';
import { Box, Layers, RotateCw, Sparkles } from 'lucide-react';

interface ThreeDWorkbenchProps {
  payload: RepresentationPayload;
}

export const ThreeDWorkbench: React.FC<ThreeDWorkbenchProps> = ({ payload }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const bottleFluidRef = useRef<THREE.Mesh | null>(null);
  const primaryMeshRef = useRef<THREE.Mesh | THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(20, 20, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x06b6d4, 1.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xa855f7, 2, 10);
    pointLight.position.set(-5, 3, -2);
    scene.add(pointLight);

    // 5. Generate Object according to payload
    const primaryType = payload.threeDData?.primaryObject || 'water_bottle';
    const primaryObj = payload.threeDData?.objects[0];
    const colorHex = primaryObj?.properties?.color || '#06b6d4';
    const sizeScale = primaryObj?.properties?.size || 1.0;
    const fillLevel = primaryObj?.properties?.fillLevel ?? 0;

    const group = new THREE.Group();
    primaryMeshRef.current = group;

    if (primaryType === 'water_bottle') {
      // Create Water Bottle Glass Container
      const bottleGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32, 1, true);
      const bottleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
      });
      const bottleMesh = new THREE.Mesh(bottleGeo, bottleMat);
      group.add(bottleMesh);

      // Bottle Cap
      const capGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = 1.7;
      group.add(capMesh);

      // Water Liquid Fill Mesh
      const liquidHeight = Math.max(0.1, (fillLevel / 100) * 2.8);
      const liquidGeo = new THREE.CylinderGeometry(0.76, 0.76, liquidHeight, 32);
      const liquidMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
      });
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
      liquidMesh.position.y = -1.4 + liquidHeight / 2;
      bottleFluidRef.current = liquidMesh;
      group.add(liquidMesh);
    } else if (primaryType === 'car') {
      // 3D Car Body
      const bodyGeo = new THREE.BoxGeometry(4, 1.2, 2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.3,
        metalness: 0.8,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(bodyMesh);

      // Roof Cabin
      const cabinGeo = new THREE.BoxGeometry(2, 0.8, 1.6);
      const cabinMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        transmission: 0.8,
        opacity: 0.6,
        transparent: true,
      });
      const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat);
      cabinMesh.position.set(-0.2, 1, 0);
      group.add(cabinMesh);

      // 4 Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 24);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

      const wheelPositions: [number, number, number][] = [
        [1.3, -0.6, 1.1],
        [-1.3, -0.6, 1.1],
        [1.3, -0.6, -1.1],
        [-1.3, -0.6, -1.1],
      ];

      wheelPositions.forEach((pos) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(...pos);
        group.add(wheel);
      });
    } else if (primaryType === 'building') {
      // Parametric Architectural Building
      const floors = primaryObj?.properties?.floors || 10;
      for (let i = 0; i < floors; i++) {
        const floorGeo = new THREE.BoxGeometry(2.5, 0.3, 2.5);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.position.y = -1.8 + i * 0.4;
        group.add(floorMesh);

        const glassGeo = new THREE.BoxGeometry(2.3, 0.35, 2.3);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transmission: 0.8,
          transparent: true,
          opacity: 0.5,
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.y = -1.8 + i * 0.4 + 0.15;
        group.add(glassMesh);
      }
    } else {
      // Generic Star/Planet mesh
      const sphereGeo = new THREE.SphereGeometry(1.5, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.4,
        metalness: 0.5,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphereMesh);
    }

    group.scale.set(sizeScale, sizeScale, sizeScale);
    scene.add(group);

    // 6. Interactive Mouse Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const domElem = mountRef.current;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !group) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      group.rotation.y += deltaX * 0.01;
      group.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (group && !isDragging) {
        group.rotation.y += 0.005; // gentle idle rotation
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (domElem.contains(renderer.domElement)) {
        domElem.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [payload]);

  const primaryObj = payload.threeDData?.objects[0];

  return (
    <div className="representation-card 3d-card">
      <div className="card-header">
        <div className="card-title-group">
          <Box className="accent-icon" size={20} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle}</p>
          </div>
        </div>

        <div className="badge-group">
          <span className="info-badge"><Sparkles size={12} /> Interactive 3D Mesh</span>
          <span className="info-badge rotate-hint"><RotateCw size={12} /> Drag to Rotate 360°</span>
        </div>
      </div>

      <div className="workbench-3d-viewport" ref={mountRef}>
        {/* Floating Property Overlay HUD */}
        {primaryObj && (
          <div className="object-prop-overlay">
            <h4><Layers size={14} /> Active Object Properties</h4>
            <div className="prop-row">
              <span>Object Type:</span>
              <strong>{primaryObj.type.toUpperCase()}</strong>
            </div>
            <div className="prop-row">
              <span>Color Hex:</span>
              <strong style={{ color: primaryObj.properties.color || '#06b6d4' }}>
                {primaryObj.properties.color || '#06b6d4'}
              </strong>
            </div>
            {primaryObj.properties.fillLevel !== undefined && (
              <div className="prop-row">
                <span>Fluid Fill Level:</span>
                <strong>{primaryObj.properties.fillLevel}%</strong>
              </div>
            )}
            <div className="prop-row">
              <span>Scale Factor:</span>
              <strong>{(primaryObj.properties.size || 1.0).toFixed(1)}x</strong>
            </div>
          </div>
        )}
      </div>

      <div className="card-footer">
        <p>{payload.summaryText}</p>
      </div>
    </div>
  );
};
