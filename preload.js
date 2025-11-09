const { contextBridge, ipcRenderer } = require('electron');

// Expose safe IPC methods to renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Save game
    saveGame: (saveData) => ipcRenderer.invoke('save-game', saveData),
    
    // Load game
    loadGame: (fileName) => ipcRenderer.invoke('load-game', fileName),
    
    // List all saves
    listSaves: () => ipcRenderer.invoke('list-saves'),
    
    // Delete save
    deleteSave: (fileName) => ipcRenderer.invoke('delete-save', fileName),
    
    // Get saves directory path
    getSavesPath: () => ipcRenderer.invoke('get-saves-path'),
    
    // Open saves folder in file explorer
    openSavesFolder: () => ipcRenderer.invoke('open-saves-folder'),
    
    // Check if running in Electron
    isElectron: true
});

console.log('Preload script loaded - Electron API available');

