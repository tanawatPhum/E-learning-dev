import { Component, OnInit, AfterContentInit, NgZone, ViewEncapsulation, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { DocumentService } from '../../../services/document/document.service';
import { DocumentModel } from '../../../models/document/content.model';
import { TriggerEventModel, DocumentNavigatorModel, DocumentEventControllerModel } from 'src/app/models/document/document.model';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { ScreenDetailModel } from '../../../models/common/common.model';
import { async } from 'q';
import { CommonService } from '../../../services/common/common.service';
import { RoutingStrategy } from 'aws-sdk/clients/gamelift';
import { filter, pairwise, map } from 'rxjs/operators';
import { DocumentPreviewPageComponent } from '../document-preview-page/document-preview-page.component';
import { ContentDataControlService } from '../../../services/content/content-data-control.service';
import { SubFormContentDetailModel } from 'src/app/models/document/elements/subForm-content.model';
import { ContentRouting } from 'src/app/app-content-routing';
import { ThrowStmt } from '@angular/compiler';
import { ToolBarService } from 'src/app/services/document/toolbar.service';
declare var electron: any;
@Component({
    selector: 'document-home-page',
    templateUrl: 'document-home-page.component.html',
    styleUrls: ['../../document-page/document-page.component.scss'],
})
export class DocumentHomePageComponent implements OnInit, AfterContentInit, AfterViewInit {
    @ViewChild('documentContainerContent', { static: true }) documentContainerContent: ElementRef;
    public documentEventController:Subject<DocumentEventControllerModel> = new Subject<DocumentEventControllerModel>();


    public triggerElement: Subject<TriggerEventModel> = new Subject<TriggerEventModel>();
    public dropElement: Subject<TriggerEventModel> = new Subject<TriggerEventModel>();
    public triggerModal: Subject<TriggerEventModel> = new Subject<TriggerEventModel>();
    public loading: boolean = false;
    public contentTypes = Constants.document.contents.types;
    public modalTypes = Constants.document.modals.types;
    public modalEvents = Constants.document.modals.events;
    public toolTypes = Constants.document.tools.types;
    public layoutType = Constants.document.layouts.types;

    public contentTypeSelected: Subject<any> = new Subject<any>();
    public isOpenMenu: boolean = true;
    public triggerFromChild: Subject<TriggerEventModel> = new Subject<TriggerEventModel>();
    public currentDocumentName: string = this.documentDataService.currentDocument.nameDocument;
    public documentNavList: DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
    public documentList: DocumentModel[] = new Array<DocumentModel>();
    public showDocumentList: boolean = false;
    public onSuccessCreateDocNav: Subject<boolean> = new Subject<boolean>();
    public currentScreenSize:ScreenDetailModel = new ScreenDetailModel();
    public currentResult:DocumentModel = new DocumentModel();
    public fontSizeList  = Constants.common.style.fontSizeList;
    

    public arrayCols;
    public rootElement:JQuery;
    public contents = {
        event: {
            triggerNavDoc: 'triggerNavDoc',
            dropTool: 'dropTool',
            dropAny:'dropAny'
        },
        data: {
            savecurrentDoc: 'savecurrentDoc',
            savecurrentDocAndNewDoc: 'savecurrentDocAndNewDoc'
        }
    }
    
    constructor(
        private documentService: DocumentService,
        private documentDataService: DocumentDataControlService,
        private commonService: CommonService,
        private ngZone:NgZone,
        private router: Router,
        private contentDCtrlService:ContentDataControlService,
        private toolbarService:ToolBarService
    ) { }

    ngOnInit() {
        this.arrayCols =Array(9).fill(Array(12).fill(1));
        this.rootElement   = $('section[name="mainSection"]')
        
        // console.log(this.arrayCols)
        // this.arrayCols.forEach(element => {
        //     element.push(Array(12).fill(1))
        // });
        //console.log('this.arrayCols',this.arrayCols)

        this.currentScreenSize =  this.documentDataService.currentScreenSize
        this.documentDataService.previousPage  = DocumentHomePageComponent.name
  


        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.document.lifeCycle.updateDocumentNav){      
  
                    let targetDocNav = this.documentDataService.documentNavList.find((docNav)=>docNav.id ===  this.documentDataService.currentDocument.id)
                    if(targetDocNav){
                        $('.document-sidenav-content').html(null);
                        this.createNavigatorDocument(targetDocNav, null)
                    }
                         
   
            }
        })
        // if (electron) {
        //     electron.ipcRenderer.send('request-read-document', this.currentDocument)
        //     electron.ipcRenderer.once('reponse-read-document', (event, document) => { 
        //         console.log(' ❏ Object Document :', document);          
        //     });
        // } else {
        //     this.loadHtml().then(() => {
        //         this.loadcurrentHTML();
        //     });
        // }


        // this.loadDocumentList();



    }
    ngAfterViewInit() {
    
    // console.log("this.documentDataService.currentDocument",this.documentDataService.currentDocument)

            this.handleToolbars()
            this.documentService.calSizeContainerContent();


            this.documentEventController.next(this.documentDataService.setDocumentEvent(Constants.document.events.initialContent,null,this.documentContainerContent.nativeElement))
       
            if (this.documentDataService.currentDocument.id) {
                this.loadTargetDoc();
            } else {
                let newDoc = new DocumentModel();
                //this.contentElement.next(newDoc);
                this.documentEventController.next(this.documentDataService.setDocumentEvent(Constants.document.events.loadContent,newDoc,null))
            } 
  



           

            
            //console.log(this.documentContainerContent.nativeElement.getBoundingClientRect().top)
     


         
        
    
    }
    ngAfterContentInit() {
        // this.documentDataService.currentScreen = {h}
        // console.log(($('.document-content')))
        // $('.document-content').css('height', ($(document).height() -55)+'px');
    }
    // public showMenuLayout() {
    //     $('.document-form-select').show().animate({
    //         'width': '400px'
    //     }, 175);
    // }

    // public setNewDocumentName() {
    //     this.documentDataService.currentDocumentName = 'New Document'
    //     let countDuplicateDocName = 0;
    //     let regexForCheckDuplicateDocName = RegExp(this.documentDataService.currentDocumentName);
    //     this.documentNavList.forEach((docNav) => {
    //         if (regexForCheckDuplicateDocName.test(docNav.nameDocument)) {
    //             countDuplicateDocName = countDuplicateDocName + 1;
    //         }
    //     })
    //     if (countDuplicateDocName > 0) {
    //         this.documentDataService.currentDocumentName = this.documentDataService.currentDocumentName + countDuplicateDocName;
    //     }
    //     this.currentDocumentName = this.documentDataService.currentDocumentName;
    // }
    public async loadTargetDoc() {

        if (electron) {
            // electron.ipcRenderer.send('request-read-document', targetDocumentName)
            // await electron.ipcRenderer.once('reponse-read-document', (event, result) => {
            //     console.log(' ❏ Object Document :', result);
            //     this.contentElement.next(result);
            //     electron.ipcRenderer.removeListener('request-read-document', () => { });
            //     electron.ipcRenderer.removeListener('reponse-read-document', () => { });
            // });
        } else {
            this.documentService.loadDocFromDB(this.documentDataService.currentDocument.id).subscribe((result) => {
                if (Array.isArray(result)) {
                    this.currentResult = result && result[0];
                }else{
                    this.currentResult = result;
                }
                // console.log("this.currentResult",this.currentResult)
                this.loadDocumentNavigator();
             
            });
        }


    }
    public getTargetDoc(targetDocumentName): Observable<DocumentModel> {
        if (electron) {
            return new Observable((subscriber) => {
                // console.log("targetDocumentName",targetDocumentName)
                electron.ipcRenderer.send('request-read-target-document', targetDocumentName)
                electron.ipcRenderer.once('reponse-read-target-document', (event, result) => {
                    // console.log(' ❏ Object Document :', result);

                    subscriber.next(result);
                    subscriber.complete();
                    electron.ipcRenderer.removeListener('request-read-target-document', () => { });
                    electron.ipcRenderer.removeListener('reponse-read-target-document', () => { });
                })
            });
        } else {

            return this.documentService.loadDocFromDB(this.documentDataService.currentDocument.id);
        }
    }

    public loadDocumentNavigator() {
        if (electron) {
            electron.ipcRenderer.send('request-read-document-list', null)
            electron.ipcRenderer.once('reponse-read-document-list', (event, result) => {
                $('.document-sidenav-content').html(null);
                if (result && result.length > 0)
                    this.documentNavList = this.documentDataService.documentNavList = result;
                const targetDocument = this.documentNavList.find((documentNav) => documentNav.id === this.documentDataService.currentDocument.id);
                if (targetDocument) {
                    this.createNavigatorDocument(targetDocument, null)
                }
                this.documentList = new Array<DocumentModel>();
                this.documentDataService.documentList = new Array<DocumentModel>();
                this.documentNavList.forEach((documentNav, index) => {
                    this.getTargetDoc(documentNav.nameDocument).subscribe((document) => {
                        this.documentList.push(document);
                        this.documentDataService.documentList.push(document);
                    });
                });


            })
        } else {
            this.documentService.loadDocumentNavigatorFromDB().subscribe((result) => {
                $('.document-sidenav-content').html(null);
                this.documentNavList = this.documentDataService.documentNavList = result;
                let newDocumentNav:DocumentNavigatorModel = new DocumentNavigatorModel();
              //  newDocumentNav.id  = this.commonService.getPatternId(this.documentDataService.currentDocumentName)
                newDocumentNav.nameDocument  =this.documentDataService.currentDocument.nameDocument;
                newDocumentNav.previewImg = null;
                newDocumentNav.status = Constants.common.message.status.created.text
                newDocumentNav.userId =  Constants.common.user.id;
                newDocumentNav.childDocuments  = new Array<SubFormContentDetailModel>();
                this.documentDataService.documentNavList.push(newDocumentNav)
                console.log(' ❏ Object DocumentList :', result);
                const targetDocument = this.documentNavList.find((documentNav) => documentNav.id === this.documentDataService.currentDocument.id);
                if (targetDocument) {
                    this.createNavigatorDocument(targetDocument, null)
                }
             this.documentList =  this.documentDataService.documentList; 

             this.documentEventController.next(this.documentDataService.setDocumentEvent(Constants.document.events.loadContent,this.currentResult,null))
                
 
    


   

            //  this.contentElement.complete();
              //console.log(this.documentDataService.documentList)  
                // this.documentNavList.forEach((documentNav, index) => {
                //     this.getTargetDoc(documentNav.id).subscribe((document) => {
                //         this.documentList.push(document);
                //         this.documentDataService.documentList.push(document);
                //         console.log(this.documentList)  
                //     });
                // });
            });
        }
        this.onSuccessCreateDocNav.subscribe((status) => {
            this.triggerElements(this.contents.event.triggerNavDoc)
            // if(!this.currentDocumentName){
            //     this.setNewDocumentName();
            // }
            // if (status) {
            //     this.triggerElements(this.contents.event.triggerNavDoc)
            // }

        })

    }
    // public loadDocumentList(){
    //     electron.ipcRenderer.send('request-read-document-list',null)
    //     electron.ipcRenderer.on('reponse-read-document-list', (event,documentList) => {
    //         this.documentList = documentList;
    //         console.log(' ❏ Object DocumentList :', documentList);
    //     })
    // }
    // public loadcurrentHTML() {
    //     if (this.currentDocument && !electron) {
    //         let targetDocument = this.currentResult.find((document) => document.nameDocument === (this.currentDocument));
    //         console.log(targetDocument)
    //         this.contentElement.next(targetDocument);
    //     }
    //     else if(electron){
    //         this.contentElement.next(this.currentResult[0]);
    //     }
    //     // else{
    //     //     this.currentDocument = this.documentDataService.currentDocument = this.currentResult[0].nameDocument;
    //     //     this.contentElement.next(this.currentResult[0]);
    //     // }
    // }
    public saveDocument(action: string, data?: any) {
        this.loadingProgress();
        this.documentDataService.currentDocument.nameDocument = this.currentDocumentName;
        this.triggerElement.next({ action: Constants.common.event.click.save, data: data || this.documentDataService.currentDocument.id });
        // if (action === this.contents.data.savecurrentDoc) {
        //     this.loadingProgress();
        //     if(this.documentDataService.currentDocumentName !== this.currentDocumentName){
        //         this.triggerElement.next({ action: Constants.common.event.click.save, data: data || this.currentDocumentName });
        //         // this.documentService.findDoc(this.commonService.getPatternId(this.currentDocumentName)).subscribe((document)=>{
        //         //     if(document.status === Constants.common.message.status.success.text){
        //         //         let rexFindNumberDoc = document.nameDocument.match(/\(([^)\w\s]|\d+)\)[^(]*$/)
        //         //         if(rexFindNumberDoc){
        //         //             this.currentDocumentName =  document.nameDocument+'('+rexFindNumberDoc[1]+')'
        //         //         }else{
        //         //             this.currentDocumentName =  document.nameDocument+'(1)'
        //         //         }
        //         //         this.triggerElement.next({ action: Constants.common.event.click.save, data: data || this.currentDocumentName });
        //         //     }else{
        //         //         this.triggerElement.next({ action: Constants.common.event.click.save, data: data || this.currentDocumentName });
        //         //     }
        //         // })
        //     }else{
        //         this.triggerElement.next({ action: Constants.common.event.click.save, data: data || this.currentDocumentName });
        //     }

        // }
        // else if (action === this.contents.data.savecurrentDocAndNewDoc) {
        //     this.triggerElement.next({ action: Constants.common.event.click.new, data: data || this.currentDocumentName });
        // }

    }
    // public saveNewDocument(data?: any) {
    //     this.currentDocumentName = this.documentDataService.currentDocumentName = data;
    //     this.triggerElement.next({ action: Constants.general.event.click.new, data: data });
    // }
    public newDocument() {
        this.triggerModal.next({ action: this.modalTypes.newDocument.name, data: this.documentDataService.currentDocument.id });
    }
    // public changeDocument(documentName) {
    //     //this.currentDocumentName = this.documentDataService.currentDocumentName = documentName;
    //     this.loadTargetDoc().then((res) => {
    //         console.log("loadTargetDoc", res)
    //         this.loadDocumentNavigator();
    //     });

    //     // if(electron){
    //     //     this.loadHtml();
    //     // }else{
    //     //     this.loadcurrentHTML();
    //     // }
    // }
    public createContent(contentType: any) {
        this.contentTypeSelected.next(contentType);
    }
    public toggleMenu() {
        this.isOpenMenu = !this.isOpenMenu;
        // $('#document-sidenav').slider();
    }
    public eventModal(eventModal: TriggerEventModel) {
        // if (eventModal.action === this.modalEvents.saveNewDocument.name) {
        //     if (this.documentNavList.find((document) => document.nameDocument != eventModal.data)) {
        //         this.saveNewDocument(eventModal.data);
        //     } else {
        //         let countDuplicateName = 0;
        //         let regex = RegExp(eventModal.data);
        //         this.documentNavList.forEach((document) => {

        //             if (regex.test(eventModal.data)) {
        //                 countDuplicateName = countDuplicateName + 1;
        //             }
        //         })
        //         let newDocumentName = eventModal.data + "(" + countDuplicateName + ")";
        //         this.saveNewDocument(newDocumentName);
        //     }
        // }
        if (eventModal.action === this.modalEvents.saveOldDocument.name) {
            this.saveDocument(this.contents.data.savecurrentDocAndNewDoc, eventModal.data);
        }
        else if (eventModal.action === this.modalEvents.cancelSaveDocument.name) {
            this.router.navigate(['home'])
        }
    }
    public eventFromChild(eventChild: TriggerEventModel) {
        if (eventChild.action === Constants.common.event.load.success && eventChild.data === "save") {
            // if(this.currentDocumentName !== this.documentDataService.currentDocumentName){
            //     let targetDoc =  this.documentNavList.find((documentNav)=>documentNav.nameDocument === eventChild.data)
            //     this.documentService.deleteDocument(targetDoc).subscribe((status)=>{
            //         if(status===Constants.common.message.status.success.text){
            //             this.documentDataService.currentDocumentName =  this.currentDocumentName;
            //         }
            //     })
            // }
           // let targetDoc =  this.documentNavList.find((documentNav)=>documentNav.id === eventChild.data)


            setTimeout(() => {
                this.ngZone.run(() => {
                    this.loading = false;
                    this.loadTargetDoc();
                    // this.loadDocumentNavigator();
                })
            }, 1000)

            // this.loadHtml(this.currentDocument);

        }
        else if (eventChild.action === Constants.common.event.load.success && eventChild.data === "new") {
            this.router.navigate(['home'])
        }
        else if (eventChild.action === Constants.common.event.click.update && eventChild.data === "updateDocNav") {
            let targetDocNav = this.documentDataService.documentNavList.find((docNav)=>docNav.id ===  this.documentDataService.currentDocument.id)
            if(targetDocNav){
                $('.document-sidenav-content').html(null);
                this.createNavigatorDocument(targetDocNav, null)
            }
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
                    progressBar.css('width', setwidth)
                }
            }
        });
    }
    public previewDocument() {
        // this.documentDataService.currentDocumentName = this.currentDocumentName;
        this.router.navigate(['documentPreview'], { queryParams: { documentId: this.documentDataService.currentDocument.id } })
    }
    public createNavigatorDocument(documentNav: DocumentNavigatorModel, parentDocId: string) {
        if (documentNav.childDocuments.length == 0) {
            this.createHTMLNavDoc(documentNav, parentDocId)
            this.onSuccessCreateDocNav.next(true);
            return;
        } else {
            documentNav.childDocuments.forEach((childDocument, index) => {
                this.createHTMLNavDoc(documentNav, parentDocId)
                let targetDocument = this.documentNavList.find((document) => document.id === childDocument.id)
                return this.createNavigatorDocument(targetDocument, documentNav.id);
            })
        }
    }
    public createHTMLNavDoc(documentNav: DocumentNavigatorModel, parentDocId: string) {
        let htmlNavDocument = '<ul class="pl-3 sidenav-content-list">'
        htmlNavDocument += '<li id="nav-doc-' + documentNav.id + '" class="sidenav-content-sublist cursor-default text-muted pl-2">';
        htmlNavDocument += '<span documentnav-id="'+documentNav.id+'" id="nav-textdoc-' + documentNav.id + '"class="cursor-pointer sidenav-content-text">';
        htmlNavDocument += documentNav.nameDocument;
        htmlNavDocument += '</span>';
        htmlNavDocument += '</li>';
        htmlNavDocument += '</ul>';
        if (!parentDocId && $('.document-sidenav-content').find('.sidenav-content-firstDoc').length == 0) {
            let firstNav = '<ul class="pl-4">';
            firstNav += '<li id="nav-doc-' + documentNav.id + '" class="cursor-default text-cobalt sidenav-content-firstDoc">';
            firstNav += '<span  id=""nav-textdoc-' + documentNav.id + '" class="cursor-pointer sidenav-content-text">';
            firstNav += documentNav.nameDocument;
            firstNav += '</span>';
            firstNav += '</li>';
            firstNav += '</ul>';
            $('.document-sidenav-content').append(firstNav);
            console.log("$('.document-sidenav-content').", $('.document-sidenav-content'));
        } else {
            $('.document-sidenav-content').find('[id="nav-doc-' + parentDocId + '"]').append(htmlNavDocument)
        }
    }
    public triggerElements(action: string, element?: any) {
        if (action === this.contents.event.triggerNavDoc) {
            $('.sidenav-content-text').unbind();
            $('.sidenav-content-text').click((element) => {
                element.stopPropagation();
                this.documentDataService.currentDocument =  this.documentList.find((document)=>document.id === $(element.target).attr('documentnav-id'));
                this.loadTargetDoc();
                // if (electron) {
                //     this.loadTargetDoc($(element.target).text());
                // } else {
                //     this.loadTargetDoc(this.commonService.getPatternId($(element.target).text()));
                // }

            })
        }

    }
    public dragTool(event) {
        event.stopPropagation();
        let typeName = '';
        if($(event.target).attr('content-name')){
            typeName = 'content-name'
        }
        else if( $(event.target).attr('layout-name')){
            typeName = 'layout-name'
        }

        event.dataTransfer.setData(typeName, $(event.target).attr('content-name') || $(event.target).attr('layout-name'));
        // console.log("drag",$(event.target).attr('document-data'));

    }
    public dropTool(event) {
        let targetFile = event.dataTransfer.files

      
        if($(event.target).attr('element-name')!=='content-page'){
            event.pageTarget =  $(event.target).parents('[element-name="content-page"]').get(0)
        }else{
            event.pageTarget =  event.target
        }

        if(targetFile.length>0){
            let targetContentType = this.documentService.getComponentType(targetFile[0].type);
            let targetContent =  ContentRouting.routes.find((content)=>content.contentName === targetContentType);
            if(targetContent){
                let data = {
                    targetContent:targetContent,
                    result:targetFile
                }
                this.dropElement.next({ action: this.contents.event.dropAny, data: data })
            }
        }else{
            let targetTypeValue;
            let targetType;
            if(event.dataTransfer.getData("content-name")){
                targetTypeValue = event.dataTransfer.getData("content-name")
                targetType = 'contentName'
            }
            else if(event.dataTransfer.getData("layout-name")){
                targetTypeValue = event.dataTransfer.getData("layout-name")
                targetType = 'layoutName'
            }
            let data = { element: event, [targetType]: targetTypeValue}
            this.dropElement.next({ action: this.contents.event.dropTool, data: data })
        }


      
        // console.log(event)
        // console.log("drop",event.dataTransfer.getData("tool-type"));

    }
    public goToHome() {
        this.router.navigate(['home'])
    }
    public handleLayoutGrid(event,rowIndex,colIndex){
        $('.layout-col-table').css('background','white')
        for(let row = 0  ; row<=rowIndex;row++){
            for(let col = 0 ;col <=colIndex; col++){
                $('[table-index=index-'+row+'_'+col+']').css('background','#007bff')  
            }
        }
        let data = { detail:{rowNumber:rowIndex+1,colNumber:colIndex+1,status:'wait' },'layoutName': Constants.document.layouts.types.tableLayout}
        this.dropElement.next({ action: this.contents.event.dropTool, data: data })
        $('.dropdown-menu-table').unbind('click').bind('click',()=>{
            $('.dropdown-menu').hide();
            data = { detail:{rowNumber:rowIndex+1,colNumber:colIndex+1,status:'create' },'layoutName': Constants.document.layouts.types.tableLayout}
            this.dropElement.next({ action: this.contents.event.dropTool, data: data })
        })


    }
    handleToolbars(){
        this.setTemplate();
        $('[toolbar-tools-action][toolbar-tools-action="insert"]').show()
        $('[toolbar-tools-action][toolbar-tools-action!="insert"]').hide()


        $('[toolbar-title-action]').unbind('click').bind('click',(event)=>{
            let targetTab =  $('[toolbar-tools-action][toolbar-tools-action='+$(event.currentTarget).attr('toolbar-title-action')+']')
            let otherTab  =   $('[toolbar-tools-action][toolbar-tools-action!='+$(event.currentTarget).attr('toolbar-title-action')+']');
            let currentTarget  = $(event.currentTarget)
            $('[toolbar-title-action]').removeClass('toolbar-background')
            .css('color','white')
            otherTab.hide();
            targetTab.toggle();
            this.setTemplate();
           
            if(targetTab.is(":visible")){
                currentTarget.addClass('toolbar-background')
                .css('color','#0049B0')
            }else{
                currentTarget.removeClass('toolbar-background')
                .css('color','white')
            }
            this.documentService.calSizeContainerContent();
            // targetTab.toggleClass('toolbar-background')
      
            // $(event.currentTarget).toggleClass('toolbar-background')
            // $(event.currentTarget).css('color','#0049B0')
        })
        $('.dropdown').unbind('click').bind('click',()=>{
            $('.dropdown-menu').toggle();
        })
        
   
        // this.toolbarService.getFontFamily('#toolbar-font-family');
        // this.toolbarService.getParagraph('[data-font-group="font-alignment"]');
        // this.toolbarService.getFontStyle('[data-font-group="font-style"]');
        // this.toolbarService.getFontColor('#toolbar-font-color');
        // this.toolbarService.getFontSize('#toolbar-font-size');
        // this.toolbarService.getFontBackground('#toolbar-font-bg');
    }
    
    setTemplate(){
        
       let templateHeight = $(document).height() - ( ($('.document-navbar:visible').height()||0)  + ($('.document-toolbar:visible').height()||0) +($('.col-ruler:visible').height()||0))
        $('.container-content').css('height',templateHeight-20)
    }

    setTypeLayout(layoutType){
        this.documentEventController.next(this.documentDataService.setDocumentEvent(Constants.document.events.setLayout,layoutType,null))

    }

}
// $(document).ready(function(){
//     $("button").click(function(){
//       $("#previewDoc").attr("href", "/documentPreview");
//     });
//   });
