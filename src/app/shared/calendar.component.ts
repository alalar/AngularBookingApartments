import { Component, EventEmitter, LOCALE_ID, Inject, Input, Output,
    ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';


import { ApartmentService, ApartmentsInfo, Apartment, Booking, User } from '../apartment.service';

declare var $:any;


type DayValueObject = {
    [key:string]: {value:number,price:number,ini:boolean,end:boolean,tooltip:string}
}


 @Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html'
})




export class CalendarComponent implements AfterViewInit, OnDestroy{
    public monthCalendars:MonthCalendar[]=[];
    public nextSpecialDay:number=null;
    public previousSpecialDay:number=null;
    public selectedFromDay:number = null;
    public selectedToDay:number = null;
    public overDay:number = 0; 
    public dayProperties:DayValueObject;
    public apartmentsInfo:ApartmentsInfo;
    public NoTooltipInfoInTotals:string = CalendarComponent.tooltipInfoTotalInfo(0,0);

    @Input()  year:number=new Date().getFullYear();
    @Input()  month:number=new Date().getMonth();
    @Input()  bookings:Booking[];
    @Input()  apartments:Apartment[]=[];
    @Input()  numMonths:number=8; 
    @Output() onSelected = new EventEmitter<{from:Date,to:Date}>();
    @Output()  removePeriod = new EventEmitter<Date>();

    public successPercentage:number=60;
    public warningPercentage:number=25;
    public successPrice:number=1100;
    public warningPrice:number=400;

   // @ViewChild('ApartmentSales') public chartEl: ElementRef;
    private _chart: any;
    
    constructor (@Inject(LOCALE_ID) private localLanguage: string) {
    }

    calculateAllInfo(apartments:Apartment[]):{} {
      let dayProperties:DayValueObject = {};
      let initialDate = new Date(this.year,this.month,1);
      let endDate = new Date(this.year,this.month+this.numMonths,1); 
      let intApartmentPercentage = (1 / apartments.length) * 100;
      this.apartmentsInfo = new ApartmentsInfo();
      this.apartmentsInfo.apartments = apartments;
      //this.apartmentsInfo.TotalMonthSales={};
			//this.apartmentsInfo.TotalMonthOccupancy={};
			//this.apartmentsInfo.CheckInOut = {};
			//this.apartmentsInfo.CheckInOut.CheckIn={"Yesterday":[],"Today":[],"NextDays":[]};
			//this.apartmentsInfo.CheckInOut.CheckOut={"Yesterday":[],"Today":[],"NextDays":[]};
		      
      for (let apartment of this.apartmentsInfo.apartments) {
        //apartment.MonthOccupancy = {};
        //apartment.MonthSales = {};
        for(let booking of apartment.bookings.filter((booking:Booking) => (booking.fromDate.getTime()<endDate.getTime() && booking.toDate.getTime()>=initialDate.getTime()))){
					let intPriceDay:number = booking.price / Math.round((booking.toDate.getTime()-booking.fromDate.getTime())/(1000*60*60*24));
          let tmpDate:Date = new Date(booking.fromDate);
					while (tmpDate<booking.toDate) {
            let intDay = CalendarDay.fromDatetoYYYYMMDD(tmpDate);
            let intMont = Math.trunc(intDay/100);
            //if (apartment.MonthSales[intMont]==undefined) apartment.MonthSales[intMont]=0;
							//if (apartment.MonthOccupancy[intMont]==undefined) apartment.MonthOccupancy[intMont]=0;
							//if (this.apartmentsInfo.TotalMonthSales[intMont]==undefined) this.apartmentsInfo.TotalMonthSales[intMont]=0;
							//if (this.apartmentsInfo.TotalMonthOccupancy[intMont]==undefined) this.apartmentsInfo.TotalMonthOccupancy[intMont]=0;
              //apartment.MonthSales[intMont] += intPriceDay;
							//apartment.MonthOccupancy[intMont]++;
							//this.apartmentsInfo.TotalMonthSales[intMont] += intPriceDay;
							//this.apartmentsInfo.TotalMonthOccupancy[intMont]++;
            if (dayProperties[intDay]==undefined) {
              dayProperties[intDay] = {
                ini:false,end:false,tooltip:"",
                value:intApartmentPercentage,
                price:intPriceDay
              }
            } else {
              dayProperties[intDay].value +=intApartmentPercentage;
              dayProperties[intDay].price +=intPriceDay;
            }
            dayProperties[intDay].tooltip= CalendarComponent.tooltipInfoTotalInfo(dayProperties[intDay].value,dayProperties[intDay].price);
            tmpDate.setDate(tmpDate.getDate() + 1);
          }
        }
      }
      return dayProperties;
    }
    
