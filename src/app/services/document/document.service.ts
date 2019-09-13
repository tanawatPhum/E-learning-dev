import { Injectable } from '@angular/core';
import { Constants } from '../../global/constants';
import { Observable, Subscriber } from 'rxjs';
import { DocumentModel } from '../../models/document/content.model';
import { DocumentNavigatorModel } from 'src/app/models/document/document.model';
import { DocumentDataControlService } from './document-data-control.service';
import html2canvas from 'html2canvas';
import { CommonService } from '../common/common.service';
import { CommonResponseModel } from 'src/app/models/common/common.model';
import { DocumentTrackModel } from '../../models/document/document.model';
import { FileContentModel } from '../../models/document/elements/file-content.model';
import Amplify, { Storage, Auth } from 'aws-amplify';
import { async } from '@angular/core/testing';
import { constants } from 'os';
import { SocketIoService } from '../common/socket.service';
import { CommonDataControlService } from '../common/common-data-control.service';

declare var electron: any;
declare var rangy: any;
declare var CKEDITOR: any;
@Injectable()
export class DocumentService {
    constructor(
        private documentDataControlService: DocumentDataControlService,
        private commonDataService:CommonDataControlService,
        private commonService:CommonService,
        private socketIoService:SocketIoService
    ) {

    }
    public indexDB: any;
    public highlighter: any;
    public initDBDoc(): Observable<any> {
        return new Observable(subscriber => {
            const requestDB = window.indexedDB.open('e-learning', 1);
            requestDB.onerror = ((error) => {
                console.error('error: ', error);
            });
            requestDB.onsuccess = (async (event) => {
                subscriber.next('Success to initDB');
            })
            requestDB.onupgradeneeded = ((event: any) => {
                const db = event.target.result;
                db.createObjectStore('navigators', { keyPath: 'id' });
                db.createObjectStore('documents', { keyPath: 'id' });
                db.createObjectStore('tracks', { keyPath: 'id' });
                subscriber.next('Success to initDB');
            });
        })
    }
    public loadDocFromDB(documentName): Observable<DocumentModel> {
        return new Observable(subscriber => {
            let requestObjDoc =  {
                id:this.commonService.getPatternId(documentName),
                userId:this.commonDataService.userId
            }
            if (electron) {
                electron.ipcRenderer.send('request-read-target-document', documentName)
                electron.ipcRenderer.once('reponse-read-target-document', (event, objectDoc) => {
                    // console.log('☛ Result Document from Flie : ', objectDoc);
                    subscriber.next(objectDoc);
                    subscriber.complete();
                })
            } else {
                // this.socketIoService.sendData(Constants.document.connect.type.documentRead,requestObjDoc).subscribe((objectDoc)=>{
                //     console.log("objectDoc",objectDoc)
                //    this.creaetDocumentModel(objectDoc).subscribe((result)=>{
                //         subscriber.next(result);
                //         subscriber.complete();
                //    });
                // });
                const requestDB = window.indexedDB.open('e-learning', 1);
                requestDB.onerror = ((error) => {
                    console.error('error: ', error);
                });
                requestDB.onsuccess = (async (event) => {
                    this.indexDB = requestDB.result;
                    this.getDoc(documentName).subscribe((objectDoc) => {
                        console.log('☛ Result Document from Database : ', objectDoc);
                        subscriber.next(objectDoc);
                        subscriber.complete();
                    });
                });
            }

        });
    }
    public loadDocumentNavigatorFromDB(): Observable<DocumentNavigatorModel[]> {
        return new Observable(subscriber => {
            let requestObjDocNav =  {
                userId:this.commonDataService.userId
            }
            if (electron) {
                electron.ipcRenderer.send('request-read-document-list', null)
                electron.ipcRenderer.once('reponse-read-document-list', (event, objectNav) => {
                    subscriber.next(objectNav);
                    subscriber.complete();
                });
            } else {
                // this.socketIoService.sendData(Constants.document.connect.type.documentNavRead,requestObjDocNav).subscribe((objectDocNav)=>{
                //     console.log('objectDocNav',objectDocNav)
                //     if(!objectDocNav){
                //         objectDocNav = new Array<DocumentNavigatorModel>();
                //     }
                //         subscriber.next(objectDocNav);
                //         subscriber.complete();
                //  });
                // this.creaetDocumentModel(objectDoc).subscribe((result)=>{
                //     subscriber.next(result);
                // })
                const requestDB = window.indexedDB.open('e-learning', 1);
                requestDB.onerror = ((error) => {
                    console.error('error: ', error);
                });
                requestDB.onsuccess = (async (event) => {
                    this.indexDB = requestDB.result;
                    this.getNavigator().subscribe((objectNav) => {
                        console.log('☛ Result Document Navigator from Database : ', objectNav);
                        subscriber.next(objectNav);
                        subscriber.complete();
                    });
                });
                requestDB.onupgradeneeded = ((event: any) => {
                    const db = event.target.result;
                    db.createObjectStore('navigators', { keyPath: 'id' });
                    db.createObjectStore('documents', { keyPath: 'id' });
                });
            }

        });
    }
    public loadDocTrackFromDB(): Observable<DocumentTrackModel[]> {
        return new Observable(subscriber => {
            let requestObjDocTrack =  {
                userId:this.commonDataService.userId
            }
            if (electron) {
                // electron.ipcRenderer.send('request-read-target-document', documentName)
                // electron.ipcRenderer.once('reponse-read-target-document', (event, objectDoc) => {
                //     console.log('☛ Result Document from Flie : ', objectDoc);
                //     subscriber.next(objectDoc);
                //     subscriber.complete();
                // })
            } else {
                // this.socketIoService.sendData(Constants.document.connect.type.documentTrackRead,requestObjDocTrack).subscribe((objectDocNav)=>{
                //     subscriber.next(objectDocNav);
                //     subscriber.complete();
                // });

                const requestDB = window.indexedDB.open('e-learning', 1);
                requestDB.onerror = ((error) => {
                    console.error('error: ', error);
                });
                requestDB.onsuccess = (async (event) => {
                    this.indexDB = requestDB.result;
                    this.getTrack().subscribe((objectDoc) => {
                        console.log('☛ Result track from Database : ', objectDoc);
                        subscriber.next(objectDoc);
                        subscriber.complete();
                    });
                });
            }

        });
    }
    public deleteDocument(documentName:string):Observable<string>{
        return new Observable(subscriber => {
            let dbDocRequest = window.indexedDB.open("documents");
            dbDocRequest.onsuccess = (event)=> {
                    const transaction = this.indexDB.transaction(['documents'], 'readwrite');
                    const objectStore = transaction.objectStore('documents');
                    let request = objectStore.delete(documentName)
                    request.onerror = ((event) => {
                        console.error('cannot delete document !');
                    });
                    // request.onsuccess = ((event) => {
                    //     subscriber.next(Constants.general.message.status.success.text);
                    // }); 
                let dbNavRequest = window.indexedDB.open("navigators");
                dbNavRequest.onsuccess = (event)=> {
                    const transaction = this.indexDB.transaction(['navigators'], 'readwrite');
                    const objectStore = transaction.objectStore('navigators');
                    let request = objectStore.delete(documentName)
                    request.onerror = ((event) => {
                        console.error('cannot delete document navigator !');
                        subscriber.next(Constants.common.message.status.fail.text);
                    });
                    request.onsuccess = ((event) => {
                        subscriber.next(Constants.common.message.status.success.text);
                    }); 
                }
                let dbTrackRequest = window.indexedDB.open("tracks");
                dbTrackRequest.onsuccess = (event)=> {
                    const transaction = this.indexDB.transaction(['tracks'], 'readwrite');
                    const objectStore = transaction.objectStore('tracks');
                    let request = objectStore.delete(documentName)
                    request.onerror = ((event) => {
                        console.error('cannot delete document track !');
                        subscriber.next(Constants.common.message.status.fail.text);
                    });
                    request.onsuccess = ((event) => {
                        subscriber.next(Constants.common.message.status.success.text);
                    }); 
                }
            }
            
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
                    let result:DocumentModel = request.result;
                    result.status = Constants.common.message.status.success.text;
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result:DocumentModel = new DocumentModel();
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
                    let result:DocumentModel = request.result;
                    result.status = Constants.common.message.status.success.text;
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result:DocumentModel = new DocumentModel();
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
                    let result:DocumentNavigatorModel[] = request.result;
                    if(result.length > 0){
                        result[0].status = Constants.common.message.status.success.text; 
                    }
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result:DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
                    if(result.length > 0){
                        result[0].status  = Constants.common.message.status.notFound.text;
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
        let request  = objectStore.getAll();
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
                    let result:DocumentTrackModel[] = request.result;
                    result.forEach(element => {
                        element.status = Constants.common.message.status.success.text;
                    });
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result:DocumentTrackModel[] = new Array<DocumentTrackModel>();
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

    public compileStyles(styles: string, tagElement?: string) {
        let editor = CKEDITOR.instances[this.documentDataControlService.nameTemplate];
        let style = new CKEDITOR.style({
            element: tagElement || 'span',
            attributes: {
                'style': styles
            }
        });
        editor.applyStyle(style);
    }
    public saveDocument(nameDocument,saveobjectTemplate):Observable<string>{
        return new Observable((subscriber)=>{
            if (electron) {
                console.log(' ❏ Object for Save :', saveobjectTemplate);
                electron.ipcRenderer.send('request-save-document', JSON.stringify(saveobjectTemplate))
                electron.ipcRenderer.once('reponse-save-document', (event, status) => {
                    subscriber.next(Constants.common.event.load.success)
                    console.log('data has been saved to your file.');
                    //this.eventToParent.emit({ action: Constants.general.event.load.success, data: event })
                });
            }else{
                console.log("saveobjectTemplate",saveobjectTemplate)
                const requestTableDoc = this.indexDB.transaction(['documents'], 'readwrite');
                const objectStoreDoc = requestTableDoc.objectStore('documents');
                    console.log(' ❏ Object for Save :', saveobjectTemplate);
                    if (objectStoreDoc.get(nameDocument)) {
                        let storeDoc =  objectStoreDoc.put(saveobjectTemplate);
                        storeDoc.onsuccess = (event) => {
                            subscriber.next(Constants.common.event.load.success)
                            console.log('data has been updated to your database.');
                        };
                        storeDoc.onerror = (error) => {
                            console.log('data has error',error);
                        };
                    } else {
                        let storeDoc = objectStoreDoc.add(saveobjectTemplate);
                        storeDoc.onsuccess = (event) => {
                            subscriber.next(Constants.common.event.load.success)
                            console.log('data has been added to your database.');
                        };
                        storeDoc.onerror = (error) => {
                            console.log('data has error',error);
                        };
                    }
                    // this.socketIoService.sendData(Constants.document.connect.type.documentSave, saveobjectTemplate).subscribe((result)=>{
                    //     subscriber.next(Constants.common.event.load.success)
                    // })

                

            }
        });
    }
    public saveDocumentNav(nameDocument,saveobjectNavTemplate):Observable<string>{
        return new Observable((subscriber)=>{
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
            }else{
                // this.socketIoService.sendData(Constants.document.connect.type.documentNavSave,saveobjectNavTemplate).subscribe((result)=>{
                //     subscriber.next(Constants.common.event.load.success)
                // })
                const requestTableNav = this.indexDB.transaction(['navigators'], 'readwrite');
                const objectStoreNav = requestTableNav.objectStore('navigators');
                if (objectStoreNav.get(nameDocument)) {
                    objectStoreNav.put(saveobjectNavTemplate).onsuccess = (event) => {
                        subscriber.next(Constants.common.event.load.success)
                        console.log('data has been updated to your database.');
                    };
                } else {
                    objectStoreNav.add(saveobjectNavTemplate).onsuccess = (event) => {
                        subscriber.next(Constants.common.event.load.success)
                        console.log('data has been added to your database.');
                    };
                }
            }
        });
        
    }
    public saveDocumentTrack(nameDocument,saveobjectTrack):Observable<string>{
        return new Observable((subscriber)=>{
            if (electron) {
                // console.log(' ❏ Object for Save :', saveobjectTemplate);
                // electron.ipcRenderer.send('request-save-document', JSON.stringify(saveobjectTemplate))
                // electron.ipcRenderer.once('reponse-save-document', (event, status) => {
                //     subscriber.next(Constants.general.event.load.success)
                //     console.log('data has been saved to your file.');
                //     //this.eventToParent.emit({ action: Constants.general.event.load.success, data: event })
                // });
            }else{
                // this.socketIoService.sendData(Constants.document.connect.type.documentTrackSave,saveobjectTrack).subscribe((result)=>{
                //     subscriber.next(Constants.common.event.load.success)
                // })
                const requestTableTrack = this.indexDB.transaction(['tracks'], 'readwrite');
                const objectStoreTrack = requestTableTrack.objectStore('tracks');
                    // console.log(' ❏ Object for Save :', saveobjectTrack);
                    if (objectStoreTrack.get(nameDocument)) {
                        let storeDoc =  objectStoreTrack.put(saveobjectTrack);
                        storeDoc.onsuccess = (event) => {
                            subscriber.next(Constants.common.event.load.success)
                            console.log('data has been updated to your database.');
                        };
                        storeDoc.onerror = (error) => {
                            console.log('data has error',error);
                        };
                    } else {
                        let storeDoc = objectStoreTrack.add(saveobjectTrack);
                        storeDoc.onsuccess = (event) => {
                            subscriber.next(Constants.common.event.load.success)
                            console.log('data has been added to your database.');
                        };
                        storeDoc.onerror = (error) => {
                            console.log('data has error',error);
                        };
                    }

            }
        });
    }
    public uploadFile(files:FileContentModel[]):Observable<string>{
        return new Observable((subscriber)=>{
            Amplify.configure({
                Auth: {
                    identityPoolId: 'us-east-2:b1d020f3-2250-4e5f-beed-0fd588b8a01c',
                    region: 'us-east-2',
                    userPoolId: 'us-east-2_qCW1BuFYV',
                    userPoolWebClientId:'663n1uidmi0ao3lrsk7ldsvv3q'
                },
                Storage: {
                    bucket: 'e-learning-dev',
                }
            });
            let numberOfFiles  = 0;
            if(files.length>0){
                files.forEach(async (file)=>{
                    console.log(file)
                    await Storage.put(file.awsFileName, file.data,{contentType: file.data.type})
                     .then (result => {
                         numberOfFiles += 1;
                         if(numberOfFiles === files.length){
                             subscriber.next(Constants.common.message.status.success.text);
                         }
                     })
                     .catch(err => console.error('upload file ams error',err));
                 })  
            }else{
                subscriber.next(Constants.common.message.status.success.text);
            }
        })
    }
    public downloadFile(awsFileName:string):Observable<Blob>{
        return new Observable((subscriber)=>{
            Storage.get(awsFileName,{download: true}).then((result:any)=>{
                let blob=new Blob([result.Body],{type: result.ContentType})
                subscriber.next(blob)
               //  $('#test').attr('href',window.URL.createObjectURL(blob))
               //  $('#test').attr('download',file.fileName)
               });
        })

 
     }
    // public getFile
    public captureHTML(id):Observable<string>{
        return new Observable((subscriber)=>{
            html2canvas(document.querySelector('#'+id)).then((canvas)=>{
                let imgdata = canvas.toDataURL('image/png');
                subscriber.next(imgdata)             
            });
        });
    }

    public creaetDocumentModel(value):Observable<DocumentModel>{
        return new Observable((subscriber)=>{
            // console.log('☛ Result Document from Flie : ', value);
            let result:DocumentModel;
            if(value){
                result = value;
                result.status = Constants.common.message.status.success.text;
            }else{
                result=  new DocumentModel();
                result.status = Constants.common.message.status.notFound.text;
            }
            subscriber.next(result);
            subscriber.complete();
            subscriber.next()

        })

    }
    
}
