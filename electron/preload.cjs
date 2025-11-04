// BERAT CANKIR
// BERAT BİLAL CANKIR
// CANKIR




const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  goBack: () => ipcRenderer.send('window-go-back'),
  goForward: () => ipcRenderer.send('window-go-forward'),
  reload: () => ipcRenderer.send('window-reload'),
  toggleFullscreen: () => ipcRenderer.send('window-toggle-fullscreen'),
  onFullscreenChange: (callback) => {
    ipcRenderer.on('fullscreen-changed', (event, isFullscreen) => callback(isFullscreen));
  },
  isElectron: true
});


// BERAT CANKIR
// BERAT BİLAL CANKIR
// CANKIR