    static tooltipInfoTotalInfo(intOccupancy:number,intMoney:number):string {
        return `<ul class='list-unstyled text-left'>
                                              <li><span><strong>Occupancy</strong></span>
                                                ${Math.round(intOccupancy)}%
                                              </li>
                                              <li><span><strong>Income</strong></span>
                                                $ ${Math.round(intMoney)}
                                              </li>
                                      </ul>`
    }

    transformPeriodsIntoDays(bookings):{} {
      let dayProperties :DayValueObject = {};
      for(let booking of bookings){
          let tmpDate:Date = new Date(booking.fromDate);
          let intPriceDay:number = booking.price / Math.round((booking.toDate.getTime()-booking.fromDate.getTime())/(1000*60*60*24));
					while (tmpDate<=booking.toDate) {
            dayProperties[CalendarDay.fromDatetoYYYYMMDD(tmpDate)]={value:100,ini: (tmpDate.getTime()==booking.fromDate.getTime()),
                                    end:(tmpDate.getTime()==booking.toDate.getTime()), price:tmpDate.getTime()==booking.toDate.getTime()?0:intPriceDay,
                                    tooltip:`<ul class='list-unstyled text-left'>
                                              <li><strong> ` + booking.fromDate.toLocaleDateString(this.localLanguage,{day:'numeric',month:'long',year:'numeric'}) + ` </strong> 
                                                  to <strong> ` + booking.toDate.toLocaleDateString(this.localLanguage,{day:'numeric',month:'long',year:'numeric'}) + ` </strong>
                                              </li>
                                              <li><span class='glyphicon glyphicon glyphicon-user' ></span>
                                                ${booking.user.name}
                                              </li>
                                              <li><span class='glyphicon glyphicon glyphicon-map-marker' ></span>
                                                ${booking.user.address} , ${booking.user.city}
                                              </li>
                                              <li><span class='glyphico<n glyphicon glyphicon-phone' ></span>
                                                ${booking.user.phone}
                                              </li>
                                              <li><span><strong>@</strong></span>
                                                ${booking.user.email}
                                              </li>
                                              <li><span><strong>$</strong></span>
                                                ${booking.price}
                                              </li>
                                      </ul>`};
              tmpDate.setDate(tmpDate.getDate() + 1);
        }
      }
      return dayProperties;
    }
    public ngAfterViewInit() { }
    public createGraph(){
        this._chart = $('#ApartmentSalesOccupancy').highcharts({
            chart: {
						renderTo: 'ApartmentSalesOccupancy'
					},
				title: {
					text: 'Apartments Sales/Occupancy',
						style: {
							display: 'none'
						}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					floating: false,
					backgroundColor: '#FFFFFF'
				},
				xAxis: {
					categories: ['Feb 16', 'Mar 16', 'Apr 16', 'May 16', 'Jun 16', 'Jul 16', 'Aug 16', 'Sep 16', 'Oct 16']
				},
				yAxis: [{
							title: {
								text: 'Occupancy'
							},
							min: 0,
							max: 100,
							labels: {
								formatter: function() {
								   return this.value+"%";
								}
							},
							tickPositioner: function(min, max) {
								  var ticks = [],
									steps = 5,
									max=max + ((max % steps)!=0?steps - (max % steps):0),
									tick = min,
									step = Math.round((max - min) / steps);
									
								  while (tick < max) {
									ticks.push(Math.round(tick));
									tick += step;
									
								  }
								  ticks.push(Math.round(max));
								  return ticks;
								}
						},
							{
							title: {
								text: 'Sales'
							},
							labels: {
								formatter: function() {
								   return "$" + this.value;
								}
							},
							tickPositioner: function(min, max) {
								  var ticks = [],
									steps = 5,
									max=max + ((max % steps)!=0?steps - (max % steps):0),
									tick = min,
									step = Math.round((max - min) / steps);
									
								  while (tick < max) {
									ticks.push(Math.round(tick));
									tick += step;
									
								  }
								  ticks.push(Math.round(max));
								  return ticks;
								},
							opposite: true
						}],
				series: [{
					type: 'column',
					yAxis: 0,
					name: 'Occupancy',
					data: [60,30,20,70,20,80,20,70,20]
				}, {
					type: 'line',
					yAxis: 1,
					name: 'Sales',
					data: [200,400,100,500,900,200,900,200,500]
				}],
				plotOptions: {
					line: {
						dataLabels: {
							enabled: true,
							formatter: function () {
								return "$" + this.y;
							}
						}
					},
					column: {
						dataLabels: {
							enabled: true,
							formatter: function () {
								return this.y + "%";
							}
						}
					}
				}
        });
      }
      
      public ngOnDestroy() {
        this._chart.highcharts().destroy();
      }    
    ngOnInit() {
        this.refreshCalendarInfo();
      
    }

