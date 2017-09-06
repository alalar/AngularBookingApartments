import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApartmentMenuComponent } from './apartment-menu.component';
import { ApartmentDetailComponent } from './apartment-detail.component';
import { ApartmentAllInfoComponent } from './apartment-all-info.component';

const apartmentRoutes: Routes = [
  {
    
    path: 'apartments',
    component: ApartmentMenuComponent,
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      { path: 'all', component: ApartmentAllInfoComponent },
      { path: ':id', component: ApartmentDetailComponent },
      
      ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(apartmentRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ApartmentRoutingModule { }