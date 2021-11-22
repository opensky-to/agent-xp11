import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ipcRenderer, shell } from 'electron';
import { IPC_EVENTS } from '../../../app/ipc/ipc-events.enum';
import { APP_CONFIG } from '../../environments/environment';
import { TokenData, UserService } from './user.service';

class RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiration: Date;
  refreshTokenExpiration: Date;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  private shell: typeof shell;
  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private readonly userService: UserService,
    private http: HttpClient
  ) {
    /**
     * If user is not logged in, login user
     */
    if (this.isElectron) {
      this.shell = window.require('electron').shell;
      this.ipcRenderer = window.require('electron').ipcRenderer;
    }
    if (!this.userService.isLoggedIn$.value && this.isElectron) {
      this.subscribeToLoginEvent();
      this.subscribeToRefreshTokenEvent();
    }
  }

  login() {
    this.shell.openExternal(
      `https://www-dev.opensky.to/apptoken/${APP_CONFIG.tokenConfig.ID}`
    );
  }

  /**
   * Refreshes the access token using the refresh token
   */
  refreshToken() {
    this.http
      .post(`${APP_CONFIG.apiUrl}/authentication/refreshToken`, {
        refresh: this.userService.refreshToken,
        token: this.userService.accessToken,
      })
      .subscribe(({ data }: { data: RefreshTokenResponse }) => {
        this.userService.setTokens(
          data.token,
          data.refreshToken,
          data.expiration,
          data.refreshTokenExpiration
        );
        /**
         * Send the new tokens to the main process
         */
        this.ipcRenderer.send(IPC_EVENTS.NEW_TOKENS, {
          accessToken: data.token,
          refreshToken: data.refreshToken,
          expiration: data.expiration,
          refreshTokenExpiration: data.refreshTokenExpiration,
        });
      });
  }

  private subscribeToLoginEvent() {
    this.ipcRenderer.on(IPC_EVENTS.LOGIN, (event, tokenData: TokenData) => {
      this.userService.setTokens(
        tokenData.accessToken,
        tokenData.refreshToken,
        tokenData.expiration,
        tokenData.refreshExpiration
      );
    });
  }

  private subscribeToRefreshTokenEvent() {
    this.ipcRenderer.on(
      IPC_EVENTS.REFRESH_TOKEN,
      (
        event,
        data: { refreshToken: string | null; accessToken: string | null }
      ) => {
        // If refresh token is null, the user needs to login again
        if (data.accessToken && data.refreshToken) {
          this.userService.refreshToken = data.refreshToken;
          this.userService.accessToken = data.accessToken;
          this.refreshToken();
        } else {
          this.login();
        }
      }
    );
  }
}
