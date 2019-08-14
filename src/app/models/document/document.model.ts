import { SubFormContentModel, SubFormContentDetailModel } from './elements/subForm-content.model';

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
