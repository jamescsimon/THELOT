import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // alpha to see background image
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Add a test cube
const cubes = [];
const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshStandardMaterial({ color: 0x808080 });

function createCube(x, y, name, url) {
  const cube = new THREE.Mesh(cubeGeo, cubeMat.clone());
  cube.position.set(x, y, 0.5);
  cube.name = name;
  cube.userData.url = url;
  scene.add(cube);
  cubes.push(cube);
}

// Example cube for ticketbooth
createCube(-2, 1, "ticketbooth", "pages/ticketbooth.html");
createCube(2, -1, "mailroom", "pages/mailroom.html"); // Add later

// Camera and controls
camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);

// Raycaster for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null;

// Mouse move
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Mouse click
window.addEventListener('click', () => {
  if (hovered && hovered.userData.url) {
    window.location.href = hovered.userData.url;
  }
});

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubes);
  
  if (intersects.length > 0) {
    if (hovered !== intersects[0].object) {
      if (hovered) hovered.material.color.set(0x808080);
      hovered = intersects[0].object;
      hovered.material.color.set(0xff0000);
    }
  } else if (hovered) {
    hovered.material.color.set(0x808080);
    hovered = null;
  }

  renderer.render(scene, camera);
}
animate();
