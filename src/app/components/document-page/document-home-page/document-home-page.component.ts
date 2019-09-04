import { Component, OnInit, AfterContentInit, NgZone, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { DocumentService } from '../../../services/document/document.service';
import { DocumentModel } from '../../../models/document/content.model';
import { TriggerEventModel, DocumentNavigatorModel } from 'src/app/models/document/document.model';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { Router } from '@angular/router';
import { ScreenDetailModel } from '../../../models/common/common.model';
import { async } from 'q';
import { CommonService } from '../../../services/common/common.service';
declare var electron: any;
@Component({
    selector: 'document-home-page',
    templateUrl: 'document-home-page.component.html',
    styleUrls: ['../../document-page/document-page.component.scss'],
})
export class DocumentHomePageComponent implements OnInit, AfterContentInit, AfterViewInit {
    public triggerElement: Subject<TriggerEventModel> = new Subject<TriggerEventModel>();
    public dropElement: Subject<TriggerEventModel> = new Subject<TriggerEventModel>();
    public triggerModal: Subject<TriggerEventModel> = new Subject<TriggerEventModel>();
    public loading: boolean = false;
    public contentElement: Subject<DocumentModel> = new Subject<DocumentModel>();
    public contentTypes = Constants.document.contents.types;
    public modalTypes = Constants.document.modals.types;
    public modalEvents = Constants.document.modals.events;
    public toolTypes = Constants.document.tools.types;
    public contentTypeSelected: Subject<any> = new Subject<any>();
    public isOpenMenu: boolean = true;
    public triggerFromChild: Subject<TriggerEventModel> = new Subject<TriggerEventModel>();
    public currentDocumentName: string = this.documentDataService.currentDocumentName;
    public documentNavList: DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
    public documentList: DocumentModel[] = new Array<DocumentModel>();
    public showDocumentList: boolean = false;
    public onSuccessCreateDocNav: Subject<boolean> = new Subject<boolean>();
    public currentScreenSize:ScreenDetailModel = new ScreenDetailModel();

    public contents = {
        event: {
            triggerNavDoc: 'triggerNavDoc',
            dropTool: 'dropTool'
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
        private router: Router,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        this.currentScreenSize =  this.documentDataService.currentScreenSize
     

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
        if (this.currentDocumentName) {
            this.loadTargetDoc(this.currentDocumentName);
        } else {
            let newDoc = new DocumentModel();
            this.contentElement.next(newDoc);
        }
        this.loadDocumentNavigator();
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

    public setNewDocumentName() {
        this.documentDataService.currentDocumentName = 'New Document'
        let countDuplicateDocName = 0;
        let regexForCheckDuplicateDocName = RegExp(this.documentDataService.currentDocumentName);
        this.documentNavList.forEach((docNav) => {
            if (regexForCheckDuplicateDocName.test(docNav.nameDocument)) {
                countDuplicateDocName = countDuplicateDocName + 1;
            }
        })
        if (countDuplicateDocName > 0) {
            this.documentDataService.currentDocumentName = this.documentDataService.currentDocumentName + countDuplicateDocName;
        }
        this.currentDocumentName = this.documentDataService.currentDocumentName;
    }
    public async loadTargetDoc(targetDocumentName: string) {

        if (electron) {
            electron.ipcRenderer.send('request-read-document', targetDocumentName)
            await electron.ipcRenderer.once('reponse-read-document', (event, result) => {
                console.log(' ❏ Object Document :', result);
                this.contentElement.next(result);
                electron.ipcRenderer.removeListener('request-read-document', () => { });
                electron.ipcRenderer.removeListener('reponse-read-document', () => { });
            });
        } else {
            this.documentService.loadDocFromDB(this.commonService.getPatternId(targetDocumentName)).subscribe((result) => {
                this.contentElement.next(result);
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
            return this.documentService.loadDocFromDB(this.commonService.getPatternId(targetDocumentName));
        }
    }

    public loadDocumentNavigator() {
        if (electron) {
            electron.ipcRenderer.send('request-read-document-list', null)
            electron.ipcRenderer.once('reponse-read-document-list', (event, result) => {
                $('.document-sidenav-content').html(null);
                if (result && result.length > 0)
                    this.documentNavList = this.documentDataService.documentNavList = result;
                const targetDocument = this.documentNavList.find((documentNav) => documentNav.nameDocument === this.currentDocumentName);
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
                console.log(' ❏ Object DocumentList :', result);

            })
        } else {
            this.documentService.loadDocumentNavigatorFromDB().subscribe((result) => {
                $('.document-sidenav-content').html(null);
                this.documentNavList = this.documentDataService.documentNavList = result;
                const targetDocument = this.documentNavList.find((documentNav) => documentNav.nameDocument === this.documentDataService.currentDocumentNav);
                if (targetDocument) {
                    this.createNavigatorDocument(targetDocument, null)
                }
                this.documentList = new Array<DocumentModel>();
                this.documentDataService.documentList = new Array<DocumentModel>();

                this.documentNavList.forEach((documentNav, index) => {
                    this.getTargetDoc(documentNav.id).subscribe((document) => {
                        this.documentList.push(document);
                        this.documentDataService.documentList.push(document);
                    });
                });
            });
        }
        this.onSuccessCreateDocNav.subscribe((status) => {
            if(!this.currentDocumentName){
                this.setNewDocumentName();
            }
            if (status) {
                this.triggerElements(this.contents.event.triggerNavDoc)
            }

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
        if (action === this.contents.data.savecurrentDoc) {
            this.loadingProgress();
            if(this.documentDataService.currentDocumentName !== this.currentDocumentName){
                this.documentService.findDoc(this.commonService.getPatternId(this.currentDocumentName)).subscribe((document)=>{
                    if(document.status === Constants.common.message.status.success.text){
                        let rexFindNumberDoc = document.nameDocument.match(/\(([^)\w\s]|\d+)\)[^(]*$/)
                        if(rexFindNumberDoc){
                            this.currentDocumentName =  document.nameDocument+'('+rexFindNumberDoc[1]+')'
                        }else{
                            this.currentDocumentName =  document.nameDocument+'(1)'
                        }
                        this.triggerElement.next({ action: Constants.common.event.click.save, data: data || this.currentDocumentName });
                    }else{
                        this.triggerElement.next({ action: Constants.common.event.click.save, data: data || this.currentDocumentName });
                    }
                })
            }else{
                this.triggerElement.next({ action: Constants.common.event.click.save, data: data || this.currentDocumentName });
            }

        }
        else if (action === this.contents.data.savecurrentDocAndNewDoc) {
            this.triggerElement.next({ action: Constants.common.event.click.new, data: data || this.currentDocumentName });
        }

    }
    // public saveNewDocument(data?: any) {
    //     this.currentDocumentName = this.documentDataService.currentDocumentName = data;
    //     this.triggerElement.next({ action: Constants.general.event.click.new, data: data });
    // }
    public newDocument() {
        this.triggerModal.next({ action: this.modalTypes.newDocument.name, data: this.currentDocumentName });
    }
    public changeDocument(documentName) {
        console.log("changeDoc", documentName)
        this.currentDocumentName = this.documentDataService.currentDocumentName = documentName;
        this.loadTargetDoc(this.currentDocumentName).then((res) => {
            console.log("loadTargetDoc", res)
            this.loadDocumentNavigator();
        });

        // if(electron){
        //     this.loadHtml();
        // }else{
        //     this.loadcurrentHTML();
        // }
    }
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
            if(this.currentDocumentName !== this.documentDataService.currentDocumentName){
                this.documentService.deleteDocument(this.commonService.getPatternId(this.documentDataService.currentDocumentName)).subscribe((status)=>{
                    if(status===Constants.common.message.status.success.text){
                        this.documentDataService.currentDocumentName =  this.currentDocumentName;
                    }
                })
            }
            setTimeout(() => {
                this.ngZone.run(() => {
                    this.loading = false;
                    this.loadTargetDoc(this.currentDocumentName);
                    this.loadDocumentNavigator();
                })
            }, 1000)

            // this.loadHtml(this.currentDocument);

        }
        else if (eventChild.action === Constants.common.event.load.success && eventChild.data === "new") {
            this.router.navigate(['home'])
        }
        else if (eventChild.action === Constants.common.event.click.update && eventChild.data === "updateDocNav") {
            let targetDocNav = this.documentDataService.documentNavList.find((docNav)=>docNav.nameDocument ===  this.documentDataService.currentDocumentNav)
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
        this.documentDataService.currentDocumentName = this.currentDocumentName;
        this.router.navigate(['documentPreview'], { queryParams: { documentName: this.documentDataService.currentDocumentName } })
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
        htmlNavDocument += '<span id="nav-textdoc-' + documentNav.id + '"class="cursor-pointer sidenav-content-text">';
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
                this.documentDataService.currentDocumentName =  this.currentDocumentName = $(element.target).text();
                if (electron) {
                    this.loadTargetDoc($(element.target).text());
                } else {
                    this.loadTargetDoc(this.commonService.getPatternId($(element.target).text()));
                }

            })
        }

    }
    public dragTool(event) {
        event.stopPropagation();
        event.dataTransfer.setData("tool-type", $(event.target).attr('document-data'));
        // console.log("drag",$(event.target).attr('document-data'));

    }
    public dropTool(event) {
        let data = { element: event, toolType: event.dataTransfer.getData("tool-type") }
        this.dropElement.next({ action: this.contents.event.dropTool, data: data })
        // console.log(event)
        // console.log("drop",event.dataTransfer.getData("tool-type"));

    }
    public goToHome() {
        this.router.navigate(['home'])
    }

}
// $(document).ready(function(){
//     $("button").click(function(){
//       $("#previewDoc").attr("href", "/documentPreview");
//     });
//   });
