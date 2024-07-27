import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AnimatedCardProps {
  cardNumber: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ cardNumber = -1, rarity = 'Rare' }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aspectRatio = 0.4;
    let camera: THREE.PerspectiveCamera,
      scene: THREE.Scene,
      renderer: THREE.WebGLRenderer,
      group: THREE.Group;

    const init = () => {
      // Create camera

      camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
      camera.position.z = 300;

      // Create scene
      scene = new THREE.Scene();

      // Load textures
      const frontTexture = new THREE.TextureLoader().load(
        cardNumber == -1 ? '/cards/spade.png' : `/poker-cards/poker-${cardNumber}.png`,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
        }
      );
      // const frontTexture = new THREE.TextureLoader().load(
      //   '/cards/spade.png'
      // );
      const backTexture = new THREE.TextureLoader().load('/cards/landing-back.png', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
      });

      // Card geometry and materials
      const cardGeometry = new THREE.PlaneGeometry(80, 120);
      const frontMaterial = new THREE.MeshBasicMaterial({
        map: frontTexture,
        side: THREE.FrontSide,
      });
      const backMaterial = new THREE.MeshBasicMaterial({ map: backTexture, side: THREE.BackSide });

      // Create card mesh with both sides
      const cardFront = new THREE.Mesh(cardGeometry, frontMaterial);
      const cardBack = new THREE.Mesh(cardGeometry, backMaterial);

      // Create glow geometry and material
      const glowColor = {
        Common: 0x00ff52,
        Rare: 0x0052ff,
        Epic: 0xff5200,
        Legendary: 0xff00ff,
      }[rarity];

      // Create glow geometry and material
      const glowGeometry = new THREE.PlaneGeometry(90, 130); // Slightly larger than the card
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: glowColor, // Glory blue color
        side: THREE.DoubleSide, // Render both sides of the geometry
        transparent: true,
        opacity: 0.5, // Adjust the opacity for the glow effect
        blending: THREE.AdditiveBlending, // Use additive blending for a glowing effect
        depthWrite: false, // Disable depth writing to avoid z-fighting
        depthTest: false, // Disable depth testing to avoid z-fighting
      });

      // Create glow mesh
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.renderOrder = -1; // Render the glow before the card

      // Group the front and back of the card and the glow
      group = new THREE.Group();
      group.add(glow); // Add the glow mesh first
      group.add(cardFront);
      group.add(cardBack);
      scene.add(group);

      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth * aspectRatio, window.innerHeight * aspectRatio);
      canvasRef.current?.appendChild(renderer.domElement);

      onWindowResize(); // Call this here to set initial size correctly
      window.addEventListener('resize', onWindowResize, false);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth * aspectRatio, window.innerHeight * aspectRatio);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      const time = Date.now() * 0.001;
      group.rotation.y = time * Math.PI;
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

export default AnimatedCard;
