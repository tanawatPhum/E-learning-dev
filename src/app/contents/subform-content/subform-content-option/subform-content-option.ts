import { Component, Input } from '@angular/core';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';

@Component({
    selector: 'subform-content-option',
    templateUrl: 'subform-content-option.html',
    styleUrls: ['subform-content-option.scss']
})
export class SubformContentOptionComponent implements ContentOptionInterFace {
    @Input() parentBox: JQuery<Element>;
    constructor(
        private documentDCtrlService:DocumentDataControlService,
        private contentDCtrlService:ContentDataControlService,
    ){

    }
    public removeSubform(){
        this.contentDCtrlService.poolContents.subFroms = this.contentDCtrlService.poolContents.subFroms.filter((subFrom)=>subFrom.parentBoxId !== this.parentBox.attr('id'));
       
        this.documentDCtrlService.documentTrack.contents =  this.documentDCtrlService.documentTrack.contents.filter((video)=>video.parentId !==this.parentBox.attr('id'));
        this.contentDCtrlService.poolContents.progressBar.forEach((progressBar,index)=>{
            this.contentDCtrlService.poolContents.progressBar[index].contentList =  progressBar.contentList.filter((content)=>content.parentId != this.parentBox.attr('id'));
        })
        this.contentDCtrlService.poolContents.todoList.forEach((todoList,index)=>{
            todoList.toDoListOrder.forEach((taskList,taskIndex)=>{
                this.contentDCtrlService.poolContents.todoList[index].toDoListOrder[taskIndex].objectTodoList =  taskList.objectTodoList.filter((component)=>  component.id !== this.parentBox.attr('id'))
            });    
        });
        this.parentBox.remove();
    }
}
