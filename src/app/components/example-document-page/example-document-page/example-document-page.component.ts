import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { DocumentService } from '../../../services/document/document.service';
import { Constants } from '../../../global/constants';
declare var CKEDITOR:any;


@Component({
    selector: 'example-document-page',
    templateUrl: 'example-document-page.component.html',
    styleUrls: ['example-document-page.component.scss',],
    encapsulation: ViewEncapsulation.None
})
export class ExampleDocumentPageComponent implements OnInit,AfterViewInit {
    public rootTemplateDoc:JQuery<Element>
    public textSize =  Constants.general.style.fontSizeList[0];
    public textSizeList =  Constants.general.style.fontSizeList;
    constructor(
        public documentService:DocumentService
       
    ){

    }
    // public onChange( event: CKEditor4.EventInfo ) {
    //     cons
    //     console.log( event.editor.getData() );
    // }
    ngOnInit(){
    

   
    // this.rootTemplateDoc  =$( '#template-doc' )
    // CKEDITOR.inline( 'editable', {
    //     removePlugins: 'toolbar'
    // } );
        
   

    }
    ngAfterViewInit(){
        // this.documentService.initCKeditor();
        // setTimeout(() => {
        //     $('#option-color').colorPalettePicker();
        // }, 1000);
      
    }

    changeTextSize(fontsize){
        let style = 'font-size:'+fontsize +'px'
      
        this.documentService.compileStyles(style);
        
        // let editor = CKEDITOR.instances['template-doc'];
        // var selectedText = editor.getSelection().getSelectedText(); 
        // var newElement = new CKEDITOR.dom.element('span');    
        // newElement.setAttributes({style: 'font-size:'+ fontsize +'px'})             
        // newElement.setText(selectedText);                         
        // editor.insertElement(newElement);  


    }
    




}
