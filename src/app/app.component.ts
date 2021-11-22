import { Component, HostListener, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { slideInAnimation } from './animations/slide-in.animation';
import { XplaneService } from './core/services/electron/xplane.service';
import { UserService } from './auth/user.service';
import { LoginService } from './auth/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation(400)],
})
export class AppComponent implements OnInit {
  secondColumnVisible = false;

  col3Open = false;
  manualOpened = false;
  largeScreen = false;

  col3OpenTrigger: 'opened' | 'closed' = 'closed';

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private userService: UserService,
    private loginService: LoginService
  ) {
    this.translate.setDefaultLang('en');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // If screensize becomes larger then 1450px, set col3Open to true
    if (event.target.innerWidth > 1450) {
      this.col3Open = true;
      this.col3OpenTrigger = 'opened';
      this.manualOpened = false;
      this.largeScreen = true;
    } else {
      this.largeScreen = false;
      if (this.manualOpened === false) {
        this.col3Open = false;
        this.col3OpenTrigger = 'closed';
      }
    }
  }

  ngOnInit() {
    /**
     * Get current screen size
     * If its larger then 1450px, set largeScreen to true
     */
    this.onResize({ target: { innerWidth: window.innerWidth } });
  }

  toggleCol3() {
    if (this.largeScreen) {
      return;
    }
    if (this.col3Open === false) {
      this.col3Open = true;
      this.col3OpenTrigger = 'opened';
      this.manualOpened = true;
    } else {
      this.col3OpenTrigger = 'closed';
      this.col3Open = false;
    }
  }
}
