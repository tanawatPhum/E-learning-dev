export class ProgressBarContentModel{
    public id:string;
    public parentId:string;
    public progress:number;
    public contentList:ProgressBarContentObjectModel[] = new Array<ProgressBarContentObjectModel>();
}

export class ProgressBarContentObjectModel{
    public parentId:string;
    public id:string;
    public boxType:string;
}