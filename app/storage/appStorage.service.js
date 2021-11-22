"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppStorageService = exports.StorageObject = void 0;
var fs = require("fs");
var fsPromises = require("fs-extra");
var path_1 = require("path");
var StorageObject = /** @class */ (function () {
    function StorageObject(json) {
        if (json) {
            this.deserialize(json);
        }
    }
    /**
     * Deserialize the object from a json string
     */
    StorageObject.prototype.deserialize = function (json) {
        var obj = JSON.parse(json);
        this.refreshToken = obj.refreshToken;
        this.refreshTokenExpiration = obj.refreshTokenExpiration
            ? new Date(obj.refreshTokenExpiration)
            : null;
        this.accessToken = obj.accessToken;
        this.accessTokenExpiration = obj.accessTokenExpiration
            ? new Date(obj.accessTokenExpiration)
            : null;
    };
    /**
     * Serialize the object to a json string
     */
    StorageObject.prototype.serialize = function () {
        return JSON.stringify(this);
    };
    return StorageObject;
}());
exports.StorageObject = StorageObject;
var AppStorageService = /** @class */ (function () {
    function AppStorageService(app) {
        this.storageLocation = path_1.join(app.getPath('userData'), 'storage.json');
        console.log(this.storageLocation);
        this._initStorage();
    }
    /**
     * Initialize the storage file if it doesn't exist
     */
    AppStorageService.prototype._initStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fileExists()];
                    case 1:
                        if (!!(_b.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, fsPromises.writeFile(this.storageLocation, new StorageObject().serialize())];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 3: return [4 /*yield*/, fsPromises.readFile(this.storageLocation)];
                    case 4:
                        json = _b.sent();
                        if (!(json.toString() === '{}')) return [3 /*break*/, 6];
                        return [4 /*yield*/, fsPromises.writeFile(this.storageLocation, new StorageObject().serialize())];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        // Read the storage file
                        _a = this;
                        return [4 /*yield*/, this.getStorage()];
                    case 7:
                        // Read the storage file
                        _a.storageObject = _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if the storage file exists using promises
     */
    AppStorageService.prototype.fileExists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fsPromises.access(this.storageLocation, fs.constants.F_OK)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the storage object from the storage file
     */
    AppStorageService.prototype.getStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fsPromises.readFile(this.storageLocation)];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, new StorageObject(json.toString())];
                }
            });
        });
    };
    /**
     * Save the storage object to the storage file
     */
    AppStorageService.prototype.saveStorage = function (storageObject) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fsPromises.writeFile(this.storageLocation, storageObject.serialize())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets the refresh token and expiration date
     */
    AppStorageService.prototype.setRefreshToken = function (refreshToken, refreshTokenExpiration) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.storageObject) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getStorage()];
                    case 1:
                        _a.storageObject = _b.sent();
                        _b.label = 2;
                    case 2:
                        this.storageObject.refreshToken = refreshToken;
                        this.storageObject.refreshTokenExpiration = refreshTokenExpiration;
                        return [4 /*yield*/, this.saveStorage(this.storageObject)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets the access token and expiration date
     * @param accessToken The access token
     * @param accessTokenExpiration The expiration date
     */
    AppStorageService.prototype.setAccessToken = function (accessToken, accessTokenExpiration) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.storageObject) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getStorage()];
                    case 1:
                        _a.storageObject = _b.sent();
                        _b.label = 2;
                    case 2:
                        this.storageObject.accessToken = accessToken;
                        this.storageObject.accessTokenExpiration = accessTokenExpiration;
                        return [4 /*yield*/, this.saveStorage(this.storageObject)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the refresh token
     */
    AppStorageService.prototype.getRefreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.storageObject) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getStorage()];
                    case 1:
                        _a.storageObject = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.storageObject.refreshToken];
                }
            });
        });
    };
    /**
     * Gets the refresh token expiration date
     * @returns True if its still valid, false if it has expired
     */
    AppStorageService.prototype.getRefreshTokenExpiration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.storageObject) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getStorage()];
                    case 1:
                        _a.storageObject = _b.sent();
                        _b.label = 2;
                    case 2:
                        console.log('exp', this.storageObject.refreshTokenExpiration);
                        return [2 /*return*/, this.storageObject.refreshTokenExpiration > new Date()];
                }
            });
        });
    };
    /**
     * Gets the access token
     */
    AppStorageService.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.storageObject) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getStorage()];
                    case 1:
                        _a.storageObject = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.storageObject.accessToken];
                }
            });
        });
    };
    /**
     * Gets the access token expiration date
     * @returns True if its still valid, false if it has expired
     */
    AppStorageService.prototype.getAccessTokenExpiration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.storageObject) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getStorage()];
                    case 1:
                        _a.storageObject = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.storageObject.accessTokenExpiration > new Date()];
                }
            });
        });
    };
    return AppStorageService;
}());
exports.AppStorageService = AppStorageService;
//# sourceMappingURL=appStorage.service.js.map