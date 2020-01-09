import { Injectable } from '@angular/core';
import { ContentsModel } from '../../models/document/content.model';
import { Subject, Observable } from 'rxjs';
import { UpdateContentModel } from 'src/app/models/common/common.model';
import { ToDoListCurrentModel } from 'src/app/models/document/elements/todoList-content.model';


@Injectable()
export class ContentDataControlService {
    private _currentBox: Subject<JQuery<Element>> = new Subject();
    private _poolContents: ContentsModel = new ContentsModel();
    private _updateContent: Subject<UpdateContentModel> = new Subject<UpdateContentModel>();
    private _currentSelectTaskList: ToDoListCurrentModel[] = new Array<ToDoListCurrentModel>();

 

    
    public getUpdateContent(): Observable<UpdateContentModel> {
        return this._updateContent.asObservable();
    }
    public set updateContent(value:UpdateContentModel) {
        this._updateContent.next(value);
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
    public get currentSelectTaskList(): ToDoListCurrentModel[] {
        return this._currentSelectTaskList;
    }
    public set currentSelectTaskList(value: ToDoListCurrentModel[]) {
        this._currentSelectTaskList = value;
    }
    public set currentBox(value: JQuery<Element>) {
        this._currentBox.next(value);
    }
    public setLastContent(parentBox:JQuery<Element>){
        parentBox.find('[content-name]').attr('content-last','true')
    }

}