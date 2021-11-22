import { ipcMain } from 'electron';
import { AppStorageService } from '../storage/appStorage.service';
import { XplaneService } from '../x-plane/x-plane.service';
import { IPC_EVENTS } from './ipc-events.enum';

class NewTokensResponse {
  acccessToken: string;
  refreshToken: string;
  exipration: Date;
  refreshTokenExpiration: Date;
}

export class IpcService {
  constructor(
    private xplaneService: XplaneService,
    private webContents: Electron.WebContents,
    private storage: AppStorageService
  ) {
    // Send xplane status to renderer
    this.xplaneService.$connectionStatus.subscribe(status => {
      this.webContents.send(IPC_EVENTS.X_PLANE_CONNECTION_STATUS, status);
    });

    this.xplaneService.datarefService.subscribedDataRefs.subscribe(dataRefs => {
      this.webContents.send(IPC_EVENTS.X_PLANE_DATAREFS, dataRefs);
    });

    // Request xplane status from renderer
    ipcMain.on(IPC_EVENTS.X_PLANE_CONNECTION_STATUS_REQUEST, event => {
      event.returnValue = this.xplaneService.$connectionStatus.getValue();
    });

    // New Tokens from renderer
    ipcMain.on(
      IPC_EVENTS.NEW_TOKENS,
      async (event, tokens: NewTokensResponse) => {
        await this.storage.setAccessToken(
          tokens.acccessToken,
          tokens.exipration
        );
        await this.storage.setRefreshToken(
          tokens.refreshToken,
          tokens.refreshTokenExpiration
        );
      }
    );
  }
}
