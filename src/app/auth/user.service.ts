import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class TokenData {
  accessToken: string;
  expiration: Date;
  refreshToken: string;
  refreshExpiration: Date;
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$ = new BehaviorSubject(false);

  private _accessToken?: string;
  /**
   * get access token
   *
   * @returns access token
   * @memberof UserService
   */
  get accessToken(): string | undefined {
    return this._accessToken;
  }

  /**
   * Sets access token
   *
   * @param accessToken access token
   */
  set accessToken(accessToken: string) {
    this._accessToken = accessToken;
  }

  private _refreshToken?: string;
  /**
   * get refresh token
   *
   * @returns refresh token
   * @memberof UserService
   */
  get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  /**
   * set refresh token
   */
  set refreshToken(refreshToken: string) {
    this._refreshToken = refreshToken;
  }

  /**
   * Expiration time of access token
   */
  private _accessTokenExpiresAt?: Date;

  /**
   * Get expiration time of access token
   *
   * @returns access token expiration time
   * @memberof UserService
   */
  get accessTokenExpiresAt(): Date | undefined {
    return this._accessTokenExpiresAt;
  }

  /**
   * Expiration time of refresh token
   */
  private _refreshTokenExpiresAt?: Date;

  /**
   * Get expiration time of refresh token
   *
   * @returns refresh token expiration time
   * @memberof UserService
   */
  get refreshTokenExpiresAt(): Date | undefined {
    return this._refreshTokenExpiresAt;
  }

  /**
   * Username of logged in user
   */
  private _user?: string;

  /**
   * Get username of logged in user
   *
   * @returns username
   * @memberof UserService
   */
  get user(): string | undefined {
    return this._user;
  }

  constructor() {}

  /**
   * Gets if the access token is expired
   */
  isAccessTokenExpired(): boolean {
    return this.accessTokenExpiresAt
      ? this.accessTokenExpiresAt.getTime() < Date.now()
      : true;
  }

  /**
   * Gets if the refresh token is expired
   */
  isRefreshTokenExpired(): boolean {
    return this.refreshTokenExpiresAt
      ? this.refreshTokenExpiresAt.getTime() < Date.now()
      : true;
  }

  /**
   * Sets access token and refresh token
   */
  setTokens(
    accessToken: string,
    refreshToken: string,
    expiration: Date,
    refreshExpiration: Date
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this._accessTokenExpiresAt = expiration;
    this._refreshTokenExpiresAt = refreshExpiration;
    this.isLoggedIn$.next(true);
  }
}
