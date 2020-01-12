import { Component, Input, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from '../../services/content/content-data-control.service';
import { ContentInterFace } from '../interface/content.interface';
import { VideoConetentDataModel, VideoConetentConditionModel, VideoContentModel } from '../../models/document/elements/video-content.model';
import { CommonService } from '../../services/common/common.service';
import { UpdateContentModel, UploadFileModel } from '../../models/common/common.model';
import { DocumentTrackContent } from '../../models/document/document.model';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { Constants } from 'src/app/global/constants';
import { promise } from 'protractor';


@Component({
    moduleId: module.id,
    selector: 'video-content',
    templateUrl: 'video-content.html',
    styleUrls: ['video-content.scss']
})
export class VideoContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    @Input() lifeCycle: string;
    @Input() parentBox: JQuery<Element>;
    @Input() data: any;
    @HostListener('click', ['$event']) onClick(event) {
        event.preventDefault();
        event.stopPropagation();

    }

    private rootElement: JQuery<Element>;
    private targetFile;
    private actionCase = {
        browseVideo: 'browseVideo',
        loadingVideo: 'loadingVideo',
        showVideo: 'showVideo',
        videoSource: 'videoSource',
        videoYoutube: 'videoYoutube',
        videoWistia: 'videoWistia'
    }
    private currentCase = this.actionCase.browseVideo;
    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private contentDCtrlService: ContentDataControlService,
        private documentDCtrlService: DocumentDataControlService,
        private element: ElementRef

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');
        // this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
        //     if(detail.actionCase === Constants.common.event.load.component || Constants.common.event.load.preview){
        //         this.parentBox  = this.rootElement.parents('.content-box');
        //         let targetVideo =  this.contentDCtrlService.poolContents.videos.find((video)=>video.parentId === this.parentBox.attr('id'))
        //         if(targetVideo.data.channelStream === 'wistia'){
        //            this.loadVideo(targetVideo)
        //         }
        //     }
        // })
    }
    ngAfterViewInit() {
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.createContent) {
            this.handleBrowseVideo();
        }
        else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
            let targetVideo = this.contentDCtrlService.poolContents.videos.find((video) => video.parentId === this.parentBox.attr('id'))
            if (targetVideo) {
                if(this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor){
                    this.rootElement.find('.content-video').css('pointer-events','none')

                }else if(this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview){
                    this.rootElement.find('.content-video').css('pointer-events','auto')
                }
                this.loadVideo(targetVideo)
            }

        }
    }
    private handleBrowseVideo() {
        this.rootElement.find('#btn-video').unbind('click').bind('click', () => {
            this.rootElement.find('.content-browse-video').click((event) => {
                event.stopPropagation();
            })
            this.rootElement.find('.content-browse-video').trigger('click');
            this.rootElement.find('.content-browse-video').change((event) => {
                let dataStreaming = new VideoConetentDataModel();
                dataStreaming.channelStream = 'videoSource';
                const target = event.target as HTMLInputElement;
                this.targetFile = target.files;



                // dataStreaming.channelStream = 
                console.log(' ❏ Video :', this.targetFile);
                this.addVideo(dataStreaming, 'videoSource');
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
            let dataStreaming = new VideoConetentDataModel();
            dataStreaming.channelStream = 'videoSource';
            this.addVideo(dataStreaming, 'videoSource');
        });
        this.rootElement.find('.toolbar-browse-video').find('#video-input-url').unbind('click').bind('click', () => {
            event.preventDefault();
            event.stopPropagation();
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

                this.addVideo(dataStreaming, streamDetail.channelStream);


            })

            this.rootElement.find('.toolbar-browse-video').find('#video-input-url').unbind('input').bind('input', this.commonService.debounce((event) => {
                event.preventDefault();
                event.stopPropagation();
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
                    this.addVideo(dataStreaming, streamDetail.channelStream);
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
            this.currentCase = this.actionCase.loadingVideo;
            let awsFileName = this.commonService.getPatternAWSName(this.targetFile[0].name) || 'fileName';
            let uploadFile: UploadFileModel = {
                data: this.targetFile[0],
                awsFileName: awsFileName
            }
            this.documentService.uploadFile([uploadFile]).subscribe(() => {
                let videoPath = Constants.common.host.storage + awsFileName;
                this.currentCase = this.actionCase.showVideo;
                video.path = videoPath;
                this.rootElement.find('video').attr('src', videoPath)
                    .attr('id', this.parentBox.attr('id') + '-video')
                this.currentCase = this.actionCase.videoSource;
                this.contentDCtrlService.poolContents.videos.push(video)
                this.contentDCtrlService.setLastContent(this.parentBox);
            })
        } else if (sourceType === 'youtube') {
            video.path = this.targetFile;
            this.rootElement.find('iframe').attr('src', this.targetFile)
                .attr('id', this.parentBox.attr('id') + '-video')
            this.currentCase = this.actionCase.videoYoutube;
            this.contentDCtrlService.poolContents.videos.push(video)
            this.contentDCtrlService.setLastContent(this.parentBox);
        }
        else if (sourceType === 'wistia') {
            this.currentCase = this.actionCase.videoWistia;
            video.path = this.targetFile;
            this.rootElement.find('.wistia_responsive').addClass('wistia_async_' + this.targetFile)
            this.contentDCtrlService.poolContents.videos.push(video)
            this.contentDCtrlService.setLastContent(this.parentBox);
        }
        let updateAction: UpdateContentModel = new UpdateContentModel()
        updateAction.actionCase = 'showVideo'
        this.contentDCtrlService.updateContent = updateAction
        this.contentDCtrlService.setLastContent(this.parentBox);
        this.addDocumentTrackVideo();
    }
    private loadVideo(targetVideo: VideoContentModel) {
        
        if (targetVideo.data.channelStream === 'videoSource') {
            this.rootElement.find('video').attr('src', targetVideo.path)
                .attr('id', this.parentBox.attr('id') + '-video')

        } else if (targetVideo.data.channelStream === 'youtube') {

            this.currentCase = this.actionCase.videoYoutube;
            this.rootElement.find('iframe').attr('src', targetVideo.path)
                .attr('id', this.parentBox.attr('id') + '-video')

        } else if (targetVideo.data.channelStream === 'wistia') {
            this.currentCase = this.actionCase.videoWistia;
            this.rootElement.find('.wistia_responsive').addClass('wistia_async_' + targetVideo.data.streamId)
                .attr('id', this.parentBox.attr('id') + '-video')
        }
    }

    private addDocumentTrackVideo() {
        let documentTrackContent = new DocumentTrackContent;
        documentTrackContent.parentId = this.parentBox.attr('id');
        documentTrackContent.name = this.parentBox.attr('name');
        documentTrackContent.id = this.parentBox.attr('id') + '-video'
        documentTrackContent.progress = 0;
        documentTrackContent.conditions.videoCondition.isMustWatchingEnd = false;
        documentTrackContent.conditions.videoCondition.isClickPlay = false;
        this.documentDCtrlService.documentTrack.contents.push(documentTrackContent)
    }

}
