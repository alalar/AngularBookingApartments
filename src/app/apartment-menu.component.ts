import { Component,  ViewChild, OnInit} from '@angular/core';

import { ApartmentService, Apartment } from './apartment.service';
import { ApartmentEditComponent } from './apartment-edit.component';


import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './apartment-menu.component.html'
})

export class ApartmentMenuComponent implements OnInit  {

  public successPrice:number=1100;
  public warningPrice:number=400;

  nextMonthDate:Date= new Date(new Date().getFullYear(), new Date().getMonth()+1,1);
  nextYYYYMM:number = this.nextMonthDate.getFullYear() * 100 + this.nextMonthDate.getMonth();
  nextMonthName:string = this.nextMonthDate.toLocaleString('en',{month:'long'});

  currentYYYYMM:number = new Date().getFullYear() * 100 + new Date().getMonth();
  currentMonthName:string = new Date().toLocaleString('en',{month:'long'});

 @ViewChild(ApartmentEditComponent)
  public readonly apartmentEditComponent: ApartmentEditComponent;

  constructor(
    private service: ApartmentService
  ) {}

  apartments: Observable<Apartment[]>;
  checkInOuts: {
            "CheckIn": {"Yesterday":any[],"Today":any[],"NextDays":any[]},
            "CheckOut": {"Yesterday":any[],"Today":any[],"NextDays":any[]}
          }=null;

  ngOnInit() {
    this.apartments = this.service.getApartments();
     this.service.getCheckinOuts().subscribe((checkInOuts: {
            "CheckIn": {"Yesterday":any[],"Today":any[],"NextDays":any[]},
            "CheckOut": {"Yesterday":any[],"Today":any[],"NextDays":any[]}
          }) => {this.checkInOuts = checkInOuts});
  }

  newApartment() {
    this.apartmentEditComponent.show(null);
  }

}

