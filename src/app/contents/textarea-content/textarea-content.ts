import { Component, OnInit, Input, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { TextAreaContentModel } from 'src/app/models/document/elements/textarea-content.model';
import { Constants } from 'src/app/global/constants';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { ContentsModel } from 'src/app/models/document/content.model';
declare var CKEDITOR:any;
@Component({
    moduleId: module.id,
    selector: 'textarea-content',
    templateUrl: 'textarea-content.html',
    styleUrls: ['textarea-content.scss']
})
export class TextareaContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    public rootElement: JQuery<Element>;
    public targetTextArea:TextAreaContentModel = new TextAreaContentModel();
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
            if(detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm && detail.for === this.parentBox.attr('id')){
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
    public initialTextarea(){
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

    public addTextarea() {
        let textArea: TextAreaContentModel = { 
            parentId: this.parentBox.attr('id'), 
            id: this.parentBox.attr('id') + '-img', 
            value: '', 
            html:'',
            styles:null
        };
        this.contentDCtrlService.poolContents.textAreas.push(textArea);
        this.parentBox.draggable({
            handle: this.parentBox.find('.content-box-label')
        })
        this.rootElement.find('.content-textarea').attr('id',this.parentBox.attr('id') + '-textarea').ready(()=>{
            CKEDITOR.disableAutoInline = true;
            CKEDITOR.inline(this.parentBox.attr('id') + '-textarea', {
                allowedContent: true,
            });
            CKEDITOR.instances[this.parentBox.attr('id') + '-textarea'].on('instanceReady', (ev) => {
                $('.cke_top').css('display', 'none')
                $(ev.editor.element.$).removeAttr("title");
            })
    
        })

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
    public loadTextarea(){
        this.parentBox.draggable({
            handle: this.parentBox.find('.content-box-label')
        })
        if(this.targetTextArea){
            this.rootElement.html(this.targetTextArea.html).attr('style',this.targetTextArea.styles)
            this.rootElement.find('.content-textarea').attr('contenteditable', 'true').ready(()=>{
                CKEDITOR.inline(this.parentBox.attr('id') + '-textarea', {
                    allowedContent: true,
                });
                CKEDITOR.instances[this.parentBox.attr('id') + '-textarea'].on('instanceReady', (ev) => {
                    $('.cke_top').css('display', 'none')
                    $(ev.editor.element.$).removeAttr("title");
                })
            })
        }
        
    }
    public setPreview() {
        if(this.targetTextArea){
            this.rootElement.html(this.targetTextArea.html)
            this.rootElement.find('.content-textarea').attr('contenteditable', 'false')
            .css('cursor', 'default');
        }
        
    }


}
