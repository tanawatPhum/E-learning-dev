import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ProgressBarContentModel, ProgressBarContentObjectModel } from 'src/app/models/document/elements/progressBar-content-model';
import { Constants } from 'src/app/global/constants';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';

@Component({
    moduleId: module.id,
    selector: 'progress-bar-content',
    templateUrl: 'progress-bar-content.html',
    styleUrls: ['progress-bar-content.scss']
})
export class ProgressBarContentComponent implements OnInit,ContentInterFace  {
    @Input() parentBox: JQuery<Element>;
    @Input() lifeCycle:string;
    public targetProgressBar:ProgressBarContentModel = new ProgressBarContentModel();
    public actionCase = {
        browseImg:'browseImg',
        loadingImg:'loadingImg',
        showImg:'showImg'
    }
    public currentCase = this.actionCase.browseImg;
    public contentTypes = Constants.document.contents.types;
    public rootElement:JQuery<Element>;
    constructor(
        private commonService :CommonService,
        private documentService:DocumentService,
        private documentDCtrlService:DocumentDataControlService,
        private contentDCtrlService:ContentDataControlService,
        private element: ElementRef
        ){}
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement); 
        this.parentBox = this.rootElement.parents('.content-box');
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.document.contents.lifeCycle.playVideo 
            && detail.for === Constants.document.contents.types.progressBar
                ){
                this.handleProgressBar();
                // let targetDocumentContent:ContentsModel = detail.data;
                // this.targetimg = targetDocumentContent.imgs.find((img) => img.parentId === this.parentBox.attr('id'))
                // this.initialImg();
            } 
            else  if(detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm && detail.for === this.parentBox.attr('id')){
                this.targetProgressBar  = this.contentDCtrlService.poolContents.progressBar.find((progressBar)=>progressBar.parentId === this.parentBox.attr('id'));      
                this.initialFile();
            }
            else if(detail.actionCase === Constants.document.contents.lifeCycle.clickLink){
                this.handleProgressBar();
            }
        })

    }
 
    ngAfterViewInit(){
        this.targetProgressBar  = this.contentDCtrlService.poolContents.progressBar.find((progressBar)=>progressBar.parentId === this.parentBox.attr('id'));      
        this.initialFile();
    }
    public initialFile(){
        if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.createContent){
            this.addProgressBar();
        }
        else if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview){
            this.loadProgressBar();
            if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview){
                this.handleProgressBar();
            }
        } 
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
        this.contentDCtrlService.setLastContent(this.parentBox);
    }
    loadProgressBar(){
        this.rootElement.find('.content-progress-bar').attr('id',this.parentBox.attr('id') + '-progressBar');
    }
    public async handleProgressBar(){
        let summaryOfPercent = 0;
        let numberOfContentProgress =0;
        for await (let parentBox of this.contentDCtrlService.poolContents.progressBar){
            for await (let content of parentBox.contentList){
                let targetDocumentTrack  =  this.documentDCtrlService.currentDocumentTrack.contents.find((contentTrack)=>contentTrack.id === content.id);
                if(targetDocumentTrack){
                    if(targetDocumentTrack.contentType === this.contentTypes.video){
                        summaryOfPercent += targetDocumentTrack.progress
                        numberOfContentProgress += 1;
                    }
                    else if(targetDocumentTrack.contentType === this.contentTypes.link){
                        if(targetDocumentTrack.conditions.linkCondition.isClicked){
                            summaryOfPercent += targetDocumentTrack.progress
                        }
                        numberOfContentProgress += 1;
                    }
                    // else if(targetDocumentTrack.contentType === this.contentTypes.subform){
                    //     targetDocumentTrack.conditions.subformCondition.isClickLinks.forEach((link)=>{
                    //         let targetDoc = this.documentDCtrlService.documentTracks.find((docTrack)=>docTrack.id ===link.linkId);
                    //         summaryOfPercent += targetDoc.progress;
                    //         numberOfContentProgress += 1;
                    //     });
                    // } 
                    else if(targetDocumentTrack.contentType === this.contentTypes.exam){
                        summaryOfPercent += targetDocumentTrack.progress
                        numberOfContentProgress += 1;
                    }

                }
            }
     
        }
        let percentProgress = (summaryOfPercent / numberOfContentProgress) || 0;
        if(percentProgress !== 0){
            this.rootElement.find('.progress-bar').css('width', Math.floor(percentProgress) + '%');
            this.rootElement.find('.progress-bar').html( Math.floor(percentProgress) + '%')
        }else{
            this.rootElement.find('.progress-bar').css('width', 0);
            this.rootElement.find('.progress-bar').html('')
        }


    }

}
