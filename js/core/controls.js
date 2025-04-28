import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

function setupControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableRotate = true;
  
  controls.target.set(0, 1.6, 8);

  controls.minPolarAngle = Math.PI / 2;  // 90 degrees flat
  controls.maxPolarAngle = Math.PI / 2;  // 90 degrees flat

  controls.screenSpacePanning = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  };

  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };

  controls.update();

  return controls;
}

export { setupControls };
