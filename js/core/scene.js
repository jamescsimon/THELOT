import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 5);
scene.add(dirLight);

const floor = new THREE.Mesh(
new THREE.PlaneGeometry(44, 55),
new THREE.MeshPhongMaterial({ color: 0x666666 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, 27.5);
scene.add(floor);

const ceiling = new THREE.Mesh(
new THREE.PlaneGeometry(44, 55),
new THREE.MeshPhongMaterial({ color: 0x555555 })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, 3, 27.5);
scene.add(ceiling);

const signBoard = new THREE.Mesh(
new THREE.PlaneGeometry(5, 3),
new THREE.MeshBasicMaterial({ color: 0x222222 })
);
signBoard.position.set(0, 2, 8);
signBoard.rotation.y = Math.PI;
scene.add(signBoard);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export { scene, camera, renderer };