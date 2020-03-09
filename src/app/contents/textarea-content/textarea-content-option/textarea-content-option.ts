import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';
import { Constants } from '../../../global/constants';
import { DocumentService } from 'src/app/services/document/document.service';
import { UpdateContentModel } from 'src/app/models/common/common.model';
declare var CKEDITOR: any;
@Component({
    selector: 'textarea-content-option',
    templateUrl: 'textarea-content-option.html',
    styleUrls: ['textarea-content-option.scss']
})
export class TextareaContentOptionComponent  implements ContentOptionInterFace,OnInit,AfterViewInit{
    @Input() parentBox: JQuery<Element>;
    public rootElement: JQuery<Element>;
    public fontSizeList:Number[] =  new Array<Number>();
    public currentColorCode:string;

    constructor(
        private contentDCtrlService:ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private documentService:DocumentService,
        private element: ElementRef,
    ){

    }
    ngOnInit(){
        this.rootElement = $(this.element.nativeElement);
        this.fontSizeList = Constants.common.style.fontSizeList
        // this.handleSection();
        // this.handleOptionToolVideo();
        // this.contentDCtrlService.getUpdateContentOption().subscribe((detail)=>{
        //     this.handleSection();
        //     this.handleOptionToolVideo();        
        // })
    } 
    ngAfterViewInit(){
        this.handleOptionTextArea();
    }
    public handleOptionTextArea(){
        this.rootElement.find('#option-font-family').fontselect(
            {
                searchable: false,
            }
        ).on('change', (ev) => {
            let font: any = $(ev.currentTarget).val().toString();
            font = font.replace(/\+/g, ' ');
            font = font.split(':');
            let fontFamily = font[0];
            let fontWeight = font[1] || 400;
            let style = 'font-family:"' + fontFamily + '";font-weight:' + fontWeight;
            this.addStyles(style)
        });
        this.rootElement.find('#option-format-paragraph').change((element) => {
            let style = '';
            this.addStyles(style,'div')
        });
        this.rootElement.find('#option-font-size').change((element) => {
            let style = 'font-size:' + $(element.currentTarget).val() + 'px';
            this.addStyles(style)
        });
        this.rootElement.find('.option-font-alignment').click((element) => {
            let style = 'text-align:' + $(element.currentTarget).attr('data-font-alignment');
            let editor = CKEDITOR.instances[this.documentDCtrlService.nameTemplate];
            let selectedElement = $(editor.getSelection().getStartElement().$);
            let tagName;
            this.addStyles(style, 'div')
        });
        this.rootElement.find('.option-font-style').click((element) => {
            let style;
            let dataStyle = $(element.currentTarget).attr('data-font-style');
            let editor = CKEDITOR.instances[this.documentDCtrlService.nameTemplate];
            let selectedElement = $(editor.getSelection().getStartElement().$);
            let allwrapElement = $('span:contains("' + selectedElement.text() + '")');
            if (dataStyle === 'bold') {
                if (allwrapElement.css('font-weight') === '700') {
                    style = 'font-weight:400';
                } else {
                    style = 'font-weight:' + $(element.currentTarget).attr('data-font-style');
                }
            }
            else if (dataStyle === 'italic') {
                if (allwrapElement.css('font-style') === 'italic') {
                    style = 'font-style:normal';
                } else {
                    style = 'font-style:' + $(element.currentTarget).attr('data-font-style');
                }
            }
            else if (dataStyle === 'underline') {
                if (/none/.test(allwrapElement.css('text-decoration'))) {
                    style = 'text-decoration:' + $(element.currentTarget).attr('data-font-style');
                } else {
                    style = 'text-decoration:none'
                }
            }
            this.addStyles(style);
        });
        // if(this.currentColorCode){
        //     $("#option-font-color").spectrum("set", this.currentColorCode.toHexString())
        // }
     
        this.rootElement.find("#option-font-color").spectrum({
            showPalette: true,
            palette: [ ],
            showSelectionPalette: true, // true by default
            selectionPalette: ["red", "green", "blue"],
            change:(color)=> {
                let style = 'color:' + color.toHexString();
                this.currentColorCode =  color.toHexString();
                this.addStyles(style)
            }
        });
        if(this.currentColorCode){
            $("#option-font-color").spectrum("set", this.currentColorCode)
        }
    }
    public addStyles(styles,element?){
        this.documentService.compileStyles(styles, element);
    }
    public removeTextarea(){
        this.contentDCtrlService.poolContents.textAreas = this.contentDCtrlService.poolContents.textAreas.filter((textarea)=>textarea.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
        let updateContent = new UpdateContentModel();
        updateContent.actionCase = Constants.document.contents.lifeCycle.delete;
        this.contentDCtrlService.updateContent =  updateContent;
    }



}
