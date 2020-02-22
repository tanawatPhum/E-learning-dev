export class NoteContentModel{
    public parentId:string;
    public id: string;
    public text:string;
    public html:string;
    public status:string;
    public position:NoteContentPositionModel = new NoteContentPositionModel();
}

export class NoteContentPositionModel{
    public originalTop:number;
    public originalLeft:number;
    public originalIconTop:number;
    public originalIconLeft:number;

}