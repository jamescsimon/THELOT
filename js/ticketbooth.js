import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

/* =======================
        Setup Scene
======================= */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.update();
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

/* =======================
        Create Helpers
======================= */
function createTextTexture(text, width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const lines = text.split('\n');
  let y = 20;
  for (const line of lines) {
    ctx.fillText(line, 20, y);
    y += 34;
  }

  return new THREE.CanvasTexture(canvas);
}

function createButtonLabel(text, width = 256, height = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  return new THREE.CanvasTexture(canvas);
}

/* =======================
        Environment
======================= */
// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshPhongMaterial({ color: 0xffffff })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Building wall behind everything
const buildingTexture = new THREE.TextureLoader().load('../assets/images/outside_mailroom.jpg');
const buildingMaterial = new THREE.MeshBasicMaterial({ map: buildingTexture });
const buildingPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 10),
  buildingMaterial
);
buildingPlane.position.set(0, 5, -20);
scene.add(buildingPlane);

/* =======================
        Booth Area
======================= */
// Flat Booth Image
const boothTexture = new THREE.TextureLoader().load('../assets/images/booth.jpg');
const boothMaterial = new THREE.MeshBasicMaterial({ map: boothTexture });
const boothPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 4),
  boothMaterial
);
boothPlane.position.set(0, 3, 1);
scene.add(boothPlane);

// Video Screen
const video = document.createElement('video');
video.src = '../assets/images/temp.mp4';
video.loop = true;
video.muted = true;
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;

const screen = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 1.2),
  new THREE.MeshBasicMaterial({ map: videoTexture })
);
screen.position.set(0, 3, 1.01); // Slightly in front of booth
scene.add(screen);

/* =======================
      Instructions Sign
======================= */
const signText = `
1 - Get a Special Guest Pass on Plots
    (app.plots.events/event/tour)

2 - Scan Your QR Code with the security guard
    during open hours. (QR code)

3 - Verify your ID with Stripe.
`;

const signTexture = createTextTexture(signText);
const signMaterial = new THREE.MeshBasicMaterial({ map: signTexture });
const sign = new THREE.Mesh(
  new THREE.PlaneGeometry(2.8, 2),
  signMaterial
);
sign.position.set(0, 1.2, 1.1);
scene.add(sign);

/* =======================
        Buttons
======================= */
// Done Button (under sign)
const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
const button = new THREE.Mesh(
  new THREE.BoxGeometry(1, 0.4, 0.2),
  buttonMaterial
);
button.position.set(sign.position.x, sign.position.y - 0.5, sign.position.z + 0.6);
button.name = "teleportButton";
scene.add(button);

// Done Label
const doneTexture = createButtonLabel("Done");
const doneMaterial = new THREE.MeshBasicMaterial({ map: doneTexture, transparent: true });
const doneLabel = new THREE.Mesh(
  new THREE.PlaneGeometry(1.2, 0.3),
  doneMaterial
);
doneLabel.position.set(
  button.position.x,
  button.position.y,
  button.position.z + 0.26
);
scene.add(doneLabel);

// Mailroom Button (at building)
const mailroomButtonMaterial = new THREE.MeshStandardMaterial({ color: 0x0000aa });
const mailroomButton = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 0.5),
  mailroomButtonMaterial
);
mailroomButton.position.set(0, 2.5, -19.5);
mailroomButton.name = "mailroomButton";
scene.add(mailroomButton);

// Mailroom Label
const mailroomTexture = createButtonLabel("Mailroom");
const mailroomLabelMaterial = new THREE.MeshBasicMaterial({ map: mailroomTexture, transparent: true });
const mailroomLabel = new THREE.Mesh(
  new THREE.PlaneGeometry(1.8, 0.5),
  mailroomLabelMaterial
);
mailroomLabel.position.set(
  mailroomButton.position.x,
  mailroomButton.position.y,
  mailroomButton.position.z + 0.26
);
scene.add(mailroomLabel);

/* =======================
       Animation Loop
======================= */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

/* =======================
      Event Listeners
======================= */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([button, mailroomButton]);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    if (clickedObject.name === "teleportButton") {
      teleportPlayer();
    } else if (clickedObject.name === "mailroomButton") {
      goToMailroom();
    }
  }
});

/* =======================
        Actions
======================= */
function teleportPlayer() {
    // Start and end positions
    const startCamPos = camera.position.clone();
    const endCamPos = new THREE.Vector3(0, 2, -8);
  
    const startBoothPos = boothPlane.position.clone();
    const endBoothPos = startBoothPos.clone().add(new THREE.Vector3(0, 5, 0)); // Raise by 5 units
  
    const startScreenPos = screen.position.clone();
    const endScreenPos = startScreenPos.clone().add(new THREE.Vector3(0, 5, 0));
  
    const startSignPos = sign.position.clone();
    const endSignPos = startSignPos.clone().add(new THREE.Vector3(0, 5, 0));
  
    const startButtonPos = button.position.clone();
    const endButtonPos = startButtonPos.clone().add(new THREE.Vector3(0, 5, 0));
  
    const startDoneLabelPos = doneLabel.position.clone();
    const endDoneLabelPos = startDoneLabelPos.clone().add(new THREE.Vector3(0, 5, 0));
  
    const lookTarget = buildingPlane.position.clone();
  
    let tCam = 0;
    let tObjects = 0;
    const camDuration = 1.5; // camera moves SLOWER (1.5 seconds)
    const objDuration = 0.6; // objects raise FASTER (0.6 seconds)
  
    function move(deltaTime) {
      tCam += deltaTime / camDuration;
      tObjects += deltaTime / objDuration;
  
      if (tCam >= 1.0) tCam = 1.0;
      if (tObjects >= 1.0) tObjects = 1.0;
  
      // Camera movement (slow)
      camera.position.lerpVectors(startCamPos, endCamPos, tCam);
      camera.lookAt(lookTarget);
  
      // Objects movement (fast)
      boothPlane.position.lerpVectors(startBoothPos, endBoothPos, tObjects);
      screen.position.lerpVectors(startScreenPos, endScreenPos, tObjects);
      sign.position.lerpVectors(startSignPos, endSignPos, tObjects);
      button.position.lerpVectors(startButtonPos, endButtonPos, tObjects);
      doneLabel.position.lerpVectors(startDoneLabelPos, endDoneLabelPos, tObjects);
  
      if (tCam < 1.0 || tObjects < 1.0) {
        requestAnimationFrame(() => {
          const newDelta = 1/60; // Assume ~60fps
          move(newDelta);
        });
      }
    }
  
    move(0);
  }
  

function goToMailroom() {
  window.location.href = "../pages/mailroom.html";
}
