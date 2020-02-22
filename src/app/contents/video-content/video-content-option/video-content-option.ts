import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from '../../../services/content/content-data-control.service';
import { DocumentTrackModel } from '../../../models/document/document.model';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { filter } from 'rxjs/operators';
import { UpdateContentModel } from 'src/app/models/common/common.model';
import { Constants } from 'src/app/global/constants';

@Component({
    selector: 'video-content-option',
    templateUrl: 'video-content-option.html',
    styleUrls: ['video-content-option.scss']
})
export class VideoContentOptionComponent implements ContentOptionInterFace,OnInit,AfterViewInit{
    @Input() parentBox: JQuery<Element>;
    public rootElement: JQuery<Element>;
    public sourceType:string;

    constructor(
        private contentDCtrlService:ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef,
    ){

    }
    public actionCase = {
        browseVideo: 'browseVideo',
        showVideo: 'showVideo',
    }
    public currentCase  = this.actionCase.browseVideo
    ngOnInit(){
        this.rootElement = $(this.element.nativeElement);
  
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            this.handleSection();
            this.handleOptionToolVideo();        
        })
    }
    ngAfterViewInit(){
        this.handleSection();
        this.handleOptionToolVideo();
    }
    handleSection(){
        setTimeout(() => {
        // console.log(this.parentBox.find('.content-toolbar'))
            if(this.parentBox.find('.content-toolbar:visible').length > 0){
                this.currentCase =  this.actionCase.browseVideo;
            }
            else if(this.parentBox.find('.content-video:visible').length > 0){
                this.currentCase =  this.actionCase.showVideo;
                let targetVideo = this.contentDCtrlService.poolContents.videos.find((video) => video.parentId === this.parentBox.attr('id'))
                if (targetVideo) {
                    this.sourceType = targetVideo.data.channelStream;
                    if (targetVideo.condition.isMustWatchingEnd) {
                        $('.option-video').find('.video-tracker').prop('checked', true)
                    }
                }
            }
        });
    }
    handleOptionToolVideo(){
        $('.option-video').find('.video-tracker').unbind().on('click',(element) => {
            let targetVideoIndex = this.contentDCtrlService.poolContents.videos.findIndex((video) => video.parentId === this.parentBox.attr('id'))
            let targetVideoTrackIndex =  this.documentDCtrlService.documentTrack.contents.findIndex((video)=>video.parentId === this.contentDCtrlService.poolContents.videos[targetVideoIndex].parentId);
            if (targetVideoIndex >= 0) {
                if($('.option-video').find('.video-tracker').prop('checked')){
                    this.contentDCtrlService.poolContents.videos[targetVideoIndex].condition.isMustWatchingEnd = true;
                    this.documentDCtrlService.documentTrack.contents[targetVideoTrackIndex].conditions.videoCondition.isMustWatchingEnd = true
                }else{
                    this.contentDCtrlService.poolContents.videos[targetVideoIndex].condition.isMustWatchingEnd = false;
                    this.documentDCtrlService.documentTrack.contents[targetVideoTrackIndex].conditions.videoCondition.isMustWatchingEnd = false;
                }
            }
        });
    }

    public removeVideo(){
        this.contentDCtrlService.poolContents.videos = this.contentDCtrlService.poolContents.videos.filter((video)=>video.parentId !== this.parentBox.attr('id'));
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
        let updateContent = new UpdateContentModel();
        updateContent.actionCase = Constants.document.contents.lifeCycle.delete;
        this.contentDCtrlService.updateContent =  updateContent;
    }




}
