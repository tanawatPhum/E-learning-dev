import { Component, Input, ElementRef, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
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
export class VideoContentComponent implements OnInit,OnDestroy, ContentInterFace, AfterViewInit {
    @Input() lifeCycle: string;
    @Input() parentBox: JQuery<Element>;
    @Input() data: any;
    @HostListener('click', ['$event']) onClick(event) {
        event.preventDefault();
        event.stopPropagation();

    }

    public rootElement: JQuery<Element>;
    public targetFile;
    public contentTypes = Constants.document.contents.types;
    public targetVideo: VideoContentModel = new VideoContentModel();
    public updateAction: UpdateContentModel = new UpdateContentModel();
    public documentTrackInterval: any;
    public videoTypes  =Constants.document.contents.constats.videoTypes;
    public actionCase = {
        browseVideo: 'browseVideo',
        loadingVideo: 'loadingVideo',
        showVideo: 'showVideo',
        videoSource: 'videoSource',
        videoYoutube: 'videoYoutube',
        videoWistia: 'videoWistia'
    }
    public currentCase = this.actionCase.browseVideo;
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
            if (detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm  && detail.for === this.parentBox.attr('id')) {
                let targetDocumentContent: ContentsModel = detail.data;
                this.targetVideo = targetDocumentContent.videos.find((video) => video.parentId === this.parentBox.attr('id'))
                this.intialVideo();
            }
        })
    }
    ngOnDestroy(){
        clearInterval(this.documentTrackInterval)
    }
    ngAfterViewInit() {
        this.targetVideo = this.contentDCtrlService.poolContents.videos.find((video) => video.parentId === this.parentBox.attr('id'))
        this.intialVideo();
    }

    public intialVideo() {
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.createContent) {
            if(this.data){
                this.targetFile = this.data;
                let dataStreaming = new VideoConetentDataModel();
                dataStreaming.channelStream = this.videoTypes.browseFile;
                this.addVideo(dataStreaming, dataStreaming.channelStream);
            }else{
                this.handleBrowseVideo();
            }
        }
        else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
            if (this.targetVideo) {
                this.loadVideo(this.targetVideo)
                if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor) {
                    this.parentBox.css('margin','0')
                    this.rootElement.find('.content-video').css('pointer-events', 'none')

                } else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
                    this.rootElement.find('.content-video').css('pointer-events', 'auto')
                 
                    this.parentBox.css('margin','10px 0 10px 0')
                    setTimeout(() => {
                        this.handleVideo();
                    }, 500);
                }
            }
        }
    }
    public handleBrowseVideo() {

        this.rootElement.find('#btn-video').unbind('click').bind('click', () => {
            this.rootElement.find('.content-browse-video').click((event) => {
                event.stopPropagation();
            })
            this.rootElement.find('.content-browse-video').trigger('click');
            this.rootElement.find('.content-browse-video').change((event) => {
                let dataStreaming = new VideoConetentDataModel();
                dataStreaming.channelStream = this.videoTypes.browseFile;
                const target = event.target as HTMLInputElement;
                this.targetFile = target.files;
                // dataStreaming.channelStream = 
                console.log(' ❏ Video :', this.targetFile);
                this.addVideo(dataStreaming, dataStreaming.channelStream);
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
            dataStreaming.channelStream = this.videoTypes.browseFile;
            this.addVideo(dataStreaming, dataStreaming.channelStream);
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

                if (streamDetail.streamId != null && streamDetail.channelStream == this.videoTypes.youtube) {
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

                    if (streamDetail.streamId != null && streamDetail.channelStream == this.videoTypes.youtube) {
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
    public addVideo(dataStreaming, sourceType) {
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
        if (sourceType === this.videoTypes.browseFile) {
            this.currentCase = this.actionCase.loadingVideo;
            let awsFileName = this.commonService.getPatternAWSName(this.targetFile[0].name) || 'fileName';
            let uploadFile: UploadFileModel = {
                data: this.targetFile[0],
                awsFileName: awsFileName
            }
            this.documentService.uploadFile([uploadFile]).subscribe((url) => {
                // let videoPath = Constants.common.host.storage + awsFileName;
                let videoPath =url;
                this.currentCase = this.actionCase.showVideo;
                video.path = videoPath;
                this.rootElement.find('video').attr('src', videoPath)
                    .attr('id', this.parentBox.attr('id') + '-video')
                this.currentCase = this.actionCase.videoSource;
                this.contentDCtrlService.poolContents.videos.push(video)
                this.contentDCtrlService.setLastContent(this.parentBox);
            })
        } else if (sourceType === this.videoTypes.youtube) {
            video.path = this.targetFile;
            this.rootElement.find('iframe').attr('src', this.targetFile)
                .attr('id', this.parentBox.attr('id') + '-video')
            this.currentCase = this.actionCase.videoYoutube;
            this.contentDCtrlService.poolContents.videos.push(video)
            this.contentDCtrlService.setLastContent(this.parentBox);
        }
        else if (sourceType === this.videoTypes.wistia) {
            this.currentCase = this.actionCase.videoWistia;
            video.path = this.targetFile;
            this.rootElement.find('.content-wistia').addClass('wistia_responsive wistia_embed wistia_async_' + this.targetFile)
            this.contentDCtrlService.poolContents.videos.push(video)
            this.contentDCtrlService.setLastContent(this.parentBox);
        }
        this.updateAction.actionCase = 'showVideo'
        this.contentDCtrlService.updateContent = this.updateAction
        this.contentDCtrlService.setLastContent(this.parentBox);
        if(sourceType === this.videoTypes.wistia){
            this.addDocumentTrackVideo();
        }
        
    }
    private loadVideo(targetVideo: VideoContentModel) {
        if (targetVideo.data.channelStream === this.videoTypes.browseFile) {
            this.currentCase = this.actionCase.videoSource;
            this.rootElement.find('video').attr('src', targetVideo.path)
                .attr('id', this.parentBox.attr('id') + '-video')

        } else if (targetVideo.data.channelStream === this.videoTypes.youtube) {

            this.currentCase = this.actionCase.videoYoutube;
            this.rootElement.find('iframe').attr('src', targetVideo.path)
                .attr('id', this.parentBox.attr('id') + '-video')

        } else if (targetVideo.data.channelStream === this.videoTypes.wistia) {
            this.currentCase = this.actionCase.videoWistia;
            this.rootElement.find('.content-wistia').addClass('wistia_responsive wistia_embed wistia_async_' + targetVideo.data.streamId)
           
            // .attr('id', this.parentBox.attr('id') + '-video')
        }

      
    }
    public handleVideo() {
        this.rootElement.find('.content-video').css('height',this.parentBox.height())
        // this.parentBox.after('<br>')
        // console.log(this.parentBox)
        let targetDocumentTrackIndex = this.documentDCtrlService.currentDocumentTrack.contents.findIndex((content) => content.parentId === this.parentBox.attr('id'))
        let targetDocumentTrack = this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex]
        if (targetDocumentTrack) {
            let targetVideo = this.contentDCtrlService.poolContents.videos.find((video) => video.parentId === targetDocumentTrack.parentId)
            if (targetVideo) {
                let isHasToDoList= $('.content-toDoList')
                let isHasProgressBar = $('.content-progress-bar')
                let targetWistiaVideo = Wistia.api(targetVideo.data.streamId);
                targetWistiaVideo.time(targetDocumentTrack.data);
                this.rootElement.find('.content-video').click((event) => {
                    this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex].conditions.videoCondition.isClickPlay = true;
                    if(isHasToDoList.length >0){
                        this.updateAction.for  = this.contentTypes.todoList;
                        this.updateAction.actionCase = Constants.document.contents.lifeCycle.playVideo;
                        this.contentDCtrlService.updateContent = this.updateAction
                    }
                })
                // targetWistiaVideo.bind("play", (e) => {
                  
                    // if(isHasToDoList.length >0){
                    //     this.updateAction.actionCase = Constants.document.contents.lifeCycle.playVideo;
                    //     this.contentDCtrlService.updateContent = this.updateAction
                 
                    // }
                //     return targetWistiaVideo.unblind;
                // });
                targetWistiaVideo.bind("secondchange", () => {
                    if (isHasProgressBar.length > 0) {
                        this.updateAction.for  = this.contentTypes.progressBar;
                        this.updateAction.actionCase = Constants.document.contents.lifeCycle.playVideo;
                        this.contentDCtrlService.updateContent = this.updateAction
                    }
               
                    this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex].data = targetWistiaVideo.time()
                    this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex].progress = (targetWistiaVideo.time() / targetWistiaVideo.duration()) * 100;
                    if(!this.documentTrackInterval){
                        this.documentTrackInterval = setInterval(() => {
                            let currentDocument =  JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocument))
                            let documentTrack = JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocumentTrack))
                            let contents = JSON.parse(JSON.stringify(this.contentDCtrlService.poolContents))

                            this.documentService.handleDocumentTrack(currentDocument,documentTrack,contents).subscribe(()=>{
                                clearInterval(this.documentTrackInterval)
                                this.documentTrackInterval = null;
                            });
                        }, 4000)
                    }
         
                })
                targetWistiaVideo.bind("end", (e) => {
                    this.documentDCtrlService.currentDocumentTrack.contents[targetDocumentTrackIndex].progress = 100;
                    this.updateAction.actionCase = Constants.document.contents.lifeCycle.playVideo;
                    // this.contentDCtrlService.updateContent = this.updateAction
                    if(isHasToDoList.length >0){
                        this.updateAction.for  = this.contentTypes.todoList;
                        this.contentDCtrlService.updateContent = this.updateAction
                    }
                    if (isHasProgressBar.length > 0) {
                        this.updateAction.for  = this.contentTypes.progressBar;
                        this.contentDCtrlService.updateContent = this.updateAction
                    }
                    let currentDocument =  JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocument))
                    let documentTrack = JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocumentTrack))
                    let contents = JSON.parse(JSON.stringify(this.contentDCtrlService.poolContents))
                    this.documentService.handleDocumentTrack(currentDocument,documentTrack,contents).subscribe(()=>{
                        clearInterval(this.documentTrackInterval)
                        this.documentTrackInterval = null;
                    });
              
                })
                targetWistiaVideo.bind("pause",  (e)=> {
                    let currentDocument =  JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocument))
                    let documentTrack = JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocumentTrack))
                    let contents = JSON.parse(JSON.stringify(this.contentDCtrlService.poolContents))
                    this.documentService.handleDocumentTrack(currentDocument,documentTrack,contents).subscribe(()=>{
                        clearInterval(this.documentTrackInterval)
                        this.documentTrackInterval = null;
                    });
                });
            }
        }
    }
    public addDocumentTrackVideo() {
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
    // private handleDocumentTrack() {
    //     let numberOfCondition = this.documentDCtrlService.currentDocumentTrack.contents.length;
    //     let numberOfProgress = 0;
    //     let currentDocumentTrack = this.documentDCtrlService.currentDocumentTrack.contents.filter((content) => content.contentType === this.contentTypes.video)
    //     currentDocumentTrack.forEach((content) => {
    //         if (content.conditions.videoCondition.isMustWatchingEnd) {
    //             numberOfProgress += content.progress
    //         } else if (content.conditions.videoCondition.isClickPlay) {
    //             numberOfProgress += 100
    //         }
    //     })
    //     this.documentDCtrlService.currentDocumentTrack.progress = numberOfProgress / numberOfCondition;
    //     this.saveDocumentTrack(this.documentDCtrlService.currentDocumentName).subscribe((status) => {
    //         // console.log(" this.currentDocumentTrack", this.currentDocumentTrack)          
    //     });
    // }
    // private saveDocumentTrack(nameDocument) {
    //     let saveObjectTrackTemplate: DocumentTrackModel = {
    //         id: this.commonService.getPatternId(nameDocument),
    //         nameDocument: nameDocument,
    //         userId: Constants.common.user.id,
    //         status: Constants.common.message.status.created.text,
    //         isTrackProgress: this.documentDCtrlService.currentDocumentTrack.contents.length > 0 ? true : false,
    //         progress: this.documentDCtrlService.currentDocumentTrack.contents.length === 0 ? 100 : this.documentDCtrlService.currentDocumentTrack.progress,
    //         contents: this.documentDCtrlService.currentDocumentTrack.contents
    //     }

    //     return this.documentService.saveDocumentTrack(nameDocument, saveObjectTrackTemplate)
    // }

}
