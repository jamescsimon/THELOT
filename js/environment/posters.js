import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

const posterCovers = {
  action: new THREE.TextureLoader().load("../assets/images/poster2.png"),
  comedy: new THREE.TextureLoader().load("../assets/images/poster3.png"),
  horror: new THREE.TextureLoader().load("../assets/images/poster4.png"),
  scifi: new THREE.TextureLoader().load("../assets/images/poster2.png"),
  drama: new THREE.TextureLoader().load("../assets/images/poster3.png"),
  indie: new THREE.TextureLoader().load("../assets/images/poster4.png")
};

function spawnPostersInRoom(scene, posterObjects, centerX, centerZ, facingLeft, genre = "action") {
  const posterWidth = 1;
  const posterHeight = 2;
  const spacing = 1;
  const posterY = 1.5;
  const posterOffsetFlush = 0.01;
  const wallSize = 17;

  function createPosterMaterial() {
    return new THREE.MeshBasicMaterial({
      map: posterCovers[genre] || null,
      color: 0x888888,
      side: THREE.DoubleSide
    });
  }

  function placeWallPosters(baseX, baseZ, normalX, normalZ, count, offsetFromWall) {
    const totalWidth = (count - 1) * (posterWidth + spacing);
    const startOffset = -totalWidth / 2;

    for (let i = 0; i < count; i++) {
      const poster = new THREE.Mesh(
        new THREE.PlaneGeometry(posterWidth, posterHeight),
        createPosterMaterial()
      );

      const offset = startOffset + i * (posterWidth + spacing);

      poster.position.set(
        baseX + offset * normalZ + offsetFromWall * normalX,
        posterY,
        baseZ + offset * normalX + offsetFromWall * normalZ
      );

      if (normalX === 1) poster.rotation.y = Math.PI / 2;
      if (normalX === -1) poster.rotation.y = -Math.PI / 2;
      if (normalZ === 1) poster.rotation.y = 0;
      if (normalZ === -1) poster.rotation.y = Math.PI;

      poster.userData.isPoster = true;
      poster.userData.genre = genre;
      poster.userData.originalTexture = poster.material.map;
      poster.userData.originalRoomCenter = new THREE.Vector3(centerX, 1.6, centerZ); // ✅ ADD THIS LINE!
      posterObjects.push(poster);
      scene.add(poster);

    }
  }

  placeWallPosters(centerX, centerZ + (wallSize/2) - 0.25, 0, -1, 8, posterOffsetFlush);
  if (facingLeft) {
    placeWallPosters(centerX - (wallSize/2) + 0.25, centerZ, 1, 0, 8, posterOffsetFlush);
  } else {
    placeWallPosters(centerX + (wallSize/2) - 0.25, centerZ, -1, 0, 8, posterOffsetFlush);
  }
  placeWallPosters(centerX, centerZ - (wallSize/2) + 0.25, 0, 1, 8, posterOffsetFlush);
}

export { spawnPostersInRoom };
