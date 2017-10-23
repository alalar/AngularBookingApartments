import { Component, ViewChild, LOCALE_ID, Inject, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { ApartmentService, Apartment, Booking, User } from './apartment.service';



@Component({
  templateUrl: './apartment-checkinout.component.html'
})

export class ApartmentCheckinoutComponent implements OnInit {
    private checkInOuts:Object = null;
    constructor (
        @Inject(LOCALE_ID) private localLanguage: string, 
        private service: ApartmentService
      ) {
    }

    ngOnInit() {
        this.service.getCheckinOuts().subscribe((checkInOuts: {
            "CheckIn": {"Yesterday":any[],"Today":any[],"NextDays":any[]},
            "CheckOut": {"Yesterday":any[],"Today":any[],"NextDays":any[]}
          }) => {this.checkInOuts = checkInOuts});        
    };

   
}