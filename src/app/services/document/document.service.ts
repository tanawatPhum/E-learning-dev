import { Injectable, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { Constants } from '../../global/constants';
import { Observable, Subscriber } from 'rxjs';
import { DocumentModel } from '../../models/document/content.model';
import { DocumentNavigatorModel } from 'src/app/models/document/document.model';
import { DocumentDataControlService } from './document-data-control.service';
import html2canvas from 'html2canvas';
import { CommonService } from '../common/common.service';
import { CommonResponseModel, UploadFileModel } from 'src/app/models/common/common.model';
import { DocumentTrackModel } from '../../models/document/document.model';
import { FileContentModel } from '../../models/document/elements/file-content.model';
import Amplify, { Storage, Auth } from 'aws-amplify';
import { SocketIoService } from '../common/socket.service';
import { CommonDataControlService } from '../common/common-data-control.service';
import { AdHost } from '../../directives/ad-host/ad-host.directive';
import domtoimage from 'dom-to-image';

Amplify.configure({
    Auth: {
        identityPoolId: 'eu-central-1:4c9f1222-30c0-4db9-b9ed-57938e9684be',
        region: 'eu-central-1',
        // userPoolId: 'us-east-2_qCW1BuFYV',
        // userPoolWebClientId:'663n1uidmi0ao3lrsk7ldsvv3q'
    },
    Storage: {
        bucket: 'e-learning-dev',

    }
});

declare var electron: any;
declare var rangy: any;
declare var CKEDITOR: any;
@Injectable()
export class DocumentService {
    @ViewChild(AdHost, { static: true }) adHost: AdHost;
    constructor(
        private documentDataService: DocumentDataControlService,
        private commonDataService: CommonDataControlService,
        private commonService: CommonService,
        private socketIoService: SocketIoService,
    ) {

    }
    public indexDB: any;
    public highlighter: any;
    private contentTypes = Constants.document.contents.types;
    // public createContent(){
    //     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Img);
    //     const viewContainerRef = this.adHost.viewContainerRef;
    //     viewContainerRef.clear();
    //     const componentRef = viewContainerRef.createComponent(componentFactory);
    // }

    public initDBDoc(): Observable<any> {
        return new Observable(subscriber => {
            if (!electron) {
                this.socketIoService.sendData(Constants.document.connect.type.documentReadMongoDBToCacheDB).subscribe((status) => {
                    //this.creaetDocumentModel(objectDoc).subscribe((result)=>{
                    subscriber.next(status);
                    subscriber.complete();
                    //});
                });

            }

            // const requestDB = window.indexedDB.open('e-learning', 1);
            // requestDB.onerror = ((error) => {
            //     console.error('error: ', error);
            // });
            // requestDB.onsuccess = (async (event) => {
            //     subscriber.next('Success to initDB');
            // })
            // requestDB.onupgradeneeded = ((event: any) => {
            //     const db = event.target.result;
            //     db.createObjectStore('navigators', { keyPath: 'id' });
            //     db.createObjectStore('documents', { keyPath: 'id' });
            //     db.createObjectStore('tracks', { keyPath: 'id' });
            //     subscriber.next('Success to initDB');
            // });
        })
    }
    public loadDocFromDB(documentName?, userId?): Observable<DocumentModel> {
        return new Observable(subscriber => {
            let idDoc = null
            if (documentName) {
                idDoc = this.commonService.getPatternId(documentName)
            }
            let requestObjDoc = {
                id: idDoc,
                userId: userId || this.commonDataService.userId
            }
            if (electron) {
                electron.ipcRenderer.send('request-read-target-document', documentName)
                electron.ipcRenderer.once('reponse-read-target-document', (event, objectDoc) => {
                    // console.log('☛ Result Document from Flie : ', objectDoc);
                    subscriber.next(objectDoc);
                    subscriber.complete();
                })
            } else {
                this.socketIoService.sendData(Constants.document.connect.type.documentRead, requestObjDoc).subscribe((objectDoc: DocumentModel[]) => {

                    this.creaetDocumentModel(objectDoc).subscribe((result) => {
                        subscriber.next(result);
                        subscriber.complete();
                    });


                });
            }

        });
    }
    public loadDocumentNavigatorFromDB(): Observable<DocumentNavigatorModel[]> {
        return new Observable(subscriber => {
            let requestObjDocNav = {
                userId: this.commonDataService.userId
            }
            if (electron) {
                electron.ipcRenderer.send('request-read-document-list', null)
                electron.ipcRenderer.once('reponse-read-document-list', (event, objectNav) => {
                    subscriber.next(objectNav);
                    subscriber.complete();
                });
            } else {
                this.socketIoService.sendData(Constants.document.connect.type.documentNavRead, requestObjDocNav).subscribe((objectDocNav) => {
                    if (!objectDocNav) {
                        objectDocNav = new Array<DocumentNavigatorModel>();
                    }
                    subscriber.next(objectDocNav);
                    subscriber.complete();
                });
                // this.creaetDocumentModel(objectDoc).subscribe((result)=>{
                //     subscriber.next(result);
                // })
                // const requestDB = window.indexedDB.open('e-learning', 1);
                // requestDB.onerror = ((error) => {
                //     console.error('error: ', error);
                // });
                // requestDB.onsuccess = (async (event) => {
                //     this.indexDB = requestDB.result;
                //     this.getNavigator().subscribe((objectNav) => {
                //         console.log('☛ Result Document Navigator from Database : ', objectNav);
                //         subscriber.next(objectNav);
                //         subscriber.complete();
                //     });
                // });
                // requestDB.onupgradeneeded = ((event: any) => {
                //     const db = event.target.result;
                //     db.createObjectStore('navigators', { keyPath: 'id' });
                //     db.createObjectStore('documents', { keyPath: 'id' });
                // });
            }

        });
    }
    public loadDocTrackFromDB(): Observable<DocumentTrackModel[]> {
        return new Observable(subscriber => {
            let requestObjDocTrack = {
                userId: this.commonDataService.userId
            }
            if (electron) {
                // electron.ipcRenderer.send('request-read-target-document', documentName)
                // electron.ipcRenderer.once('reponse-read-target-document', (event, objectDoc) => {
                //     console.log('☛ Result Document from Flie : ', objectDoc);
                //     subscriber.next(objectDoc);
                //     subscriber.complete();
                // })
            } else {
                this.socketIoService.sendData(Constants.document.connect.type.documentTrackRead, requestObjDocTrack).subscribe((objectDocNav) => {
                    subscriber.next(objectDocNav);
                    subscriber.complete();
                });

                // const requestDB = window.indexedDB.open('e-learning', 1);
                // requestDB.onerror = ((error) => {
                //     console.error('error: ', error);
                // });
                // requestDB.onsuccess = (async (event) => {
                //     this.indexDB = requestDB.result;
                //     this.getTrack().subscribe((objectDoc) => {
                //         console.log('☛ Result track from Database : ', objectDoc);
                //         subscriber.next(objectDoc);
                //         subscriber.complete();
                //     });
                // });
            }

        });
    }
    public deleteDocument(documentNavObj: DocumentNavigatorModel): Observable<string> {
        return new Observable(subscriber => {
            if (electron) {

            } else {
                this.socketIoService.sendData(Constants.document.connect.type.documentDelete, documentNavObj).subscribe((res) => {
                    console.log('xxxx', res)
                    if (res === Constants.common.message.status.success.text) {
                        subscriber.next(Constants.common.message.status.success.text);
                        subscriber.complete();
                    } else {
                        subscriber.next(Constants.common.message.status.fail.text);
                        subscriber.complete();
                    }
                });
            }
            // let dbDocRequest = window.indexedDB.open("documents");
            // dbDocRequest.onsuccess = (event)=> {
            //         const transaction = this.indexDB.transaction(['documents'], 'readwrite');
            //         const objectStore = transaction.objectStore('documents');
            //         let request = objectStore.delete(documentName)
            //         request.onerror = ((event) => {
            //             console.error('cannot delete document !');
            //         });
            //         // request.onsuccess = ((event) => {
            //         //     subscriber.next(Constants.general.message.status.success.text);
            //         // }); 
            //     let dbNavRequest = window.indexedDB.open("navigators");
            //     dbNavRequest.onsuccess = (event)=> {
            //         const transaction = this.indexDB.transaction(['navigators'], 'readwrite');
            //         const objectStore = transaction.objectStore('navigators');
            //         let request = objectStore.delete(documentName)
            //         request.onerror = ((event) => {
            //             console.error('cannot delete document navigator !');
            //             subscriber.next(Constants.common.message.status.fail.text);
            //         });
            //         request.onsuccess = ((event) => {
            //             subscriber.next(Constants.common.message.status.success.text);
            //         }); 
            //     }
            //     let dbTrackRequest = window.indexedDB.open("tracks");
            //     dbTrackRequest.onsuccess = (event)=> {
            //         const transaction = this.indexDB.transaction(['tracks'], 'readwrite');
            //         const objectStore = transaction.objectStore('tracks');
            //         let request = objectStore.delete(documentName)
            //         request.onerror = ((event) => {
            //             console.error('cannot delete document track !');
            //             subscriber.next(Constants.common.message.status.fail.text);
            //         });
            //         request.onsuccess = ((event) => {
            //             subscriber.next(Constants.common.message.status.success.text);
            //         }); 
            //     }
            // }

        })
    }
    private getDoc(documentName?): Observable<DocumentModel> {
        const transaction = this.indexDB.transaction(['documents']);
        const objectStore = transaction.objectStore('documents');
        let request;
        if (documentName) {
            request = objectStore.get(documentName)
        } else {
            request = objectStore.getAll();
        }
        return new Observable(subscriber => {
            request.onerror = ((event) => {
                console.error('Unable to retrieve daa from database!');
            });

            request.onsuccess = ((event) => {
                // Do something with the request.result!
                if (request.result) {
                    let result: DocumentModel = request.result;
                    result.status = Constants.common.message.status.success.text;
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result: DocumentModel = new DocumentModel();
                    result.status = Constants.common.message.status.notFound.text;
                    subscriber.next(result);
                    subscriber.complete();
                    //console.error('couldn\'t be found in your database!');
                }
            });
        });
    }

    public findDoc(documentName): Observable<DocumentModel> {
        const transaction = this.indexDB.transaction(['documents']);
        const objectStore = transaction.objectStore('documents');
        let request = objectStore.get(documentName)

        return new Observable(subscriber => {
            request.onerror = ((event) => {
                console.error('Unable to retrieve daa from database!');
            });

            request.onsuccess = ((event) => {
                // Do something with the request.result!
                if (request.result) {
                    let result: DocumentModel = request.result;
                    result.status = Constants.common.message.status.success.text;
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result: DocumentModel = new DocumentModel();
                    result.status = Constants.common.message.status.notFound.text;
                    subscriber.next(result);
                    subscriber.complete();
                    //console.error('couldn\'t be found in your database!');
                }
            });
        });
    }

    private getNavigator(): Observable<DocumentNavigatorModel[]> {
        const transaction = this.indexDB.transaction(['navigators']);
        const objectStore = transaction.objectStore('navigators');
        let request = objectStore.getAll();
        return new Observable(subscriber => {
            request.onerror = ((event) => {
                console.error('Unable to retrieve daa from database!');
            });
            request.onsuccess = ((event) => {
                // Do something with the request.result!
                if (request.result) {
                    let result: DocumentNavigatorModel[] = request.result;
                    if (result.length > 0) {
                        result[0].status = Constants.common.message.status.success.text;
                    }
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result: DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
                    if (result.length > 0) {
                        result[0].status = Constants.common.message.status.notFound.text;
                    }
                    subscriber.next(result);
                    subscriber.complete();
                    // console.error('couldn\'t be found in your database!');
                }
            });
        });
    }
    private getTrack(): Observable<DocumentTrackModel[]> {
        const transaction = this.indexDB.transaction(['tracks']);
        const objectStore = transaction.objectStore('tracks');
        let request = objectStore.getAll();
        // if (documentName) {
        //     request = objectStore.get(documentName);
        // }else{
        //     request = objectStore.getAll();
        // }
        return new Observable(subscriber => {
            request.onerror = ((event) => {
                console.error('Unable to retrieve daa from database!');
            });
            request.onsuccess = ((event) => {
                // Do something with the request.result!
                if (request.result) {
                    let result: DocumentTrackModel[] = request.result;
                    result.forEach(element => {
                        element.status = Constants.common.message.status.success.text;
                    });
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result: DocumentTrackModel[] = new Array<DocumentTrackModel>();
                    result.forEach(element => {
                        element.status = Constants.common.message.status.notFound.text;
                    });
                    subscriber.next(result);
                    subscriber.complete();
                    //console.error('couldn\'t be found in your database!');
                }
            });
        });
    }

    public compileStyles(styles: string, tagElement?: string,editor?:any) {

        let targetEditor = CKEDITOR.instances[editor] || CKEDITOR.instances[this.documentDataService.nameTemplate];
 
        let style = new CKEDITOR.style({
            element: tagElement || 'span',
            attributes: {
                'style': styles
            }
        });
        console.log(style)
        targetEditor.applyStyle(style);
    }
    public saveDocument(nameDocument, saveobjectTemplate): Observable<string> {
        return new Observable((subscriber) => {
            if (electron) {
                console.log(' ❏ Object for Save :', saveobjectTemplate);
                electron.ipcRenderer.send('request-save-document', JSON.stringify(saveobjectTemplate))
                electron.ipcRenderer.once('reponse-save-document', (event, status) => {
                    subscriber.next(Constants.common.event.load.success)
                    console.log('data has been saved to your file.');
                    //this.eventToParent.emit({ action: Constants.general.event.load.success, data: event })
                });
            } else {
                // console.log("saveobjectTemplate",saveobjectTemplate)
                // const requestTableDoc = this.indexDB.transaction(['documents'], 'readwrite');
                // const objectStoreDoc = requestTableDoc.objectStore('documents');
                //     console.log(' ❏ Object for Save :', saveobjectTemplate);
                //     if (objectStoreDoc.get(nameDocument)) {
                //         let storeDoc =  objectStoreDoc.put(saveobjectTemplate);
                //         storeDoc.onsuccess = (event) => {
                //             subscriber.next(Constants.common.event.load.success)
                //             console.log('data has been updated to your database.');
                //         };
                //         storeDoc.onerror = (error) => {
                //             console.log('data has error',error);
                //         };
                //     } else {
                //         let storeDoc = objectStoreDoc.add(saveobjectTemplate);
                //         storeDoc.onsuccess = (event) => {
                //             subscriber.next(Constants.common.event.load.success)
                //             console.log('data has been added to your database.');
                //         };
                //         storeDoc.onerror = (error) => {
                //             console.log('data has error',error);
                //         };
                //     }
                this.socketIoService.sendData(Constants.document.connect.type.documentSave, saveobjectTemplate).subscribe((result) => {
                    subscriber.next(Constants.common.event.load.success)
                })



            }
        });
    }
    public saveDocumentNav(nameDocument, saveobjectNavTemplate): Observable<string> {
        return new Observable((subscriber) => {
            if (electron) {
                electron.ipcRenderer.send('request-read-document-list', null)
                electron.ipcRenderer.once('reponse-read-document-list', (event, documentList) => {
                    let newDocumentList: DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
                    if (documentList && documentList.length > 0) {
                        if (!documentList.find((document) => document.nameDocument == nameDocument)) {
                            newDocumentList = documentList
                            newDocumentList.push(saveobjectNavTemplate);
                            electron.ipcRenderer.send('request-save-document-list', JSON.stringify(newDocumentList))
                        } else {
                            let indexTargetDocument = documentList.findIndex((document) => document.nameDocument == nameDocument)
                            newDocumentList = documentList;
                            newDocumentList[indexTargetDocument] = saveobjectNavTemplate
                            electron.ipcRenderer.send('request-save-document-list', JSON.stringify(newDocumentList))
                            // this.eventToParent.emit({ action: Constants.general.event.load.success, data: event })
                        }
                    } else {
                        newDocumentList.push(saveobjectNavTemplate);
                        electron.ipcRenderer.send('request-save-document-list', JSON.stringify(newDocumentList))
                    };
                });
                electron.ipcRenderer.once('response-save-document-list', (event, status) => {
                    subscriber.next(Constants.common.event.load.success)
                });
            } else {
                this.socketIoService.sendData(Constants.document.connect.type.documentNavSave, saveobjectNavTemplate).subscribe((result) => {
                    subscriber.next(Constants.common.event.load.success)
                })
                // const requestTableNav = this.indexDB.transaction(['navigators'], 'readwrite');
                // const objectStoreNav = requestTableNav.objectStore('navigators');
                // if (objectStoreNav.get(nameDocument)) {
                //     objectStoreNav.put(saveobjectNavTemplate).onsuccess = (event) => {
                //         subscriber.next(Constants.common.event.load.success)
                //         console.log('data has been updated to your database.');
                //     };
                // } else {
                //     objectStoreNav.add(saveobjectNavTemplate).onsuccess = (event) => {
                //         subscriber.next(Constants.common.event.load.success)
                //         console.log('data has been added to your database.');
                //     };
                // }
            }
        });

    }
    public saveDocumentTrack(nameDocument, saveobjectTrack): Observable<string> {
        return new Observable((subscriber) => {
            if (electron) {
                // console.log(' ❏ Object for Save :', saveobjectTemplate);
                // electron.ipcRenderer.send('request-save-document', JSON.stringify(saveobjectTemplate))
                // electron.ipcRenderer.once('reponse-save-document', (event, status) => {
                //     subscriber.next(Constants.general.event.load.success)
                //     console.log('data has been saved to your file.');
                //     //this.eventToParent.emit({ action: Constants.general.event.load.success, data: event })
                // });
            } else {
                this.socketIoService.sendData(Constants.document.connect.type.documentTrackSave, saveobjectTrack).subscribe((result) => {
                    subscriber.next(Constants.common.event.load.success)
                })
                // const requestTableTrack = this.indexDB.transaction(['tracks'], 'readwrite');
                // const objectStoreTrack = requestTableTrack.objectStore('tracks');
                //     // console.log(' ❏ Object for Save :', saveobjectTrack);
                //     if (objectStoreTrack.get(nameDocument)) {
                //         let storeDoc =  objectStoreTrack.put(saveobjectTrack);
                //         storeDoc.onsuccess = (event) => {
                //             subscriber.next(Constants.common.event.load.success)
                //             console.log('data has been updated to your database.');
                //         };
                //         storeDoc.onerror = (error) => {
                //             console.log('data has error',error);
                //         };
                //     } else {
                //         let storeDoc = objectStoreTrack.add(saveobjectTrack);
                //         storeDoc.onsuccess = (event) => {
                //             subscriber.next(Constants.common.event.load.success)
                //             console.log('data has been added to your database.');
                //         };
                //         storeDoc.onerror = (error) => {
                //             console.log('data has error',error);
                //         };
                //     }

            }
        });
    }
    public uploadFile(files: UploadFileModel[] | FileContentModel[]): Observable<string> {
        return new Observable((subscriber) => {
  
            let numberOfFiles = 0;
            if (files.length > 0) {
                files.forEach(async (file) => {
                    await Storage.put(file.awsFileName, file.data, { contentType: file.data.type })
                        .then(result => {
                            numberOfFiles += 1;
                            if (numberOfFiles === files.length) {
                                console.log("Upload Success")
                                subscriber.next(Constants.common.message.status.success.text);
                            }

                        })
                        .catch(err => subscriber.next(Constants.common.message.status.success.text));
                })
            } else {
                subscriber.next(Constants.common.message.status.success.text);
            }
        })
    }
    public downloadFile(awsFileName: string): Observable<Blob> {
        return new Observable((subscriber) => {
            Storage.get(awsFileName, { download: true }).then((result: any) => {
                let blob = new Blob([result.Body], { type: result.ContentType })
                subscriber.next(blob)
                //  $('#test').attr('href',window.URL.createObjectURL(blob))
                //  $('#test').attr('download',file.fileName)
            });
        })


    }
    // public getFile
    public captureHTML(id): Observable<string> {
        return new Observable((subscriber) => {
            domtoimage.toBlob(document.getElementById(id))
                .then((blob) => {
                    let fileImg = new File([blob], this.documentDataService.currentDocumentName + '.png', { type: "image/png" })
                    let awsFileName = this.commonService.getPatternAWSName(fileImg.name) || 'fileName';
                    let uploadFile: UploadFileModel = {
                        data: fileImg,
                        awsFileName: awsFileName
                    }
                    this.uploadFile([uploadFile]).subscribe(() => {
                        let urlFile = Constants.common.host.storage + awsFileName;
                        subscriber.next(urlFile)
                    });
                });
        });
    }
    public creaetDocumentModel(value): Observable<DocumentModel> {
        return new Observable((subscriber) => {
            // console.log('☛ Result Document from Flie : ', value);
            let result;
            if (Array.isArray(value)) {
                result = value;
                result.forEach(element => {
                    element.status = Constants.common.message.status.success.text;
                });
            }
            else if (value) {
                result = value;
                result.status = Constants.common.message.status.success.text;
            } else {
                result = new DocumentModel();
                result.status = Constants.common.message.status.notFound.text;
            }
            subscriber.next(result);
            subscriber.complete();
            subscriber.next()

        })

    }

    public handleDocumentTrack(nameDocument):Observable<any>{
        return new Observable((subscriber)=>{
            let numberOfCondition = this.documentDataService.currentDocumentTrack.contents.length;
            let numberOfProgress =0;
            // console.log(this.currentDocumentTrack.contents[targetVideoTrackIndex])
            this.documentDataService.currentDocumentTrack.contents.forEach((content) => {
                if(content.contentType === this.contentTypes.video){
                    if(content.conditions.videoCondition.isMustWatchingEnd){
                        numberOfProgress +=content.progress
                    }else if(content.conditions.videoCondition.isClickPlay){
                        numberOfProgress +=100
                    }
                }
                else if(content.contentType === this.contentTypes.subform){
                    let numberOfLinks = content.conditions.subformCondition.isClickLinks.length;
                    let numberOfProgressLink =0;
                    content.conditions.subformCondition.isClickLinks.forEach((link)=>{
                        let documentTrackTarget  = this.documentDataService.documentTracks.find((documentTrack)=>documentTrack.id ===link.linkId);
                        // if(link.isClicked){
                        //     link.progress =  documentTrackTarget.progress;
                        // }
                        link.progress =  documentTrackTarget.progress;
                        numberOfProgressLink +=link.progress;
                        // else if(!content.conditions.subformCondition.haveInDoList){
                        //     numberOfProgressLink +=100;
                        // }

                    });
                    content.progress = numberOfProgressLink/numberOfLinks;
                    numberOfProgress += numberOfProgressLink/numberOfLinks;
                }
            });
            // this.currentDocumentTrack.contents.forEach((content) => {
            //     if()
            // })
    
            this.documentDataService.currentDocumentTrack.progress =   numberOfProgress/numberOfCondition;
            let saveObjectTrackTemplate: DocumentTrackModel = {
                id: this.commonService.getPatternId(nameDocument),
                nameDocument: nameDocument,
                userId: Constants.common.user.id,
                status: Constants.common.message.status.created.text,
                isTrackProgress: this.documentDataService.currentDocumentTrack.contents.length > 0 ? true : false,
                progress: this.documentDataService.currentDocumentTrack.contents.length === 0 ? 100 : this.documentDataService.currentDocumentTrack.progress,
                contents: this.documentDataService.currentDocumentTrack.contents
            }
            console.log('saveObjectTrackTemplate',saveObjectTrackTemplate)
            this.saveDocumentTrack(nameDocument,saveObjectTrackTemplate).subscribe((status)=>{
                subscriber.next(status)
                subscriber.complete();
               // console.log(" this.currentDocumentTrack", this.currentDocumentTrack)          
            });
        })

    }

    // public createDocumentList(){
    //     this.loadDocFromDB().subscribe((document)=>{
    //         console.log('document',document)
    //     })
    //     // this.documentDataService.documentNavList.forEach((documentNav)=>{
    //         // this.getTargetDoc(documentNav.id).subscribe((document) => {
    //         //     this.documentDataService.documentList.push(document);
    //         // })
    //     // })
    // }
    // public getTargetDoc(targetDocumentName): Observable<DocumentModel> {
    //     if (electron) {
    //         return new Observable((subscriber) => {
    //             // console.log("targetDocumentName",targetDocumentName)
    //             electron.ipcRenderer.send('request-read-target-document', targetDocumentName)
    //             electron.ipcRenderer.once('reponse-read-target-document', (event, result) => {
    //                 // console.log(' ❏ Object Document :', result);

    //                 subscriber.next(result);
    //                 subscriber.complete();
    //                 electron.ipcRenderer.removeListener('request-read-target-document', () => { });
    //                 electron.ipcRenderer.removeListener('reponse-read-target-document', () => { });
    //             })
    //         });
    //     } else {

    //         return this.loadDocFromDB(this.commonService.getPatternId(targetDocumentName));
    //     }
    // }

}
