import { Component, HostListener, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';

@Component({
    selector: 'one-layout-option',
    templateUrl: 'one-layout-option.html',
    styleUrls: ['one-layout-option.scss']
})
export class OneLayoutOptionComponent implements OnInit,AfterViewInit{
    @Input() parentBox: JQuery<Element>;
    public selectSizeLayout:string = '12';
    constructor(
        private contentDCtrlService:ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef,
    ){

    }
    ngOnInit(){
  
    }
    ngAfterViewInit(){
     
    }
    public removeLayoutGrid(){

    this.parentBox.remove();
    }

    // public addColumn(){
    //     let numberColumn
    //     if(this.parentBox.length ===0){
    //         numberColumn = 1;
    //     }else {
    //         numberColumn = this.parentBox.length;
    //     }

    //     this.parentBox.append(`<div title="column-${numberColumn}" id="layout-column-${numberColumn}" class="layout-column col-lg-${this.selectSizeLayout}"></div>`)
    // }
    
    
}
