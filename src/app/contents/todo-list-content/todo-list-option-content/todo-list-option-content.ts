import { Component, Input, OnInit, ElementRef, AfterViewInit, ChangeDetectionStrategy, ViewChildren, QueryList, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ToDoListContentModel, ToDoListContentOrderModel, ObjectToDoList, ToDoListCurrentModel, ToDoListBoxListModel } from '../../../models/document/elements/todoList-content.model';
import { UpdateContentModel } from '../../../models/common/common.model';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { Constants } from '../../../global/constants';
import { async } from 'q';
import { ContentsModel } from 'src/app/models/document/content.model';

@Component({
    selector: 'todo-list-option-content',
    templateUrl: 'todo-list-option-content.html',
    styleUrls: ['todo-list-option-content.scss']
})
export class TodoListOptionContentComponent implements ContentOptionInterFace,OnInit,AfterViewInit,AfterViewChecked{
    @Input() parentBox: JQuery<Element>;
    @ViewChildren('componentList') componentList:QueryList<any>;
    public rootElement:JQuery<Element>;
    public toDoListOrder:ToDoListContentOrderModel[] = new Array<ToDoListContentOrderModel>();
    public toDoListComponentList:ToDoListBoxListModel[]  = new Array<ToDoListBoxListModel>();
    public boxTypes = Constants.document.boxes.types;
    public videoTypes = Constants.document.contents.constats.videoTypes;
 
