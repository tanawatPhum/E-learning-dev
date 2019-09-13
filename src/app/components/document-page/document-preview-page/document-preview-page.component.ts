import { Component, ViewChild, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { DocumentService } from '../../../services/document/document.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentModel } from '../../../models/document/content.model';
import { ScreenDetailModel } from 'src/app/models/common/common.model';
import { Constants } from '../../../global/constants';
import { CommonService } from '../../../services/common/common.service';
import { find } from 'rxjs/operators';
import { commentContentModel, commentDetailModel } from '../../../models/document/elements/comment-content.model';
import { BoxContentModel } from '../../../models/document/elements/box-content.model';
import { TextAreaContentModel } from '../../../models/document/elements/textarea-content.model';
import { ImgContentModel } from 'src/app/models/document/elements/img-content.model';
import { VideoContentModel } from '../../../models/document/elements/video-content.model';
import { SubFormContentModel } from '../../../models/document/elements/subForm-content.model';
import { Observable, Subscriber, interval } from 'rxjs';
import { async } from 'q';
import { ToDoListContentModel } from '../../../models/document/elements/todoList-content.model';
import { ProgressBarContentModel } from '../../../models/document/elements/progressBar-content-model';
import { DocumentTrackModel } from '../../../models/document/document.model';
import { runInThisContext } from 'vm';
import { FileContentModel } from '../../../models/document/elements/file-content.model';
import { LinkContentModel } from 'src/app/models/document/elements/link-content.model';
import { ExamContentModel } from 'src/app/models/document/elements/exam-content.model';
import { CommonDataControlService } from '../../../services/common/common-data-control.service';


declare var electron: any;
declare var Wistia: any;
@Component({
    selector: 'document-preview-page',
    templateUrl: 'document-preview-page.component.html',
    styleUrls: ['../../document-page/document-page.component.scss']
})
export class DocumentPreviewPageComponent implements OnInit ,OnDestroy{
    @ViewChild('documentPreviewContent', { static: true }) documentPreviewContent: ElementRef;
    private rootElement: JQuery<Element>;
    private currentResult: DocumentModel = new DocumentModel();
    private contentTemplateSize: ScreenDetailModel = new ScreenDetailModel();
    // private currentScreenSize: ScreenDetailModel = new ScreenDetailModel();
    private documentTracks: DocumentTrackModel[] = new Array<DocumentTrackModel>();
    private currentDocumentTrack: DocumentTrackModel = new DocumentTrackModel();
    public boxType = Constants.document.boxes.types;
    // private currentCommentIsChild:boolean = false;
    // private currentMessage:string;
    private currentCommentDetail:commentDetailModel = new commentDetailModel();

    // private currentBrowseFile:any;
    public isUrlChannel: boolean = false;
    public actions = {
        element: {
            addElCommentBox: 'addElCommentBox',
            addElReplyCommentBox: 'addElReplyCommentBox',
            previewElement: 'previewElement',
            ratioElement: 'ratioElement',
            setCommentElement: 'setCommentElement',
            setResultElement: 'setResultElement'
        },
        handle: {
            handleSubForm: 'handleSubForm',
            handleVideo: 'handleVideo',
            handleProgressBar: 'handleProgressBar',
            handleComment: 'handleComment',
            handleToDoList: 'handleToDoList',
            handleFile: 'handleFile',
            handleLink: 'handleLink',
            handleExam: 'handleExam',
            handleDocumentTrack:'handleDocumentTrack'
        },
        data: {
            retrieveResultData: 'retrieveResultData',
            setDocumentTrack: 'setDocumentTrack'
        },
        template: {
            setDocument: 'setDocument',
            setDocumentTrack: 'setDocumentTrack',

        }
    }
    public boxes: BoxContentModel[] = new Array<BoxContentModel>();
    public textAreas: TextAreaContentModel[] = new Array<TextAreaContentModel>();
    public imgs: ImgContentModel[] = new Array<ImgContentModel>();
    public videos: VideoContentModel[] = new Array<VideoContentModel>();
    public subForms: SubFormContentModel[] = new Array<SubFormContentModel>();
    public comments: commentContentModel[] = new Array<commentContentModel>();
    public toDoLists: ToDoListContentModel[] = new Array<ToDoListContentModel>();
    public files:FileContentModel[] = new Array<FileContentModel>();
    public links:LinkContentModel[] = new Array<LinkContentModel>();
    public exams:ExamContentModel[]  = new  Array<ExamContentModel>(); 
    public progressBars: ProgressBarContentModel[] = new Array<ProgressBarContentModel>();
    private documentTrackInterval:any;
    private currentUrlParam:any;
    constructor(
        private documentDataService: DocumentDataControlService,
        private documentService: DocumentService,
        private CommonDataService:CommonDataControlService,
        private commonService: CommonService,
        private router: Router,
        private route: ActivatedRoute
    ) { }
    // @HostListener('window:beforeunload', [ '$event' ])
    // beforeUnloadHander(event) {
        
    //     // this.saveDocument();
    //     // this.handles(this.actions.handle.handleDocumentTrack);
    // }
    ngOnInit() {
        
    }
    ngOnDestroy() {
        clearInterval(this.documentTrackInterval)
        $(document).find('body').css('overflow-x','auto');
        $(document).find('body').css('overflow-y','hidden');
    }
    ngAfterContentInit() {


// $(window).resize((event)=>{
//     this.contentTemplateSize.width = $(document).width();
//     this.contentTemplateSize.height = $(document).height();
//     console.log(this.contentTemplateSize)
//     this.setElements(this.actions.element.ratioElement);
// })

        // $(window).resize((event)=>{
        //     $('.document-preview-content').css('height',event.currentTarget.innerHeight - Constants.general.element.css.navBar.height) 
        //     this.currentScreenSize.height = event.currentTarget.innerHeight -Constants.general.element.css.navBar.height;
        //     this.currentScreenSize.width = event.currentTarget.innerWidth;
        //     this.rootElement.html(this.currentResult.html)
        //     this.setElements(this.actions.element.previewElement);
        // });
        this.setTemplate(this.actions.template.setDocument);
        this.route.queryParams.subscribe((params) => {
            this.currentUrlParam = params
            this.isUrlChannel = true;
            this.documentDataService.currentDocumentName = this.currentUrlParam['documentName'];
            if(this.currentUrlParam['userId']){
                this.CommonDataService.userId =  this.currentUrlParam['userId'];
            }
            
        })
        this.loadHtml(this.documentDataService.currentDocumentName);

    }

    public loadHtml(documentName?) {
        if (electron) {
            electron.ipcRenderer.send('request-read-document', documentName)
            electron.ipcRenderer.once('reponse-read-document', (event, result) => {
                console.log(' ❏ Object Document :', result);
                if (result) {
                    this.setElements(this.actions.element.setResultElement, null, result);
                    this.setTemplate(this.actions.template.setDocumentTrack);
                }
                this.currentResult = result;
            });
        } else {
            this.documentService.loadDocFromDB(this.commonService.getPatternId(documentName)).subscribe((result) => {
                console.log(' ❏ Object Document :', result)
                this.setElements(this.actions.element.setResultElement, null, result);
                this.setTemplate(this.actions.template.setDocumentTrack);
            });
        };
    }
    public setTemplate(action) {
        if (action === this.actions.template.setDocument) {
            this.contentTemplateSize = JSON.parse(localStorage.getItem('contentTemplateSize'));
            this.rootElement = $(this.documentPreviewContent.nativeElement);
            // - Constants.general.element.css.navBar.height
            this.rootElement.css('height', $(window).height())
            // this.currentScreenSize.height = $(this.rootElement).outerHeight();
            // this.currentScreenSize.width = $(this.rootElement).outerWidth();
            // $(window).resize((event) => {
            //     // this.currentScreenSize.height = $(this.rootElement).outerHeight();
            //     // this.currentScreenSize.width = $(this.rootElement).outerWidth();
            //     this.setElements(this.actions.element.ratioElement);
            // });
            
        }
        else if (action === this.actions.template.setDocumentTrack) {
            this.documentService.loadDocTrackFromDB().subscribe((documentTrack) => {
                this.documentTracks = documentTrack;
                console.log('documentTrack',documentTrack)
                if (this.documentTracks.length > 0) {
                    this.currentDocumentTrack = documentTrack.find((documentTrack) => documentTrack.id === this.commonService.getPatternId(this.documentDataService.currentDocumentName));
                    this.handles(this.actions.handle.handleDocumentTrack);
                    this.handles(this.actions.handle.handleToDoList);
                    this.handles(this.actions.handle.handleProgressBar);
                   this.documentTrackInterval = setInterval(()=>{
                        this.handles(this.actions.handle.handleDocumentTrack);
                    },2000)
                };
            })
            
        }
        // else if(action === this.actions.template.updateDocumentTrack){
        //     // this.documentTracks.forEach(()=>{

        //     // })
        // }
    }
    public setElements(action, elment?: JQuery<Element>, data?: any) {
        if (action === this.actions.element.setResultElement) {
            this.currentResult = data;
         let html = '<div id="contentTemplate" style="overflow-x:hidden;overflow-y:auto;position:relative; width:' + this.contentTemplateSize.width + 'px;height:' + this.contentTemplateSize.height + 'px">' + data.html + '</div>'
            this.rootElement.html(html);
            this.retrieveData(this.actions.data.retrieveResultData, data);
            this.setElements(this.actions.element.previewElement);
            this.handles(this.actions.handle.handleSubForm);
            this.handles(this.actions.handle.handleVideo);
            this.handles(this.actions.handle.handleComment);
            this.handles(this.actions.handle.handleFile);
            this.handles(this.actions.handle.handleLink);
            this.handles(this.actions.handle.handleExam);
           // this.handles(this.actions.handle.handleToDoList);
            this.setElements(this.actions.element.setCommentElement);
        }
        else if (action === this.actions.element.previewElement) {
            this.rootElement.find('.content-box').removeClass('content-box-active border border-primary');
            this.rootElement.find('.content-box').removeClass('ui-draggable ui-draggable-handle');
            this.rootElement.find('.content-box').removeClass('ui-resizable');
            this.rootElement.find('.content-box').removeClass('content-box-current');
            this.rootElement.find('.content-box').find('.ui-resizable-handle').remove();
            this.rootElement.find('.content-box').css('border', 'none');
            this.rootElement.find('.content-box').css('cursor', 'default');
            this.rootElement.find('.content-box').find('.content-toolbar').remove();
            this.rootElement.find('.content-box').find('.content-video').css('pointer-events', 'initial');
            this.rootElement.find('.content-box').find('.content-textarea').each((index, element) => {
                let targetTextArea = this.currentResult.contents.textAreas.find((textArea) => textArea.id == $(element).attr('id'));
                $('[id="' + $(element).attr('id') + '"]').val(targetTextArea.value);
                $('[id="' + $(element).attr('id') + '"]').attr('disabled', 'true');
            });
            this.rootElement.find('.content-box').find('.content-subform').find('li').attr('contenteditable', 'false');
            this.rootElement.find('.content-box').find('.content-box-label').remove();
            this.rootElement.find('.template-doc').attr('contenteditable', 'false');

            // this.rootElement.find('.template-doc').css('width', this.documentDataService.currentScreenSize.width +'px');
            this.rootElement.find('.content-box').find('.content-progress-bar').find('.progress-bar').css('width', 0)
            this.rootElement.find('.content-comment').css('height', 'auto');
            this.rootElement.find('.content-comment').find('.comment-form').css('padding-bottom', '2.5%');

            $(document).find('body').css('overflow-x','hidden');
            $(document).find('body').css('overflow-y','hidden');
            this.setElements(this.actions.element.ratioElement)
        }
        if (action === this.actions.element.ratioElement) {
            // let ratioW;
            // let ratioH;


            // let scale = Math.min(
            //     this.documentDataService.currentScreenSize.width/ this.contentTemplateSize.width,    
            //     this.documentDataService.currentScreenSize.height /(this.contentTemplateSize.height+93)
            //   );
            //   console.log(scale)
            //   this.rootElement.find('#contentTemplate').css({
            //     transform: 'scale( '+ scale + ')',
            //     transformOrigin: 'left top'
            // });
            let ratioW = this.documentDataService.currentScreenSize.width / this.contentTemplateSize.width;
            let ratioH = this.documentDataService.currentScreenSize.height / (this.contentTemplateSize.height+93)


            // console.log("currentScreen",this.documentDataService.currentScreenSize)
            // console.log("contentTemplateSize",this.contentTemplateSize)
            // console.log("ratioW",ratioW)
            console.log(this.documentDataService.currentScreenSize)
            // this.rootElement.find('#contentTemplate').css({
            //     transform: 'scale( ' + ratioW + ')',
            //     transformOrigin: 'left top'
            // });

            this.rootElement.find('#contentTemplate').css({
                        transform: 'scale( ' + ratioW +',' + ratioH + ')',
                        transformOrigin: 'left top'
                    });

            // this.rootElement.css({
            //     transform: 'scale( ' + ratioW +',' + ratioH + ')',
            //     transformOrigin: 'left top'
            // });
            // this.rootElement.find('#contentTemplate').css({
            //     transform: 'scale( ' + ratioH + ')',
            //     transformOrigin: 'left top'
            // });
            // this.rootElement.css({
            //     transform: 'scale( ' + ratioW + ')',
            //     transformOrigin: 'left top'
            // });
            // if (ratioW > ratioH) {

            //     this.rootElement.css({
            //             transform: 'scale( ' + ratioW + ')',
            //             transformOrigin: 'left top'
            //         });
            //     // this.rootElement.find('#contentTemplate').css({
            //     //     transform: 'scale( ' + ratioW + ')',
            //     //     transformOrigin: 'left top'
            //     // });
            // } else {
            //     this.rootElement.css({
            //         transform: 'scale( ' + ratioH + ')',
            //         transformOrigin: 'left top'
            //     });
            //     // this.rootElement.find('#contentTemplate').css({
            //     //     transform: 'scale( ' + ratioH + ')',
            //     //     transformOrigin: 'left top'
            //     // });
            // }

        }
        else if (action === this.actions.element.setCommentElement) {
            this.comments.forEach(async (parentBox) => {
                for await(const comment of parentBox.listComment){
                    this.currentCommentDetail.id = comment.id;
                    this.currentCommentDetail.message = comment.message;
                    this.currentCommentDetail.imgData = comment.imgData;
                    this.currentCommentDetail.liked = comment.liked;
                    await this.addElements(this.actions.element.addElReplyCommentBox, $('#' + parentBox.id), Constants.common.event.load.html).then(async (status)=>{
                        for await(const child of comment.childs){
                            this.currentCommentDetail.id = child.id;
                            this.currentCommentDetail.message = child.message;
                            this.currentCommentDetail.imgData = child.imgData;
                            this.currentCommentDetail.isChild = child.isChild;
                            this.currentCommentDetail.liked = child.liked;
                            await this.addElements(this.actions.element.addElReplyCommentBox, $('#' + comment.id), Constants.common.event.load.html)
                        }
                    })
                }
            })
        }
    }
    public backToDocumentHome() {
        this.router.navigate(['documentHome'])
    }
    private async addElements(action: string, element?: JQuery<Element>, subaction?: string, subElement?: any, data?: any) {
        if (action === this.actions.element.addElCommentBox) {
            let htmlToolComment = '<div id="comment-box-current" class="row comment-form submit w-100 h-auto comment-reply-current  comment-reply-child">';
            htmlToolComment += '<div class="row comment-form submit m-0 w-100">';
            htmlToolComment += '<div class="col-12">';
            htmlToolComment += '<div class="row m-0 max-height">';
            htmlToolComment += '<div   class="col-1 half-height pl-3">';
            htmlToolComment += '<div class="comment-profile icon">';
            htmlToolComment += '<img src="assets/imgs/documentPage/profileIcon.svg">';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col-10 pt-4 pl-5 half-height">';
            htmlToolComment += '<textarea placeholder="Leave your comment here..." class="comment-textarea"></textarea>';
            htmlToolComment += '<div  class="comment-massege-img"></div>'
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col-12 pr-3 pt-2">';
            htmlToolComment += '<div class="row m-0">';
            htmlToolComment += '<div class="col-1  half-height">';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col-6 pl-5">';
            htmlToolComment += '<div  id="comment-attach" class="comment-tool attach">';
            htmlToolComment += '<input type="file" class="comment-browse-file" id="comment-input-file">'
            htmlToolComment += '<img src="assets/imgs/contentPage/attachment.svg">';
            htmlToolComment += '</div>';
            htmlToolComment += '<div id="comment-question" class="comment-tool question">';
            // htmlToolComment += '<img  src="assets/imgs/contentPage/question.svg">';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col pt-3 ">';
            htmlToolComment += '<button data-commentReplyId="' + element.attr('id') + '" type="button" class="btn btn-primary float-right comment-btn-post-reply">Post Comment</button>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            element.append(htmlToolComment);
            this.handles(this.actions.handle.handleComment, element)
        }
        else if (action === this.actions.element.addElReplyCommentBox) {
            let htmlToolComment = '<div id="comment-reply-' + ($('.comment-reply').length + 1) + '" class="row comment-form submit m-0 w-100 h-auto comment-reply">';
            htmlToolComment += '<div class="col-12">';
            htmlToolComment += '<div class="row m-0 max-height">';
            htmlToolComment += '<div   class="col-1  pl-3 pt-1 ">';
            htmlToolComment += '<div class="comment-profile-reply icon">';
            htmlToolComment += '<img src="assets/imgs/documentPage/profileIcon.svg">';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col-10 pt-4 pl-5 ">';
            htmlToolComment += '<div class="reply-user-name">test</div>';
            htmlToolComment += '<div class="reply-user-massege">' + this.currentCommentDetail.message;
            htmlToolComment += '<div class="reply-user-massege-img"></div>'
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col-12 pr-3 pt-2">';
            htmlToolComment += '<div class="row m-0">';
            htmlToolComment += '<div class="col-1  half-height">';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col-6 pl-5">';
            htmlToolComment += '<div class="reply-tool">';
            if (this.currentCommentDetail.liked === 0) {
                htmlToolComment += '<span data-numberLike="' + this.currentCommentDetail.liked + '" class="liked-text">Liked</span>';
            } else {
                htmlToolComment += '<span data-numberLike="' + this.currentCommentDetail.liked + '" class="liked-text">Liked ' + this.currentCommentDetail.liked + '</span>';
            }

            if (!this.currentCommentDetail.isChild) {
                htmlToolComment += '<span class="reply-text"  data-commentReplyId="comment-reply-' + ($('.comment-reply').length + 1) + '" >Reply</span>';
            }
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            element.append(htmlToolComment);
            let targetCommentIndex;
            let replyComment: commentDetailModel = {
                id: 'comment-reply-' + $('.comment-reply').length,
                userId: 0,
                message: this.currentCommentDetail.message,
                isQuestion: false,
                imgData: null,
                isChild: false,
                liked: 0,
                childs: []
            }
            if (subaction == "replyChild" || subaction == Constants.common.event.load.html) {
                element.find('#comment-box-current').remove();
                if (this.currentCommentDetail.isChild) {
                    element.find('#' + 'comment-reply-' + $('.comment-reply').length).addClass('comment-reply-child');
                }
                targetCommentIndex = this.comments.findIndex((parentBox) => parentBox.id === (element.parents('.content-comment').attr('id')||element.attr('id')))  ;
                
            } else if (subaction != "replyChild" && subaction != Constants.common.event.load.html) {
                targetCommentIndex = this.comments.findIndex((parentBox) => parentBox.id === element.attr('id'));
            }
            // console.log(targetCommentIndex)
            // console.log(this.currentCommentDetail)

            
            if (targetCommentIndex != -1) {
                if (this.currentCommentDetail.imgData) {
                    const reader = new FileReader();
                    return new Promise((resovle,reject)=>{
                        reader.onload = ((event: any) => {
                            console.log(this.currentCommentDetail)
                            let commentImg = '<img src="' + event.target.result + '" id="'+this.currentCommentDetail.id  + '-img"></img>'
                            element.find('#'+this.currentCommentDetail.id ).find('.reply-user-massege-img').html(commentImg)
                            replyComment.imgData = this.currentCommentDetail.imgData
                            // this.currentCommentDetail.imgData = null;
                            if (subaction != "replyChild" && subaction != Constants.common.event.load.html) {
                                if (!this.comments[targetCommentIndex].listComment.find((comment) => comment.id == replyComment.id)) {
                                    this.comments[targetCommentIndex].listComment.push(replyComment);
                                }
                            } else if (subaction == "replyChild") {
                                replyComment.isChild = true;
                                let targetCommentReply = this.comments[targetCommentIndex].listComment.findIndex((comment) => comment.id === element.attr('id'))
                                this.comments[targetCommentIndex].listComment[targetCommentReply].childs.push(replyComment)
    
                            }
    
                            if (subaction === Constants.common.event.click.save || subaction == "replyChild") {
                                this.saveDocument();
                            }
                            this.handles(this.actions.handle.handleComment, element)
                            resovle(Constants.common.message.status.success.text)
                        });
                        // console.log("this.currentCommentDetail.imgData[0]",this.currentCommentDetail.imgData[0])
          
                        reader.readAsDataURL(this.currentCommentDetail.imgData[0]);
                    })

                } else {
                    if (subaction != "replyChild" && subaction != Constants.common.event.load.html) {

                        if (!this.comments[targetCommentIndex].listComment.find((comment) => comment.id == replyComment.id)) {
                            this.comments[targetCommentIndex].listComment.push(replyComment);
                        }
                    } else if (subaction == "replyChild") {
                        replyComment.isChild = true;
                        let targetCommentReply = this.comments[targetCommentIndex].listComment.findIndex((comment) => comment.id === element.attr('id'))
                        this.comments[targetCommentIndex].listComment[targetCommentReply].childs.push(replyComment)
                    }
                    if (subaction === Constants.common.event.click.save || subaction == "replyChild") {
                        this.saveDocument();
                    }
                }
            }

            this.handles(this.actions.handle.handleComment, element)
        }

    }
    private handles(action: string, element?: JQuery<Element>, subaction?: string, data?: any) {
        if (action === this.actions.handle.handleSubForm) {
            this.rootElement.find('.content-subform').find('li').click((element) => {
                // console.log($(event.currentTarget).attr('data-subformName'))

                // this.router.navigate(['documentPreview'], { queryParams: {documentName:$(event.currentTarget).attr('data-subformName') }})
                this.goToSubForm($(element.currentTarget));
                // this.loadHtml($(event.currentTarget).attr('data-subformName'))
            })
            this.rootElement.find('.carousel-control-next').click((event) => {
                $('#' + $(event.currentTarget).attr('data-subformId')).carousel('next');
            })
            this.rootElement.find('.carousel-control-prev').click((event) => {
                $('#' + $(event.currentTarget).attr('data-subformId')).carousel('prev');
            })
        }
        else if (action === this.actions.handle.handleVideo) {
            setTimeout(() => {
                this.currentDocumentTrack.contents.forEach((content)=>{
                    if(content.boxType === this.boxType.boxVideo){
                    let targetVideo = this.videos.find((video)=>video.id === content.id)
                    let targetWistiaVideo =  Wistia.api(targetVideo.data.wistiaId);
                    targetWistiaVideo.time(content.data);
                    }

                })
                // this.currentResult.contents.videos.forEach(async video => {
                //     let targetvideo =  Wistia.api(video.data.wistiaId);
                //     targetvideo.time(video.data.currentWatchingTime);
                // });
            }, 300);
            this.rootElement.find('.content-video').click((event) => {
                let targetVideoIndex = this.currentResult.contents.videos.findIndex((video) => video.id === $(event.currentTarget).attr('id'))
                let targetVideo = this.currentResult.contents.videos[targetVideoIndex];
                if (targetVideo.data.channelStream === 'wistia') {
                    let video = Wistia.api(targetVideo.data.wistiaId);
                    let isHasProgressBar = this.rootElement.find('.content-progress-bar')
                    let isHasToDoList= this.rootElement.find('.content-toDoList')
                    let targetVideoTrackIndex = this.currentDocumentTrack.contents.findIndex(content => content.parentId === this.currentResult.contents.videos[targetVideoIndex].parentId)
                    video.bind("play", ()=> {
                        this.currentDocumentTrack.contents[targetVideoTrackIndex].conditions.videoCondition.isClickPlay =  true;
                      //  console.log(this.currentDocumentTrack.contents[targetVideoTrackIndex]);
                        if (isHasToDoList.length > 0) {
                            this.handles(this.actions.handle.handleToDoList);
                        }
                        // if(targetVideo.condition.isMustWatchingEnd){
                            video.bind("secondchange", () => {
                                // this.videos[targetVideoIndex].data.currentWatchingTime = video.time();
                                // console.log(this.videos[targetVideoIndex].data.currentWatchingTime);
                                // this.currentResult.contents.videos[targetVideoIndex].data.currentWatchingTime = video.time();
                                // console.log(this.currentResult.contents.videos[targetVideoIndex].data.currentWatchingTime)
                                this.currentDocumentTrack.contents[targetVideoTrackIndex].data= video.time()
                                this.currentDocumentTrack.contents[targetVideoTrackIndex].progress = (video.time()/video.duration()) * 100;
                                if (targetVideoTrackIndex >= 0) {
        
                                    if (isHasProgressBar.length > 0) {
                                        this.handles(this.actions.handle.handleProgressBar);
                                    }
                                    if(Math.ceil(video.time()) === Math.ceil(video.duration())){
                                        this.currentDocumentTrack.contents[targetVideoTrackIndex].progress = 100;
                                        this.handles(this.actions.handle.handleDocumentTrack)
                                        if (isHasToDoList.length > 0) {
                                            this.handles(this.actions.handle.handleToDoList);
                                        }
                                    }
                                }
                            })
                        // }
                        // else{
                        //     this.handles(this.actions.handle.handleDocumentTrack);
                        //     this.currentDocumentTrack.contents[targetVideoTrackIndex].progress = 100;
                        //     this.handles(this.actions.handle.handleToDoList);
                        // }
                    });
                    
     
                    // console.log(targetVideo);
                   // let targetVideoTrackIndex = this.currentDocumentTrack.contents.findIndex(content => content.parentId === this.currentResult.contents.videos[targetVideoIndex].parentId)
                    // video.bind("secondchange", () => {
                    //     this.currentResult.contents.videos[targetVideoIndex].data.currentWatchingTime = video.time();
                    //     if (isHasProgressBar.length > 0) {
                    //         this.handles(this.actions.handle.handleProgressBar)
                    //     }
                    //     if (Math.ceil(video.time()) === Math.ceil(video.duration()) && targetVideoTrackIndex >= 0) {
                    //         this.currentDocumentTrack.contents[targetVideoTrackIndex].progress = 100;
                    //         this.handles(this.actions.handle.handleToDoList, null,'saveDocTrack');
                    //         // let targetParentBox =  $('#'+this.currentResult.contents.videos[targetVideoIndex].parentId);
                    //         // this.handles(this.actions.handle.handleToDoList,targetParentBox)
                    //     }
                    // })
                }
            })

        }
        else if (action === this.actions.handle.handleProgressBar) {
            let summaryOfPercent = 0;
            let numberOfContentProgress =0;
            this.progressBars.forEach((parentBox)=>{
                parentBox.contentList.forEach((content)=>{
                    let targetDocumentTrack  =  this.currentDocumentTrack.contents.find((contentTrack)=>contentTrack.id === content.id);
                    if(targetDocumentTrack){
                        if(targetDocumentTrack.boxType === this.boxType.boxVideo){
                            summaryOfPercent += targetDocumentTrack.progress
                            numberOfContentProgress += 1;
                        }
                        else if(targetDocumentTrack.boxType === this.boxType.boxSubform){
                            targetDocumentTrack.conditions.subformCondition.isClickLinks.forEach((link)=>{
                                let targetDoc = this.documentTracks.find((docTrack)=>docTrack.id ===link.linkId);
                                summaryOfPercent += targetDoc.progress;
                                numberOfContentProgress += 1;
                            });
                        } 
                        else if(targetDocumentTrack.boxType === this.boxType.boxExam){
                            summaryOfPercent += targetDocumentTrack.progress
                            numberOfContentProgress += 1;
                        }

                    }
                    // this.currentDocumentTrack.contents.forEach((contentTrack)=>{
                    //     if(content.id === contentTrack.id){
                  
                    //         if(contentTrack.boxType === this.boxType.boxVideo){
                    //             summaryOfPercent += contentTrack.progress
                    //             numberOfContentProgress += 1;
                    //         }
                    //         else if(contentTrack.boxType === this.boxType.boxSubform){
                    //             contentTrack.conditions.subformCondition.isClickLinks.forEach((link)=>{
                    //                 let targetDoc = this.documentTracks.find((docTrack)=>docTrack.id ===link.linkId);
                    //                 summaryOfPercent += targetDoc.progress;
                    //                 numberOfContentProgress += 1;
                    //             });
                    //         }
                    //     }

                    // })
                })
                let percentProgress = summaryOfPercent / numberOfContentProgress;
                this.rootElement.find('#'+ parentBox.parentId).find('.progress-bar').css('width', percentProgress + '%');
            })
            // this.rootElement.find('.content-progress-bar').find('.progress-bar').css('width', percentProgress + '%');

            // this.currentDocumentTrack.contents.forEach((contentTrack)=>{
            //      this.progressBars.forEach((parentBox)=>{
            //         parentBox.contentList.forEach((content)=>{
            //             if(content.parentId == contentTrack.parentId){
            //                 summaryOfPercent += contentTrack.progress
            //                 numberOfContentProgress += 1
            //             }
            //         })

            //      })
            // })
            // let summaryOfCurrentWatchingTime = 0;
            // let totalTime = 0;
            // this.currentResult.contents.videos.forEach((video) => {
            //     totalTime += video.data.duration;
            //     summaryOfCurrentWatchingTime += video.data.currentWatchingTime;
            // });
            // let percentProgress = (summaryOfCurrentWatchingTime / totalTime) * 100;
            // this.rootElement.find('.content-progress-bar').find('.progress-bar').css('width', percentProgress + '%');
        }
        else if (action === this.actions.handle.handleComment) {

            this.rootElement.find('.content-comment').find('.comment-form').find('.comment-btn-post').unbind('click').bind('click', (event) => {
                this.currentCommentDetail.isChild = false;
                this.currentCommentDetail.message = this.rootElement.find('.content-comment').find('textarea').val().toString();
                if (this.currentCommentDetail.message || this.currentCommentDetail.imgData) {
                    this.addElements(this.actions.element.addElReplyCommentBox, $('#' + $(event.currentTarget).attr('data-commentId')), Constants.common.event.click.save)

                }
            })

            // //  this.rootElement.find('.content-comment').find('.comment-form').find('#comment-question').bind('click',(element)=>{

            // //  })
            this.rootElement.find('.content-comment').find('.comment-form').find('#comment-attach').unbind('click').bind('click', (element) => {
                let parentBoxId = $(element.currentTarget).attr('data-commentBoxId')
                $(element.currentTarget).unbind('click');
                $(element.currentTarget).find('#comment-input-file').trigger('click')
                $(element.currentTarget).find('#comment-input-file').unbind('change').bind('change', (fileEvent: any) => {
                    this.currentCommentDetail.imgData = fileEvent.target.files;
                    const reader = new FileReader();
                    reader.onload = ((event: any) => {
                        let commentImg = '<img  src="' + event.target.result + '"/>'
                        this.rootElement.find('#' + parentBoxId).find('.comment-massege-img').html(commentImg)
                    });
                    reader.readAsDataURL(this.currentCommentDetail.imgData[0]);
                })
                this.handles(this.actions.handle.handleComment)
            });
            
            if (element) {
                element.find('.reply-tool').find('.reply-text').unbind().bind('click', (element) => {
                    let targetBoxReply = $(element.currentTarget).attr('data-commentReplyId')
                    this.rootElement.find('#comment-box-current').remove();
                    this.addElements(this.actions.element.addElCommentBox, $('#' + targetBoxReply), 'replyChild')
                    // this.
                    // console.log($(element.currentTarget).attr('data-commentReplyId'))
                })

                element.find('.reply-tool').find('.liked-text').unbind().bind('click', (event) => {
                    let liked = $(event.currentTarget).attr('data-numberlike')
                    $(event.currentTarget).text('Liked ' + (parseInt(liked) + 1))
                    $(event.currentTarget).attr('data-numberlike', parseInt(liked) + 1)

                    if ($(event.currentTarget).parents('.comment-reply').hasClass('comment-reply-child')) {
                        let targetParentBoxRootIndex = this.comments.findIndex(parentBox => parentBox.id === element.parents('.content-comment').attr('id'));
                        let targetParentBox1Index = this.comments[targetParentBoxRootIndex].listComment.findIndex((parentBox) => parentBox.id === element.attr('id'));
                        let targetParentBox2Index = this.comments[targetParentBoxRootIndex].listComment[targetParentBox1Index].childs.findIndex((parentBox) => parentBox.id === $(event.currentTarget).parents('.comment-reply').attr('id'));
                        this.comments[targetParentBoxRootIndex].listComment[targetParentBox1Index].childs[targetParentBox2Index].liked = parseInt(liked) + 1;
                    } else {
                        let targetParentBoxIndex = this.comments.findIndex((parentBox) => parentBox.id === element.attr('id'));
                        let targetCommentIndex = this.comments[targetParentBoxIndex].listComment.findIndex(comment => comment.id === $(event.currentTarget).parents('.comment-reply').attr('id'))
                        this.comments[targetParentBoxIndex].listComment[targetCommentIndex].liked = parseInt(liked) + 1;
                    }

                    this.saveDocument();
                });
                // element.find('#comment-box-current').unbind().bind('click',(element)=>{
                //     console.log(element);
                // })

                element.find('.comment-btn-post-reply').unbind().bind('click', (event) => {
                    this.currentCommentDetail.message = element.find('textarea').val().toString();
                    if (this.currentCommentDetail.message || this.currentCommentDetail.imgData) {
                        this.currentCommentDetail.isChild = true
                        this.currentCommentDetail.liked = 0;
                        this.addElements(this.actions.element.addElReplyCommentBox, $('#' + $(event.currentTarget).attr('data-commentreplyid')), 'replyChild')
                    }
                })
                element.find('#comment-attach').unbind().bind('click', (element) => {
                    $(element.currentTarget).unbind('click');
                    $(element.currentTarget).find('#comment-input-file').trigger('click')
                    $(element.currentTarget).find('#comment-input-file').unbind('change').bind('change', (fileEvent: any) => {
                        this.currentCommentDetail.imgData = fileEvent.target.files;
                        const reader = new FileReader();
                        reader.onload = ((event: any) => {
                            let commentImg = '<img  src="' + event.target.result + '"/>'
                            this.rootElement.find('#comment-box-current').find('.comment-massege-img').html(commentImg)
                            // console.log(this.rootElement.find('#comment-box-current'))
                            // if(this.rootElement.find('#comment-box-current').length>0){
                            //     this.rootElement.find('#comment-box-current').find('.comment-massege-img').html(commentImg)
                            // }else{
                            //     let parentBoxId = $(element.currentTarget).attr('data-commentBoxId')
                            //     console.log( this.rootElement.find('#' + parentBoxId))
                            //     this.rootElement.find('#' + parentBoxId).find('.comment-massege-img').html(commentImg)
                            // }
                            // this.rootElement.find('#comment-box-current').find('.comment-massege-img').html(commentImg)
                        });
                        reader.readAsDataURL(this.currentCommentDetail.imgData[0]);
                    })
                    this.handles(this.actions.handle.handleComment, $('#comment-box-current'))
                });
            }
        }
        else if (action === this.actions.handle.handleToDoList) {
            // let summaryTotalOfProgress = 0;
            this.toDoLists.forEach((todoList, index) => {
                todoList.toDoListOrder.forEach((task) => {
                    let summaryOfProgress = 0;
                    // let progressContent = 0;

                     task.objectTodoList.forEach((content) => {
                      let targetContent =  this.currentDocumentTrack.contents.find(contentTrack=>contentTrack.parentId === content.id);

                      if(targetContent){
                          if( targetContent.boxType === this.boxType.boxVideo && !targetContent.conditions.videoCondition.isMustWatchingEnd&&targetContent.conditions.videoCondition.isClickPlay ){
                                summaryOfProgress += 100;
                          }else {
                            summaryOfProgress += targetContent.progress;
                          }
                      } 
                    });

                    if (summaryOfProgress === task.objectTodoList.length * 100) {
                        $('#' + todoList.parentBoxId).find('.content-toDoList').find('#' + task.id).find('p').css('text-decoration', 'line-through');
                    }
                    todoList.progress =  summaryOfProgress;

                })

                // if (this.toDoLists.length - 1 === index) {
                //     this.currentDocumentTrack.contents.forEach((contentTrack) => {
                //         summaryTotalOfProgress +=contentTrack.progress;
                //     });
                //     this.currentDocumentTrack.progress =  summaryTotalOfProgress/this.currentDocumentTrack.contents.length;
                //     // if (subaction === 'saveDocTrack') {
                //     //     this.saveDocumentTrack(this.documentDataService.currentDocumentName).subscribe((status)=>{
                            
                //     //     });
                //     // }

                // }

            })
            this.saveDocument();
            // let targetParentBoxIndex =  this.toDoLists.find((parentBox)=>parentBox.parentBoxId === element.attr('id'))

            // element.
        }
        else if (action === this.actions.handle.handleDocumentTrack) {
            let numberOfCondition = this.currentDocumentTrack.contents.length;
            let numberOfProgress =0;
            // console.log(this.currentDocumentTrack.contents[targetVideoTrackIndex])
            this.currentDocumentTrack.contents.forEach((content) => {
                if(content.boxType === this.boxType.boxVideo){
                    if(content.conditions.videoCondition.isMustWatchingEnd){
                        numberOfProgress +=content.progress
                    }else if(content.conditions.videoCondition.isClickPlay){
                        numberOfProgress +=100
                    }
                }
                else if(content.boxType === this.boxType.boxSubform){
                    let numberOfLinks = content.conditions.subformCondition.isClickLinks.length;
                    let numberOfProgressLink =0;
                    content.conditions.subformCondition.isClickLinks.forEach((link)=>{
                        if(link.isClicked){
                            let documentTrackTarget  = this.documentTracks.find((documentTrack)=>documentTrack.id ===link.linkId);
                            link.progress =  documentTrackTarget.progress;
                            numberOfProgressLink +=link.progress;
                        }
                        else if(!content.conditions.subformCondition.haveInDoList){
                            numberOfProgressLink +=100;
                        }
                    });
                    content.progress = numberOfProgressLink/numberOfLinks;
                    numberOfProgress += numberOfProgressLink/numberOfLinks;
                }
            });
            if(this.currentUrlParam['typeUrl']==='survey' && this.currentUrlParam['status']===Constants.common.message.status.submitted.text){
               let targetExamIndex =   this.currentDocumentTrack.contents.findIndex((content)=>content.id === this.currentUrlParam['examId'])
               if(targetExamIndex>=0){
                this.currentDocumentTrack.contents[targetExamIndex].conditions.examCondition.isSubmitted = true;
                this.currentDocumentTrack.contents[targetExamIndex].progress = 100;
                numberOfProgress +=100
               }
            }
            // this.currentDocumentTrack.contents.forEach((content) => {
            //     if()
            // })

            this.currentDocumentTrack.progress =   numberOfProgress/numberOfCondition;
            this.saveDocumentTrack(this.documentDataService.currentDocumentName).subscribe((status)=>{
               // console.log(" this.currentDocumentTrack", this.currentDocumentTrack)          
            });
            // let numberOfCondition = 0;
            // let numberOfProgress =0;
            
            // this.documentTracks.forEach((docTrack)=>{
            //     this.currentDocumentTrack.contents.forEach((content) => {
            //         content.conditions.subformCondition.isClickLinks.forEach((link)=>{
            //             if(link.isClicked){
                           
            //             }
            //         });
            //     });
            // });
            // this.currentDocumentTrack.contents.forEach((content)=>{
            //     if(content.conditions.subformCondition.haveInDoList){
            //         numberOfCondition +=1;
            //         numberOfProgress += content.progress;
            //     }
            //     else if(content.boxType === this.boxType.boxVideo){
            //         numberOfCondition +=1;
            //         numberOfProgress += content.progress;
            //     }

            // });
            // this.currentDocumentTrack.progress =   numberOfProgress/numberOfCondition;
            // this.saveDocumentTrack(this.documentDataService.currentDocumentName).subscribe((status)=>{
            //    // console.log(" this.currentDocumentTrack", this.currentDocumentTrack)          
            // });
          
        }
        else if (action === this.actions.handle.handleFile) {
            this.rootElement.find('.content-file').unbind().bind('click',(element)=>{
                let targetFile = this.files.find((file)=>file.awsFileName === $(element.currentTarget).attr('data-awsname'))
                this.documentService.downloadFile(targetFile.awsFileName).subscribe((blobFile)=>{
                    let url = window.URL.createObjectURL(blobFile);
                    let link = document.createElement('a');
                    link.download = targetFile.fileName;
                    link.href = url;
                    link.click();
                })
            })
        }
        else if (action === this.actions.handle.handleLink) {
            this.rootElement.find('.content-link').unbind().bind('click',(element)=>{
                let targetLink = this.links.find((link)=>link.id === $(element.currentTarget).attr('id'))
                if(targetLink){
                    window.open(targetLink.path)
                }
  
            })
        }
        else if (action === this.actions.handle.handleExam) {
            this.rootElement.find('.content-exam').each((index,element)=>{
                if(this.currentUrlParam['typeUrl']==='survey' && this.currentUrlParam['status']===Constants.common.message.status.submitted.text){
                    let targetExamIndex = this.exams.findIndex((exam)=>exam.id === $(element).attr('id'))
                    if(targetExamIndex>=0){
                        this.exams[targetExamIndex].score = this.currentUrlParam['score']
                    }
                 }
                let targetExam = this.exams.find((exam)=>exam.id === $(element).attr('id'))
                if(targetExam){
                    $(element).find('#text-exam-score').text('Score:'+(targetExam.score || '0'))
                }
            })
            this.rootElement.find('.content-exam').find('#exam-input-url').unbind().bind('click',(element)=>{
                let targetExam = this.exams.find((exam)=>exam.id === $(element.currentTarget).parents('.content-exam').attr('id'))
                if(targetExam){
                    let param = '?forward_url='+ Constants.common.host.smartDoc +'/documentPreview?'
                    param += 'documentName=' + this.documentDataService.currentDocumentName +'&'
                    param += 'userId=' + this.CommonDataService.userId +'&'
                    param += 'examId=' + targetExam.id +'&'
                    param += 'status=' + Constants.common.message.status.submitted.text +'&'
                    param += 'typeUrl=' +'survey'
                    console.log(targetExam.path + param)
                    location.assign(targetExam.path + param)
                }
  
            })
        }


    }
    private saveDocument() {
        let saveobjectTemplate: DocumentModel = {
            nameDocument: this.currentResult.nameDocument,
            previewImg: this.currentResult.previewImg,
            userId:Constants.common.user.id,
            id: this.currentResult.id, html: this.currentResult.html,
            status: this.currentResult.status,
            contents: {
                boxes: this.boxes,
                files:this.files,
                links:this.links,
                textAreas: this.textAreas,
                imgs: this.imgs,
                videos: this.videos,
                subFroms: this.subForms,
                comments: this.comments,
                todoList: this.toDoLists,
                exams:this.exams,
                progressBar: this.progressBars
            }
        }
        this.documentService.saveDocument(this.currentResult.nameDocument, saveobjectTemplate).subscribe((status) => {

        })

    }
    private saveDocumentTrack(nameDocument): Observable<string> {
        let saveObjectTrackTemplate: DocumentTrackModel = {
            id: this.commonService.getPatternId(nameDocument),
            nameDocument: nameDocument,
            userId:Constants.common.user.id,
            status: Constants.common.message.status.created.text,
            isTrackProgress: this.currentDocumentTrack.contents.length > 0 ? true : false,
            progress: this.currentDocumentTrack.contents.length === 0 ? 100 : this.currentDocumentTrack.progress,
            contents: this.currentDocumentTrack.contents
        }

        return this.documentService.saveDocumentTrack(nameDocument, saveObjectTrackTemplate)
    }

    public async goToSubForm(element:JQuery<Element>) {
        let targetContentIndex = await this.currentDocumentTrack.contents.findIndex((content)=>content.id === element.parents('.content-subform').attr('id'))
        console.log(targetContentIndex)
        if(targetContentIndex >= 0){
            let targetLinkIndex = this.currentDocumentTrack.contents[targetContentIndex].conditions.subformCondition.isClickLinks.findIndex(link=>link.linkName === element.attr('data-subformName'))
            this.currentDocumentTrack.contents[targetContentIndex].conditions.subformCondition.isClickLinks[targetLinkIndex].isClicked =true;
            // let numberOfLinks =this.currentDocumentTrack.contents[targetContentIndex].conditions.subformCondition.isClickLinks.length;
            // let summaryOfProgress = 0;
            // this.currentDocumentTrack.contents[targetContentIndex].conditions.subformCondition.isClickLinks.forEach((link)=>{
            //     let targetDocumentTrack =  this.documentTracks.find(docTrack=>docTrack.id === link.linkId);
            //     targetDocumentTrack.progress = targetDocumentTrack.progress;
            // });
            // this.currentDocumentTrack.contents[targetContentIndex].progress = summaryOfProgress/numberOfLinks;
        }
        this.handles(this.actions.handle.handleDocumentTrack);
        // this.saveDocumentTrack(this.documentDataService.currentDocumentName).subscribe((status) => {
        //     if (status === Constants.general.message.status.success.text) {
                this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
                let currentUrl = this.router.url + '?';
                this.router.navigateByUrl(currentUrl)
                    .then(() => {
                        this.router.navigated = false;
                        this.router.navigate(['documentPreview'], { queryParams: { documentName: element.attr('data-subformName') } })
                     
                        //this.handles(this.actions.handle.handleToDoList);
                        // this.router.navigate([this.router.url]);
                    });
        //     }
        // });
        // this.documentTracks.find(()=>)
        // this.documentTrack.contents.forEach((content)=>{
        //     if(content.boxType === )
        // })
        //let contentIndex = this.documentTrack.contents.findIndex((content)=>content.id === )
        // this.router.routeReuseStrategy.shouldReuseRoute = function(){return false;};
        // let currentUrl = this.router.url + '?';
        // this.router.navigateByUrl(currentUrl)
        //   .then(() => {
        //     this.router.navigated = false;
        //     this.router.navigate(['documentPreview'], { queryParams: {documentName:$(element.currentTarget).attr('data-subformName') }})
        //     // this.router.navigate([this.router.url]);
        //   });
    }
    private retrieveData(action: string, results: DocumentModel, element?: JQuery<Element>) {
        if (action === this.actions.data.retrieveResultData) {
            this.boxes = results.contents.boxes || new Array<BoxContentModel>();
            this.subForms = results.contents.subFroms || new Array<SubFormContentModel>();
            this.imgs = results.contents.imgs||  new Array<ImgContentModel>();
            this.comments = results.contents.comments ||  new Array<commentContentModel>();
            this.toDoLists = results.contents.todoList ||  new Array<ToDoListContentModel>();
            this.exams =  results.contents.exams ||  new Array<ExamContentModel>()
            this.videos = results.contents.videos ||  new Array<VideoContentModel>();
            this.progressBars = results.contents.progressBar ||  new Array<ProgressBarContentModel>();
            this.files =   results.contents.files ||  new Array<FileContentModel>();
            this.links =   results.contents.links ||  new Array<LinkContentModel>();
            this.textAreas = results.contents.textAreas ||  new Array<TextAreaContentModel>();
        }

    }

}
