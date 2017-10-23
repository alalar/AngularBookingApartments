import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID  } from '@angular/core';

import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { ApartmentsModule } from './apartments.module';



const appRoutes: Routes = [
  { path: '',
    redirectTo: '/apartments/all',
    pathMatch: 'full'
  },
  {path: '**', redirectTo: '/apartments/all',
    pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent
   
  ],
  imports: [
    ApartmentsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserModule,
    HttpModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "en-US"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
