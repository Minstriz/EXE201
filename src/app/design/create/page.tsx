'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshStandardMaterial } from 'three';

export default function CreateCustomProduct() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.8, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(3, 10, 10);
    scene.add(dirLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const loader = new GLTFLoader();
    loader.load(
      '/model_3D/t_shirt.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.position.y = -1;
        scene.add(model);
        modelRef.current = model;
        setSceneReady(true);
      },
      undefined,
      (error) => {
        console.error('Lỗi khi load GLB:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // ✅ Convert PNG/JPG -> texture
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !sceneReady || !modelRef.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgData = e.target?.result as string;
      const texture = new THREE.TextureLoader().load(imgData);

      modelRef.current?.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          console.log('Applying texture to:', mesh.name);

          const material = new MeshStandardMaterial({
            map: texture,
          });

          mesh.material = material;
        }
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 120px)',
          marginTop: '80px',
        }}
      />
      <div className="text-center mt-4">
        <input type="file" accept=".png,.jpg,.jpeg" onChange={handleImageUpload} />
        <p className="text-sm text-gray-500">Chọn file PNG hoặc JPG để áp lên áo</p>
      </div>
    </div>
  );
}
