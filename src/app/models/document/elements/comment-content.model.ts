export class commentContentModel {
    public parentId:string;
    public id:string;
    public listComment:commentDetailModel[] = new Array<commentDetailModel>();

}

export class commentDetailModel {
    public id:string;
    public userId:number;
    public message:string;
    public isQuestion:boolean;
    public imgData:any;
    public isChild:boolean
    public liked:number;
    public childs:commentDetailModel[] = new Array<commentDetailModel>();
}


