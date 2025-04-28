function animate(renderer, scene, camera, controls) {
  function loop() {
    requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
  }
  loop();
}

export { animate };
