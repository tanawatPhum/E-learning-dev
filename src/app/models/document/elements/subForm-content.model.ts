export class SubFormContentModel {
    parentBoxId:string;
    subformList:SubFormContentDetailModel[] =  new Array<SubFormContentDetailModel>();
}
export class SubFormContentDetailModel{
    public id: string;
    public documentName:string;
    public isLinked:boolean = false;
    public linkName:string;
    public type:string;
    public isConfirm:boolean =false;
    public condition:SubFormContentConditionModel = new SubFormContentConditionModel();
}

export class SubFormContentConditionModel{
    public haveInDoList:boolean;
    public isClickLinks:SubFormContentLinkModel[] = new Array<SubFormContentLinkModel>();
}
export class SubFormContentLinkModel{
    public progress:number;
    public linkId:string;
    public linkName:string;
    public isClicked:boolean;
}