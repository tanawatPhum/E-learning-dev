import { Injectable, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { DocumentService } from './document.service';
import { Observable } from 'rxjs';
import { DocumentDataControlService } from './document-data-control.service';
import { Element } from '@angular/compiler';
declare  var CKEDITOR:any;
@Injectable()
export class ToolBarService {
    constructor(
        private documentService:DocumentService,
        private documentDCtrlService:DocumentDataControlService
    ){
     
    }
    public getFontFamily(selector:string,element?):Promise<any>{
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


                let style;
                if(element instanceof jQuery){
                    style = {fontFamily:fontFamily,'font-weight':fontWeight}
                    this.addStylesWithElement(style,element)
                }else{
                    style = 'font-family:"' + fontFamily + '";font-weight:' + fontWeight;
                    this.addStyles(style,element)
                }

                this.addStyles(style)
                resovle(style)
            });
        })
    }
    public getParagraph(selector:string,element?):Promise<any>{4
        return new Promise((resovle,reject)=>{
            $(selector).unbind().on('click',(element) => {
                let style = 'text-align:' + $(element.currentTarget).find('[data-font-alignment]').attr('data-font-alignment');
                this.addStyles(style, 'div')
                resovle(resovle)
            })
        })
    }

    public getFontStyle(selector:string,targetElement?:any):Promise<any>{
        let element:JQuery<Element> = targetElement;
        return new Promise((resovle,reject)=>{
            $(selector).click((event) => {
                let style;
                let targetStyle =$(event.target)
                let dataStyle = targetStyle.attr('data-font-style');
                let editor = CKEDITOR.instances[this.documentDCtrlService.nameTemplate];
                let selectedElement = $(editor.getSelection().getStartElement().$);
                let allwrapElement = $('span:contains("' + selectedElement.text() + '")');
                if (dataStyle === 'bold') {
                    if(element instanceof jQuery && element.css('font-weight') === '700'){
                        style = {'font-weight':'400'};
                    }
                    else if (!(element instanceof jQuery) && allwrapElement.css('font-weight') === '700') {
                        style = 'font-weight:400';
                        
                    } else {
                        if(element instanceof jQuery){
                            style =  {'font-weight':targetStyle.attr('data-font-style')}
                        }else{
                            style = 'font-weight:' + targetStyle.attr('data-font-style');
                        }
                    }
                }
                else if (dataStyle === 'italic') {
                    if(element instanceof jQuery && element.css('font-style') === 'italic'){
                        style = {'font-style':'normal'};
                    }
                    else if (!(element instanceof jQuery) && allwrapElement.css('font-style') === 'italic') {
                        style = 'font-style:normal';
                    } else {
                        if(element instanceof jQuery){
                            style =  {'font-style':targetStyle.attr('data-font-style')}
                        }else{
                            style = 'font-style:' + targetStyle.attr('data-font-style');
                        }
                        
                    }
                }
                else if (dataStyle === 'underline') {
                    if(element instanceof jQuery && /none/.test(element.css('text-decoration'))){
                        style =  {'text-decoration':targetStyle.attr('data-font-style')}
                    }
                    else if (!(element instanceof jQuery) && /none/.test(allwrapElement.css('text-decoration'))) {
                        style = 'text-decoration:' + targetStyle.attr('data-font-style');
                    } else {
                        if(element instanceof jQuery){
                            style = {'text-decoration':'none'};
                        }else{
                            style = 'text-decoration:none'
                        }
                    }
                }

        
                if(element instanceof jQuery){
                    this.addStylesWithElement(style,element)
                }else{
                    this.addStyles(style,element)
                }

                resovle(style);
            })

        })
    }
    public getFontColor(selector:string,element?):Promise<any>{
        return new Promise((resovle,reject)=>{
            $(selector).spectrum({
                showPalette: true,
                palette: [ ],
                showSelectionPalette: true, // true by default
                selectionPalette: ["red", "green", "blue"],
                change:(color)=> {
                    let style;
                    if(element instanceof jQuery){
                        style = {color:color.toHexString()}
                        this.addStylesWithElement(style,element)
                    }else{
                        style = 'color:' + color.toHexString();
                        this.addStyles(style,element)
                    }
 
                    resovle(style); 
                }
            });
        })
    }

    public getFontBackground(selector:string,element?):Promise<any>{
        return new Promise((resovle,reject)=>{
            $(selector).spectrum({
                showPalette: true,
                palette: [ ],
                showSelectionPalette: true, // true by default
                selectionPalette: ["red", "green", "blue"],
                change:(color)=> {
                    let style
                    if(element instanceof jQuery){
                        style = {'background': color.toHexString()}
                        this.addStylesWithElement(style,element)
                    }else{
                        style  ='background:' + color.toHexString();
                        this.addStyles(style)
                    }
                    resovle(style); 
                }
            });
            setTimeout(() => {
                $(selector).next().html(
                    '<img style="width:100%;height:100%" src="assets/imgs/contentPage/optionTool/paint-bucket.svg">'
                )                 
            });
        })
    }

    public getFontSize(selector:string,element?):Promise<any>{
        return new Promise((resovle,reject)=>{
            $(selector).change((event) => {
                let style;
                if(element instanceof jQuery){
                    style = {'font-size':$(event.currentTarget).val() + 'px'}
                    this.addStylesWithElement(style,element)
                }else{
                    style = 'font-size:' + $(event.currentTarget).val() + 'px';
                    this.addStyles(style,element)
                }
                resovle(style); 
            });
        })
    }


    public addStylesWithElement(style,element){
        console.log(style)
        Object.keys(style).forEach((key)=>{
            $(element).css(key, style[key])
        })
    }

    public addStyles(styles,element?){
        this.documentService.compileStyles(styles, element);
    }

}