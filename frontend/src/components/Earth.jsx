import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Earth = ({ activeLayers = [], layerOpacities = {} }) => {
  const mountRef = useRef(null);
  const earthRef = useRef(null);
  const cloudRef = useRef(null);
  const overlaysRef = useRef({});
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 18;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011);
    rendererRef.current = renderer;

    if (mountRef.current) {
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);
    }

    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x222222,
      shininess: 10,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    earthRef.current = earth;

    const cloudGeometry = new THREE.SphereGeometry(5.1, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);
    cloudRef.current = clouds;

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 1000; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
    }
    starGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starPositions, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 5, 5);
    scene.add(directionalLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
      (texture) => {
        earthMaterial.map = texture;
        earthMaterial.needsUpdate = true;
      }
    );

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };
      earth.rotation.y += deltaMove.x * 0.01;
      earth.rotation.x += deltaMove.y * 0.01;
      clouds.rotation.y += deltaMove.x * 0.008;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event) => {
      camera.position.z += event.deltaY * 0.05;
      camera.position.z = Math.max(8, Math.min(30, camera.position.z));
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      if (!isDragging) {
        earth.rotation.y += 0.001;
        clouds.rotation.y += 0.002;
      }

      Object.values(overlaysRef.current).forEach((overlay) => {
        if (overlay) overlay.rotation.y += 0.0015;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !earthRef.current) return;

    Object.values(overlaysRef.current).forEach((mesh) => {
      if (mesh) sceneRef.current.remove(mesh);
    });
    overlaysRef.current = {};

    activeLayers.forEach((layerId) => {
      const opacity = layerOpacities[layerId] ?? 0.5;

      const geometry = new THREE.SphereGeometry(5.03, 64, 64);
      let material = null;

      if (layerId === 'temperature') {
        material = new THREE.MeshBasicMaterial({
          color: 0xff5522,
          transparent: true,
          opacity,
          wireframe: true,
        });
      } else if (layerId === 'vegetation') {
        material = new THREE.MeshBasicMaterial({
          color: 0x22cc55,
          transparent: true,
          opacity,
          wireframe: true,
        });
      } else if (layerId === 'co2') {
        material = new THREE.MeshBasicMaterial({
          color: 0xffaa00,
          transparent: true,
          opacity,
          wireframe: true,
        });
      } else if (layerId === 'air_quality') {
        material = new THREE.MeshBasicMaterial({
          color: 0x88ccff,
          transparent: true,
          opacity,
          wireframe: true,
        });
      } else if (layerId === 'fires') {
        material = new THREE.MeshBasicMaterial({
          color: 0xff2200,
          transparent: true,
          opacity,
          wireframe: true,
        });
      } else if (layerId === 'night_lights') {
        material = new THREE.MeshBasicMaterial({
          color: 0xffff99,
          transparent: true,
          opacity,
          wireframe: true,
        });
      }

      if (material) {
        const overlayMesh = new THREE.Mesh(geometry, material);
        overlayMesh.rotation.copy(earthRef.current.rotation);
        sceneRef.current.add(overlayMesh);
        overlaysRef.current[layerId] = overlayMesh;
      }
    });
  }, [activeLayers, layerOpacities]);

  return <div ref={mountRef} className="earth-container" />;
};

export default Earth;
