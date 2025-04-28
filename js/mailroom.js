import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

import { scene, camera, renderer } from './core/scene.js';
import { setupControls } from './core/controls.js';
import { setupRaycasting } from './core/raycasting.js';
import { animate } from './core/animation.js';
import { createHallwayWalls, wallObjects } from './environment/hallway.js';
import { createRoom } from './environment/rooms.js';
import { createButton, createTitleLabel, setupArrowButtons, setupBackButton } from './ui/buttons.js';

const teleportButtons = [];
const posterObjects = [];

const controls = setupControls(camera, renderer);
setupRaycasting(camera, scene, teleportButtons, posterObjects, wallObjects, controls);

createHallwayWalls(scene);

createRoom(scene, teleportButtons, posterObjects, -13.5, 8.5, true, "action");
createRoom(scene, teleportButtons, posterObjects, 13.5, 8.5, false, "comedy");
createRoom(scene, teleportButtons, posterObjects, -13.5, 26.5, true, "horror");
createRoom(scene, teleportButtons, posterObjects, 13.5, 26.5, false, "scifi");
createRoom(scene, teleportButtons, posterObjects, -13.5, 44.5, true, "drama");
createRoom(scene, teleportButtons, posterObjects, 13.5, 44.5, false, "indie");

createButton(scene, "Action", -1.5, 2.2, new THREE.Vector3(-13.5, 1.6, 8.5), teleportButtons);
createButton(scene, "Comedy", 1.5, 2.2, new THREE.Vector3(13.5, 1.6, 8.5), teleportButtons);
createButton(scene, "Horror", -1.5, 1.6, new THREE.Vector3(-13.5, 1.6, 26.5), teleportButtons);
createButton(scene, "Sci-Fi", 1.5, 1.6, new THREE.Vector3(13.5, 1.6, 26.5), teleportButtons);
createButton(scene, "Drama", -1.5, 1.0, new THREE.Vector3(-13.5, 1.6, 44.5), teleportButtons);
createButton(scene, "Indie", 1.5, 1.0, new THREE.Vector3(13.5, 1.6, 44.5), teleportButtons);

createTitleLabel(scene, "Select a Room", 0, 2.8, 7.9);

animate(renderer, scene, camera, controls);
setupArrowButtons();
setupBackButton(controls, camera);