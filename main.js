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
      contextIsolation: false, // Guvenlik onlemi icin normalde true yapilir, MVP icin false kullaniyoruz
      enableRemoteModule: true
    },
    show: false // Wait until ready to show
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'out/index.html')}`;

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
