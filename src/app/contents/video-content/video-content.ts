import { Component, Input, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from '../../services/content/content-data-control.service';
import { ContentInterFace } from '../interface/content.interface';
import { VideoConetentDataModel, VideoConetentConditionModel, VideoContentModel } from '../../models/document/elements/video-content.model';
import { CommonService } from '../../services/common/common.service';
import { UpdateContentModel } from '../../models/common/common.model';
import { DocumentTrackContent } from '../../models/document/document.model';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { Constants } from '../../../../dist/E-learning/app/global/constants';

@Component({
    moduleId: module.id,
    selector: 'video-content',
    templateUrl: 'video-content.html',
    styleUrls: ['video-content.scss']
})
export class VideoContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    @Input() parentBox: JQuery<Element>;
    @Input() data: any;
    @HostListener('click',['$event']) onClick(event) {
  console.log('Hello world')
    }

    private rootElement: JQuery<Element>;
    private targetFile;
    private actionCase = {
        browseVideo: 'browseVideo',
        showVideo: 'showVideo',
        videoSource:'videoSource',
        videoYoutube:'videoYoutube',
        videoWistia:'videoWistia'
    }
    private currentCase = this.actionCase.browseVideo;
    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private contentDCtrlService: ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.common.event.load.component){
                this.parentBox  = this.rootElement.parents('.content-box');
                let targetVideo =  this.contentDCtrlService.poolContents.videos.find((video)=>video.parentId === this.parentBox.attr('id'))
                if(targetVideo.data.channelStream === 'wistia'){
                   this.loadVideo(targetVideo)
                }
            }
        })
    }
    ngAfterViewInit() {
        this.handleBrowseVideo();
    }
    private handleBrowseVideo() {
        this.rootElement.find('#btn-video').click(() => {
            this.rootElement.find('.content-browse-video').trigger('click');
            this.rootElement.find('.content-browse-video').change((event) => {
                const target = event.target as HTMLInputElement;
                this.targetFile = target.files;
                console.log(' ❏ Video :', this.targetFile);
                this.addVideo(null, 'videoSource');
            });
        });
        this.rootElement.find('.toolbar-browse-video').find('.toolbar-drag').on('dragover', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        this.rootElement.find('.toolbar-browse-video').find('.toolbar-drag').on('dragleave', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        this.rootElement.find('.toolbar-browse-video').find('.toolbar-drag').on('drop', (event: any) => {
            event.preventDefault();
            event.stopPropagation();
            this.targetFile = event.originalEvent.dataTransfer.files;
            console.log(' ❏ Video :', this.targetFile);
            this.addVideo(null, 'videoSource');
        });
        this.rootElement.find('.toolbar-browse-video').find('#video-input-url').click(() => {
            this.rootElement.find('.toolbar-browse-video').find('#video-input-url').focus();

            this.rootElement.find('.toolbar-browse-video').find('#video-input-url').bind("paste", (event: any) => {
                event.preventDefault();
                event.stopPropagation();
                let pastedData = event.originalEvent.clipboardData.getData('text');
                $(event.currentTarget).val(pastedData)
                const url = pastedData;
                let dataStreaming = new VideoConetentDataModel();
                // let streamId = event.target.value;
                const streamDetail = this.commonService.getStreamId(url);

                if (streamDetail.streamId != null && streamDetail.channelStream == 'youtube') {
                    this.targetFile = 'https://www.youtube.com/embed/' + streamDetail.streamId;
                    dataStreaming.streamId = streamDetail.streamId;
                    dataStreaming.channelStream = streamDetail.channelStream;
                } else {
                    this.targetFile = streamDetail.streamId;
                    dataStreaming.streamId = streamDetail.streamId;
                    dataStreaming.channelStream = streamDetail.channelStream;
                }

                this.addVideo(dataStreaming,streamDetail.channelStream);


            })

            this.rootElement.find('.toolbar-browse-video').find('#video-input-url').on('input', this.commonService.debounce((event) => {
                event.preventDefault();
                if (event.target.value) {
                    const url = event.target.value;
                    let dataStreaming = new VideoConetentDataModel();
                    // let streamId = event.target.value;
                    const streamDetail = this.commonService.getStreamId(url);

                    if (streamDetail.streamId != null && streamDetail.channelStream == 'youtube') {
                        this.targetFile = 'https://www.youtube.com/embed/' + streamDetail.streamId;
                        dataStreaming.streamId = streamDetail.streamId;
                        dataStreaming.channelStream = streamDetail.channelStream;
                    } else {
                        this.targetFile = streamDetail.streamId;
                        dataStreaming.streamId = streamDetail.streamId;
                        dataStreaming.channelStream = streamDetail.channelStream;
                    }
                    this.addVideo(dataStreaming,streamDetail.channelStream);
                }
            }, 2000));
        });



    }
    private addVideo(dataStreaming, sourceType) {
        let streamData: VideoConetentDataModel = dataStreaming;
        let condition: VideoConetentConditionModel = new VideoConetentConditionModel();
        condition.isMustWatchingEnd = false;
        let video = {
            id: this.parentBox.attr('id') + '-video',
            data: streamData,
            path: null,
            parentId: this.parentBox.attr('id'),
            condition: condition
        }
        if (sourceType === 'videoSource') {
            const reader = new FileReader();
            reader.onload = ((event: any) => {
                video.path = event.target.result;
                this.rootElement.find('video').attr('src',event.target.result)
                .attr('id',this.parentBox.attr('id') + '-video')
                this.currentCase = this.actionCase.videoSource;
                this.contentDCtrlService.poolContents.videos.push(video)
                // this.videos.push(video);
            });
            reader.readAsDataURL(this.targetFile[0]);
        } else if (sourceType === 'youtube') {
            video.path = this.targetFile;
            this.rootElement.find('iframe').attr('src',this.targetFile)
            .attr('id',this.parentBox.attr('id') + '-video')
            this.currentCase = this.actionCase.videoYoutube;
            this.contentDCtrlService.poolContents.videos.push(video)
        }
        else if (sourceType === 'wistia') {
                this.currentCase = this.actionCase.videoWistia;
                video.path = this.targetFile;
                this.rootElement.find('.wistia_responsive').addClass('wistia_async_' + this.targetFile)
                this.contentDCtrlService.poolContents.videos.push(video)
                this.contentDCtrlService.setLastContent(this.parentBox);
        }
        let updateAction:UpdateContentModel = new UpdateContentModel()
        updateAction.actionCase  = 'showVideo'
        this.contentDCtrlService.updateContent = updateAction
        this.addDocumentTrackVideo();
    }
    private loadVideo(targetVideo:VideoContentModel){
        if (targetVideo.data.channelStream === 'videoSource') {

        }else if (targetVideo.data.channelStream === 'youtube') {

        }else if (targetVideo.data.channelStream === 'wistia') {
            this.currentCase = this.actionCase.videoWistia;
            this.rootElement.find('.wistia_responsive').addClass('wistia_async_' + targetVideo.data.streamId)
        }
    }
    private addDocumentTrackVideo(){
        let documentTrackContent = new DocumentTrackContent;
        documentTrackContent.parentId  = this.parentBox.attr('id');
        documentTrackContent.name  = this.parentBox.attr('name');
        documentTrackContent.id = this.parentBox.attr('id') + '-video'
        documentTrackContent.progress= 0;
        documentTrackContent.conditions.videoCondition.isMustWatchingEnd = false;
        documentTrackContent.conditions.videoCondition.isClickPlay = false;
        this.documentDCtrlService.documentTrack.contents.push(documentTrackContent)
    }

}
