import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { zoomIntoPoster, teleportPlayer } from '../ui/navigation.js';
import { loadPDFPages } from './loaders.js';

const genreScriptPaths = {
  action: "/assets/scripts/action/action-script.pdf",
  comedy: "/assets/scripts/comedy/comedy-script.pdf",
  horror: "/assets/scripts/horror/horror-script.pdf",
  scifi: "/assets/scripts/scifi/scifi-script.pdf",
  drama: "/assets/scripts/drama/drama-script.pdf",
  indie: "/assets/scripts/indie/indie-script.pdf"
};

let screenplayPages = [];
let screenplayReady = false;
let currentGenre = "";

function setupRaycasting(camera, scene, teleportButtons, posterObjects, wallObjects, controls) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      console.log('Clicked UI button, skipping raycast.');
      return;
    }
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
  
    const clickableObjects = [...wallObjects, ...teleportButtons, ...posterObjects];
    const intersects = raycaster.intersectObjects(clickableObjects, false);
  
    if (intersects.length > 0) {
  
      for (let i = 0; i < intersects.length; i++) {
        const hit = intersects[i].object;
  
        if (hit.userData.type === 'wall') {
          console.log('Ray hit a wall BEFORE reaching target, blocking click.');
          return; 
        }
  
        if (hit.userData.isPoster) {
          console.log('Clicked poster:', hit);
          const genre = hit.userData.genre || "action";
          if (currentGenre !== genre) {
            screenplayReady = false;
            loadPDFPages(genreScriptPaths[genre]).then(pages => {
              screenplayPages = pages;
              screenplayReady = true;
              currentGenre = genre;
              zoomIntoPoster(hit, screenplayPages, controls, camera);
            });
          } else {
            if (!screenplayReady) return;
            zoomIntoPoster(hit, screenplayPages, controls, camera);
          }
          return; 
        }
  
        if (hit.userData.target) {
          teleportPlayer(camera, controls, hit.userData.target);
          return; 
        }
      }
    }
  });
  
}

export { setupRaycasting };