import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

async function loadPDFPages(url) {
  const loadingTask = pdfjsLib.getDocument(url);
  const pdf = await loadingTask.promise;
  const textures = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const texture = new THREE.CanvasTexture(canvas);
    textures.push(texture);
  }

  return textures;
}

export { loadPDFPages };
