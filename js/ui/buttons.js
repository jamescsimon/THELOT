import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { getCurrentPoster, getCurrentPageIndex, updateCurrentPageIndex, getScreenplayPages, getRoomCenterPosition, teleportPlayer } from './navigation.js';

function createButtonTexture(text, width = 256, height = 128) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = '#444444';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  return new THREE.CanvasTexture(canvas);
}

function createTitleTexture(text, width = 512, height = 256) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  return new THREE.CanvasTexture(canvas);
}

function createButton(scene, label, x, y, targetPosition, teleportButtons) {
  const texture = createButtonTexture(label);
  const button = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.5),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
  );
  button.position.set(x, y, 7.8);
  button.rotation.y = Math.PI;
  button.userData.target = targetPosition;
  button.userData.genre = label.toLowerCase();
  button.name = 'teleportButton';
  scene.add(button);
  teleportButtons.push(button);
}

function createTitleLabel(scene, text, x, y, z) {
  const texture = createButtonTexture(text, 512, 256);
  const title = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 1),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
  );
  title.position.set(x, y, z);
  title.rotation.y = Math.PI;
  scene.add(title);
}

function hideNavigationButtons() {
  const backButton = document.getElementById('backButton');
  const leftArrow = document.getElementById('leftArrow');
  const rightArrow = document.getElementById('rightArrow');

  if (backButton) backButton.style.display = 'none';
  if (leftArrow) leftArrow.style.display = 'none';
  if (rightArrow) rightArrow.style.display = 'none';
}

function showNavigationButtons() {
  const backButton = document.getElementById('backButton');
  const leftArrow = document.getElementById('leftArrow');
  const rightArrow = document.getElementById('rightArrow');

  if (backButton) backButton.style.display = 'block';
  if (leftArrow) leftArrow.style.display = 'block';
  if (rightArrow) rightArrow.style.display = 'block';
}

function setupArrowButtons() {
  const leftArrow = document.getElementById('leftArrow');
  const rightArrow = document.getElementById('rightArrow');

  leftArrow.addEventListener('click', () => {
    const currentPoster = getCurrentPoster();
    if (!currentPoster) return;

    const pages = getScreenplayPages(); // ✅ Get pages cleanly
    let index = getCurrentPageIndex();
    index = (index - 1 + pages.length) % pages.length;

    currentPoster.material.map = pages[index];
    currentPoster.material.needsUpdate = true;

    updateCurrentPageIndex(index);
  });

  rightArrow.addEventListener('click', () => {
    const currentPoster = getCurrentPoster();
    if (!currentPoster) return;

    const pages = getScreenplayPages(); // ✅ Get pages cleanly
    let index = getCurrentPageIndex();
    index = (index + 1) % pages.length;

    currentPoster.material.map = pages[index];
    currentPoster.material.needsUpdate = true;

    updateCurrentPageIndex(index);
  });
}

function setupBackButton(controls, camera) {
  const backButton = document.getElementById('backButton');
  console.log('BACK BUTTON CLICKED');
  backButton.addEventListener('click', () => {
    const currentPoster = getCurrentPoster();
    const roomCenter = getRoomCenterPosition();
    console.log('currentPoster:', currentPoster);
    console.log('roomCenter:', roomCenter);

    if (roomCenter && currentPoster) {
      teleportPlayer(camera, controls, roomCenter);

      currentPoster.material.map = currentPoster.userData.originalTexture; // Restore original poster
      currentPoster.material.needsUpdate = true;

      updateCurrentPageIndex(0);
      hideNavigationButtons();
    }
  });
}

export {
  createButtonTexture,
  createTitleTexture,
  createButton,
  createTitleLabel,
  hideNavigationButtons,
  showNavigationButtons,
  setupArrowButtons,
  setupBackButton 
};
