import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './home/home.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FlightPlanOverviewComponent } from './flight-plan-overview/flight-plan-overview.component';
import { MainGridElementComponent } from './main-grid-element/main-grid-element.component';
import { MapModule } from './map/map.module';
import { BadgeTextComponent } from './badge-text/badge-text.component';
import { PrimaryDirective } from './badge-text/primary.directive';
import { SecondaryDirective } from './badge-text/secondary.directive';
import { WarnDirective } from './badge-text/warn.directive';
import { StylingDirective } from './badge-text/styling.directive';
import { TrackingConditionsComponent } from './tracking-conditions/tracking-conditions.component';
import { WeightAndBalancesComponent } from './weight-and-balances/weight-and-balances.component';
import { WeightAndBalanceElementComponent } from './weight-and-balances/weight-and-balance-element/weight-and-balance-element.component';
import { FlightPlanComponent } from './flight-plan/flight-plan.component';
import { FlightEventsComponent } from './flight-events/flight-events.component';
import { FlightGraphsComponent } from './flight-graphs/flight-graphs.component';
import { ChartsModule } from 'ng2-charts';
import { AuthInterceptor } from './auth-interceptor.interceptor';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    FlightPlanOverviewComponent,
    MainGridElementComponent,
    BadgeTextComponent,
    PrimaryDirective,
    SecondaryDirective,
    WarnDirective,
    StylingDirective,
    TrackingConditionsComponent,
    WeightAndBalancesComponent,
    WeightAndBalanceElementComponent,
    FlightPlanComponent,
    FlightEventsComponent,
    FlightGraphsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatIconModule,
    ChartsModule,
    MapModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
