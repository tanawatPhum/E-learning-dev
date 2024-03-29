import { Injectable } from '@angular/core';
import { Constants } from '../../global/constants';
import { Observable } from 'rxjs';
import { DocumentModel } from '../../models/document/content.model';
import { ScreenDetailModel } from 'src/app/models/common/common.model';
import { DocumentNavigatorModel } from 'src/app/models/document/document.model';
import { DocumentService } from './document.service';
import { CommonService } from '../common/common.service';
import { DocumentTrackModel, DocumentEventControllerModel } from '../../models/document/document.model';
declare var electron: any;
@Injectable()
export class DocumentDataControlService {

   // private _currentDocument: string = "New Document32";
    private _currentDocumentNav: DocumentNavigatorModel = new DocumentNavigatorModel();
    private _currentDocumentTrack: DocumentTrackModel = new DocumentTrackModel();
 
    private _contentSize: ScreenDetailModel = new ScreenDetailModel();
    private _documentNavList: DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
    private _documentList: DocumentModel[] = new Array<DocumentModel>();
    private _nameTemplate: string;
    private _currentScreenSize: ScreenDetailModel = new ScreenDetailModel();
    private _previousPage: string;
    private _documentTrack: DocumentTrackModel = new DocumentTrackModel();
    private _documentTracks: DocumentTrackModel[] = new Array<DocumentTrackModel>();
    private _currentResult: DocumentModel = new DocumentModel();
    private _systemReult: DocumentModel = new DocumentModel();

    private _currentDocument: DocumentModel = new DocumentModel();
    public get currentDocument(): DocumentModel {
        return this._currentDocument;
    }
    public set currentDocument(value: DocumentModel) {
        this._currentDocument = value;
    }

    public get systemReult(): DocumentModel {
        return this._systemReult;
    }
    public set systemReult(value: DocumentModel) {
        this._systemReult = value;
    }
    public get currentResult(): DocumentModel {
        return this._currentResult;
    }
    public set currentResult(value: DocumentModel) {
        this._currentResult = value;
    }

    private _lifeCycle: string;
    public get documentTracks(): DocumentTrackModel[] {
        return this._documentTracks;
    }
    public set documentTracks(value: DocumentTrackModel[]) {
        this._documentTracks = value;
    }

    public get currentDocumentTrack(): DocumentTrackModel {
        return this._currentDocumentTrack;
    }
    public set currentDocumentTrack(value: DocumentTrackModel) {
        this._currentDocumentTrack = value;
    }

    public get lifeCycle(): string {
        return this._lifeCycle;
    }
    public set lifeCycle(value: string) {
        this._lifeCycle = value;
    }

    public get documentTrack(): DocumentTrackModel {
        return this._documentTrack;
    }
    public set documentTrack(value: DocumentTrackModel) {
        this._documentTrack = value;
    }
 
    public get previousPage(): string {
        return this._previousPage;
    }
    public set previousPage(value: string) {
        this._previousPage = value;
    }
    public get currentScreenSize(): ScreenDetailModel {
        return this._currentScreenSize;
    }
    public set currentScreenSize(value: ScreenDetailModel) {
        this._currentScreenSize = value;
    }
    public get nameTemplate(): string {
        return this._nameTemplate;
    }
    public set nameTemplate(value: string) {
        this._nameTemplate = value;
    }
    public get documentList(): DocumentModel[] {
        return this._documentList;
    }
    public set documentList(value: DocumentModel[]) {
        this._documentList = value;
    }
    public get documentNavList(): DocumentNavigatorModel[] {
        return this._documentNavList;
    }
    public set documentNavList(value: DocumentNavigatorModel[]) {
        this._documentNavList = value;
    }
    public get contentSize(): ScreenDetailModel {
        return this._contentSize;
    }
    public set contentSize(value: ScreenDetailModel) {
        this._contentSize = value;
    }
    public get currentDocumentNav(): DocumentNavigatorModel {
        return this._currentDocumentNav;
    }
    public set currentDocumentNav(value: DocumentNavigatorModel) {
        this._currentDocumentNav = value;
    }

    public setDocumentEvent(event,data,element){
        let eventobj:DocumentEventControllerModel = new DocumentEventControllerModel();
        eventobj.event = event;
        eventobj.data = data;
        eventobj.element =  element;
        return eventobj;
    }
    // public get currentDocumentName(): string {
    //     return this._currentDocument;
    // }
    // public set currentDocumentName(value: string) {
    //     this._currentDocument = value;
    // }

   
}