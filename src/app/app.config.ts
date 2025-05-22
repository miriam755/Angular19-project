import { ApplicationConfig, provideZoneChangeDetection,importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth-interceptor.service';
import { withFetch } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()), // <-- הוספת withFetch()
    provideNoopAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};