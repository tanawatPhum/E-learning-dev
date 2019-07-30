import { Injectable } from '@angular/core';
import { Constants } from '../../global/constants';
import { Observable } from 'rxjs';
import { DocumentModel } from '../../models/document/content.model';
import { DocumentNavigatorModel } from 'src/app/models/document/document.model';
declare var electron: any;
declare var rangy:any;
@Injectable()
export class DocumentService {
    constructor() { }
    public indexDB: any;
    public highlighter:any;
    public loadDocFromDB(documentName): Observable<DocumentModel> {
        return new Observable(subscriber => {
            if(electron){
                electron.ipcRenderer.send('request-read-target-document', documentName)
                electron.ipcRenderer.once('reponse-read-target-document', (event, objectDoc) => {  
                    console.log('☛ Result Document from Flie : ', objectDoc);
                    subscriber.next(objectDoc);
                    subscriber.complete();
                })
            }else{
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
                requestDB.onupgradeneeded = ((event: any) => {
                    const db = event.target.result;
                    // db.createObjectStore('documents', { keyPath: 'id' });
                    db.createObjectStore('navigators', { keyPath: 'id' });
                });
            }

        });
    }
    public loadDocumentNavigatorFromDB(): Observable<DocumentNavigatorModel[]> {
        return new Observable(subscriber => {
            if(electron){
                electron.ipcRenderer.send('request-read-document-list', null)
                electron.ipcRenderer.once('reponse-read-document-list', (event, objectNav) => {
                    subscriber.next(objectNav);
                    subscriber.complete();
                });
            }else{
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
                });
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

    private getDoc(documentName?): Observable<any> {
        const transaction = this.indexDB.transaction(['documents']);
        const objectStore = transaction.objectStore('documents');
        let request;
        if(documentName){
            request =  objectStore.get(documentName)
        }else{
            request =  objectStore.getAll();
        }
        return new Observable(subscriber => {
            request.onerror = ((event) => {
                console.error('Unable to retrieve daa from database!');
            });

            request.onsuccess = ((event) => {
                // Do something with the request.result!
                if (request.result) {
                    let result  = request.result;
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    console.error('couldn\'t be found in your database!');
                }
            });
        });
    }

    private getNavigator(): Observable<any> {
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
                    let result  = request.result;
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    console.error('couldn\'t be found in your database!');
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
                    let result  = request.result;
                    subscriber.next(result);
                    subscriber.complete();
                } else {
                    console.error('couldn\'t be found in your database!');
                }
            });
        });
    }
    public async initialApplierStylesText(styles){
        rangy.init();
        this.highlighter = rangy.createHighlighter();

        // this.highlighter.addClassApplier(rangy.createClassApplier("highlight", {
        //     ignoreWhiteSpace: true,
        //     tagNames: ["span", "a"]
        // }));
        await this.highlighter.addClassApplier(rangy.createClassApplier('content-text', {
            ignoreWhiteSpace: true,
            useExistingElements:false,
            elementTagName: "span",
            elementProperties: {
                // href: "#",
                // id: "test",
                style:styles
                // onclick: () => {
                //     let highlight = this.highlighter.getHighlightForElement(this);
                //     if (window.confirm("Delete this note (ID " + highlight.id + ")?")) {
                //         this.highlighter.removeHighlights([highlight]);
                //     }
                //     return false;
                // }
            }
        }));
    }
    public compileStylesText(){
        // setTimeout(() => {
        //     this.highlighter.unhighlightSelection();
        // }, 3000);
       
    
        this.highlighter.highlightSelection('content-text');
      
        
    }
    public remove(){
        console.log('cxcxcxc');
        this.highlighter.unhighlightSelection();
    }
}
