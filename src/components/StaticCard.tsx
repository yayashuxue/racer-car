import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StaticCardProps {
  cardNumber: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  columnWidth: number;
  rowHeight: number;
}

const StaticCard: React.FC<StaticCardProps> = ({
  cardNumber = -1,
  rarity = 'Rare',
  columnWidth,
  rowHeight,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aspectRatio = columnWidth / rowHeight;
    let camera: THREE.PerspectiveCamera,
      scene: THREE.Scene,
      renderer: THREE.WebGLRenderer,
      group: THREE.Group;

    const init = () => {
      // Create camera
      camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
      camera.position.z = 250;

      // Create scene
      scene = new THREE.Scene();

      // Load texture
      const frontTexture = new THREE.TextureLoader().load(
        cardNumber == -1 ? '/cards/spade.png' : `/poker-cards/poker-${cardNumber}.png`
      );

      // Card geometry and material
      const cardGeometry = new THREE.PlaneGeometry(columnWidth * 0.9, rowHeight * 0.9);
      const frontMaterial = new THREE.MeshBasicMaterial({
        map: frontTexture,
        side: THREE.FrontSide,
      });

      // Create card mesh
      const cardFront = new THREE.Mesh(cardGeometry, frontMaterial);

      // Create glow geometry and material
      const glowColor = {
        Common: 0x00ff52,
        Rare: 0x0052ff,
        Epic: 0xff5200,
        Legendary: 0xff00ff,
      }[rarity];

      const glowGeometry = new THREE.PlaneGeometry(columnWidth * 0.95, rowHeight * 0.95); // Slightly larger than the card
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: glowColor, // Glory blue color
        side: THREE.DoubleSide, // Render both sides of the geometry
        transparent: true,
        opacity: 0.5, // Adjust the opacity for the glow effect
        blending: THREE.AdditiveBlending, // Use additive blending for a glowing effect
        depthWrite: false, // Disable depth writing to avoid z-fighting
      });

      // Create glow mesh
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.renderOrder = -1; // Render the glow before the card

      // Group the front of the card and the glow
      group = new THREE.Group();
      group.add(glow); // Add the glow mesh first
      group.add(cardFront);
      scene.add(group);

      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(columnWidth, rowHeight);
      canvasRef.current?.appendChild(renderer.domElement);

      onWindowResize(); // Call this here to set initial size correctly
      window.addEventListener('resize', onWindowResize, false);
    };

    const onWindowResize = () => {
      // camera.aspect = columnWidth / rowHeight;
      // camera.updateProjectionMatrix();
      // // renderer.setSize(window.innerWidth * aspectRatio, window.innerHeight * aspectRatio * .8);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    init();
    animate();

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []); // Empty dependency array to run the effect only once

  return <div ref={canvasRef} style={{ display: 'flex', justifyContent: 'center' }} />;
};

export default StaticCard;
