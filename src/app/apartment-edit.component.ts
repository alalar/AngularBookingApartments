import { Component,  OnInit} from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { numberValidator } from './shared/number.validator';
import { Apartment, ApartmentService } from './apartment.service';
import { AsyncUniqueFieldValidator } from './shared/async-unique-field.validator';


@Component({
    selector: 'apartment-edit',
    templateUrl: './apartment-edit.component.html'
})

export class ApartmentEditComponent implements OnInit  {
    private apartmentForm : FormGroup;
    private visibleAnimate:boolean = false;
    private visible:boolean=false;
    private apartmentTypes:string[]=Apartment.getApartmentTypes();
    private originalApartmentName:string;
    private apartment:Apartment;
    
    constructor(private fb: FormBuilder,
        private apartmentService:ApartmentService

    ) {}



    ngOnInit() {
        this.createForm();
    }
    createForm() {
      this.apartmentForm = this.fb.group({
        name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
        numBedroom: [null, Validators.compose([Validators.required, numberValidator({min:1,max:5})])],
        floor: [null, Validators.compose([Validators.required, numberValidator({min:1,max:4})])],
        apartmentType: [null, Validators.compose([Validators.required, numberValidator({min:0,max:this.apartmentTypes.length-1})])]
      });
    
        

    }
    removeApartment() {
        this.apartmentService.removeApartment(this.apartment);
    }
    saveApartment() {
        this.apartmentService.saveApartment(this.apartment?this.apartment.name:null,this.apartmentForm.value).subscribe(
            (apartment:Apartment) => {
                this.apartment = apartment;
                this.originalApartmentName = this.apartment.name;
                this.hide();
            }
        )
   }
   public hide() {
     this.visibleAnimate = false;
     setTimeout(() => this.visible = false, 300);      
   }

   public show(apartment:Apartment):void
    {
     this.originalApartmentName = null;
     if (apartment && (!this.apartment || apartment.name!=this.apartment.name)) {
         this.apartment = apartment;
         this.originalApartmentName = apartment.name;
         this.apartmentForm.reset(this.apartment);
     }
    this.apartmentForm.controls['name'].setAsyncValidators(AsyncUniqueFieldValidator(this.originalApartmentName,this.apartmentService,"name"));
    this.apartmentForm.controls['name'].updateValueAndValidity();
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
   }
   public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}