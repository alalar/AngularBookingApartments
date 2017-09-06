import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class ApartmentsInfo{
		constructor (public apartments:Apartment[]=[],
    public TotalMonthSales:any={},
    public TotalMonthOccupancy:any={},
		public CheckInOut:any={}){}
}

export class Apartment {
  private static lstDescription:string[]=["Pool View","Ocean View","Ocean Front"];
  constructor(public name:string,public numBedroom:number, public apartmentType:number, public floor:number, public bookings:Booking[]=[],
    public MonthSales:{[key: number]: number}={},public MonthOccupancy:{[key: number]: number}={}){}
  public typeDesc():string{
    return Apartment.lstDescription[this.apartmentType];
  }      
  public static getApartmentTypes() {
    return Apartment.lstDescription
  }          
}

export class Booking {
  constructor(public fromDate:Date,public  toDate:Date,public  price:number, public user:User){
  }
}
export class User {
    constructor(public name:string,public  address:string,public  city:string,public  phone:number,public  email:string){
    }  
}

      
	//functions to use in this applicacion
	function sortBookedItems(BookedArray:Booking[]) {
		BookedArray.sort(function(a:Booking, b:Booking) {
			return a.fromDate.getTime() - b.fromDate.getTime();
			});
	}
	//functions to use in this applicacion
	function sortApartmentItems(ApartmentArray:Apartment[]) {
		ApartmentArray.sort(function(a:Apartment, b:Apartment) {
				let valueA = a.name.toLowerCase();
				let valueB = b.name.toLowerCase();
				if (valueA > valueB) {
					return 1;
				}
				if (valueA < valueB) {
					return -1;
				}
				// a must be equal to b
				return 0;
			});
	}


  let apartmentsInfo = {
    "Apartments":[],
    "TotalMonthSales":{},
    "TotalMonthOccupancy":{},
    "CheckInOut":{
            "CheckIn": {"Yesterday":[],"Today":[],"NextDays":[]},
            "CheckOut": {"Yesterday":[],"Today":[],"NextDays":[]}
          }
    }
let apartmentsPromise = Observable.of(apartmentsInfo.Apartments);

@Injectable()
export class ApartmentService {
	getCheckinOuts():Observable<{
            "CheckIn": {"Yesterday":any[],"Today":any[],"NextDays":any[]},
            "CheckOut": {"Yesterday":any[],"Today":any[],"NextDays":any[]}
          }>{
						return Observable.of(apartmentsInfo.CheckInOut);
					}
  getApartments():Observable<Apartment[]> { 
    //return new Observable<Apartment[]>((subscriber:any) => subscriber.next(apartments));
     return apartmentsPromise;
    //return this.apartments.asObservable();
     }
  getApartment(apartmentName: string): Observable<Apartment> {
    return Observable.of(apartmentsInfo.Apartments.find((apartment:Apartment) => apartment.name.toLowerCase()===apartmentName.toLowerCase()));
  }
  saveApartment(originalApartmentName:string,apartment:Apartment): Observable<Apartment> {
		
    if (originalApartmentName==null) {
				let newApartment = new Apartment(apartment.name, apartment.numBedroom, apartment.apartmentType, apartment.floor);
        apartmentsInfo.Apartments.push(newApartment);
				apartment = newApartment;
      } else {
        let apartmentIndex =  apartmentsInfo.Apartments.map(apartment => apartment.name.toLowerCase()).indexOf(originalApartmentName.toLocaleLowerCase());
        if (apartmentIndex>-1) {
								apartmentsInfo.Apartments[apartmentIndex].apartmentType = +apartment.apartmentType;
								apartmentsInfo.Apartments[apartmentIndex].floor = +apartment.floor;
								apartmentsInfo.Apartments[apartmentIndex].numBedroom = +apartment.numBedroom;
                apartmentsInfo.Apartments[apartmentIndex].name = apartment.name;
								apartment = apartmentsInfo.Apartments[apartmentIndex];
            }
      }
			sortApartmentItems(apartmentsInfo.Apartments);
			this.calculateAllInfo();
    return Observable.of(apartment);
    
  }
    removeApartment(apartmentToRemove:Apartment) {
        let apartmentIndex = apartmentsInfo.Apartments.map(apartment => apartment.name.toLowerCase()).indexOf(apartmentToRemove.name.toLocaleLowerCase());
        if (apartmentIndex>-1) {
                apartmentsInfo.Apartments.splice(apartmentIndex,1);
								this.calculateAllInfo();
         }
    }