    refreshCalendarInfo() {
        this.resetCalendar();
        if (this.apartments.length>0) {
          this.dayProperties = this.calculateAllInfo(this.apartments);
          
        } else {
          this.dayProperties = this.transformPeriodsIntoDays(this.bookings);
        }
        this.moveToMonth(0);
       

        $( document ).ready(function() {
          $('app-calendar [rel="tooltip"]').tooltip({ placement:"left",container:"body"});
        });
    }

    updateTotalGraphs() {
      let lstXaxis = [];
			for (let intAux=0;intAux<8;intAux++) {
				let tmpDate:Date = new Date(this.year,this.month+intAux,1);
				lstXaxis.push(tmpDate.toLocaleDateString(this.localLanguage,{month:'short',year:'numeric'}));
			}
      this.createGraph();
      
			this._chart.highcharts().xAxis[0].update({categories:lstXaxis}, true);
			this._chart.highcharts().series[0].setData(this.monthCalendars.map((monthCalendar:MonthCalendar) => monthCalendar.totalMonthValue));
			this._chart.highcharts().series[1].setData(this.monthCalendars.map((monthCalendar:MonthCalendar) => parseFloat(monthCalendar.totalMonthPrice.toFixed(2))));
			/*apartmentSalesChart.xAxis[0].update({categories:lstXaxis}, true);
			while(apartmentSalesChart.series.length > 0)
				apartmentSalesChart.series[0].remove(true);
			apartmentsInfo.Apartments.forEach(function(apartment,index){
				window.setTimeout(function (){ apartmentSalesChart.addSeries({type: 'line',
						name: apartment.Name,
						data: lstApartmentsSalesInfo[index]
						}); }, 0);
				
				});*/
    }

    doBooking() {
      if (this.selectedFromDay!=null && this.selectedToDay!=null) {
        this.onSelected.emit({from:CalendarDay.fromYYYYMMDDToDate(this.selectedFromDay), to:CalendarDay.fromYYYYMMDDToDate(this.selectedToDay)});
      }
    }
 
    clickOnCalendarDay(intDay:number){
      if (this.selectedFromDay==null || (intDay<=this.selectedFromDay || (this.nextSpecialDay!=null && intDay>this.nextSpecialDay))) {
        this.selectedFromDay=intDay;
        if (this.nextSpecialDay<intDay) {
          this.selectedToDay = null;
        }
        this.getNextPreviousSpecialDay(intDay,1);
        if (this.nextSpecialDay<this.selectedToDay) {
          this.selectedToDay = null;
        }
      } else {
        this.selectedToDay=intDay;
        
      }
      if (this.selectedToDay!=null) {
        this.doBooking();
      }
    }
    removeCalendarPeriod(intDay:number){
      this.removePeriod.emit(CalendarDay.fromYYYYMMDDToDate(intDay));
    }

    resetCalendar() {
      this.selectedFromDay = null;
      this.selectedToDay = null;
      this.nextSpecialDay = null;
      this.previousSpecialDay = null;
    }

    overTableCell(intDay:number) {
      this.overDay = intDay;
    }
    monthBefore() {
      this.moveToMonth(-1);
    }
    monthNext(){
      this.moveToMonth(1);
    }
    TransformFromYYYYMMDDToString(intDay:number):string {
      return CalendarDay.TransformFromYYYYMMDDToString(intDay);
    }   
  moveToMonth(index:number) {
    this.monthCalendars=[];
    let date = new Date(this.year,this.month+index,1);
    this.year = date.getFullYear();
    this.month = date.getMonth();
    for (let intAux=0;intAux<this.numMonths;intAux++) {
        date = new Date(this.year,this.month+intAux,1);
        this.monthCalendars.push(new MonthCalendar(date.getFullYear(),date.getMonth(), this.dayProperties));
    }
     this.updateTotalGraphs();
  }
  getNextPreviousSpecialDay(yyyymmddDate:number,intMinValue:number) {
    this.nextSpecialDay = null;
    let intIndex:number = 0;
    while (this.nextSpecialDay==null && intIndex<this.monthCalendars.length) {
      for (let intWeeks:number=0;intWeeks<this.monthCalendars[intIndex].calendarDays.length;intWeeks++){
        for (let intDays:number=0;intDays<this.monthCalendars[intIndex].calendarDays[intWeeks].length;intDays++){
            if (this.monthCalendars[intIndex].calendarDays[intWeeks][intDays]!=undefined &&
                this.monthCalendars[intIndex].calendarDays[intWeeks][intDays].dayValue!=undefined &&
                this.monthCalendars[intIndex].calendarDays[intWeeks][intDays].dayValue>=intMinValue) {
                if (this.monthCalendars[intIndex].calendarDays[intWeeks][intDays].yyyymmddDate<=yyyymmddDate) {
                  this.previousSpecialDay=this.monthCalendars[intIndex].calendarDays[intWeeks][intDays].yyyymmddDate
                }
                if (this.monthCalendars[intIndex].calendarDays[intWeeks][intDays].yyyymmddDate>yyyymmddDate) {
                  this.nextSpecialDay=this.monthCalendars[intIndex].calendarDays[intWeeks][intDays].yyyymmddDate;  
                  return;
                }
            }
        }
      }
     intIndex++;
    }
  }

  
  
}






