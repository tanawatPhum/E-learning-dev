export class ScreenDetailModel {
    public height:number;
    public width:number;
}
export class PostitionDetailModel {
    public top:number;
    public left:number;
}
export class ElementDetailModel{
    public screenDetail = new ScreenDetailModel();
    public postitionDetail  = new PostitionDetailModel();
}

export class CommonResponseModel{
    public action:string;
    public data:any;
}