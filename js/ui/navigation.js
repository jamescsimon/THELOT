import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { showNavigationButtons } from './buttons.js';

let currentPoster = null;
let currentPageIndex = 0;
let roomCenterPosition = null;
let screenplayPages = []; // Now tracking screenplayPages globally inside navigation.js

function zoomIntoPoster(poster, pages, controls, camera) {
  const worldPosition = new THREE.Vector3();
  poster.getWorldPosition(worldPosition);

  const offsetDistance = 2; // Distance away from poster
  const angle = poster.rotation.y;

  const offsetX = Math.sin(angle) * offsetDistance;
  const offsetZ = Math.cos(angle) * offsetDistance;

  const targetPosition = new THREE.Vector3(
    worldPosition.x + offsetX,
    1.6,
    worldPosition.z + offsetZ
  );

  camera.position.copy(targetPosition);
  controls.target.copy(worldPosition);
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.enableRotate = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.update();

  poster.material.map = pages[0];
  poster.material.needsUpdate = true;

  currentPoster = poster;
  currentPageIndex = 0;
  roomCenterPosition = poster.userData.originalRoomCenter;
  screenplayPages = pages; // Save the screenplay pages globally now

  showNavigationButtons();
}

function teleportPlayer(camera, controls, targetPosition) {
  console.log('Teleporting to:', targetPosition);

  if (targetPosition.x === 0 && targetPosition.z === 5) {
    camera.position.set(0, 1.6, 5);
    controls.target.set(0, 1.6, 8);
  } else {
    camera.position.set(targetPosition.x, 1.6, targetPosition.z);
    controls.target.set(targetPosition.x, 1.6, targetPosition.z + 5);
  }

  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableRotate = true;
  
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  };
  
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;

  controls.update();
}


function getCurrentPoster() {
  return currentPoster;
}

function getCurrentPageIndex() {
  return currentPageIndex;
}

function getRoomCenterPosition() {
  return roomCenterPosition;
}

function getScreenplayPages() {
  return screenplayPages;
}

function updateCurrentPageIndex(newIndex) {
  currentPageIndex = newIndex;
}

export { 
  zoomIntoPoster, 
  teleportPlayer, 
  getCurrentPoster, 
  getCurrentPageIndex, 
  getRoomCenterPosition, 
  getScreenplayPages, 
  updateCurrentPageIndex 
};
