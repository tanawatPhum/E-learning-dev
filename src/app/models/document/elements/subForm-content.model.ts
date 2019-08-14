export class SubFormContentModel {
    parentBoxId:string;
    subformList:SubFormContentDetailModel[] =  new Array<SubFormContentDetailModel>();
}
export class SubFormContentDetailModel{
    public id: string;
    public nameDocument:string;
    public isLinked:boolean = false;
    public linkName:string;
    public type:string;
}
