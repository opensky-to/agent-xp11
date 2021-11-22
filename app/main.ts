import { app, BrowserWindow, dialog, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { IpcService } from './ipc/ipc.service';
import { XplaneService } from './x-plane/x-plane.service';
import { IPC_EVENTS } from './ipc/ipc-events.enum';
import { AppStorageService } from './storage/appStorage.service';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const storageService = new AppStorageService(app);

function createWindow(): BrowserWindow {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron')),
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(
      url.format({
        pathname: path.join(__dirname, pathIndex),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  const xplaneService = new XplaneService();
  const ipcService = new IpcService(
    xplaneService,
    win.webContents,
    storageService
  );

  return win;
}

try {
  let mainWindow: BrowserWindow = null;
  /**
   * Register custom url protocol
   */
  // remove so we can register each time as we run the app.
  app.removeAsDefaultProtocolClient('opensky-agent-xp11');

  // If we are running a non-packaged version of the app && on windows
  if (process.env.NODE_ENV !== 'production' && process.platform === 'win32') {
    // Set the path of electron.exe and your app.
    // These two additional parameters are only available on windows.
    app.setAsDefaultProtocolClient('opensky-agent-xp11', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    app.setAsDefaultProtocolClient('opensky-agent-xp11');
  }

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', async (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      const token = commandLine.pop();

      /**
       * If we have a token, we need to extract the contents and save them to storage
       */
      const tokenContents = extractTokenContents(token);
      await storageService.setRefreshToken(
        tokenContents.refreshToken,
        tokenContents.refreshExpiration
      );
      await storageService.setAccessToken(
        tokenContents.accessToken,
        tokenContents.expiration
      );

      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
        mainWindow.webContents.send(IPC_EVENTS.LOGIN, tokenContents);
      }
    });

    // Create mainWindow, load the rest of the app, etc...
    app.whenReady().then(async () => {
      /**
       * If we have a token in storage, we need to check if it is still valid
       */
      /**
       * Wait for FRONTEND_READY event
       */
      const frontendReady = new Promise<void>(resolve => {
        ipcMain.on(IPC_EVENTS.FRONTEND_READY, () => {
          resolve();
        });
      });

      mainWindow = createWindow();
      await frontendReady;

      const refreshToken = await storageService.getRefreshToken();
      const accessToken = await storageService.getAccessToken();
      const stillValid = await storageService.getRefreshTokenExpiration();
      if (refreshToken && accessToken && stillValid) {
        // We have a valid token, send it to the main window
        mainWindow.webContents.send(IPC_EVENTS.REFRESH_TOKEN, {
          refreshToken,
          accessToken,
        });
      } else {
        // We have an expired token, send null to the main window
        mainWindow.webContents.send(IPC_EVENTS.REFRESH_TOKEN, {
          refreshToken: null,
          accessToken: null,
        });
      }
    });

    // Handle the protocol. In this case, we choose to show an Error Box.
    app.on('open-url', (event, url) => {
      dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
    });
  }

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

const extractTokenContents = (token: string) => {
  const splits = token.split('&');
  const accessToken = splits[0].split('=')[1];
  const expiration = fileTimeToUnixTime(parseInt(splits[1].split('=')[1]));
  const refreshToken = splits[2].split('=')[1];
  const refreshExpiration = fileTimeToUnixTime(
    parseInt(splits[3].split('=')[1])
  );
  const user = splits[4].split('=')[1].slice(0, -1);
  return {
    accessToken,
    expiration,
    refreshToken,
    refreshExpiration,
    user,
  };
};

/**
 * Converts windows filetime to Date
 */
const fileTimeToUnixTime = (fileTime: number) => {
  const seconds = fileTime / 10000000 - 11644473600;
  return new Date(seconds * 1000);
};
