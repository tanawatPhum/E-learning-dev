import { Component, OnInit, Input, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { TextAreaContentModel } from 'src/app/models/document/elements/textarea-content.model';
import { Constants } from 'src/app/global/constants';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { ContentsModel } from 'src/app/models/document/content.model';

@Component({
    moduleId: module.id,
    selector: 'textarea-content',
    templateUrl: 'textarea-content.html',
    styleUrls: ['textarea-content.scss']
})
export class TextareaContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    private rootElement: JQuery<Element>;
    private targetTextArea:TextAreaContentModel = new TextAreaContentModel();
    @Input() lifeCycle:string;
    @Input() parentBox: JQuery<Element>;
    @HostListener('click', ['$event']) onClick(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        $(event.currentTarget).find('.content-textarea').focus();
        this.parentBox.draggable({
            handle: this.parentBox.find('.content-box-label')
        })
    }
    // @HostListener('blur',['$event']) onBlur(event) {
    //     this.parentBox.draggable({ disabled: false });
    // }

    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private documentDCtrlService:DocumentDataControlService,
        private contentDCtrlService: ContentDataControlService,
        private element: ElementRef

    ) { }

    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm){
                let targetDocumentContent:ContentsModel = detail.data;
                this.targetTextArea = targetDocumentContent.textAreas.find((textarea) => textarea.parentId === this.parentBox.attr('id'));
                this.initialTextarea()
            }
        })
        // this.contentDCtrlService.getUpdateContent().subscribe((detail) => {
         
        //     // if (detail.actionCase === Constants.common.event.save.document) {
        //     //     this.setDataToSave();
        //     // }
          
        //     if (detail.actionCase === Constants.common.event.load.component) {
        //         this.loadTextarea();
        //     }
        //     if (detail.actionCase === Constants.common.event.load.preview) {
        //         this.setPreview();
        //     }
        // })
    }
    ngAfterViewInit() {
        this.targetTextArea = this.contentDCtrlService.poolContents.textAreas.find((textarea) => textarea.parentId === this.parentBox.attr('id'));
        this.initialTextarea();
    }
    private initialTextarea(){
        if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.createContent){
            this.addTextarea() 
        }
        else if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadEditor){
            this.loadTextarea();
        }
        else if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview){
            this.setPreview();
        }
    }

    private addTextarea() {
        let textArea: TextAreaContentModel = { 
            parentId: this.parentBox.attr('id'), 
            id: this.parentBox.attr('id') + '-img', 
            value: '', 
            html:''
        };
        this.contentDCtrlService.poolContents.textAreas.push(textArea);
        this.parentBox.draggable({
            handle: this.parentBox.find('.content-box-label')
        })
        this.rootElement.find('.content-textarea').attr('id',this.parentBox.attr('id') + '-textarea')
        this.contentDCtrlService.setLastContent(this.parentBox);

    }
    // setDataToSave(){
    //     let targetIndexTextArea = this.contentDCtrlService.poolContents.textAreas.findIndex((textarea) => textarea.parentId === this.parentBox.attr('id'));
    //     this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].value = $(event.target).text().toString();
    //     this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].html = $(event.target).html();
    // }
    // handleTextarea(event?, action?) {
    //     // if (action === 'input') {
    //     //     let targetIndexTextArea = this.contentDCtrlService.poolContents.textAreas.findIndex((textarea) => textarea.parentId === this.parentBox.attr('id'));
    //     //     if (targetIndexTextArea >= 0) {
    //     //         this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].value = $(event.target).text().toString();
    //     //     }
    //     // }
    // }
    private loadTextarea(){
        this.parentBox.draggable({
            handle: this.parentBox.find('.content-box-label')
        })
        if(this.targetTextArea){
            this.rootElement.html(this.targetTextArea.html)
            this.rootElement.find('.content-textarea').attr('contenteditable', 'true');
        }
        
    }
    private setPreview() {
        if(this.targetTextArea){
            this.rootElement.html(this.targetTextArea.html)
            this.rootElement.find('.content-textarea').attr('contenteditable', 'false')
            .css('cursor', 'default');
        }
        
    }


}
