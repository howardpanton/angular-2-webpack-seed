export const mainDevelopmentTemplate = `
import './polyfills.ts';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './app';
import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule);

`;