  constructor() {
    this.createTestApartments();
  }

  createTestApartments(){
    //function to create an object in order to show the functionality
			var lstUsers = [
                      new User("Peter Lim","Royal mile 5","Edinbourgh",454323121,"PLim@yahooo.com"),
                      new User("Mary Goldwin","Brown Street 3","NY",454323121,"MGoldwin@yahooo.com"),
                      new User("Jhon Pearson","Old Street 23","Chicago",876545987,"JPearson@yahooo.com"),
                      new User("Michael Loom","Elephan Rd 23","Nashville",876545987,"MLoom@yahooo.com"),
                      new User("Richard Bear","Old Street 23","Toronto",876545987,"RBear@yahooo.com"),
                      new User("Pauline Jake","Old Street 23","Vancover",876545987,"PJake@yahooo.com"),
                      new User("Jane Town","Old Street 23","Los Angeles",876545987,"JTown@yahooo.com"),
                      new User("Eloise Forte","Old Street 23","Boston",876545987,"EForte@yahooo.com"),
                      new User("Maurice Oliver","Old Street 23","Munich",876545987,"MOliver@yahooo.com"),
                      new User("Grace Klin","Old Street 23","London",876545987,"GKlin@yahooo.com")
                      ];
			//var lstViews = ["Vista Mar","Vista Piscina"];
			//var lstItems = ["Television","Cafetera","Platos","Cubiertos","Cama grande","Sofa","Toallas"];
			let intNumApartments:number = 6;
			let tmpInitialBookingDate:Date = new Date(new Date().getFullYear(),new Date().getMonth()-2,1)
			let tmpFinishBookingDate:Date = new Date(new Date().getFullYear(),new Date().getMonth()+12,1)

			for (let intApartments:number=0;intApartments<intNumApartments;intApartments++){
				let newApartment:Apartment = new Apartment(
            String.fromCharCode(65+Math.floor(Math.random() * 12)) + (Math.floor(Math.random() * 3)+1) + Math.floor(Math.random() * 10)+ Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 4)+1,
            Math.floor(Math.random() * Apartment.getApartmentTypes().length),
            Math.floor(Math.random() * 4)+1
          )
				for (let dteTempDate:Date = new Date(tmpInitialBookingDate);dteTempDate<tmpFinishBookingDate;){
					let intEmptyDays:number = Math.floor(Math.random() * 20)+5;
					let intBookingDays:number = Math.floor(Math.random() * 20)+1;
					let intPrice:number = intBookingDays * (Math.floor(Math.random() * 50)+50);
					dteTempDate = new Date(dteTempDate.setDate(dteTempDate.getDate() + intEmptyDays));
					let finishDate:Date = new Date(dteTempDate);
					finishDate = new Date(finishDate.setDate(finishDate.getDate() + intBookingDays));
          
					//'{"Start":"2016-08-22","Finish":"2016-09-12","Price":"2000","Person":"Alberto","Comment":"OK"}'
					let newBooking:Booking = new Booking(new Date(dteTempDate),new Date(finishDate),intPrice, lstUsers[Math.floor(Math.random() * lstUsers.length)]);
					newApartment.bookings.push(newBooking);
					dteTempDate = finishDate;
				}
        sortBookedItems(newApartment.bookings);
        apartmentsInfo.Apartments.push(newApartment);
			}
			sortApartmentItems(apartmentsInfo.Apartments);
			this.calculateAllInfo();
			//afterLoadingInfo();
		}

    //function to calculate all the values such as, total sales, checkin-out from the apartments info
		calculateAllInfo(){
			apartmentsInfo.TotalMonthSales={};
			apartmentsInfo.TotalMonthOccupancy={};
			apartmentsInfo.CheckInOut.CheckIn={"Yesterday":[],"Today":[],"NextDays":[]};
			apartmentsInfo.CheckInOut.CheckOut={"Yesterday":[],"Today":[],"NextDays":[]};
			//localStorage.setItem('apartmentsInfo', JSON.stringify(apartmentsInfo));
			apartmentsInfo.Apartments.forEach(function(apartment:Apartment){
					apartment.MonthSales = {};
					apartment.MonthOccupancy = {};
					apartment.bookings.forEach(function(Booked:Booking){
						let intDays:number = Math.round((Booked.toDate.getTime()-Booked.fromDate.getTime())/(1000*60*60*24));
						let intPriceDay:number = Booked.price / intDays;
						let tmpDate:Date = new Date(Booked.fromDate);
						while (tmpDate<Booked.toDate) {
							let strYYYYMM:string = tmpDate.getFullYear() + (tmpDate.getMonth()<10?"0":"") + (tmpDate.getMonth());
							if (apartment.MonthSales[strYYYYMM]==undefined) apartment.MonthSales[strYYYYMM]=0;
							if (apartment.MonthOccupancy[strYYYYMM]==undefined) apartment.MonthOccupancy[strYYYYMM]=0;
							if (apartmentsInfo.TotalMonthSales[strYYYYMM]==undefined) apartmentsInfo.TotalMonthSales[strYYYYMM]=0;
							if (apartmentsInfo.TotalMonthOccupancy[strYYYYMM]==undefined) apartmentsInfo.TotalMonthOccupancy[strYYYYMM]=0;
							apartment.MonthSales[strYYYYMM] += intPriceDay;
							apartment.MonthOccupancy[strYYYYMM]++;
							apartmentsInfo.TotalMonthSales[strYYYYMM] += intPriceDay;
							apartmentsInfo.TotalMonthOccupancy[strYYYYMM]++;
							tmpDate.setDate(tmpDate.getDate() + 1);
						}
						//Check checkin-out
						var intCheckInDateDiff = Math.round((Booked.fromDate.getTime()-new Date().setHours(0,0,0,0))/(1000*60*60*24));
						var intCheckOutDateDiff = Math.round((Booked.toDate.getTime()-new Date().setHours(0,0,0,0))/(1000*60*60*24));
						if (intCheckInDateDiff>-2 && intCheckInDateDiff<6) {
							let objCheck = {"ApartmentName":apartment.name,"Booking":Booked};
							if (intCheckInDateDiff<0) {
								apartmentsInfo.CheckInOut.CheckIn.Yesterday.push(objCheck);
							}
							else if (intCheckInDateDiff==0) {
								apartmentsInfo.CheckInOut.CheckIn.Today.push(objCheck);
							}
							else
								apartmentsInfo.CheckInOut.CheckIn.NextDays.push(objCheck);
						}
						if (intCheckOutDateDiff>-2 && intCheckOutDateDiff<6) {
							let objCheck = {"ApartmentName":apartment.name,"Booking":Booked};
							if (intCheckOutDateDiff<0) {
								apartmentsInfo.CheckInOut.CheckOut.Yesterday.push(objCheck);
							}
							else if (intCheckOutDateDiff==0) {
								apartmentsInfo.CheckInOut.CheckOut.Today.push(objCheck);
							}
							else
								apartmentsInfo.CheckInOut.CheckOut.NextDays.push(objCheck);
						}
					})
					for(let propertyName in apartment.MonthOccupancy) {
   						apartment.MonthOccupancy[propertyName] = (apartment.MonthOccupancy[propertyName] / 
							 					new Date(parseInt(propertyName) / 100,(parseInt(propertyName) % 100)+1,0).getDate()) * 100
					}

					//sortBookedItems(apartment.bookings);
				});	
							
		}

  }

