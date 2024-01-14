// preload.js

const { ipcRenderer } = require('electron');

ipcRenderer.on('resize', (event, { width, height }) => {
  const webview = document.querySelector('webview');
  webview.style.width = `${width}px`;
  webview.style.height = `${height}px`;
});

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('webview-loaded');
});
