const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const isDev = !app.isPackaged;

let mainWindow;

// --- AI Agent IPC Handlers ---
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    // Klasor yoksa olustur
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-dir', async (event, dirPath) => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const result = files.map(f => ({ name: f.name, isDirectory: f.isDirectory() }));
    return { success: true, files: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('run-command', async (event, command, cwd) => {
  return new Promise((resolve) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout,
        stderr,
        error: error ? error.message : null
      });
    });
  });
});
// -----------------------------

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // Frame'i kaldirarak masaustu hissiyati yaratalim (frameless)
    // Ama Microsoft Store icin genelde standart bar baslangicta iyi olabilir, simdilik kapali kalsin isterseniz acabilirsiniz.
    titleBarStyle: 'hidden', 
    titleBarOverlay: {
      color: '#fafafa',
      symbolColor: '#171717',
      height: 56
    },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
      enableRemoteModule: true
    },
    show: false
  });

  // Microsoft Store Google Auth Fix (Hide Electron from User-Agent)
  mainWindow.webContents.userAgent = mainWindow.webContents.userAgent.replace(/Electron\/\S+/, "");
  app.userAgentFallback = app.userAgentFallback ? app.userAgentFallback.replace(/Electron\/\S+/, "") : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  
  // Handle popups correctly for Firebase Auth
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      }
    };
  });

  const startUrl = isDev
    ? 'http://localhost:3000/register'
    : 'https://ideaai.togetlink.com/register';

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
