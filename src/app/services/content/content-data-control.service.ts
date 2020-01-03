import { Injectable } from '@angular/core';
import { ContentsModel } from '../../models/document/content.model';
import { Subject, Observable } from 'rxjs';
import { UpdateContentModel } from 'src/app/models/common/common.model';


@Injectable()
export class ContentDataControlService {
    private _currentBox: Subject<JQuery<Element>> = new Subject();
    private _poolContents: ContentsModel = new ContentsModel();
    private _updateContentOption: Subject<UpdateContentModel> = new Subject<UpdateContentModel>();

    
    public getUpdateContentOption(): Observable<UpdateContentModel> {
        return this._updateContentOption.asObservable();
    }
    public set updateContentOption(value:UpdateContentModel) {
        this._updateContentOption.next(value);
    }


    public get poolContents(): ContentsModel {
        return this._poolContents;
    }
    public set poolContents(value: ContentsModel) {
        this._poolContents = value;
    }

    public getcurrentBox(): Observable<JQuery<Element>> {
       return this._currentBox.asObservable();
    }
    public set currentBox(value: JQuery<Element>) {
        this._currentBox.next(value);
    }
    public setLastContent(parentBox:JQuery<Element>){
        parentBox.find('[content-name]').attr('content-last','true')
    }

}