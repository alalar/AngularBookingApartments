import { FormGroup, AbstractControl, ValidatorFn, FormControl, Validators } from '@angular/forms';


export function numberValidator(prms:any = {}): ValidatorFn {
    return (control: FormControl): {[key: string]: boolean} => {
      if(control.hasError('required')) {
       return null;
      }

      let val: number = control.value;

      if(isNaN(val) || val==undefined || /\D/.test(val.toString())) {

        return {"number": true};
      } else if(!isNaN(prms.min) && !isNaN(prms.max)) {

        return val < prms.min || val > prms.max ? {"number": true} : null;
      } else if(!isNaN(prms.min)) {

        return val < prms.min ? {"number": true} : null;
      } else if(!isNaN(prms.max)) {

        return val > prms.max ? {"number": true} : null;
      } else {

        return null;
      }
    };
  }