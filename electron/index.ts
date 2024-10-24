import {join} from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {BrowserWindow, app, ipcMain, IpcMainEvent, nativeTheme, globalShortcut, screen} from 'electron';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

function createWindow() {
  const {width: screenWidth, height: screenHeight} = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = Math.round(screenWidth * 0.92); // 92% width
  const windowHeight = Math.round(screenHeight * 0.94); // 94% height
  const window = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    resizable: false,
    center: true,
    hasShadow: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  const port = 9001;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../dist-vite/index.html');

  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }
  window.setMenuBarVisibility(false);

  try {
    globalShortcut.register('CommandOrControl+M', () => {
      const isVisible = window.isMenuBarVisible();
      window.setMenuBarVisibility(!isVisible);
    });

    globalShortcut.register('CommandOrControl+I', () => {
      const isVisible = window.webContents.isDevToolsOpened();
      isVisible ? window.webContents.closeDevTools() : window.webContents.openDevTools();
    });
  } catch (error) {
    console.error('Error registering shortcut:', error);
  }

  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });

  nativeTheme.themeSource = 'system';
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'common.hiElectron'), 500);
});
