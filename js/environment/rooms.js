import { spawnPostersInRoom } from './posters.js';
import { createButtonTexture } from '../ui/buttons.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

function createRoom(scene, teleportButtons, posterObjects, centerX, centerZ, facingLeft, genre) {
  const size = 17;
  const wallThickness = 0.5;
  const adjustedCenterX = facingLeft ? centerX + 0.1 : centerX - 0.1;

  const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });

  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(size, 3, wallThickness), wallMaterial);
  frontWall.position.set(adjustedCenterX, 1.5, centerZ - size/2);
  scene.add(frontWall);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(size, 3, wallThickness), wallMaterial);
  backWall.position.set(adjustedCenterX, 1.5, centerZ + size/2);
  scene.add(backWall);

  const sideWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, 3, size), wallMaterial);
  sideWall.position.set(facingLeft ? adjustedCenterX - size/2 : adjustedCenterX + size/2, 1.5, centerZ);
  scene.add(sideWall);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshPhongMaterial({ color: 0x666666 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(adjustedCenterX, 0, centerZ);
  scene.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshPhongMaterial({ color: 0x555555 }));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(adjustedCenterX, 3, centerZ);
  scene.add(ceiling);

  const light = new THREE.PointLight(0xffffff, 1, 30);
  light.position.set(adjustedCenterX, 2.8, centerZ);
  scene.add(light);

  const backButtonTexture = createButtonTexture("Back");
  const backButton = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 0.6),
    new THREE.MeshBasicMaterial({ map: backButtonTexture, transparent: true, side: THREE.DoubleSide })
  );

  const hallwayWidth = 10; // your hallway width from hallway.js
  if (facingLeft) {
    backButton.position.set(centerX + hallwayWidth/2 + 0.6, 1.2, centerZ);
    backButton.rotation.y = -Math.PI/2;
  } else {
    backButton.position.set(centerX - hallwayWidth/2 - 0.6, 1.2, centerZ);
    backButton.rotation.y = Math.PI/2;
  }

  backButton.userData.target = new THREE.Vector3(0, 1.6, 5); // Back to hallway position
  backButton.name = "teleportButton";

  scene.add(backButton);
  teleportButtons.push(backButton);

  spawnPostersInRoom(scene, posterObjects, centerX, centerZ, facingLeft, genre);
}

export { createRoom };
