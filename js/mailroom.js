import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

/* ======================
        Setup
====================== */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 0); // Eye height

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* ======================
      Controls
====================== */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.enableRotate = true;
controls.target.set(0, 1.6, 5);
controls.update();

/* ======================
       Lights
====================== */
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 5);
scene.add(light);

/* ======================
      Hallway
====================== */
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 50),
  new THREE.MeshPhongMaterial({ color: 0x888888 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// Ceiling
const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 50),
  new THREE.MeshPhongMaterial({ color: 0x555555 })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 3;
scene.add(ceiling);

// Left Wall
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 3),
  new THREE.MeshPhongMaterial({ color: 0x333333 })
);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-5, 1.5, 25);
scene.add(leftWall);

// Right Wall
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 3),
  new THREE.MeshPhongMaterial({ color: 0x333333 })
);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(5, 1.5, 25);
scene.add(rightWall);

/* ======================
     Posters on Walls
====================== */
const posterImages = [
  "../assets/images/poster1.png",
  "../assets/images/poster2.png",
  "../assets/images/poster3.png",
  "../assets/images/poster4.png",
];

function createPoster(texturePath, x, y, z, rotationY = 0) {
  const texture = new THREE.TextureLoader().load(texturePath);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const poster = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 3),
    material
  );
  poster.position.set(x, y, z);
  poster.rotation.y = rotationY;
  scene.add(poster);
}

// Place posters on the left wall
for (let i = 0; i < posterImages.length; i++) {
  createPoster(
    posterImages[i],
    -4.9, // slightly offset from the left wall
    1.5,  // centered vertically
    5 + i * 10, // spaced down the hall
    Math.PI / 2
  );
}

// Place posters on the right wall (mirror)
for (let i = 0; i < posterImages.length; i++) {
  createPoster(
    posterImages[i],
    4.9,
    1.5,
    10 + i * 10,
    -Math.PI / 2
  );
}

/* ======================
      Animation
====================== */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

/* ======================
     Responsive Resize
====================== */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
