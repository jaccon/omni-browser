const { Menu, dialog } = require('electron');

function createMenu({ openSettingsWindow, reloadPreconfiguredURL, enableQuitBrowser, enableSavePage }) {
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save Page',
          accelerator: 'CmdOrCtrl+S',
          click: enableSavePage,
          // Condição para habilitar/desabilitar Save Page
          enabled: enableSavePage !== false,
        },
        { type: 'separator' },
        {
          label: 'Quit Browser',
          accelerator: 'CmdOrCtrl+Q',
          click: enableQuitBrowser,
          // Condição para habilitar/desabilitar Quit Browser
          enabled: enableQuitBrowser !== false,
        },
        { type: 'separator' },
        {
          label: 'About',
          accelerator: 'CmdOrCtrl+A',
          click: () => {
            // Substituir pelo código para abrir a página de about
          },
        },
        { type: 'separator' },
        {
          label: 'Reload Page',
          accelerator: 'CmdOrCtrl+R',
          click: reloadPreconfiguredURL,
        },
      ],
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Open Settings',
          accelerator: 'CmdOrCtrl+,',
          click: openSettingsWindow,
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(menuTemplate);
}

module.exports = { createMenu };
