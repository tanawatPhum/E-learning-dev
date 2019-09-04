import { SubFormContentModel, SubFormContentDetailModel, SubFormContentConditionModel } from './elements/subForm-content.model';
import {  ContentsModel } from './content.model';
import { VideoConetentConditionModel } from './elements/video-content.model';

export class TriggerEventModel {
    public action:string;
    public data:any;
}
export class DocumentNavigatorModel{
    public userId:string;
    public nameDocument:string;
    public id:string;
    public status:string;
    public previewImg:any;
    public childDocuments:SubFormContentDetailModel[];
}
export class DocumentTrackModel{
    public userId:string;
    public id:string;
    public nameDocument:string;
    public isTrackProgress:boolean;
    public progress:number = 0;
    public status:string;
    public contents:DocumentTrackContent[] = new Array<DocumentTrackContent>();
}

export class DocumentTrackContent{
    public userId:string;
    public parentId:string;
    public id:string;
    public data:any;
    public name:string;
    public boxType:string;
    public progress:number;
    public conditions:DocumentTrackContentCondition = new DocumentTrackContentCondition();
}
export class DocumentTrackContentCondition{
    public videoCondition:VideoConetentConditionModel = new VideoConetentConditionModel();
    public subformCondition:SubFormContentConditionModel = new SubFormContentConditionModel();

}