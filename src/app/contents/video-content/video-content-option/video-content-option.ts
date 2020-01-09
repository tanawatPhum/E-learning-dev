import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from '../../../services/content/content-data-control.service';
import { DocumentTrackModel } from '../../../models/document/document.model';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';

@Component({
    selector: 'video-content-option',
    templateUrl: 'video-content-option.html',
    styleUrls: ['video-content-option.scss']
})
export class VideoContentOptionComponent implements ContentOptionInterFace,OnInit{
    @Input() parentBox: JQuery<Element>;
    private rootElement: JQuery<Element>;

    constructor(
        private contentDCtrlService:ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef,
    ){

    }
    private actionCase = {
        browseVideo: 'browseVideo',
        showVideo: 'showVideo',
    }
    private currentCase  = this.actionCase.browseVideo
    ngOnInit(){
        this.rootElement = $(this.element.nativeElement);
        this.handleSection();
        this.handleOptionToolVideo();
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            this.handleSection();
            this.handleOptionToolVideo();        
        })
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
                    if (targetVideo.condition.isMustWatchingEnd) {
                        $('.option-video').find('.video-tracker').prop('checked', true)
                    }
                }
            }
        });
    }
    handleOptionToolVideo(){
        $('.option-video').find('.video-tracker').unbind().on('click',(element) => {
            console.log("this.documentDCtrlService.documentTrack",this.documentDCtrlService.documentTrack)
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

    private removeVideo(){
        this.contentDCtrlService.poolContents.videos = this.contentDCtrlService.poolContents.videos.filter((video)=>video.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
    }




}
