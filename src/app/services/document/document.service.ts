import { Injectable } from '@angular/core';
import { Constants } from '../../global/constants';
import { Observable } from 'rxjs';
import { DocumentModel } from '../../models/document/content.model';

@Injectable()
export class DocumentService {
    constructor() { }
    public indexDB: any;
    public loadHTMLFromDB(documentName?): Observable<DocumentModel[]> {
        return new Observable(subscriber => {
            const requestDB = window.indexedDB.open('e-learning', 1);
            requestDB.onerror = ((error) => {
                console.error('error: ', error);
            });
            requestDB.onsuccess = (async (event) => {
                this.indexDB = requestDB.result;
                this.getHTML(documentName).subscribe((objectHTML) => {
                    console.log('☛ Result from Database : ', objectHTML);
                    subscriber.next(objectHTML);
                    subscriber.complete();
                });
            });
            requestDB.onupgradeneeded = ((event: any) => {
                const db = event.target.result;
                const objectStore = db.createObjectStore('templates', { keyPath: 'id' });
            });
        });
    }
    private getHTML(documentName?): Observable<any> {
        const transaction = this.indexDB.transaction(['templates']);
        const objectStore = transaction.objectStore('templates');
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
}
