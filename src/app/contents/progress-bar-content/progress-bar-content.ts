import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ProgressBarContentModel, ProgressBarContentObjectModel } from 'src/app/models/document/elements/progressBar-content-model';

@Component({
    moduleId: module.id,
    selector: 'progress-bar-content',
    templateUrl: 'progress-bar-content.html',
    styleUrls: ['progress-bar-content.scss']
})
export class ProgressBarContentComponent implements OnInit,ContentInterFace  {
    @Input() parentBox: JQuery<Element>;
    private actionCase = {
        browseImg:'browseImg',
        loadingImg:'loadingImg',
        showImg:'showImg'
    }
    private currentCase = this.actionCase.browseImg;
    private rootElement:JQuery<Element>;
    constructor(
        private commonService :CommonService,
        private documentService:DocumentService,
        private contentDCtrlService:ContentDataControlService,
        private element: ElementRef
        ){}
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement); 
    }
 
    ngAfterViewInit(){
        this.addProgressBar();
      
    }
    addProgressBar(){
        let progressBar: ProgressBarContentModel = {
            id: this.parentBox.attr('id') + '-progressBar',
            parentId:this.parentBox.attr('id'),
            progress: 0,
            contentList:new Array<ProgressBarContentObjectModel>()
        }
        this.contentDCtrlService.poolContents.progressBar.push(progressBar);
        this.rootElement.find('.content-progress-bar').attr('id',this.parentBox.attr('id') + '-progressBar');
        
    }

}
