export class ProgressBarContentModel{
    public id:string;
    public parentId:string;
    public progress:number;
    public contentList:ProgressBarContentObjectModel[] = new Array<ProgressBarContentObjectModel>();
    public styles:string;
}

export class ProgressBarContentObjectModel{
    public parentId:string;
    public id:string;
    public boxType:string;
}

export class ProgressBoxListModel {
    public id:string;
    public name:string;
    public boxType:string;
    public boxTypeName:string;
}