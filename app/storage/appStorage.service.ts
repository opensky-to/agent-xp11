import { App } from 'electron';
import * as fs from 'fs';
import * as fsPromises from 'fs-extra';
import { join } from 'path';

export class StorageObject {
  public refreshToken: string;
  public refreshTokenExpiration: Date;
  public accessToken: string;
  public accessTokenExpiration: Date;

  constructor(json?: string) {
    if (json) {
      this.deserialize(json);
    }
  }

  /**
   * Deserialize the object from a json string
   */
  public deserialize(json: string) {
    let obj = JSON.parse(json);
    this.refreshToken = obj.refreshToken;
    this.refreshTokenExpiration = obj.refreshTokenExpiration
      ? new Date(obj.refreshTokenExpiration)
      : null;
    this.accessToken = obj.accessToken;
    this.accessTokenExpiration = obj.accessTokenExpiration
      ? new Date(obj.accessTokenExpiration)
      : null;
  }

  /**
   * Serialize the object to a json string
   */
  public serialize() {
    return JSON.stringify(this);
  }
}

export class AppStorageService {
  storageLocation: string;
  storageObject?: StorageObject;

  constructor(app: App) {
    this.storageLocation = join(app.getPath('userData'), 'storage.json');
    this._initStorage();
  }

  /**
   * Initialize the storage file if it doesn't exist
   */
  private async _initStorage() {
    // Create the storage file if it doesn't exist
    if (!(await this.fileExists())) {
      await fsPromises.writeFile(
        this.storageLocation,
        new StorageObject().serialize()
      );
    } else {
      // Check if the storage file is empty
      let json = await fsPromises.readFile(this.storageLocation);
      if (json.toString() === '{}') {
        await fsPromises.writeFile(
          this.storageLocation,
          new StorageObject().serialize()
        );
      } else {
        // Read the storage file
        this.storageObject = await this.getStorage();
      }
    }
  }

  /**
   * Check if the storage file exists using promises
   */
  async fileExists(): Promise<boolean> {
    try {
      await fsPromises.access(this.storageLocation, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get the storage object from the storage file
   */
  async getStorage(): Promise<StorageObject> {
    let json = await fsPromises.readFile(this.storageLocation);
    return new StorageObject(json.toString());
  }

  /**
   * Save the storage object to the storage file
   */
  async saveStorage(storageObject: StorageObject) {
    await fsPromises.writeFile(this.storageLocation, storageObject.serialize());
  }

  /**
   * Sets the refresh token and expiration date
   */
  async setRefreshToken(refreshToken: string, refreshTokenExpiration: Date) {
    if (!this.storageObject) {
      this.storageObject = await this.getStorage();
    }
    this.storageObject!.refreshToken = refreshToken;
    this.storageObject!.refreshTokenExpiration = refreshTokenExpiration;
    await this.saveStorage(this.storageObject!);
  }

  /**
   * Sets the access token and expiration date
   * @param accessToken The access token
   * @param accessTokenExpiration The expiration date
   */
  async setAccessToken(accessToken: string, accessTokenExpiration: Date) {
    if (!this.storageObject) {
      this.storageObject = await this.getStorage();
    }
    this.storageObject!.accessToken = accessToken;
    this.storageObject!.accessTokenExpiration = accessTokenExpiration;
    await this.saveStorage(this.storageObject!);
  }

  /**
   * Gets the refresh token
   */
  async getRefreshToken(): Promise<string> {
    if (!this.storageObject) {
      this.storageObject = await this.getStorage();
    }
    return this.storageObject!.refreshToken;
  }

  /**
   * Gets the refresh token expiration date
   * @returns True if its still valid, false if it has expired
   */
  async getRefreshTokenExpiration(): Promise<boolean> {
    if (!this.storageObject) {
      this.storageObject = await this.getStorage();
    }
    return this.storageObject!.refreshTokenExpiration > new Date();
  }

  /**
   * Gets the access token
   */
  async getAccessToken(): Promise<string> {
    if (!this.storageObject) {
      this.storageObject = await this.getStorage();
    }
    return this.storageObject!.accessToken;
  }

  /**
   * Gets the access token expiration date
   * @returns True if its still valid, false if it has expired
   */
  async getAccessTokenExpiration(): Promise<boolean> {
    if (!this.storageObject) {
      this.storageObject = await this.getStorage();
    }
    return this.storageObject!.accessTokenExpiration > new Date();
  }
}
