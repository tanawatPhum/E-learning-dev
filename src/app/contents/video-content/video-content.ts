import { Component, Input, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from '../../services/content/content-data-control.service';
import { ContentInterFace } from '../interface/content.interface';
import { VideoConetentDataModel, VideoConetentConditionModel, VideoContentModel } from '../../models/document/elements/video-content.model';
import { CommonService } from '../../services/common/common.service';
import { UpdateContentModel, UploadFileModel } from '../../models/common/common.model';
import { DocumentTrackContent, DocumentTrackModel } from '../../models/document/document.model';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { Constants } from 'src/app/global/constants';
import { promise } from 'protractor';
import { ContentsModel } from '../../models/document/content.model';
declare var Wistia: any;

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
    private contentTypes = Constants.document.contents.types;
    private targetVideo: VideoContentModel = new VideoContentModel();
    private updateAction: UpdateContentModel = new UpdateContentModel();
    private documentTrackInterval: any;
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
        this.contentDCtrlService.getUpdateContent().subscribe((detail) => {
            if (detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm) {
                let targetDocumentContent: ContentsModel = detail.data;
                this.targetVideo = targetDocumentContent.videos.find((video) => video.parentId === this.parentBox.attr('id'))
                this.intialVideo();
            }
        })
    }
    ngAfterViewInit() {
        this.targetVideo = this.contentDCtrlService.poolContents.videos.find((video) => video.parentId === this.parentBox.attr('id'))
        this.intialVideo();
    }
    private intialVideo() {
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.createContent) {
            this.handleBrowseVideo();
        }
        else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
            if (this.targetVideo) {
                this.loadVideo(this.targetVideo)
                if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor) {
                    this.rootElement.find('.content-video').css('pointer-events', 'none')

                } else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
                    this.rootElement.find('.content-video').css('pointer-events', 'auto')
                    setTimeout(() => {
                        this.handleVideo();
                    }, 500);
                }
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
            this.rootElement.find('.content-wistia').addClass('wistia_responsive wistia_embed wistia_async_' + this.targetFile)
            this.contentDCtrlService.poolContents.videos.push(video)
            this.contentDCtrlService.setLastContent(this.parentBox);
        }
        this.updateAction.actionCase = 'showVideo'
        this.contentDCtrlService.updateContent = this.updateAction
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
            this.rootElement.find('.content-wistia').addClass('wistia_responsive wistia_embed wistia_async_' + targetVideo.data.streamId)
            // .attr('id', this.parentBox.attr('id') + '-video')
        }
    }
    private handleVideo() {
        let targetDocumentTrackIndex = this.documentDCtrlService.currentDocumentTrack.contents.findIndex((content) => content.parentId === this.parentBox.attr('id'))
        let targetDocumentTrack = this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex]
        if (targetDocumentTrack) {
            let targetVideo = this.contentDCtrlService.poolContents.videos.find((video) => video.parentId === targetDocumentTrack.parentId)
            if (targetVideo) {
                let isHasProgressBar = $('.content-progress-bar')
                let targetWistiaVideo = Wistia.api(targetVideo.data.streamId);
                targetWistiaVideo.time(targetDocumentTrack.data);
                // this.rootElement.find('.content-video').click((event) => {
                targetWistiaVideo.bind("play", (e) => {
                    this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex].conditions.videoCondition.isClickPlay = true;
                    return targetWistiaVideo.unblind;
                });
                targetWistiaVideo.bind("secondchange", () => {
                    if (isHasProgressBar.length > 0) {
                        this.updateAction.actionCase = Constants.document.contents.lifeCycle.playVideo;
                        this.contentDCtrlService.updateContent = this.updateAction
                    }
                    this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex].data = targetWistiaVideo.time()
                    this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex].progress = (targetWistiaVideo.time() / targetWistiaVideo.duration()) * 100;
                    this.documentTrackInterval = setInterval(() => {
                        this.handleDocumentTrack();
                    }, 4000)
                })
                targetWistiaVideo.bind("end", (e) => {
                    this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex].progress = 100;
                    this.updateAction.actionCase = Constants.document.contents.lifeCycle.playVideo;
                    this.contentDCtrlService.updateContent = this.updateAction
                    this.handleDocumentTrack();
                    clearInterval(this.documentTrackInterval)
                })
                targetWistiaVideo.bind("pause",  (e)=> {
                    this.handleDocumentTrack();
                    clearInterval(this.documentTrackInterval)
                });
            }
        }
    }
    private addDocumentTrackVideo() {
        let documentTrackContent = new DocumentTrackContent;
        documentTrackContent.contentType = this.contentTypes.video;
        documentTrackContent.parentId = this.parentBox.attr('id');
        documentTrackContent.name = this.parentBox.attr('name');
        documentTrackContent.id = this.parentBox.attr('id') + '-video'
        documentTrackContent.progress = 0;
        documentTrackContent.conditions.videoCondition.isMustWatchingEnd = false;
        documentTrackContent.conditions.videoCondition.isClickPlay = false;
        this.documentDCtrlService.documentTrack.contents.push(documentTrackContent)
    }
    private handleDocumentTrack() {
        let numberOfCondition = this.documentDCtrlService.currentDocumentTrack.contents.length;
        let numberOfProgress = 0;
        let currentDocumentTrack = this.documentDCtrlService.currentDocumentTrack.contents.filter((content) => content.contentType === this.contentTypes.video)
        currentDocumentTrack.forEach((content) => {
            if (content.conditions.videoCondition.isMustWatchingEnd) {
                numberOfProgress += content.progress
            } else if (content.conditions.videoCondition.isClickPlay) {
                numberOfProgress += 100
            }
        })
        this.documentDCtrlService.currentDocumentTrack.progress = numberOfProgress / numberOfCondition;
        this.saveDocumentTrack(this.documentDCtrlService.currentDocumentName).subscribe((status) => {
            // console.log(" this.currentDocumentTrack", this.currentDocumentTrack)          
        });
    }
    private saveDocumentTrack(nameDocument) {
        let saveObjectTrackTemplate: DocumentTrackModel = {
            id: this.commonService.getPatternId(nameDocument),
            nameDocument: nameDocument,
            userId: Constants.common.user.id,
            status: Constants.common.message.status.created.text,
            isTrackProgress: this.documentDCtrlService.currentDocumentTrack.contents.length > 0 ? true : false,
            progress: this.documentDCtrlService.currentDocumentTrack.contents.length === 0 ? 100 : this.documentDCtrlService.currentDocumentTrack.progress,
            contents: this.documentDCtrlService.currentDocumentTrack.contents
        }

        return this.documentService.saveDocumentTrack(nameDocument, saveObjectTrackTemplate)
    }

}
