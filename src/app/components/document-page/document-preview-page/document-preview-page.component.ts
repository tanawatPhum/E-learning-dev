import { Component,ViewChild,ElementRef,OnInit } from '@angular/core';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { DocumentService } from '../../../services/document/document.service';
import { Router } from '@angular/router';
import { DocumentModel } from '../../../models/document/content.model';
import { ScreenDetailModel } from 'src/app/models/general/general.model';
import { Constants } from '../../../global/constants';
declare var electron: any;
@Component({
    selector: 'document-preview-page',
    templateUrl: 'document-preview-page.component.html',
    styleUrls: ['../../document-page/document-page.component.scss']
})
export class DocumentPreviewPageComponent implements OnInit {
    @ViewChild('documentPreviewContent', { static: true }) documentPreviewContent: ElementRef;
    private rootElement;
    private currentResult:DocumentModel = new DocumentModel();
    private currentScreenSize:ScreenDetailModel = new ScreenDetailModel();
    public contents = {
        element: {
            previewElement: 'previewElement',
            ratioElement:'ratioElement'
        }
    }
    constructor(
        private documentDataService:DocumentDataControlService,
        private documentService:DocumentService,
        private router:Router
    ) { }
    ngOnInit() {
    }
    ngAfterContentInit() {
        this.rootElement = $(this.documentPreviewContent.nativeElement);
        $(this.rootElement).css('height',$(window).height() - Constants.general.element.css.navBar.height)  
        this.currentScreenSize.height = $(this.rootElement).outerHeight();
        this.currentScreenSize.width = $(this.rootElement).outerWidth();
        this.loadHtml(this.documentDataService.currentDocumentName);
        $(window).resize((event)=>{
            $('.document-preview-content').css('height',event.currentTarget.innerHeight - Constants.general.element.css.navBar.height) 
            this.currentScreenSize.height = event.currentTarget.innerHeight -Constants.general.element.css.navBar.height;
            this.currentScreenSize.width = event.currentTarget.innerWidth;
            this.rootElement.html(this.currentResult.html)
            this.setElements(this.contents.element.previewElement);
        });
    }
    public loadHtml(documentName?){
        if (electron) {
            electron.ipcRenderer.send('request-read-document', documentName)
            electron.ipcRenderer.once('reponse-read-document', (event, result) => { 
                console.log(' ❏ Object Document :', result);
                if(result){
                    this.currentResult =  result;
                    this.rootElement.html(result.html)
                    this.setElements(this.contents.element.previewElement)
                } 
                this.currentResult = result;        
            });
        }else{
            this.documentService.loadDocFromDB(documentName).subscribe((result) => {
                console.log(' ❏ Object Document :', result)
                if(result){
                    this.currentResult =  result;
                    this.rootElement.html(result.html)
                    this.setElements(this.contents.element.previewElement)
                } 
            });
        };
    }
    public setElements(action){
        if(action === this.contents.element.previewElement){
            this.rootElement.find('.content-box').removeClass('content-box-active border border-primary');
            this.rootElement.find('.content-box').removeClass('ui-draggable ui-draggable-handle');
            this.rootElement.find('.content-box').removeClass('ui-resizable');
            this.rootElement.find('.content-box').removeClass('content-box-current');
            this.rootElement.find('.content-box').css('border','none');
            this.rootElement.find('.content-box').css('cursor','default');
            this.rootElement.find('.content-box').find('.ui-resizable-handle').remove();
            this.rootElement.find('.content-box').find('.content-toolbar').remove();
            this.rootElement.find('.content-box').find('.content-video').css('pointer-events','initial');
            this.rootElement.find('.content-box').find('.content-textarea').each((index,element)=>{
               let targetTextArea = this.currentResult.elements.textAreas.find((textArea)=>textArea.id == $(element).attr('id'));
               $('[id="' + $(element).attr('id') + '"]').val(targetTextArea.value);
               $('[id="' + $(element).attr('id') + '"]').attr('disabled','true');
            });
            this.setElements(this.contents.element.ratioElement)
        }
        if(action === this.contents.element.ratioElement){
           let contentSize:ScreenDetailModel =  JSON.parse(localStorage.getItem('contentSize'))
           let diffOfScreenSize=  Math.abs((this.currentScreenSize.width - contentSize.width)) * 100/contentSize.width
           
           this.rootElement.find('.content-box').each((index,contentBox) => {
            let newHeight;
            let newWidth;
            let newLeft;
            let newTop;
            if(this.currentScreenSize.height  > contentSize.height ){
                newHeight = $(contentBox).outerHeight()+($(contentBox).outerHeight() * diffOfScreenSize)/100  + (($(contentBox).position().top * 1.7)/100) ;
                newTop = $(contentBox).position().top +(($(contentBox).position().top * diffOfScreenSize)/100) + (($(contentBox).position().top * 1.7)/100);
            }else{
                newHeight = $(contentBox).outerHeight()-(($(contentBox).outerHeight() * diffOfScreenSize)/100)+ (($(contentBox).position().top * 1.7)/100);
                newTop = $(contentBox).position().top - (($(contentBox).position().top * diffOfScreenSize)/100) + (($(contentBox).position().top * 1.7)/100);
            }
            if(this.currentScreenSize.width  > contentSize.width ){
                newWidth = $(contentBox).outerWidth()+($(contentBox).outerWidth() * diffOfScreenSize)/100 ;
                newLeft = $(contentBox).position().left+(($(contentBox).position().left * diffOfScreenSize)/100);
            }else{
                newWidth = $(contentBox).outerWidth()-($(contentBox).outerWidth() * diffOfScreenSize)/100;
                newLeft = $(contentBox).position().left-((($(contentBox).position().left * diffOfScreenSize)/100))
            }
            $(contentBox).css('height',newHeight);
            $(contentBox).css('width',newWidth);
            $(contentBox).css('left',newLeft);
            $(contentBox).css('top',newTop);
           });
           
           console.log(diffOfScreenSize);
        }
    }
    public backToDocumentHome(){
        this.router.navigate(['documentHome'])
    }

}
