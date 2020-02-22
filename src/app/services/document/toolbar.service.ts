import { Injectable, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { DocumentService } from './document.service';
import { Observable } from 'rxjs';
import { DocumentDataControlService } from './document-data-control.service';
declare  var CKEDITOR:any;
@Injectable()
export class ToolBarService {
    constructor(
        private documentService:DocumentService,
        private documentDCtrlService:DocumentDataControlService
    ){
     
    }
    public getFontFamily(selector:string):Promise<any>{
        return new Promise((resovle,reject)=>{
            $(selector).fontselect(
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
                resovle(style)
            });
        })
    }
    public getParagraph(selector:string):Promise<any>{4
        return new Promise((resovle,reject)=>{
            $(selector).unbind().on('click',(element) => {
                let style = 'text-align:' + $(element.currentTarget).attr('data-font-alignment');
                this.addStyles(style, 'div')
                resovle(resovle)
            })
        })
    }

    public getFontStyle(selector:string):Promise<any>{
        return new Promise((resovle,reject)=>{
            $(selector).click((element) => {
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
                resovle(style);
            })

        })
    }
    public getFontColor(selector:string):Promise<any>{
        return new Promise((resovle,reject)=>{
            $(selector).spectrum({
                showPalette: true,
                palette: [ ],
                showSelectionPalette: true, // true by default
                selectionPalette: ["red", "green", "blue"],
                change:(color)=> {
                    let style = 'color:' + color.toHexString();
                    this.addStyles(style)
                    resovle(style); 
                }
            });
        })
    }

    public getFontBackground(selector:string):Promise<any>{
        return new Promise((resovle,reject)=>{
            $(selector).spectrum({
                showPalette: true,
                palette: [ ],
                showSelectionPalette: true, // true by default
                selectionPalette: ["red", "green", "blue"],
                change:(color)=> {
                    let style = 'background:' + color.toHexString();
                    this.addStyles(style)
                    resovle(style); 
                }
            });
        })
    }

    public getFontSize(selector:string):Promise<any>{
        return new Promise((resovle,reject)=>{
            $(selector).change((element) => {
                let style = 'font-size:' + $(element.currentTarget).val() + 'px';
                this.addStyles(style)
                resovle(style); 
            });
        })
    }




    public addStyles(styles,element?){
        this.documentService.compileStyles(styles, element);
    }

}