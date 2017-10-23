import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ApartmentMenuComponent }    from './apartment-menu.component';
import { ApartmentDetailComponent }  from './apartment-detail.component';
import { ApartmentRoutingModule } from './apartment-routing.module';
import { ApartmentEditComponent } from './apartment-edit.component';
import { ApartmentAllInfoComponent } from './apartment-all-info.component';
import { ApartmentService } from './apartment.service';
import { ApartmentCheckinoutComponent } from './apartment-checkinout.component';

import { CalendarComponent } from './shared/calendar.component';
import { ModalComponent}  from './shared/modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule ,
    ApartmentRoutingModule
  ],
  declarations: [
    ApartmentMenuComponent,
    ApartmentDetailComponent,
    ApartmentEditComponent,
    ApartmentAllInfoComponent,
    CalendarComponent,
    ModalComponent,
    ApartmentCheckinoutComponent
  ],
  providers: [ 
    ApartmentService
   ]
})
export class ApartmentsModule {}