import { Injectable } from '@angular/core';
import { Constants } from '../../global/constants';
import { Observable } from 'rxjs';
import { DocumentModel } from '../../models/document/content.model';
import { ScreenDetailModel } from 'src/app/models/general/general.model';

@Injectable()
export class DocumentDataControlService {
    private _currentDocument: string;
    private _contentSize: ScreenDetailModel = new ScreenDetailModel();
    public get contentSize(): ScreenDetailModel {
        return this._contentSize;
    }
    public set contentSize(value: ScreenDetailModel) {
        this._contentSize = value;
    }
    public get currentDocument(): string {
        return this._currentDocument;
    }
    public set currentDocument(value: string) {
        this._currentDocument = value;
    }
}