export class BoxContentModel {
    public id: string;
    public name:string;
    public contentType: string;
    public boxType:string;
    public htmlDetail:BoxHTMLModel = new BoxHTMLModel();

}

export class BoxHTMLModel{
    public top:number;
    public left:number;
    public height:number;
    public width:number;
    public background:string;
    public selector:string;
    public level:string;
}
