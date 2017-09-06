import { Component, Output } from '@angular/core';
import {Subject} from 'rxjs/Subject';


@Component({
  selector: 'app-modal',
  template: `
  <div (click)="onContainerClicked($event)" class="modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div class="modal-dialog">
      <div class="modal-content" >
        <div class="modal-header" >
            <button type="button" class="close" data-dismiss="modal" (click)="hide()">&times;</button>
          <h4 >{{modalHeader}}</h4>
        </div>
        <div class="modal-body" [innerHTML]=modalBody>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="nodoit()">No</button>
            <button type="button" class="btn btn-primary" (click)="doit()">Yes</button>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ModalComponent {

    private clickStream = new Subject<boolean>();
    //private clickStream = new Observable<boolean>();
    @Output() blnResult = this.clickStream.asObservable();
    //@Output() observable = this.clickStream;
  public visible = false;
  private visibleAnimate = true;

  public modalHeader:string;
  public modalBody:string;

  public show(strHeader:string,strBody:string): void {
    this.modalHeader = strHeader;
    this.modalBody = strBody;
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }
  public doit() {
       //this.clickStream = new Observable((observer:any)  => observer.next(true));
       this.clickStream.next(true);
       this.hide();
  }
  public nodoit() {
       this.clickStream.next(false);
      //this.clickStream = new Observable((observer:any)  => observer.next(false));
       this.hide();
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}