    constructor(
        private documentDControlService:DocumentDataControlService,
        private contentDCtrlService:ContentDataControlService,
        private element: ElementRef,
        private cdr: ChangeDetectorRef
    
    ){}
    ngOnInit(){
        
        this.rootElement = $(this.element.nativeElement); 
 
      
    }
    ngAfterViewInit(){
        let targetTodoList = this.contentDCtrlService.poolContents.todoList.find((todoList)=>todoList.parentId=== this.parentBox.attr('id') )
        if (!this.contentDCtrlService.currentSelectTaskList.find(box => box.boxId === this.parentBox.attr('id'))) {
            if(targetTodoList){
                this.contentDCtrlService.currentSelectTaskList.push({
                    boxId: this.parentBox.attr('id'),
                    taskId: targetTodoList.toDoListOrder[0].id
                })
            }
        }
        this.loadTaskList() 
        
  
   
        
    }
    ngAfterViewChecked(){
        //your code to update the model
        this.cdr.detectChanges();
     }
     public addTaskList(){
        let taskName = this.rootElement.find('.option-toDoList').find('#toDoList-inputTask').val().toString();
        let taskNumber = 0;
        if (taskName) {
            this.rootElement.find('.option-toDoList').find('.toDoList-taskList').find('.list-group-item').each((index,element)=>{
                let targetId =  $(element).attr('id')
                let targetTaskNumber = parseInt(targetId.replace('taskList-',''));
                if(targetTaskNumber > taskNumber){
                    taskNumber = targetTaskNumber;
                }
            })
            taskNumber = taskNumber+1;
            //let taskLength = (this.rootElement.find('.option-toDoList').find('.toDoList-taskList').find('.list-group-item').length + 1)
  

            let displayName = 'Step' + taskNumber + ' : ' + taskName;
            if (!this.contentDCtrlService.poolContents.todoList.find(parentBox => parentBox.parentId === this.parentBox.attr('id') + '-todoList')) {
                let todoList: ToDoListContentModel = {
                    parentId: this.parentBox.attr('id'),
                    id: this.parentBox.attr('id') + '-todoList',
                    progress: 0,
                    toDoListOrder: new Array<ToDoListContentOrderModel>()
                }
                this.contentDCtrlService.poolContents.todoList.push(todoList)
            }
            let toDoListOrder: ToDoListContentOrderModel = {
                id: 'taskList-' + taskNumber,
                name: taskName,
                displayName: displayName,
                progress: 0,
                step: taskNumber,
                objectTodoList: new Array<ObjectToDoList>()
            }
            let targetTodoListIndex = this.contentDCtrlService.poolContents.todoList.findIndex(parentBox => parentBox.parentId === this.parentBox.attr('id'))
            if (targetTodoListIndex >= 0 && !this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder.find(order => order.id === 'taskList-' + taskNumber)) {
                this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder.push(toDoListOrder)
            }
      
            this.toDoListOrder =   this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder;
            this.contentDCtrlService.setLastContent(this.parentBox);
            this.updateContent(Constants.document.contents.lifeCycle.addTaskList,this.toDoListOrder);
            // console.log("this.toDoListOrder",this.toDoListOrder)
            // this.handles(this.actions.event.handleOptionToolToDoList)
            // this.addElements(this.actions.event.addElToDoList, this.currentBox)
        }

    }  
    public loadTaskList(){
        let targetTodoListIndex = this.contentDCtrlService.poolContents.todoList.findIndex(parentBox => parentBox.parentId === this.parentBox.attr('id'))
        if(targetTodoListIndex >= 0 ){
     
        this.toDoListOrder =   this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder;
        let targetBox = this.contentDCtrlService.currentSelectTaskList.find((box) => box.boxId === this.parentBox.attr('id')) 

        if (targetBox) {
            this.createToDoListComponentList().then(()=>{

                this.rootElement.find('.option-toDoList').find('.toDoList-taskList').find('#' + targetBox.taskId).addClass('task-active');
                this.componentList.changes.subscribe((componentList)=>{
                    componentList.forEach(component => {
                        let targetTodoListIndex = this.contentDCtrlService.poolContents.todoList.findIndex(parentBox => parentBox.parentId === this.parentBox.attr('id'))
                        let targetIndexTodoOrder = this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder.findIndex((order) => order.id === this.rootElement.find('.task-active').attr('id'));
                        let objectTodoList = this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder[targetIndexTodoOrder].objectTodoList;
                        if(objectTodoList.find((object)=>object.id === component.nativeElement.value)){
                            component.nativeElement.setAttribute('checked',true)
                        }     
                    });
                })
                // let targetTodoListIndex = this.contentDCtrlService.poolContents.todoList.findIndex(parentBox => parentBox.parentId === this.parentBox.attr('id'))
                // let targetIndexTodoOrder = this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder.findIndex((order) => order.id === this.rootElement.find('.task-active').attr('id'));
                // console.log(this.rootElement.find('.option-toDoList').find('.toDoList-componentList').find('input[type="checkbox"]'))
                // this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder[targetIndexTodoOrder].objectTodoList.forEach((object) => {
                //         this.rootElement.find('.option-toDoList').find('.toDoList-componentList').find('input[type="checkbox"]').each((index, element) => {
                //             if (object.id === $(element).val()) {
                //                 $(element).prop('checked', true);
                //             }
                //         });                  
                //     });
      
                           
         
            });
            
          
     

        }


        this.updateContent('addTaskList',this.toDoListOrder);
        
       }
    }  
    public handleTaskList(event,action){
        if(action==='click'){
            this.rootElement.find('.option-toDoList').find('.toDoList-taskList').find('.list-group-item').removeClass('task-active')
            $(event.currentTarget).addClass('task-active')
            if (!this.contentDCtrlService.currentSelectTaskList.find(box => box.boxId === this.parentBox.attr('id'))) {
                this.contentDCtrlService.currentSelectTaskList.push({
                    boxId: this.parentBox.attr('id'),
                    taskId: $(event.currentTarget).attr('id')
                })
            } else {
                let targetBoxIndex = this.contentDCtrlService.currentSelectTaskList.findIndex(box => box.boxId === this.parentBox.attr('id'))
                this.contentDCtrlService.currentSelectTaskList[targetBoxIndex].taskId = $(event.currentTarget).attr('id');
            }
            this.createToDoListComponentList();

            let targetTodoListIndex = this.contentDCtrlService.poolContents.todoList.findIndex(parentBox => parentBox.parentId === this.parentBox.attr('id'))
            let targetIndexTodoOrder = this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder.findIndex((order) => order.id === $(event.currentTarget).attr('id'));
            this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder[targetIndexTodoOrder].objectTodoList.forEach((object) => {
        
                this.rootElement.find('.option-toDoList').find('.toDoList-componentList').find('input[type="checkbox"]').each((index, element) => {
                    if (object.id === $(element).val()) {
                        $(element).prop('checked', true);
                    }
                });
            })
        }
        else if(action==='input'){
            let taskId   =  $(event.currentTarget).attr('data-taskId');
            let targetToDoListIndex = this.contentDCtrlService.poolContents.todoList.findIndex(parentBox => parentBox.parentId === this.parentBox.attr('id'))
            let targetToDoListTaskIndex  =   this.contentDCtrlService.poolContents.todoList[targetToDoListIndex].toDoListOrder.findIndex(task=>task.id===taskId);
            this.contentDCtrlService.poolContents.todoList[targetToDoListIndex].toDoListOrder[targetToDoListTaskIndex].displayName  =  $(event.currentTarget).text();
            this.parentBox.find('.content-toDoList').find('#'+taskId).find('p').text($(event.currentTarget).text())
        }
    }
    handleComponentList(event,action){
        if(action==='click'){
            let targetToDoListIndex = this.contentDCtrlService.poolContents.todoList.findIndex(parentBox => parentBox.parentId === this.parentBox.attr('id'))
            let targetToDoOrderIndex = this.contentDCtrlService.poolContents.todoList[targetToDoListIndex].toDoListOrder.findIndex((order) => order.id === this.rootElement.find('.task-active').attr('id'));
            let targetDocumentTrackContentIndex =  this.documentDControlService.documentTrack.contents.findIndex(content=>content.parentId ===$(event.currentTarget).val().toString());
            if ($(event.currentTarget).prop('checked')) {
                let objectTodoList: ObjectToDoList = {
                    id: $(event.currentTarget).val().toString(),
                    progress: 0
                }
    
                this.contentDCtrlService.poolContents.todoList[targetToDoListIndex].toDoListOrder[targetToDoOrderIndex].objectTodoList.push(objectTodoList)
                if( this.documentDControlService.documentTrack.contents[targetDocumentTrackContentIndex].contentType === this.boxTypes.boxSubform){
                    this.documentDControlService.documentTrack.contents[targetDocumentTrackContentIndex].conditions.subformCondition.haveInDoList = true;
                }
            } else {
                this.contentDCtrlService.poolContents.todoList[targetToDoListIndex].toDoListOrder[targetToDoOrderIndex].objectTodoList =
                this.contentDCtrlService.poolContents.todoList[targetToDoListIndex].toDoListOrder[targetToDoOrderIndex].objectTodoList.filter((object) => object.id != $(event.currentTarget).val().toString())
                if( this.documentDControlService.documentTrack.contents[targetDocumentTrackContentIndex].contentType === this.boxTypes.boxSubform){
                    this.documentDControlService.documentTrack.contents[targetDocumentTrackContentIndex].conditions.subformCondition.haveInDoList = false;
                }
            }
        }

    }
 
