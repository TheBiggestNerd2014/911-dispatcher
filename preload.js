const { contextBridge, ipcRenderer } = require('electron');

// Expose safe IPC methods to renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Quit the application
    quitApp: () => ipcRenderer.send('quit-app'),
    
    // Check if running in Electron
    isElectron: true
});

console.log('Preload script loaded - Electron API available');

