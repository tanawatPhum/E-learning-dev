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
import { DocumentModel, ContentsModel } from 'src/app/models/document/content.model';
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

        this.contentDCtrlService.getUpdateContent().subscribe((detail) => {
            if(detail.actionCase === Constants.document.contents.lifeCycle.addTaskList){
                this.toDoListOrder = detail.data;
            }
            else if((detail.actionCase === Constants.document.contents.lifeCycle.playVideo
                && detail.for === Constants.document.contents.types.todoList)
                || detail.actionCase === Constants.document.contents.lifeCycle.clickLink
                ){
                    this.handleTodoList();                
            }
            else if(detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm && detail.for === this.parentBox.attr('id')){
                let targetDocumentContent:ContentsModel = detail.data;
                this.targetIndexToDoList = targetDocumentContent.todoList.findIndex((todoList) => todoList.parentId === this.parentBox.attr('id'))
                this.targetToDoList = targetDocumentContent.todoList[this.targetIndexToDoList];
                this.initialToDoList();
            } 
        })
    }
    ngAfterViewInit() {
        this.targetIndexToDoList = this.contentDCtrlService.poolContents.todoList.findIndex((todoList) => todoList.parentId === this.parentBox.attr('id'))
        this.targetToDoList = this.contentDCtrlService.poolContents.todoList[this.targetIndexToDoList];
        this.initialToDoList();
 

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
        this.toDoListOrder = this.targetToDoList && this.targetToDoList.toDoListOrder;
    }
    private handleTodoList() {
        this.targetToDoList.toDoListOrder.forEach((task) => {
            let summaryOfProgress = 0;
            let numberOfTasks = 0;
            // let progressContent = 0;
            task.objectTodoList.forEach((content) => {
                let targetContent = this.documentDCtrlService.currentDocumentTrack.contents.find(contentTrack => contentTrack.parentId === content.id);
                if (targetContent) {
                    if (targetContent.contentType === this.contentTypes.video) {
                        if(!targetContent.conditions.videoCondition.isMustWatchingEnd && targetContent.conditions.videoCondition.isClickPlay){
                            summaryOfProgress += 100;
                        }else{
                            summaryOfProgress += targetContent.progress;
                        }
                        numberOfTasks +=1;
                    } 
                    else if (targetContent.contentType === this.contentTypes.link) {
                        if(targetContent.conditions.linkCondition.isClicked){
                            summaryOfProgress += targetContent.conditions.linkCondition.progress;
                        }
                        numberOfTasks +=1;
                        // targetContent.conditions.subformCondition.isClickLinks.forEach((link)=>{
                        //     if(link.isClicked){
                        //         summaryOfProgress += link.progress;
                        //     }
                        //     numberOfTasks +=1;
                        // })
                    }
                    // else if (targetContent.contentType === this.contentTypes.subform) {
                    //     targetContent.conditions.subformCondition.isClickLinks.forEach((link)=>{
                    //         if(link.isClicked){
                    //             summaryOfProgress += link.progress;
                    //         }
                    //         numberOfTasks +=1;
                    //     })
                    // }
                    // if (targetContent.contentType === this.contentTypes.subform) {
                    //     targetContent.conditions.subformCondition.isClickLinks.forEach((document)=>{
                    //         if(document.isClicked){
                    //             summaryOfProgress += 100;
                    //         }

                    //     })

                    // }
                }
            });
            if (summaryOfProgress === numberOfTasks * 100) {
                $('#' + this.targetToDoList.parentId).find('.content-toDoList').find('#' + task.id).find('p').css('text-decoration', 'line-through');
            }
            this.targetToDoList.progress =  this.contentDCtrlService.poolContents.todoList[this.targetIndexToDoList].progress =  summaryOfProgress;
            this.saveDocument();
        })



    }
    private saveDocument(){
        this.updateAction.actionCase = Constants.document.contents.lifeCycle.saveDocument;
        this.updateAction.data  = this.contentDCtrlService.poolContents;

        let saveobjectTemplate: DocumentModel = {
            nameDocument: this.documentDCtrlService.currentDocument.nameDocument,
            styles:this.documentDCtrlService.currentResult.styles,
            previewImg: this.documentDCtrlService.currentResult.previewImg,
            userId:this.commonDCtrlService.userId,
            id: this.documentDCtrlService.currentResult.id, 
            layoutType:this.documentDCtrlService.currentResult.layoutType,
            pages:this.documentDCtrlService.currentResult.pages,
            html: $('#contentTemplate').html(),
            status: this.documentDCtrlService.currentResult.status,
            otherDetail: this.documentDCtrlService.currentResult.otherDetail,
            contents:this.contentDCtrlService.poolContents
        }

        this.documentService.saveDocument(this.documentDCtrlService.currentResult.nameDocument, saveobjectTemplate).subscribe((status) => {
        })

        // let saveobjectTemplate: DocumentModel = {
        //     nameDocument: this.documentDCtrlService.currentDocumentName,
        //     previewImg: this.documentDCtrlService.currentResult.previewImg,
        //     userId:this.commonDCtrlService.userId,
        //     id: this.documentDCtrlService.currentResult.id, 
        //     html: $('#contentTemplate').html(),
        //     status: this.documentDCtrlService.currentResult.status,
        //     otherDetail: this.documentDCtrlService.currentResult.otherDetail,
        //     contents:this.contentDCtrlService.poolContents
        // }
        // this.updateAction.data = saveobjectTemplate;
        // this.contentDCtrlService.updateContent = this.updateAction
    };






}
