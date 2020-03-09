import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';
import { UpdateContentModel } from 'src/app/models/common/common.model';
import { Constants } from 'src/app/global/constants';
import { ToolBarService } from '../../../services/document/toolbar.service';

@Component({
    selector: 'link-content-option',
    templateUrl: 'link-content-option.html',
    styleUrls: ['link-content-option.scss']
})
export class LinkContentOptionComponent implements ContentOptionInterFace, OnInit {
    @Input() parentBox: JQuery<Element>;
    public rootElement: JQuery<Element>;
    public fontSizeList = Constants.common.style.fontSizeList;
    public targetLink;
    public targetLinkIndex;
    public actionCase = {
        browseLink: 'browseLink',
        showLink: 'showLink'
    }
    public currentCase = this.actionCase.browseLink;

    constructor(
        private contentDCtrlService: ContentDataControlService,
        private element: ElementRef,
        private documentDCtrlService:DocumentDataControlService,
        private toolbarService:ToolBarService
    ) {

    }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.handleSection();
        this.handleOptionLink();
        this.contentDCtrlService.getUpdateContent().subscribe((detail) => {
            this.handleSection();
        })
    }
    handleSection() {
        setTimeout(() => {
            if (this.parentBox.find('.content-toolbar:visible').length > 0) {
                this.currentCase = this.actionCase.browseLink;
            }
            else if (this.parentBox.find('.content-link:visible').length > 0) {
                this.currentCase = this.actionCase.showLink;
                this.targetLinkIndex = this.contentDCtrlService.poolContents.links.findIndex((link)=>link.parentId === this.parentBox.attr('id'))
                this.targetLink =  this.contentDCtrlService.poolContents.links[this.targetLinkIndex]
                if(this.targetLink){
                    $('.option-link').find('#link-input-url').val(this.targetLink.name);
                }
            }
        });
    }
    handleOptionLink(){
        this.rootElement.find('.option-link').find('#link-input-url').unbind().bind('input', (element) => {
            let targetLinkIndex = this.contentDCtrlService.poolContents.links.findIndex(link=>link.parentId === this.parentBox.attr('id'))
            if(targetLinkIndex>=0){
                this.contentDCtrlService.poolContents.links[targetLinkIndex].name =  $(element.currentTarget).val().toString();
                this.parentBox.find('.content-link').text($(element.currentTarget).val().toString());
                this.parentBox.find('.content-link').attr('data-name',$(element.currentTarget).val().toString());
            }
        })
        let targetContentLink = this.parentBox.find('.content-link');
        this.toolbarService.getFontFamily('#option-font-family',targetContentLink).then(()=>{
            this.contentDCtrlService.poolContents.links[this.targetLinkIndex].styles  = targetContentLink.attr('style').toString()
        });
        this.toolbarService.getFontStyle('[data-font-group="font-style"]',targetContentLink).then(()=>{
            this.contentDCtrlService.poolContents.links[this.targetLinkIndex].styles  = targetContentLink.attr('style').toString()
        });
        this.toolbarService.getFontColor('#option-font-color',targetContentLink).then(()=>{
            this.contentDCtrlService.poolContents.links[this.targetLinkIndex].styles  = targetContentLink.attr('style').toString()
        });
        this.toolbarService.getFontSize('#option-font-size',targetContentLink).then(()=>{
            this.contentDCtrlService.poolContents.links[this.targetLinkIndex].styles  = targetContentLink.attr('style').toString()
        });
        this.toolbarService.getFontBackground('#option-background-color',this.parentBox).then(()=>{
            this.contentDCtrlService.poolContents.links[this.targetLinkIndex].styles  = targetContentLink.attr('style').toString()
        });
    }
    public removeLink() {

  
       

        this.documentDCtrlService.documentTrack.contents =  this.documentDCtrlService.documentTrack.contents.filter((link)=>link.parentId !==this.parentBox.attr('id'));

        this.contentDCtrlService.poolContents.progressBar.forEach((progressBar,index)=>{
            this.contentDCtrlService.poolContents.progressBar[index].contentList =  progressBar.contentList.filter((content)=>content.parentId != this.parentBox.attr('id'));
        })
        this.contentDCtrlService.poolContents.todoList.forEach((todoList,index)=>{
            todoList.toDoListOrder.forEach((taskList,taskIndex)=>{
                this.contentDCtrlService.poolContents.todoList[index].toDoListOrder[taskIndex].objectTodoList =  taskList.objectTodoList.filter((component)=>  component.id !== this.parentBox.attr('id'))
            });    
        });
        this.contentDCtrlService.poolContents.links = this.contentDCtrlService.poolContents.links.filter((link) => link.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
        let updateContent = new UpdateContentModel();
        updateContent.actionCase = Constants.document.contents.lifeCycle.delete;
        this.contentDCtrlService.updateContent =  updateContent;
    }
}
