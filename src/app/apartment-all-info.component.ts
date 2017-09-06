import { Component, ViewChild, LOCALE_ID, Inject, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { ApartmentService, Apartment, Booking, User } from './apartment.service';
import { CalendarComponent }  from './shared/calendar.component';


@Component({
  templateUrl: './apartment-all-info.component.html'
})

export class ApartmentAllInfoComponent implements OnInit {
  @ViewChild(CalendarComponent)
  public readonly calendarView: CalendarComponent;
    constructor (
        @Inject(LOCALE_ID) private localLanguage: string, 
        private service: ApartmentService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
      let param:string;
        this.route.params
        .switchMap((params: Params) => this.service.getApartments())
        .subscribe((apartments:Apartment[]) => {  
                                                  if (this.calendarView) {
                                                      this.calendarView.apartments = apartments;
                                                      this.calendarView.bookings = [];
                                                      this.calendarView.refreshCalendarInfo();
                                                  }
                                });
    }

    calculateAllInfo(apartments:Apartment[]){

    }
}