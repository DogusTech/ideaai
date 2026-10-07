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

const { dialog } = require('electron');
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result.canceled) return { success: false };
  return { success: true, path: result.filePaths[0] };
});

// --- LOCAL AI ENGINE (OLLAMA) ROUTER ---
ipcMain.handle('ask-local-ai', async (event, messages) => {
  try {
    // Ollama localhost REST API'sine (chat endpoint) istek atiyoruz
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'ui-llama', // Bizim ozel egittigimiz UI modeline gecildi
        messages: messages, // Artık tüm mesaj geçmişi ve system prompt gidiyor
        stream: false 
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API Hatasi: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, text: data.message.content };
    
  } catch (error) {
    console.error("Local AI Hatasi:", error);
    return { 
      success: false, 
      error: 'Lokal Yapay Zeka motoruna baglanilamadi. Ollama calisiyor mu?' 
    };
  }
});
// -----------------------------
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
    ? 'http://localhost:3000/mac-test' // Changed from ideaai.localhost due to Windows DNS issues
    : 'https://ideaai.togetlink.com/mac-test';

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
