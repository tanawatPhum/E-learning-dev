export class ToDoListContentModel {
    public parentBoxId:string;
    public id:string;
    public progress:number;
    public toDoListOrder:ToDoListContentOrderModel[] = new Array<ToDoListContentOrderModel>();
}
export class ToDoListBoxListModel {
    public id:string;
    public name:string;
    public isChecked:boolean;
    public boxType:string;
}
export class ToDoListContentOrderModel {
    id:string;
    name:string;
    displayName:string;
    progress:number;
    step:number;
    objectTodoList:ObjectToDoList[] = new Array<ObjectToDoList>();
}

export class ObjectToDoList {
    id:string;
    progress:number;
}

export class ToDoListCurrentModel {
    public boxId:string;
    public taskId:string;

}