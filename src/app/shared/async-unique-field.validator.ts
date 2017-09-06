import {  AbstractControl, } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'

import { Apartment } from '../apartment.service';
import { ApartmentService } from '../apartment.service';


let currentTimeout:any;
// FORM GROUP VALIDATORS
export const AsyncUniqueFieldValidator = (itemName:string,apartmentService:ApartmentService,fieldname:string) => {
    return (control:AbstractControl) => {
      if (control.dirty) {
        control.setErrors({CheckingDuplicatedItem: true});
        clearTimeout(currentTimeout);
        return new Promise((resolve) => {
            currentTimeout = setTimeout(() => {
              apartmentService.getApartments().subscribe((apartments:Apartment[]) => {
                    if (apartments.some((apartment:Apartment) => (apartment.name!=itemName && apartment[fieldname].toLowerCase()==control.value.toLowerCase()))) {
                      resolve({DuplicatedItem: true})
                      } else {
                        resolve(null);
                      }
              });
            }
              , 1000);
          })
      } else {
        control.setErrors(null);
        return new Promise(null);
      }
  }
}