import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ToDoListBoxListModel } from 'src/app/models/document/elements/todoList-content.model';
import { ToDoListContentModel, ToDoListContentOrderModel } from '../../models/document/elements/todoList-content.model';
import { Constants } from 'src/app/global/constants';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { UpdateContentModel } from '../../models/common/common.model';
import { DocumentModel } from 'src/app/models/document/content.model';
import { CommonDataControlService } from '../../services/common/common-data-control.service';

@Component({
    moduleId: module.id,
    selector: 'todo-list-content',
    templateUrl: 'todo-list-content.html',
    styleUrls: ['todo-list-content.scss']
})
export class TodoListContentComponent implements OnInit, ContentInterFace {
    public targetFile;
    @Input() lifeCycle: string;
    @Input() parentBox: JQuery<Element>;
    private actionCase = {
        browseImg: 'browseImg',
        loadingImg: 'loadingImg',
        showImg: 'showImg'
    }
    public currentCase = this.actionCase.browseImg;
    public rootElement: JQuery<Element>;
    public targetToDoList: ToDoListContentModel = new ToDoListContentModel();
    public targetIndexToDoList:number;
    public toDoListOrder: ToDoListContentOrderModel[] = new Array<ToDoListContentOrderModel>();
    public contentTypes = Constants.document.contents.types;
    public updateAction:UpdateContentModel = new UpdateContentModel();
    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private commonDCtrlService:CommonDataControlService,
        private documentDCtrlService: DocumentDataControlService,
        private contentDCtrlService: ContentDataControlService,
        private element: ElementRef

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');
        console.log(this.documentDCtrlService.documentTrack.contents)

    }
    ngAfterViewInit() {
        this.targetIndexToDoList = this.contentDCtrlService.poolContents.todoList.findIndex((todoList) => todoList.parentId === this.parentBox.attr('id'))
        this.targetToDoList = this.contentDCtrlService.poolContents.todoList[this.targetIndexToDoList];
        this.initialToDoList();
        this.contentDCtrlService.getUpdateContent().subscribe((detail) => {
            if(detail.actionCase === Constants.document.contents.lifeCycle.addTaskList){
                this.toDoListOrder = detail.data;
            }
            else if(detail.actionCase === Constants.document.contents.lifeCycle.playVideo ){
       
                    this.handleTodoList();                
         
    
            }
            
           
        })

    }
    private initialToDoList() {
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.createContent) {

        } else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
            this.loadTodoList();
            if(this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview){
                setTimeout(() => {
                    this.handleTodoList();
                })
              
            }
        }
    }
    private loadTodoList() {
        this.toDoListOrder = this.targetToDoList.toDoListOrder;
    }
    private handleTodoList() {
    
        this.targetToDoList.toDoListOrder.forEach((task) => {
            let summaryOfProgress = 0;
            // let progressContent = 0;
            task.objectTodoList.forEach((content) => {
  
                let targetContent = this.documentDCtrlService.currentDocumentTrack.contents.find(contentTrack => contentTrack.parentId === content.id);
                console.log(targetContent)
                if (targetContent) {
                    if (targetContent.contentType === this.contentTypes.video && !targetContent.conditions.videoCondition.isMustWatchingEnd && targetContent.conditions.videoCondition.isClickPlay) {
                        summaryOfProgress += 100;
                    } else {
                        summaryOfProgress += targetContent.progress;
                    }
                }
            });
            if (summaryOfProgress === task.objectTodoList.length * 100) {
                $('#' + this.targetToDoList.parentId).find('.content-toDoList').find('#' + task.id).find('p').css('text-decoration', 'line-through');
            }
            this.targetToDoList.progress =  this.contentDCtrlService.poolContents.todoList[this.targetIndexToDoList].progress =  summaryOfProgress;
            this.saveDocument();
        })



    }
    private saveDocument(){
        this.updateAction.actionCase = Constants.document.contents.lifeCycle.saveDocument;
        let saveobjectTemplate: DocumentModel = {
            nameDocument: this.documentDCtrlService.currentDocumentName,
            previewImg: this.documentDCtrlService.currentResult.previewImg,
            userId:this.commonDCtrlService.userId,
            id: this.documentDCtrlService.currentResult.id, 
            html: $('#contentTemplate').html(),
            status: this.documentDCtrlService.currentResult.status,
            otherDetail: this.documentDCtrlService.currentResult.otherDetail,
            contents:this.contentDCtrlService.poolContents
        }
        this.updateAction.data = saveobjectTemplate;
        this.contentDCtrlService.updateContent = this.updateAction
    };






}
