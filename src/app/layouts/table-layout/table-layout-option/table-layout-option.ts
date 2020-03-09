import { Component, HostListener, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';
import { DocumentService } from '../../../services/document/document.service';
import { Constants } from '../../../global/constants';
declare var CKEDITOR: any;
@Component({
    selector: 'table-layout-option',
    templateUrl: 'table-layout-option.html',
    styleUrls: ['table-layout-option.scss']
})
export class TableLayoutOptionComponent implements OnInit,AfterViewInit{
    @Input() parentBox: JQuery<Element>;
    public selectSizeLayout:string = '12';
    public rootElement: JQuery<Element>;
    public currentColorCode:string;
    public fontSizeList = Constants.common.style.fontSizeList
    constructor(
        private contentDCtrlService:ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef,
        private documentService:DocumentService
    ){

    }
    ngOnInit(){
        this.rootElement = $(this.element.nativeElement);
    }
    ngAfterViewInit(){
        this.handleOptionLayoutTable();
    }
    public handleOptionLayoutTable(){
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

            $(selectedElement).css('text-align',$(element.currentTarget).attr('data-font-alignment'))
            // let tagName;
            // this.addStyles(style,'p')
        });

        this.rootElement.find('.option-font-alignment-vertical').click((element) => {
            let editor = CKEDITOR.instances[this.documentDCtrlService.nameTemplate];
            let selectedElement = $(editor.getSelection().getStartElement().$);
            console.log($(element.currentTarget))
            console.log($(element.currentTarget).attr('data-font-alignment-vertical'))
            $(selectedElement).parents('td').css('vertical-align',$(element.currentTarget).attr('data-font-alignment-vertical'))
            // let tagName;
            // this.addStyles(style,'p')
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
        this.rootElement.find("#option-background-color").spectrum({
            showPalette: true,
            palette: [ ],
            showSelectionPalette: true, // true by default
            selectionPalette: ["red", "green", "blue"],
            change:(color)=> {
                let style = 'background:' + color.toHexString();
                this.addStyles(style,'td')
            
            }
        });
        setTimeout(() => {
            this.rootElement.find("#option-background-color").next().html(
                '<img style="width:100%;height:100%" src="assets/imgs/contentPage/optionTool/paint-bucket.svg">'
            )            
        });


    }

    public addStyles(styles,element?){
        this.documentService.compileStyles(styles, element);
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
