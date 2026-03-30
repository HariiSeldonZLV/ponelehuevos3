import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

// Inicializar Firebase con variables de entorno
const app = initializeApp(environment.firebase);
const db = getFirestore(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: 'FIRESTORE', useValue: db }
  ]
};
