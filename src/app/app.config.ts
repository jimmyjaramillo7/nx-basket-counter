import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '../environments/environment.development';

function tokenGetter() {
  console.log("OBTENIENDO TOKEN");
  
  return localStorage.getItem("token-board");
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), 
     provideAnimationsAsync(), 
     provideHttpClient(withInterceptorsFromDi()),
     importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["nodo.com.ec", "localhost:3000",environment.baseURL.split('//')[1]],
          disallowedRoutes: ["/api/v1/auth/signin"],
        },
      }),
    ),
    ]
};
