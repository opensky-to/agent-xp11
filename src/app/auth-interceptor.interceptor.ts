import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './auth/user.service';
import { LoginService } from './auth/login.service';

/**
 * Interceptor to add token to request header
 * Refreshes token if expired
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private authService: LoginService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check if token is expired
    if (this.userService.isAccessTokenExpired()) {
      // Access token is expired, check for refresh token
      if (this.userService.isRefreshTokenExpired()) {
        // Refresh token is expired, logout
        /**
         * @todo: Logout
         */
      } else {
        // Refresh token is valid, refresh token
        this.authService.refreshToken();
      }
    }
    if (this.userService.accessToken) {
      request = request.clone({
        setHeaders: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${this.userService.accessToken}`,
        },
      });
    }
    return next.handle(request);
  }
}
