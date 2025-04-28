import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

const wallObjects = []; 

function createHallwayWalls(scene) {
  const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const wallThickness = 0.5;
  const hallwayLength = 55;
  const hallwayWidth = 10;
  const entranceWidth = 3;

  const leftX = -hallwayWidth / 2;
  const rightX = hallwayWidth / 2;
  const entranceCenters = [8.5, 26.5, 44.5];

  for (let z = 0; z < hallwayLength; ) {
    let nextEntrance = entranceCenters.find(center => center > z);
    let segmentEnd = nextEntrance !== undefined ? nextEntrance - (entranceWidth/2) : hallwayLength;

    if (segmentEnd > z) {
      const segmentLength = segmentEnd - z;

      const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, 3, segmentLength),
        wallMaterial
      );
      leftWall.position.set(leftX - wallThickness/2, 1.5, z + segmentLength/2);
      scene.add(leftWall);
      wallObjects.push(leftWall); 

      const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, 3, segmentLength),
        wallMaterial
      );
      rightWall.position.set(rightX + wallThickness/2, 1.5, z + segmentLength/2);
      scene.add(rightWall);
      wallObjects.push(rightWall); 
    }

    if (nextEntrance !== undefined) {
      z = nextEntrance + (entranceWidth / 2);
    } else {
      break;
    }
  }
}

export { createHallwayWalls, wallObjects }; 