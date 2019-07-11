import { Component, OnInit,AfterContentInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { DocumentService } from '../../../services/document/document.service';
import { DocumentModel } from '../../../models/document/content.model';
import { triggerEventModel } from 'src/app/models/document/document.model';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { Router } from '@angular/router';
import { ScreenDetailModel } from '../../../models/general/general.model';
declare var electron: any;
@Component({
    templateUrl: 'document-home-page.component.html',
    styleUrls: ['../../document-page/document-page.component.scss']
})
export class DocumentHomePageComponent implements OnInit, AfterContentInit {
    public triggerElement: Subject<triggerEventModel> = new Subject<triggerEventModel>();
    public triggerModal: Subject<triggerEventModel> = new Subject<triggerEventModel>();
    public loading:boolean = false;
    public contentElement: Subject<DocumentModel> = new Subject<DocumentModel>();
    public contentTypes =  Constants.document.contents.types;
    public modalTypes = Constants.document.modals.types;
    public modalEvents = Constants.document.modals.events;
    public contentTypeSelected: Subject<any> = new Subject<any>();
    public isOpenMenu :boolean  = true;
    public triggerFromChild: Subject<triggerEventModel> = new Subject<triggerEventModel>();
    public currentDocument:string = "New Document";
    public documentList:DocumentModel[] =  new Array<DocumentModel>();
    public heightScreen:string;
    constructor(
        private documentService: DocumentService,
        private documentDataService:DocumentDataControlService,
        private router:Router
    ) { }
    ngOnInit() {
        this.loadHtml();

        try{
            electron.ipcRenderer.once('asynchronous-reply', (event, arg) => {
                console.log("testIPCRender",arg) // prints "pong"
                alert("testIPCRender")
              })
            electron.ipcRenderer.send('asynchronous-message', 'ping')
        }catch(e){}
      
      
    }
    ngAfterContentInit() {
  
        // this.documentDataService.currentScreen = {h}
        // console.log(($('.document-content')))
        // $('.document-content').css('height', ($(document).height() -55)+'px');
    }
    public showMenuLayout(){
        $('.document-form-select').show().animate({
            'width': '400px'
        },175);
    }
    public loadHtml(documentName?){
        this.documentService.loadHTMLFromDB(documentName).subscribe((result) => {
            if(result && result.length>0){
                if(!Array.isArray(result)){
                    result = [result]
                }else{
                    this.documentList  = result;
                }
            
                this.currentDocument = this.documentDataService.currentDocument = result[0].nameDocument;
                this.contentElement.next(result[0]);
            }
         });
    }
    public saveDocument(data?:any) {
        this.loadingProgress();
        this.triggerElement.next({action:Constants.general.event.click.save,data:data||this.currentDocument});
    }
    public saveNewDocument(data?:any){
        this.currentDocument = data;
        this.triggerElement.next({action:Constants.general.event.click.new,data:data});
    }
    public newDocument() {
        this.triggerModal.next({action:this.modalTypes.newDocument.name,data:this.currentDocument});
    }
    public changeDocument(documentName){
        this.currentDocument =  documentName;
        this.loadHtml(this.currentDocument);
        
    }
    public createContent(contentType: any) {
        this.contentTypeSelected.next(contentType);
    }
    public toggleMenu(){
        this.isOpenMenu = !this.isOpenMenu;
        // $('#document-sidenav').slider();
    }
    public eventModal(eventModal:triggerEventModel){
        if(eventModal.action  === this.modalEvents.saveNewDocument.name){
            if(this.documentList.find((document)=>document.nameDocument != eventModal.data)) {
                this.saveNewDocument(eventModal.data); 
            } else{
                let countDuplicateName = 0;
                let regex = RegExp(eventModal.data);
                this.documentList.forEach((document)=>{
                    
                    if(regex.test(eventModal.data)){
                        countDuplicateName = countDuplicateName + 1;
                    }
                })
                let newDocumentName =  eventModal.data + "("+countDuplicateName+")";
                this.saveNewDocument(newDocumentName); 
            }
        }
        else if(eventModal.action  === this.modalEvents.saveOldDocument.name){
            this.saveDocument(eventModal.data);
        }
    }
    public eventFromChild(eventChild:triggerEventModel){
        if(eventChild.action  === Constants.general.event.load.success){
            setTimeout(() => {
            this.loading =false;
            this.loadHtml();
            },1000)
        }
    }

    public loadingProgress() {
        this.loading = true;
        setTimeout(() => {
            let progressBar = $("#progress-bar"); 
            let width = 10;
            let id = setInterval(frame, 0);
            function frame() {
              if (width >= 100) {
                clearInterval(id);
              } else {
                width++; 
                let setwidth = width + '%';
                progressBar.css('width',setwidth)
              }
            }
        });
    }
    public previewDocument(){
        this.router.navigate(['documentPreview'])
    }

}
// $(document).ready(function(){
//     $("button").click(function(){
//       $("#previewDoc").attr("href", "/documentPreview");
//     });
//   });
