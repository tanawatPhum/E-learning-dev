import { Injectable } from '@angular/core';
import { Constants } from '../../global/constants';
import { Observable, Subscriber } from 'rxjs';
import { DocumentModel } from '../../models/document/content.model';
import { DocumentNavigatorModel } from 'src/app/models/document/document.model';
import { DocumentDataControlService } from './document-data-control.service';
import html2canvas from 'html2canvas';
import { CommonService } from '../common/common.service';
import { CommonResponseModel } from 'src/app/models/general/general.model';
declare var electron: any;
declare var rangy: any;
declare var CKEDITOR: any;
@Injectable()
export class DocumentService {
    constructor(
        private documentDataControlService: DocumentDataControlService,
        private commonService:CommonService
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
                subscriber.next('Success to initDB');
            });
        })
    }
    public loadDocFromDB(documentName): Observable<DocumentModel> {
        return new Observable(subscriber => {
            if (electron) {
                electron.ipcRenderer.send('request-read-target-document', documentName)
                electron.ipcRenderer.once('reponse-read-target-document', (event, objectDoc) => {
                    console.log('☛ Result Document from Flie : ', objectDoc);
                    subscriber.next(objectDoc);
                    subscriber.complete();
                })
            } else {
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
                // requestDB.onupgradeneeded = ((event: any) => {
                //     const db = event.target.result;
                //     db.createObjectStore('documents', { keyPath: 'id' });
                //     db.createObjectStore('navigators', { keyPath: 'id' });
                // });
            }

        });
    }
    public loadDocumentNavigatorFromDB(): Observable<DocumentNavigatorModel[]> {
        return new Observable(subscriber => {
            if (electron) {
                electron.ipcRenderer.send('request-read-document-list', null)
                electron.ipcRenderer.once('reponse-read-document-list', (event, objectNav) => {
                    subscriber.next(objectNav);
                    subscriber.complete();
                });
            } else {
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
                // requestDB.onupgradeneeded = ((event: any) => {
                //     const db = event.target.result;
                //     db.createObjectStore('navigators', { keyPath: 'id' });
                //     db.createObjectStore('documents', { keyPath: 'id' });
                // });
            }

        });
    }
    public loadTempDocumentNavigatorFromDB(): Observable<DocumentNavigatorModel[]> {
        return new Observable(subscriber => {
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
                db.createObjectStore('temp-navigators', { keyPath: 'id' });
            });
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
                        subscriber.next(Constants.general.message.status.fail.text);
                    });
                    request.onsuccess = ((event) => {
                        subscriber.next(Constants.general.message.status.success.text);
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
                    result.status = Constants.general.message.status.success.text;
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result:DocumentModel = new DocumentModel();
                    result.status = Constants.general.message.status.notFound.text;
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
                        result[0].status = Constants.general.message.status.success.text; 
                    }
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    let result:DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
                    if(result.length > 0){
                        result[0].status  = Constants.general.message.status.notFound.text;
                    }
                    subscriber.next(result);
                    subscriber.complete();
                   // console.error('couldn\'t be found in your database!');
                }
            });
        });
    }
    private getTempNavigator(): Observable<any> {
        const transaction = this.indexDB.transaction(['temp-navigators']);
        const objectStore = transaction.objectStore('temp-navigators');
        let request = objectStore.getAll();
        return new Observable(subscriber => {
            request.onerror = ((event) => {
                console.error('Unable to retrieve daa from database!');
            });

            request.onsuccess = ((event) => {
                // Do something with the request.result!
                if (request.result) {
                    let result = request.result;
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                   // console.error('couldn\'t be found in your database!');
                }
            });
        });
    }
    
    // public initCKeditor(){
    //     CKEDITOR.replace( this.documentDataControlService.nameTemplate, {
    //         toolbar: [],
    //         removePlugins :'elementspath,save,font,resize',
    //         on: {
    //             loaded: ()=> {
    //                 $(document).find('#cke_1_top').remove();  
    //             }
    //         }
    //     });
    // }
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
                    subscriber.next(Constants.general.event.load.success)
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
                            subscriber.next(Constants.general.event.load.success)
                            console.log('data has been updated to your database.');
                        };
                        storeDoc.onerror = (error) => {
                            console.log('data has error',error);
                        };
                    } else {
                        let storeDoc = objectStoreDoc.add(saveobjectTemplate);
                        storeDoc.onsuccess = (event) => {
                            subscriber.next(Constants.general.event.load.success)
                            console.log('data has been added to your database.');
                        };
                        storeDoc.onerror = (error) => {
                            console.log('data has error',error);
                        };
                    }

            }
        });
    }
    public saveNavDocument(nameDocument,saveobjectNavTemplate):Observable<string>{
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
                    subscriber.next(Constants.general.event.load.success)
                });
            }else{
                const requestTableNav = this.indexDB.transaction(['navigators'], 'readwrite');
                const objectStoreNav = requestTableNav.objectStore('navigators');
                if (objectStoreNav.get(nameDocument)) {
                    objectStoreNav.put(saveobjectNavTemplate).onsuccess = (event) => {
                        subscriber.next(Constants.general.event.load.success)
                        console.log('data has been updated to your database.');
                    };
                } else {
                    objectStoreNav.add(saveobjectNavTemplate).onsuccess = (event) => {
                        subscriber.next(Constants.general.event.load.success)
                        console.log('data has been added to your database.');
                    };
                }
            }
        });
        
    }
    public captureHTML(id):Observable<string>{
        return new Observable((subscriber)=>{
            html2canvas(document.querySelector('#'+id)).then((canvas)=>{
                let imgdata = canvas.toDataURL('image/png');
                subscriber.next(imgdata)             
            });
        });
    }
}
