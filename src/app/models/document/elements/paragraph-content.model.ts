export class ParagraphContentModel {
    public id:string;
    public pageId:string;
    public level:number;
    public htmlDetail:ParagraphContentHTMLModel = new ParagraphContentHTMLModel();

}

export class ParagraphContentHTMLModel {
    public offsetTop:number;
    public offsetLeft:number;
    public positionTop:number;
    public positionLeft:number;
    public width:number;
    public height:number;
    public html:string;
    public breakLine:number;
    public styles:string;
}