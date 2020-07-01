import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document/document.service';
import { DocumentNavigatorModel, TriggerEventModel } from '../../models/document/document.model';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { DocumentModel } from '../../models/document/content.model';
import { async } from '@angular/core/testing';
import { CommonService } from '../../services/common/common.service';
import { ScreenDetailModel } from '../../models/common/common.model';
import { Subject } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { SocketIoService } from 'src/app/services/common/socket.service';
import { CommonDataControlService } from '../../services/common/common-data-control.service';
import { SubFormContentDetailModel } from '../../models/document/elements/subForm-content.model';




declare var electron: any;
@Component({
    selector: 'app-home-page',
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomePageComponent implements OnInit , AfterViewInit , OnDestroy{
    @ViewChild('homeDocumentList', { static: true }) contentTemplate: ElementRef;
    private documentNavList:DocumentNavigatorModel[]  =new Array<DocumentNavigatorModel>();
    private documentList:DocumentModel[]  =  new Array<DocumentModel>();
    public triggerModal: Subject<TriggerEventModel> = new Subject<TriggerEventModel>();
    private rootElement:JQuery<Element>;
    public modalTypes = Constants.document.modals.types;
    public modalEvents = Constants.document.modals.events;
    public menuBarList =[
        {name:'Home',icon:'home.svg'},
        {name:'New',icon:'new.svg'}
    ]
    public loading:boolean =false;
    private currentMenu = {name:'Home',index:0};
    public contents = {
        event: {
            triggerDoc: 'triggerDoc'
        }
    }
    constructor(
        private documentService: DocumentService,
        private commonDataControlService:CommonDataControlService,
        private documentDataService:DocumentDataControlService,
        private commonService:CommonService,
        private router: Router,
        private socketIoService:SocketIoService
    ) { }
    ngOnInit(){
        // this.socketIoService.connectSocketIo();
        this.getDocumentList();

       
        //this.getDocumentNavigator();
  
    }
    ngAfterViewInit(){
        this.rootElement = $(this.contentTemplate.nativeElement);
    }
    ngOnDestroy(){
        console.log('destroy home')
    }
    public getDocumentList(){
        if(electron){
            this.loadDocumentNavigator();
        }else{
            this.documentService.loadDocFromDB().subscribe((documents:any)=>{
                this.documentDataService.documentList = this.documentList =  documents;
                this.loadDocumentNavigator();
            })
        }
    }
    // public getDocumentNavigator(){
    //     this.loadDocumentNavigator();
    //     // this.loading =true;
    //     // if(electron){
    //     //     this.loadDocumentNavigator();
    //     // }else{
    //     //     // this.documentService.initDBDoc().subscribe(()=>{
    //     //         //this.loadDocumentNavigator();
    //     //         this.documentService.loadDocFromDB().subscribe((documents:any)=>{
                    
    //     //             this.documentDataService.documentList =  documents;
    //     //         // console.log("xxxx",this.documentDataService.documentList)
    //     //             this.loadDocumentNavigator();
    //     //         })
    //     //     // });
    //     // }
    // }
    public loadDocumentNavigator() {
            this.documentService.loadDocumentNavigatorFromDB().subscribe((result) => {
                this.documentNavList = this.documentDataService.documentNavList = result;
                this.rootElement.html(null);
                this.documentNavList.forEach(async (documentNav)=>{
                    this.createHTMLDocList(documentNav)
                    // this.documentService.loadDocFromDB(documentNav.nameDocument).subscribe((documentObj)=>{
                    //     if(documentObj){
                    //         this.createHTMLDocList(documentObj)
                    //     }else{
                    //         this.loading = false;
                    //     }
                    // });
                });
                //this.documentDataService.documentList =  new Array<DocumentModel>();
                //this.getDocumentList()
            });
    }
    // public getDocumentList(){
    //     this.documentList = new  Array<DocumentModel>();
    //     this.homeDocumentList.html(null);
    //     if(this.documentNavList.length ==0){
    //         this.loading = false;
    //     }else{
        

    //         this.documentNavList.forEach(async (documentNav)=>{
    //             this.createHTMLDocList(documentNav)
    //             // this.documentService.loadDocFromDB(documentNav.nameDocument).subscribe((documentObj)=>{
    //             //     if(documentObj){
    //             //         this.createHTMLDocList(documentObj)
    //             //     }else{
    //             //         this.loading = false;
    //             //     }
    //             // });
    //         });
    //     }
    // }
    public createHTMLDocList(documentNavObj:DocumentNavigatorModel){
        this.rootElement.append(
            '<div class="document-container" document-id="'+documentNavObj.id+'"  document-data="'+documentNavObj.nameDocument+'" id="document-container-'+documentNavObj.id+'">'
            +'<img document-action="delete"  document-id="'+documentNavObj.id+'" document-data="'+documentNavObj.nameDocument+'" class="document-icon" src="assets/imgs/homePage/delete.svg">'
            +'<img src="'+documentNavObj.previewImg+'" class="document-paper" scrolling="no" id="iframe-'+documentNavObj.id+'"/>'
            +'<span class="document-text">'+ documentNavObj.nameDocument+'</span>'
            +'</div>'
            );
        // this.homeDocumentList.append('<div class="document-container" document-data="'+documentObj.nameDocument+'"  id="document-container-'+documentObj.id+'"><iframe class="document-paper" scrolling="no" id="iframe-'+documentObj.id+'"/><span class="document-text">'+ documentObj.nameDocument+'</span></div>')
        // this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find('body').append(documentObj.html)
        // let oldScreen: ScreenDetailModel = JSON.parse(localStorage.getItem('contentSize'))
        // this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find('head').append($("<link/>", {
        //     rel: 'stylesheet',
        //     href: 'app/global/styles.scss',
        //     type: 'text/css'
        // }));
        // this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find('body').css('cursor','pointer')
        // this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find('body').find('.content-box').each((index, contentBox) => {
        //             this.commonService.calPositionForNewScreen(contentBox,oldScreen).subscribe((elementDetail)=>{
        //                 console.log("elementDetail",contentBox)
        //                 $(contentBox).css('height',elementDetail.screenDetail.height + "%");
        //                 $(contentBox).css('width',elementDetail.screenDetail.width + "%");
        //                 $(contentBox).css('left',elementDetail.postitionDetail.left + "%");
        //                 $(contentBox).css('top',elementDetail.postitionDetail.top + "%" );
        //             })
        // })
        this.triggerElements(this.contents.event.triggerDoc,$('#document-container-'+documentNavObj.id));
        setTimeout(() => {
            this.loading =false;
        }, 500);
    }
    public changeCurrentMenu(menuObj,index){
        this.currentMenu = {name:menuObj.name,index:index}
        this.rootElement.html(null);
        if(menuObj.name === 'Home'){
            this.loadDocumentNavigator();
        }
        else if(menuObj.name === 'New'){
            this.rootElement.append('<div class="document-container" document-data="Blank document"  id="document-container-blank-document"><div class="document-paper"></div><span class="document-text">Blank document</span></div>')
        }
        this.triggerElements(this.contents.event.triggerDoc,$('#document-container-blank-document'));
    }
    public triggerElements(action: string, element?: JQuery<Element>) {
        this.documentDataService.currentDocument = new DocumentModel();
        if (action === this.contents.event.triggerDoc) {
            element.find('.document-icon').click((event)=>{
                event.stopPropagation();
                if($(event.currentTarget).attr('document-action')==='delete'){
                    this.triggerModal.next({ action: this.modalTypes.deleteDocument.name, data: $(event.currentTarget).attr('document-id') });
                }
            })

            element.click((event)=>{      
                if($(event.currentTarget).attr('document-data') == 'Blank document'){
                    this.documentDataService.currentDocument.nameDocument = 'New Document'
                    let maxNumber = 0;
                    this.documentNavList.forEach((docNav) => {
                        let regexMatchDocNumber  = RegExp('(?<='+this.documentDataService.currentDocument.nameDocument+')\\d+');
                        let findDocNumber = docNav.nameDocument.match(regexMatchDocNumber)
                        if(findDocNumber){
                            let  docNumber  = parseInt(findDocNumber[findDocNumber.length-1]);
                            if(maxNumber<docNumber){
                                maxNumber = docNumber;
                            }
                        }
                    })
                    if(maxNumber > 0){
                        this.documentDataService.currentDocument.nameDocument = this.documentDataService.currentDocument.nameDocument + (maxNumber +1);
                    }else{
                        let regexMatchDoc  = RegExp(this.documentDataService.currentDocument.nameDocument);
                        if(regexMatchDoc){
                            maxNumber = 1
                            this.documentDataService.currentDocument.nameDocument = this.documentDataService.currentDocument.nameDocument + (maxNumber +1);
                        }
                    }
                   // this.documentNavList.find((docNav)=>docNav.nameDocument === this.documentDataService.currentDocument.nameDocument)
                }else{
    
                    this.documentDataService.currentDocument   =  this.documentList.find((document)=>document.id === $(event.currentTarget).attr('document-id'))
                    this.documentDataService.currentDocumentNav = this.documentNavList.find((docNav)=>docNav.id === $(event.currentTarget).attr('document-id'))

                    // this.documentDataService.currentDocument.nameDocument  =  $(event.currentTarget).attr('document-data');

                }

                console.log(this.documentDataService.currentDocument)
                this.router.navigate(['documentHome'])                    
      

            })
        }

    }
    public eventModal(eventModal: TriggerEventModel) {
        if (eventModal.action === this.modalEvents.deleteDocument.name) {
            this.loading = true;
            let targetDoc =  this.documentNavList.find((documentNav)=>documentNav.id === eventModal.data)
            this.documentService.deleteDocument(targetDoc).subscribe((res)=>{
                this.loadDocumentNavigator();
            })
            //this.saveDocument(this.contents.data.savecurrentDocAndNewDoc, eventModal.data);
        }
    }

}
