const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

// Save games directory
const savesDir = path.join(app.getPath('userData'), 'saves');

// Ensure saves directory exists
async function ensureSavesDirectory() {
    try {
        await fs.mkdir(savesDir, { recursive: true });
        console.log('Saves directory ready:', savesDir);
    } catch (error) {
        console.error('Error creating saves directory:', error);
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        icon: path.join(__dirname, 'logo.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        backgroundColor: '#1a1a1a',
        title: '911: Dispatcher',
        autoHideMenuBar: true
    });

    mainWindow.loadFile('index.html');

    // Open DevTools in development (comment out for production)
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(async () => {
    await ensureSavesDirectory();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers for Save System

// Save game to file
ipcMain.handle('save-game', async (event, saveData) => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `save_${saveData.saveName || 'quicksave'}_${timestamp}.savegame`;
        const filePath = path.join(savesDir, fileName);
        
        await fs.writeFile(filePath, JSON.stringify(saveData, null, 2), 'utf8');
        
        return { 
            success: true, 
            fileName: fileName,
            path: filePath 
        };
    } catch (error) {
        console.error('Save error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
});

// Load game from file
ipcMain.handle('load-game', async (event, fileName) => {
    try {
        const filePath = path.join(savesDir, fileName);
        const data = await fs.readFile(filePath, 'utf8');
        const saveData = JSON.parse(data);
        
        return { 
            success: true, 
            data: saveData 
        };
    } catch (error) {
        console.error('Load error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
});

// List all save files
ipcMain.handle('list-saves', async () => {
    try {
        const files = await fs.readdir(savesDir);
        const saveFiles = files.filter(file => file.endsWith('.savegame'));
        
        // Get file stats for each save
        const savesWithStats = await Promise.all(
            saveFiles.map(async (file) => {
                const filePath = path.join(savesDir, file);
                const stats = await fs.stat(filePath);
                
                // Try to read save metadata
                try {
                    const data = await fs.readFile(filePath, 'utf8');
                    const saveData = JSON.parse(data);
                    
                    return {
                        fileName: file,
                        date: stats.mtime,
                        size: stats.size,
                        score: saveData.score || 0,
                        callsCompleted: saveData.callsCompleted || 0,
                        lives: saveData.lives || 0,
                        saveName: saveData.saveName || 'Quicksave'
                    };
                } catch (parseError) {
                    return {
                        fileName: file,
                        date: stats.mtime,
                        size: stats.size,
                        score: 0,
                        callsCompleted: 0,
                        lives: 0,
                        saveName: 'Unknown'
                    };
                }
            })
        );
        
        // Sort by date (newest first)
        savesWithStats.sort((a, b) => b.date - a.date);
        
        return { 
            success: true, 
            saves: savesWithStats 
        };
    } catch (error) {
        console.error('List saves error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
});

// Delete save file
ipcMain.handle('delete-save', async (event, fileName) => {
    try {
        const filePath = path.join(savesDir, fileName);
        await fs.unlink(filePath);
        
        return { 
            success: true 
        };
    } catch (error) {
        console.error('Delete error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
});

// Get saves directory path
ipcMain.handle('get-saves-path', async () => {
    return { 
        success: true, 
        path: savesDir 
    };
});

// Open saves directory in file explorer
ipcMain.handle('open-saves-folder', async () => {
    try {
        const { shell } = require('electron');
        await shell.openPath(savesDir);
        return { success: true };
    } catch (error) {
        return { 
            success: false, 
            error: error.message 
        };
    }
});

