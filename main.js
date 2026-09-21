const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

let mainWindow;

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
