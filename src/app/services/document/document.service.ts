import { Injectable, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../global/constants';
import { Observable, Subscriber } from 'rxjs';
import { DocumentModel, ContentsModel } from '../../models/document/content.model';
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
import { retry, catchError, map } from 'rxjs/operators';
import { ContentRouting } from '../../app-content-routing';
import { resolve } from 'url';
import { ContentDataControlService } from '../content/content-data-control.service';
import { Router } from '@angular/router';
import { BoxContentModel } from '../../models/document/elements/box-content.model';


Amplify.configure({
    Auth: {
        identityPoolId: 'ap-southeast-1:d9aeac3b-d08f-4051-ac12-435e46b8162b',
        region: 'ap-southeast-1',
        // userPoolId: 'us-east-2_qCW1BuFYV',
        // userPoolWebClientId:'663n1uidmi0ao3lrsk7ldsvv3q'
    },
    Storage: {
        bucket: 'e-learning-dev2',

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
        private contentDCtrlService:ContentDataControlService,
        private commonDataService: CommonDataControlService,
        private commonService: CommonService,
        private socketIoService: SocketIoService,
        private http: HttpClient
    ) {

    }
    private linkType = Constants.document.contents.constats.linkTypes;
    public indexDB: any;
    public highlighter: any;
    private contentTypes = Constants.document.contents.types;
    // public createContent(){
    //     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Img);
    //     const viewContainerRef = this.adHost.viewContainerRef;
    //     viewContainerRef.clear();
    //     const componentRef = viewContainerRef.createComponent(componentFactory);
    // }

    // public initDBDoc(): Observable<any> {
    //     return new Observable(subscriber => {
    //         if (!electron) {
    //             this.socketIoService.sendData(Constants.document.connect.type.documentReadMongoDBToCacheDB).subscribe((status) => {
    //                 //this.creaetDocumentModel(objectDoc).subscribe((result)=>{
    //                 subscriber.next(status);
    //                 subscriber.complete();
    //                 //});
    //             });

    //         }

    //         // const requestDB = window.indexedDB.open('e-learning', 1);
    //         // requestDB.onerror = ((error) => {
    //         //     console.error('error: ', error);
    //         // });
    //         // requestDB.onsuccess = (async (event) => {
    //         //     subscriber.next('Success to initDB');
    //         // })
    //         // requestDB.onupgradeneeded = ((event: any) => {
    //         //     const db = event.target.result;
    //         //     db.createObjectStore('navigators', { keyPath: 'id' });
    //         //     db.createObjectStore('documents', { keyPath: 'id' });
    //         //     db.createObjectStore('tracks', { keyPath: 'id' });
    //         //     subscriber.next('Success to initDB');
    //         // });
    //     })
    // }
    public loadDocFromDB(documentId?, userId?): Observable<DocumentModel> {
        return new Observable(subscriber => {
            let idDoc = documentId || null;
            // if (documentName) {
            //     idDoc = this.c
            // }
            let requestObjDoc = {
                id: idDoc,
                userId: userId || this.commonDataService.userId
            }


            if (electron) {
                // electron.ipcRenderer.send('request-read-target-document', documentName)
                // electron.ipcRenderer.once('reponse-read-target-document', (event, objectDoc) => {
                //     // console.log('☛ Result Document from Flie : ', objectDoc);
                //     subscriber.next(objectDoc);
                //     subscriber.complete();
                // })
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
    public saveDocumentTrack(saveobjectTrack): Observable<string> {
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
                    // let headers = new HttpHeaders({
                    //     'Content-Type': 'multipart/form-data'
                    //   })
                    const formData = new FormData();
                    formData.append('file', file.data);
                    formData.append('name',file.awsFileName)
                    this.http.post<any>(Constants.common.host.serverSite+'/api/uploadFile',formData,{})
                    .pipe(
                      retry(1)
                    ).subscribe((res)=>{
                        subscriber.next(res && Constants.common.host.serverSite + Constants.common.host.getImage+ res['url']);
                    })

                    // await Storage.put(file.awsFileName, file.data, { contentType: file.data.type })
                    //     .then(result => {
                    //         numberOfFiles += 1;
                    //         if (numberOfFiles === files.length) {
                    //             console.log("Upload Success")
                    //             let imgPath = Constants.common.host.storage + file.awsFileName;
                    //             subscriber.next(imgPath);
                    //         }

                    //     })
                    //     .catch(err => subscriber.next(Constants.common.message.status.fail.text));
                })
            } else {
                subscriber.next(Constants.common.message.status.success.text);
            }
        })
    }
    public downloadFile(targetFile: string): Observable<Blob> {
        return new Observable((subscriber) => {

        fetch(targetFile)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                subscriber.next(blob)
              // Here's where you get access to the blob
              // And you can use it for whatever you want
              // Like calling ref().put(blob)
          
              // Here, I use it to make an image appear on the page
            //   let objectURL = URL.createObjectURL(blob);
            //   let myImage = new Image();
            //   myImage.src = objectURL;
            //   document.getElementById('myImg').appendChild(myImage)
          });

            // this.http.get<any>(Constants.common.host.serverSite + Constants.common.host.getImage+awsFileName).subscribe(()=>{

            // })
            // Storage.get(awsFileName, { download: true }).then((result: any) => {
            //     let blob = new Blob([result.Body], { type: result.ContentType })
            //     subscriber.next(blob)
            //     //  $('#test').attr('href',window.URL.createObjectURL(blob))
            //     //  $('#test').attr('download',file.fileName)
            // });
        })


    }
    // public getFile
    public captureHTML(id): Observable<string> {
        return new Observable((subscriber) => {
            // html2canvas(document.getElementById(id)).then(canvas => {
            //     var blobBin = atob(canvas.toDataURL().split(',')[1]);
            //     var array = [];
            //     for(var i = 0; i < blobBin.length; i++) {
            //         array.push(blobBin.charCodeAt(i));
            //     }
            //     let newBlob=new Blob([new Uint8Array(array)], {type: 'image/png'})
            //     let fileImg = new File([newBlob], this.documentDataService.currentDocumentName + '.png', { type: "image/png" })
            //     let awsFileName = this.commonService.getPatternAWSName(fileImg.name) || 'fileName';
            //     let uploadFile: UploadFileModel = {
            //         data: fileImg,
            //         awsFileName: awsFileName
            //     }
            //     this.uploadFile([uploadFile]).subscribe(() => {
            //         let urlFile = Constants.common.host.storage + awsFileName;
            //         subscriber.next(urlFile)
            //     });
            // });
    

            domtoimage.toBlob(document.getElementById(id))
                .then((blob) => {
             
                    let fileImg = new File([blob], this.documentDataService.currentDocument.nameDocument + '.png', { type: "image/png" })
                    let awsFileName = this.commonService.getPatternAWSName(fileImg.name) || 'fileName';
                    let uploadFile: UploadFileModel = {
                        data: fileImg,
                        awsFileName: awsFileName
                    }
                    this.uploadFile([uploadFile]).subscribe((url) => {
                        // let urlFile = Constants.common.host.storage + awsFileName;
                        subscriber.next(url)
                    });
            });
        });
    }
    public getBase64Image(imgUrl) {
        return new Promise((resolve,reject)=>{ 
            var img = new Image();
            img.crossOrigin="anonymous" 

            setTimeout(() => {
                img.src = imgUrl;
                // onload fires when the image is fully loadded, and has width and height
            
                img.onload = ()=>{
            
                  var canvas = document.createElement("canvas");
                  canvas.width = img.width;
                  canvas.height = img.height;
                  var ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0);
                  var dataURL = canvas.toDataURL("image/png"),
                      dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
          
                  resolve(dataURL) 
                 
            
                };
                img.onerror = ()=> {
                  reject("The image could not be loaded.");
                }            
            }, 500);
    

          // set attributes and src
        })

    
    }
    // public dataURItoBlob(dataURI) {
    //     // convert base64 to raw binary data held in a string
    //     // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    //     var byteString = atob(decodeURIComponent(dataURI.split(',')[1]));
    
    //     // separate out the mime component
    //     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
    //     // write the bytes of the string to an ArrayBuffer
    //     var ab = new ArrayBuffer(byteString.length);
    //     var ia = new Uint8Array(ab);
    //     for (var i = 0; i < byteString.length; i++) {
    //         ia[i] = byteString.charCodeAt(i);
    //     }
    
    //     //Old Code
    //     //write the ArrayBuffer to a blob, and you're done
    //     //var bb = new BlobBuilder();
    //     //bb.append(ab);
    //     //return bb.getBlob(mimeString);
    
    //     //New Code
    //     return new Blob([ab], {type: mimeString});
    // }
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

    public handleDocumentTrack(currentDocument:DocumentModel,documentTrack:DocumentTrackModel,contents:ContentsModel, userId?):Observable<any>{
        return new Observable((subscriber)=>{
            let numberOfCondition = documentTrack.contents.length;
            let numberOfProgress =0;
            let isMustVideoWatchEnd = false;
            // console.log(this.currentDocumentTrack.contents[targetVideoTrackIndex])
            documentTrack.contents.forEach((content) => {
                if(content.contentType === this.contentTypes.video){
                    if(content.conditions.videoCondition.isMustWatchingEnd){
                        numberOfProgress +=content.progress
                        isMustVideoWatchEnd = true;
                    }else if(content.conditions.videoCondition.isClickPlay){
                        numberOfProgress +=100
                    }
                }
                else if(content.contentType === this.contentTypes.link){
                    if(content.conditions.linkCondition.linkType  ===  this.linkType.document){
                        let documentTrackTarget  = this.documentDataService.documentTracks.find((documentTrack)=>documentTrack.id ===content.conditions.linkCondition.linkId);
                        content.conditions.linkCondition.progress  = documentTrackTarget.progress;
                    }else if(content.conditions.linkCondition.linkType  ===  this.linkType.url){
                        if(content.conditions.linkCondition.isClicked){
                            content.conditions.linkCondition.progress  = 100;
                        }
                    }
                    content.progress =  content.conditions.linkCondition.progress;
                    numberOfProgress +=content.progress
                }


                // else if(content.contentType === this.contentTypes.subform){
                //     let numberOfLinks = content.conditions.subformCondition.isClickLinks.length;
                //     let numberOfProgressLink =0;
                //     content.conditions.subformCondition.isClickLinks.forEach((link)=>{
                //         let documentTrackTarget  = this.documentDataService.documentTracks.find((documentTrack)=>documentTrack.id ===link.linkId);
                //         // if(link.isClicked){
                //         //     link.progress =  documentTrackTarget.progress;
                //         // }
                //         link.progress =  documentTrackTarget.progress;
                //         numberOfProgressLink +=link.progress;
                //         // else if(!content.conditions.subformCondition.haveInDoList){
                //         //     numberOfProgressLink +=100;
                //         // }

                //     });
                //     content.progress = numberOfProgressLink/numberOfLinks;
                //     numberOfProgress += numberOfProgressLink/numberOfLinks;
                // }
            });
            documentTrack.rawProgress = (numberOfProgress/numberOfCondition)|| 0;

            if(contents.todoList.length === 0){
                if(isMustVideoWatchEnd){
                    documentTrack.progress =   numberOfProgress/numberOfCondition;
                }else{
                    documentTrack.progress = 100;
                }
            }else{
                contents.todoList.forEach((todolist,index)=>{
                    todolist.toDoListOrder.forEach((task)=>{
                        documentTrack.contents.forEach((content)=>{
                            let targetContent = task.objectTodoList.find((obj)=>content.parentId === obj.id)
                            if(!targetContent && !isMustVideoWatchEnd){
                                numberOfCondition -=1;
                                numberOfProgress -=content.progress;
                                
                            }

                        })    
                    })
                    if(index === contents.todoList.length-1 ){
                        documentTrack.progress =   numberOfProgress/numberOfCondition;
                    }
    
                })
            }
       
            if(this.documentDataService.currentDocumentTrack.id === documentTrack.id){
                this.documentDataService.currentDocumentTrack =  this.documentDataService.documentTrack  = documentTrack;
            }
            let saveObjectTrackTemplate: DocumentTrackModel = {
                id: currentDocument.id,
                nameDocument: currentDocument.nameDocument,
                userId: userId || this.commonDataService.userId,
                status: Constants.common.message.status.created.text,
                isTrackProgress: documentTrack.contents.length > 0 ? true : false,
                progress: documentTrack.contents.length === 0 ? 100 : documentTrack.progress,
                rawProgress:documentTrack.rawProgress,
                contents:documentTrack.contents
            }
            console.log('saveObjectTrackTemplate',saveObjectTrackTemplate)
            this.saveDocumentTrack(saveObjectTrackTemplate).subscribe((status)=>{
                subscriber.next(status)
                subscriber.complete();
               // console.log(" this.currentDocumentTrack", this.currentDocumentTrack)          
            });
        })

    }
    public loadImage(url,originalPath){
    
       return this.http.get(url+'?originalPath='+originalPath ,{ responseType: 'text' }) 
    }

    public getComponentType(type){
        
       if(/image\//.test(type)){
        return 'img-content';
       }
       else if(/video\//.test(type)){
        return 'video-content';
       }
       else if(/application\//.test(type)){
        return 'file-content';
       }
    //    else if(
    //     type ==='image/apng'||
    //     type ==='image/bmp'||
    //     type ==='image/gif'||
    //     type ==='image/x-icon'||
    //     type ==='image/jpeg'||
    //     type ==='image/png'||
    //     type ==='image/svg+xml'||
    //     type ==='image/tiff'||
    //     type === 'image/webp'
    //    ){
  
    //    }
    }
    public getBoxContentPreview(box:BoxContentModel){
       return  `
        <div contenteditable="false" id="${box.id}" class="content-box freedom-layout"
        style="
        top:${box.htmlDetail.top}px;left:${box.htmlDetail.left}px;
        height:${box.htmlDetail.height}px;width:${box.htmlDetail.width}px;
        z-index:${box.htmlDetail.level};
        position:absolute;
        cursor: default;
        "
        name="${box.name}" ><${box.htmlDetail.selector} class="full-screen"></${box.htmlDetail.selector}></div>`
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
