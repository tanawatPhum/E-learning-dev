import { Component, OnInit, AfterViewInit, ElementRef, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';

@Component({
    selector: 'table-layout',
    templateUrl: 'table-layout.html',
    styleUrls: ['table-layout.scss']
})
export class TableLayoutComponent implements OnInit, AfterViewInit {
    public rootElement: JQuery<Element>;
    @Input() layoutId:string;
    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private contentDCtrlService: ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        // this.parentBox = this.rootElement.parents('.content-layout');
    }
    ngAfterViewInit() {

       this.addLayout()
        
    }
    private addLayout(){
        this.rootElement.find('.content-layout').attr('id','layout-'+this.layoutId)
    }

}