    public updateContent(actionCase,data?){
        let updateData:UpdateContentModel  = new UpdateContentModel();
        updateData.actionCase =  actionCase;
        updateData.data =  data
        this.contentDCtrlService.updateContent = updateData;
    }
    public async createToDoListComponentList() :Promise<any>{
        return new Promise(async (resovle,reject)=>{
            this.toDoListComponentList = new Array<ToDoListBoxListModel>();
            for await(let content of this.contentDCtrlService.poolContents.links){
                this.toDoListComponentList.push({
                    id: content.parentId,
                    name: content.parentId,
                    boxType:'link',
                    boxTypeName:'link',
                    isChecked: false
                });
            }

            // for await(let content of this.contentDCtrlService.poolContents.subFroms){
            //     this.toDoListComponentList.push({
            //         id: content.parentBoxId,
            //         name: content.parentBoxId,
            //         boxType:'subform',
            //         boxTypeName:'Subform',
            //         isChecked: false
            //     });
            // }
            for await(let content of this.contentDCtrlService.poolContents.videos){
                if( content.data.channelStream === this.videoTypes.wistia ){
                    this.toDoListComponentList.push({
                        id: content.parentId,
                        name: content.parentId,
                        boxType:'video',
                        boxTypeName:'Video',
                        isChecked: false
                    });
                }
            }
            for await(let content of this.contentDCtrlService.poolContents.exams){
                 this.toDoListComponentList.push({
                    id: content.parentId,
                    name: content.parentId,
                    boxType:'exam',
                    boxTypeName:'Exam',
                    isChecked: false
                });
            }
        
            resovle(Constants.common.message.status.success)     
            
           
        })
   
     
        // await this.contentDCtrlService.poolContents.subFroms.forEach((content)=>{
        //     this.toDoListComponentList.push({
        //         id: content.parentBoxId,
        //         name: content.parentBoxId,
        //         boxType:'subform',
        //         boxTypeName:'Subform',
        //         isChecked: false
        //     });
        // })
        // await this.contentDCtrlService.poolContents.videos.forEach((content)=>{
        //     this.toDoListComponentList.push({
        //         id: content.parentId,
        //         name: content.parentId,
        //         boxType:'video',
        //         boxTypeName:'Video',
        //         isChecked: false
        //     });
        // })
        // await  this.contentDCtrlService.poolContents.exams.forEach((content)=>{
        //     this.toDoListComponentList.push({
        //         id: content.parentId,
        //         name: content.parentId,
        //         boxType:'exam',
        //         boxTypeName:'Exam',
        //         isChecked: false
        //     });
        // })

      
    }
    public removeTask(taskId){
        let targetTodoListIndex =  this.contentDCtrlService.poolContents.todoList.findIndex((todoList)=>todoList.parentId == this.parentBox.attr('id'));
        this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder = this.contentDCtrlService.poolContents.todoList[targetTodoListIndex].toDoListOrder.filter((task)=>task.id !== taskId)
        this.updateContent(Constants.document.contents.lifeCycle.addTaskList,this.toDoListOrder);
        this.loadTaskList();
        console.log(this.contentDCtrlService.poolContents.todoList[targetTodoListIndex])
    }
    public removeToDoList(){
        this.contentDCtrlService.poolContents.todoList = this.contentDCtrlService.poolContents.todoList.filter((todoList)=>todoList.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
        let updateContent = new UpdateContentModel();
        updateContent.actionCase = Constants.document.contents.lifeCycle.delete;
        this.contentDCtrlService.updateContent =  updateContent;
    
    }
}