export class CalendarDay {
  public yyyymmddDate:number;
  public ddDate:number;
  public mmDate:number;
  public yyyyDate:number;
  public yyDate:number;
  public dayValue:number;
  public initialPeriod:boolean;
  public finalPeriod:boolean;
  public tooltip:string;

  constructor (date:Date) {
    this.setDate(date);
  }
  setDate(date:Date) {
    this.ddDate = date.getDate();
    this.mmDate = date.getMonth();
    this.yyyyDate = date.getFullYear();
    this.yyDate = this.yyyyDate % 100;
    this.yyyymmddDate = this.yyyyDate * 10000 + this.mmDate * 100 + this.ddDate;
  }

  static TransformFromYYYYMMDDToString(intDay:number):string{
        return intDay==null?'__/__/____':intDay.toString().substring(6,8) + '/' + (intDay + 100).toString().substring(4,6) + '/' + intDay.toString().substring(0,4)
    }
  static fromYYYYMMDDToDate(intDay:number):Date{
    return new Date(Math.trunc(intDay/10000), Math.trunc((intDay % 10000) / 100),intDay % 100);
  }

  static fromDateToDDMMYYYY(dtDate:Date):string {
    return (dtDate.getDate()<10?"0":"") + dtDate.getDate().toString() + "/" + (dtDate.getMonth()<9?"0":"") + (dtDate.getMonth()+1) + "/" + dtDate.getFullYear();
  }

  static fromDatetoYYYYMMDD(dtDate:Date):number {
    return dtDate.getFullYear()*10000 + dtDate.getMonth()*100 + dtDate.getDate();
  }
}

class MonthCalendar {
  public calendarDays:CalendarDay[][];
  public mmDate:number;
  public yyyyDate:number;
  public monthNameDate:string;
  public totalMonthValue:number=0;
  public totalMonthPrice:number=0;
  constructor (year:number,month:number,dayProperties:DayValueObject){
      this.calculateMonthDays(year,month,dayProperties);
  }

     
  calculateMonthDays(year:number,month:number,dayProperties:DayValueObject):void {
        this.mmDate = month;
        this.yyyyDate = year;
        this.monthNameDate = new Date(year,month,1).toLocaleString('en',{month:'long'});    
        this.calendarDays=[[]];
        let intMonthDays:number = new Date(year, month+1, 0).getDate();
        let intFirstDay:number = (new Date(year, month, 0).getDay()+1) % 7;
        let weekdays:CalendarDay[] = [];
        for (let intAux:number=1;intAux<=39;intAux++){
          let intInfo:number = (intAux-intFirstDay<1?0:intAux-intFirstDay);
          if (intInfo>0 && intInfo<=intMonthDays) {
            let calendarDay = new CalendarDay(new Date(year, month, intAux-intFirstDay));
            if (dayProperties[calendarDay.yyyymmddDate]!=undefined) {
              calendarDay.dayValue = dayProperties[calendarDay.yyyymmddDate].value;
              calendarDay.initialPeriod = dayProperties[calendarDay.yyyymmddDate].ini;
              calendarDay.finalPeriod = dayProperties[calendarDay.yyyymmddDate].end;
              calendarDay.tooltip = dayProperties[calendarDay.yyyymmddDate].tooltip;
              this.totalMonthPrice += dayProperties[calendarDay.yyyymmddDate].price;
              this.totalMonthValue += dayProperties[calendarDay.yyyymmddDate].end?0:dayProperties[calendarDay.yyyymmddDate].value;
            } else {
              calendarDay.dayValue = 0;
              calendarDay.initialPeriod = false;
              calendarDay.finalPeriod = false;
              calendarDay.tooltip = "";
            }
            weekdays.push(calendarDay);
          } else {
            weekdays.push(new CalendarDay(new Date(year, month, intAux-intFirstDay)));
          }
          if (intAux % 7 ==0 && intAux>0) {
            if (this.calendarDays[0].length==0) {
              this.calendarDays[0] = weekdays;
            } else {
              this.calendarDays.push(weekdays);
            }
            weekdays = [];
          }
        }
        if (weekdays.length>0) {
           this.calendarDays.push(weekdays);
        }
        this.totalMonthValue = Math.round(this.totalMonthValue /intMonthDays);

      }
}


