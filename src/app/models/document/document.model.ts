import { SubFormContentModel, SubFormContentDetailModel } from './elements/subForm-content.model';
import {  ContentsModel } from './content.model';

export class TriggerEventModel {
    public action:string;
    public data:any;
}
export class DocumentNavigatorModel{
    public nameDocument:string;
    public id:string;
    public status:string;
    public childDocuments:SubFormContentDetailModel[];
}
export class DocumentTrackModel{
    public id:string;
    public nameDocument:string;
    public isTrackProgress:boolean;
    public progress:number;
    public status:string;
    public contents:DocumentTrackContent[] = new Array<DocumentTrackContent>();
}

export class DocumentTrackContent{
    parentId:string;
    id:string;
    boxType:string;
    isTrackProgress:boolean;
}