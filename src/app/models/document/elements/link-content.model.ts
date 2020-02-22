export class LinkContentModel {
    public type:string = '';
    public parentId:string;
    public id: string;
    public childId:string = '';
    public path: string;
    public name:string;
}

export class LinkContentConditionModel{
    public progress:number;
    public linkType:string;
    public linkId:string;
    public linkName:string;
    public isClicked:boolean;
}
