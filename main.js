const { app, BrowserWindow, ipcMain, Menu, screen, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let config;

// Função para configurar o nome do aplicativo na barra de menus
function setupAppMenu() {
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save Page',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            dialog.showSaveDialog(mainWindow, {
              title: 'Save Page',
              defaultPath: 'page.html',
              filters: [
                { name: 'HTML Files', extensions: ['html'] },
                { name: 'All Files', extensions: ['*'] },
              ],
            })
            .then(({ filePath }) => {
              if (filePath) {
                mainWindow.webContents.savePage(filePath, 'HTMLComplete', (error) => {
                  if (error) {
                    console.error('Error saving page:', error);
                  }
                });
              }
            })
            .catch((error) => {
              console.error('Error opening Save dialog:', error);
            });
          },
          // Condição para habilitar/desabilitar Save Page
          enabled: config.enableSavePage !== false,
        },
        { type: 'separator' },
        {
          label: 'About',
          accelerator: 'CmdOrCtrl+A',
          click: () => {
            mainWindow.loadURL(config.aboutPageURL);
          },
        },
        { type: 'separator' },
        {
          label: 'Reload Page',
          accelerator: 'CmdOrCtrl+R',
          click: reloadPreconfiguredURL,
        },
        { type: 'separator' },
        {
          label: 'Quit Browser',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
          // Condição para habilitar/desabilitar Quit Browser
          enabled: config.enableQuitBrowser !== false,
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Configura o nome da aplicação na barra de menus
  app.setName('OmniBrowser');
}

// Lê o arquivo de configuração
const configFile = path.join(__dirname, 'setup.json');
try {
  const data = fs.readFileSync(configFile, 'utf-8');
  config = JSON.parse(data);
} catch (error) {
  console.error('Erro ao ler o arquivo de configuração:', error);
  // Define configurações padrão caso não seja possível ler o arquivo de configuração
  config = {
    preloadURL: 'https://www.google.com',
    aboutPageURL: 'https://www.google.com',
    enableSavePage: true,  // Default habilitado
    enableQuitBrowser: true,  // Default habilitado
  };
}

// Configura o nome do aplicativo antes de criar a janela principal
setupAppMenu();

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    },
  });

  mainWindow.setFullScreen(true);

  // Carrega a URL especificada no arquivo de configuração
  mainWindow.loadURL(config.preloadURL);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function reloadPreconfiguredURL() {
  // Verifica se mainWindow está definido antes de tentar recarregar a URL
  if (mainWindow) {
    // Recarrega a URL pré-configurada
    mainWindow.loadURL(config.preloadURL);
  }
}

app.whenReady().then(createWindow);

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('webview-loaded', (event) => {
  event.reply('webview-loaded');
});
