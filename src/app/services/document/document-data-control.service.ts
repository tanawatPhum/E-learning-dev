import { Injectable } from '@angular/core';
import { Constants } from '../../global/constants';
import { Observable } from 'rxjs';
import { DocumentModel } from '../../models/document/content.model';
import { ScreenDetailModel } from 'src/app/models/common/common.model';
import { DocumentNavigatorModel } from 'src/app/models/document/document.model';

@Injectable()
export class DocumentDataControlService {
    private _currentDocument: string = "New Document1";
    private _currentDocumentNav: string = "New Document1";
    private _contentSize: ScreenDetailModel = new ScreenDetailModel();
    private _documentNavList: DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
    private _documentList: DocumentModel[] = new Array<DocumentModel>();
    private _nameTemplate: string;
    private _currentScreenSize: ScreenDetailModel = new ScreenDetailModel();
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
    public get currentDocumentNav(): string {
        return this._currentDocumentNav;
    }
    public set currentDocumentNav(value: string) {
        this._currentDocumentNav = value;
    }
    public get currentDocumentName(): string {
        return this._currentDocument;
    }
    public set currentDocumentName(value: string) {
        this._currentDocument = value;
    }
}