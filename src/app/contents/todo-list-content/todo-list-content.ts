import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ToDoListBoxListModel } from 'src/app/models/document/elements/todoList-content.model';
import { ToDoListContentModel } from '../../models/document/elements/todoList-content.model';

@Component({
    moduleId: module.id,
    selector: 'todo-list-content',
    templateUrl: 'todo-list-content.html',
    styleUrls: ['todo-list-content.scss']
})
export class TodoListContentComponent implements OnInit,ContentInterFace  {
    private targetFile;
    @Input() parentBox: JQuery<Element>;
    private actionCase = {
        browseImg:'browseImg',
        loadingImg:'loadingImg',
        showImg:'showImg'
    }
    private currentCase = this.actionCase.browseImg;
    private rootElement:JQuery<Element>;
    private targetToDoList:ToDoListContentModel[]  = new Array<ToDoListContentModel>();

    constructor(
        private commonService :CommonService,
        private documentService:DocumentService,
        private contentDCtrlService:ContentDataControlService,
        private element: ElementRef
        
        ){}
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement); 
        
    }
    ngAfterViewInit(){ 
        this.contentDCtrlService.getUpdateContentOption().subscribe((detail)=>{
            this.targetToDoList = detail.data;
        })
 

    }
    


    

}
