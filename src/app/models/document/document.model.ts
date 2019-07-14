export class triggerEventModel {
    public action:string;
    public data:any;
}
export class documentIndexModel{
    public nameDocument:string;
    public id:string;
    public childDocument:documentIndexModel[];
}