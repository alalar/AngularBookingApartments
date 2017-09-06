import { Component, ViewChild, LOCALE_ID, Inject, OnInit} from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { ModalComponent } from './shared/modal.component';
import { CalendarComponent }  from './shared/calendar.component';
import { CalendarDay } from './shared/calendar.component';
import { ApartmentService, ApartmentsInfo, Apartment, Booking, User } from './apartment.service';
import { ApartmentEditComponent } from './apartment-edit.component';

import {Subscription} from "rxjs";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Component({
  templateUrl: './apartment-detail.component.html'
})

export class ApartmentDetailComponent {

  private apartment:Apartment;

 @ViewChild(ModalComponent)
  public readonly modal: ModalComponent;

  @ViewChild(CalendarComponent)
  public readonly calendarView: CalendarComponent;

  @ViewChild(ApartmentEditComponent)
  public readonly apartmentEditComponent: ApartmentEditComponent;

  private visible:boolean=false;
  private visibleAnimate:boolean=false;
  private subscription:Subscription;
  private bookingForm : FormGroup;
  private selectedPeriod:{from:Date,to:Date}={from:new Date(),to:new Date()}
  private removePeriodIndex:number=null;

    constructor (
        @Inject(LOCALE_ID) private localLanguage: string, 
        private fb: FormBuilder, 
        private service: ApartmentService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
      this.createForm();
      let param:string;
        this.route.params
        .switchMap((params: Params) => this.service.getApartment(param = params['id']))
        .subscribe((apartmentInfo:Apartment) => { if (apartmentInfo==undefined && param!="all") {
                                                  this.router.navigate(['/apartments', "all"])
                                                      }
                                                  this.apartment = apartmentInfo; 
                                                  if (this.calendarView) {
                                                      this.calendarView.apartments=[];
                                                      this.calendarView.bookings=this.apartment.bookings;
                                                      this.calendarView.refreshCalendarInfo();
                                                  }
                                });
       
      
    }

  onSelected(selPeriod:{from:Date,to:Date}) {
      this.bookingForm.reset();
      this.selectedPeriod = selPeriod;
      this.showForm();
  } 
  removePeriod(dtDate:Date) {
    this.removePeriodIndex=null;
    //this.lstBookings.forEach((period:Booking,intIndex:number) => {if (period.fromDate<=dtDate && period.toDate>=dtDate) {periodIndex=intIndex;break;}});
    let period:Booking = this.apartment.bookings.find((period:Booking,intIndex:number) =>{
      if (period.fromDate<=dtDate && period.toDate>=dtDate) {
        this.removePeriodIndex=intIndex;
        return true
      } else {
        return false;
      }
    });
    if (period!=undefined) {
      
      this.bookingForm.reset(
        {name: period.user.name,
         address: period.user.address,
         city: period.user.city,
         phone: period.user.phone,
         email: period.user.email,
         price: period.price}
      );
      //this.selectedPeriod = period;
      this.showForm();
        /*
        */
    }
  }
  removeBooking(){
    if (this.removePeriodIndex!=null) {
        let period:Booking = this.apartment.bookings[this.removePeriodIndex];
        let infoTemplate= `
            Do you want to remove booking 
              from <strong> ` + period.fromDate.toLocaleDateString(this.localLanguage,{day:'numeric',month:'long',year:'numeric'}) + ` </strong> 
              to <strong> ` + period.toDate.toLocaleDateString(this.localLanguage,{day:'numeric',month:'long',year:'numeric'}) + ` </strong> ?
             <dl class="dl-horizontal">
                    <dt><span class="glyphicon glyphicon glyphicon-user" ></span></dt>
                    <dd>` + period.user.name + `</dd>
                    <dt><span class="glyphicon glyphicon glyphicon-map-marker" ></span></dt>
                    <dd>` + period.user.address + `, ` + period.user.city +  `</dd>
                    <dt><span class="glyphicon glyphicon glyphicon-phone" ></span></dt>
                    <dd>` + period.user.phone + `</dd>
                    <dt><span>@</span></dt>
                    <dd>` + period.user.email + `</dd>
                    <dt><span>$</span></dt>
                    <dd>` + period.price + `</dd>
            </dl>`;
        this.modal.show('Removing booking',infoTemplate);
        this.subscription = this.modal.blnResult.subscribe((blnRemove:boolean) => {
            if (blnRemove) {
                this.apartment.bookings.splice(this.removePeriodIndex,1); 
                this.service.calculateAllInfo();
                this.calendarView.refreshCalendarInfo();
                this.hide();
            }
            // unsubscribe is necessary such that the observable doesn't keep racking up listeners
            this.subscription.unsubscribe();
        });
    }            
  }
 



  createForm() {
      this.bookingForm = this.fb.group({
        name: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
        address: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
        city: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
        phone: [null, Validators.compose([Validators.required, Validators.pattern('^\\d{9,15}$')])],
        email: [null, Validators.compose([Validators.required, Validators.email])],
        price: [null, Validators.compose([Validators.required, Validators.pattern('^\\d{0,8}(\\.\\d{1,2})?$')])]
        
      });
  }

 public showForm():void {
      this.visible = true;
      setTimeout(() => this.visibleAnimate = true, 400);
 }
 public hide(): void {
      this.removePeriodIndex=null;
      this.visibleAnimate = false;
      setTimeout(() => this.visible = false, 800);
    }
  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
  confirmBooking(): void {
      this.addNewBooking();
      this.hide();
  }
  addNewBooking():void {
     if (this.removePeriodIndex!=null) {
        let booking:Booking = new Booking(this.apartment.bookings[this.removePeriodIndex].fromDate, this.apartment.bookings[this.removePeriodIndex].toDate, 
                  this.bookingForm.controls.price.value, new User(this.bookingForm.controls.name.value, this.bookingForm.controls.address.value, 
                  this.bookingForm.controls.city.value, this.bookingForm.controls.phone.value, this.bookingForm.controls.email.value));
        this.apartment.bookings[this.removePeriodIndex] = booking;
      } else {
        let booking:Booking = new Booking(this.selectedPeriod.from, this.selectedPeriod.to, this.bookingForm.controls.price.value,
                  new User(this.bookingForm.controls.name.value, this.bookingForm.controls.address.value, 
                  this.bookingForm.controls.city.value, this.bookingForm.controls.phone.value, this.bookingForm.controls.email.value));        
        this.apartment.bookings.push(booking);
      }
      this.service.calculateAllInfo();
      this.calendarView.refreshCalendarInfo();
      this.removePeriodIndex = null;
  }   
  
  editApartment() {
    this.apartmentEditComponent.show(this.apartment);
  }

}



