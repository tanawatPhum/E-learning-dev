import { Component,ViewChild,ElementRef,OnInit } from '@angular/core';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { DocumentService } from '../../../services/document/document.service';
import { Router,ActivatedRoute } from '@angular/router';
import { DocumentModel } from '../../../models/document/content.model';
import { ScreenDetailModel } from 'src/app/models/general/general.model';
import { Constants } from '../../../global/constants';
import { CommonService } from '../../../services/common/common.service';
import { find } from 'rxjs/operators';
import { commentContentModel, commentDetailModel } from '../../../models/document/elements/comment-content.model';
import { BoxContentModel } from '../../../models/document/elements/box-content.model';
import { TextAreaContentModel } from '../../../models/document/elements/textarea-content.model';
import { ImgContentModel } from 'src/app/models/document/elements/img-content.model';
import { VideoContentModel } from '../../../models/document/elements/video-content.model';
import { SubFormContentModel } from '../../../models/document/elements/subForm-content.model';
import { Observable, Subscriber } from 'rxjs';
import { async } from 'q';
declare var electron: any;
declare var Wistia:any;
@Component({
    selector: 'document-preview-page',
    templateUrl: 'document-preview-page.component.html',
    styleUrls: ['../../document-page/document-page.component.scss']
})
export class DocumentPreviewPageComponent implements OnInit {
    @ViewChild('documentPreviewContent', { static: true }) documentPreviewContent: ElementRef;
    private rootElement:JQuery<Element>;
    private currentResult:DocumentModel = new DocumentModel();
    private contentTemplateSize:ScreenDetailModel = new ScreenDetailModel();
    private currentScreenSize:ScreenDetailModel = new ScreenDetailModel();
    // private currentCommentIsChild:boolean = false;
    // private currentMessage:string;
    private currentCommentDetail  = {
        isChild:false,
        message:null,
        imgData:null,
        liked:0,
    }

    // private currentBrowseFile:any;
    public isUrlChannel:boolean = false;
    public actions = {
        element: {
            addElCommentBox:'addElCommentBox',
            addElReplyCommentBox:'addElReplyCommentBox',
            previewElement: 'previewElement',
            ratioElement:'ratioElement',
            setCommentElement:'setCommentElement',
            setResultElement:'setResultElement'
        },
        handle:{
            handleSubForm: 'handleSubForm',
            handleVideo:'handleVideo',
            handleProgressBar:'handleProgressBar',
            handleComment:'handleComment',
        },
        data:{
            retrieveResultData: 'retrieveResultData',
        }
    }
    public boxes: BoxContentModel[] = new Array<BoxContentModel>();
    public textAreas: TextAreaContentModel[] = new Array<TextAreaContentModel>();
    public imgs: ImgContentModel[] = new Array<ImgContentModel>();
    public videos: VideoContentModel[] = new Array<VideoContentModel>();
    public subForms: SubFormContentModel[] = new Array<SubFormContentModel>();
    public comments: commentContentModel[] = new Array<commentContentModel>();
    constructor(
        private documentDataService:DocumentDataControlService,
        private documentService:DocumentService,
        private commonService:CommonService,
        private router:Router,
        private route:ActivatedRoute
    ) { }
    ngOnInit() {
        
    }
    ngAfterContentInit() {
        this.contentTemplateSize = JSON.parse(localStorage.getItem('contentTemplateSize'));
        this.rootElement = $(this.documentPreviewContent.nativeElement);
        // - Constants.general.element.css.navBar.height
        this.rootElement.css('height',$(window).height())  
        this.currentScreenSize.height = $(this.rootElement).outerHeight();
        this.currentScreenSize.width = $(this.rootElement).outerWidth();
        $(window).resize((event)=>{
            this.currentScreenSize.height = $(this.rootElement).outerHeight();
            this.currentScreenSize.width = $(this.rootElement).outerWidth();
            this.setElements(this.actions.element.ratioElement);
        });
        // $(window).resize((event)=>{
        //     $('.document-preview-content').css('height',event.currentTarget.innerHeight - Constants.general.element.css.navBar.height) 
        //     this.currentScreenSize.height = event.currentTarget.innerHeight -Constants.general.element.css.navBar.height;
        //     this.currentScreenSize.width = event.currentTarget.innerWidth;
        //     this.rootElement.html(this.currentResult.html)
        //     this.setElements(this.actions.element.previewElement);
        // });
        this.route.queryParams.subscribe((params)=>{
            this.isUrlChannel = true;
            this.documentDataService.currentDocumentName  = params['documentName'];
        })
        this.loadHtml(this.documentDataService.currentDocumentName);
        
    }
    
    public loadHtml(documentName?){
        if (electron) {
            electron.ipcRenderer.send('request-read-document', documentName)
            electron.ipcRenderer.once('reponse-read-document', (event, result) => { 
                console.log(' ❏ Object Document :', result);
                if(result){
                    this.setElements(this.actions.element.setResultElement,null,result);
                    // this.currentResult =  result;
                    // let html ='<div style="width:'+this.contentTemplateSize.width +'px;height:'+this.contentTemplateSize.height +'px">'+result.html+'</div>'
                    // this.rootElement.html(html);
                    // this.setElements(this.actions.element.previewElement);
                    // this.handles(this.actions.handle.handleSubForm);
                    // this.handles(this.actions.handle.handleVideo);
                } 
                this.currentResult = result;        
            });
        }else{
            this.documentService.loadDocFromDB(this.commonService.getPatternId(documentName)).subscribe((result) => {
                console.log(' ❏ Object Document :', result)
                this.setElements(this.actions.element.setResultElement,null,result);
            });
        };
    }
    public setElements(action,elment?:JQuery<Element>,data?:any){
        if(action === this.actions.element.setResultElement){
            this.currentResult =  data;
            let html ='<div id="contentTemplate" style="overflow:scroll;position:relative; width:'+this.contentTemplateSize.width +'px;height:'+this.contentTemplateSize.height +'px">'+data.html+'</div>'
            this.rootElement.html(html);
            this.retrieveData(this.actions.data.retrieveResultData,data);
            this.setElements(this.actions.element.previewElement);
            this.handles(this.actions.handle.handleSubForm);
            this.handles(this.actions.handle.handleVideo);
            this.handles(this.actions.handle.handleComment);
            this.setElements(this.actions.element.setCommentElement);
        }
        else if(action === this.actions.element.previewElement){
            this.rootElement.find('.content-box').removeClass('content-box-active border border-primary');
            this.rootElement.find('.content-box').removeClass('ui-draggable ui-draggable-handle');
            this.rootElement.find('.content-box').removeClass('ui-resizable');
            this.rootElement.find('.content-box').removeClass('content-box-current');
            this.rootElement.find('.content-box').find('.ui-resizable-handle').remove();
            this.rootElement.find('.content-box').css('border','none');
            this.rootElement.find('.content-box').css('cursor','default');
            this.rootElement.find('.content-box').find('.content-toolbar').remove();
            this.rootElement.find('.content-box').find('.content-video').css('pointer-events','initial');
            this.rootElement.find('.content-box').find('.content-textarea').each((index,element)=>{
               let targetTextArea = this.currentResult.elements.textAreas.find((textArea)=>textArea.id == $(element).attr('id'));
               $('[id="' + $(element).attr('id') + '"]').val(targetTextArea.value);
               $('[id="' + $(element).attr('id') + '"]').attr('disabled','true');
            });
            this.rootElement.find('.content-box').find('.content-subform').find('li').attr('contenteditable','false');
            this.rootElement.find('.template-doc').attr('contenteditable','false');
            this.rootElement.find('.content-box').find('.content-progress-bar').find('.progress-bar').css('width',0)
            this.rootElement.find('.content-comment').css('height','auto');
            this.rootElement.find('.content-comment').find('.comment-form').css('padding-bottom','2.5%');
            this.setElements(this.actions.element.ratioElement)
        }
        if(action === this.actions.element.ratioElement){
            let ratioW;
            let ratioH;
            console.log("currentScreenSize",this.currentScreenSize)
            console.log("contentTemplateSize",this.contentTemplateSize)
            ratioW =  this.currentScreenSize.width/this.contentTemplateSize.width;
            ratioH =  this.currentScreenSize.height/this.contentTemplateSize.height;
            // if(this.currentScreenSize.width >this.contentTemplateSize.width){
            //     ratioW =  this.currentScreenSize.width/this.contentTemplateSize.width;
            // }else{
            //     ratioW =  this.contentTemplateSize.width/this.currentScreenSize.width;
            // }
            // if(this.currentScreenSize.height >this.contentTemplateSize.height){
            //     ratioH =  this.currentScreenSize.height/this.contentTemplateSize.height;
            // }else{
            //     ratioH =  this.contentTemplateSize.height/this.currentScreenSize.height;
            // }
            // console.log("ratioH",ratioH)
            // console.log("ratioW",ratioW)
            if(ratioW>ratioH){
                this.rootElement.find('#contentTemplate').css({
                    transform:'scale( '+ratioW+')',
                    transformOrigin:'left top'
                  });
            }else{
                this.rootElement.find('#contentTemplate').css({
                    transform:'scale( '+ratioH+')',
                    transformOrigin:'left top'
                  });
            }

        }
        else if(action === this.actions.element.setCommentElement){
            this.comments.forEach((parentBox)=>{
                parentBox.listComment.forEach(async(comment)=>{
                    this.currentCommentDetail.message = comment.message;
                    this.currentCommentDetail.imgData = comment.imgData;
                    this.currentCommentDetail.liked = comment.liked;
                   await this.addElements(this.actions.element.addElReplyCommentBox,$('#'+parentBox.id),Constants.general.event.load.html)
                    comment.childs.forEach(async(child)=>{
                        this.currentCommentDetail.message = child.message;
                        this.currentCommentDetail.imgData = child.imgData;
                        this.currentCommentDetail.isChild = child.isChild;
                        this.currentCommentDetail.liked = child.liked;
                       await this.addElements(this.actions.element.addElReplyCommentBox,$('#'+comment.id),Constants.general.event.load.html)
                    })
                })
            })
        }
    }
    public backToDocumentHome(){
        this.router.navigate(['documentHome'])
    }
    private async addElements(action: string, element?: JQuery<Element>, subaction?: string, subElement?: any ,data?:any) {
        if(action === this.actions.element.addElCommentBox){
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
            htmlToolComment +='<input type="file" class="comment-browse-file" id="comment-input-file">'
            htmlToolComment += '<img src="assets/imgs/contentPage/attachment.svg">';
            htmlToolComment += '</div>';
            htmlToolComment += '<div id="comment-question" class="comment-tool question">';
            // htmlToolComment += '<img  src="assets/imgs/contentPage/question.svg">';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col pt-3 ">';
            htmlToolComment += '<button data-commentReplyId="'+element.attr('id')+'" type="button" class="btn btn-primary float-right comment-btn-post-reply">Post Comment</button>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            element.append(htmlToolComment);
            this.handles(this.actions.handle.handleComment,element)
        }
        else if(action === this.actions.element.addElReplyCommentBox){
            let htmlToolComment = '<div id="comment-reply-'+($('.comment-reply').length+1) +'" class="row comment-form submit m-0 w-100 h-auto comment-reply">';
            htmlToolComment += '<div class="col-12">';
            htmlToolComment += '<div class="row m-0 max-height">';
            htmlToolComment += '<div   class="col-1  pl-3 pt-1 ">';
            htmlToolComment += '<div class="comment-profile-reply icon">';
            htmlToolComment += '<img src="assets/imgs/documentPage/profileIcon.svg">';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col-10 pt-4 pl-5 ">';
            htmlToolComment += '<div class="reply-user-name">test</div>';
            htmlToolComment += '<div class="reply-user-massege">'+ this.currentCommentDetail.message;
            htmlToolComment += '<div class="reply-user-massege-img"></div>'
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col-12 pr-3 pt-2">';
            htmlToolComment += '<div class="row m-0">';
            htmlToolComment += '<div class="col-1  half-height">';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col-6 pl-5">';
            htmlToolComment += '<div class="reply-tool">';
            if(this.currentCommentDetail.liked===0){
                htmlToolComment += '<span data-numberLike="'+this.currentCommentDetail.liked+'" class="liked-text">Liked</span>';
            }else{
                htmlToolComment += '<span data-numberLike="'+this.currentCommentDetail.liked+'" class="liked-text">Liked '+ this.currentCommentDetail.liked +'</span>';
            }
            
            if(!this.currentCommentDetail.isChild){
                htmlToolComment += '<span class="reply-text"  data-commentReplyId="comment-reply-'+($('.comment-reply').length+1)+'" >Reply</span>';
            }
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            element.append(htmlToolComment);
            let targetCommentIndex;
            let replyComment:commentDetailModel = {
                id:'comment-reply-'+$('.comment-reply').length,
                userId:0,
                message: this.currentCommentDetail.message,
                isQuestion:false,
                imgData:null,
                isChild:false,
                liked:0,
                childs:[]
            }
            if(subaction=="replyChild" || subaction==Constants.general.event.load.html){
                element.find('#comment-box-current').remove();
                if(this.currentCommentDetail.isChild){
                    element.find('#'+'comment-reply-'+$('.comment-reply').length).addClass('comment-reply-child');
                }
                targetCommentIndex =  this.comments.findIndex((parentBox)=>parentBox.id === element.parents('.content-comment').attr('id'));
            }else if(subaction!="replyChild" && subaction!=Constants.general.event.load.html){
                targetCommentIndex =  this.comments.findIndex((parentBox)=>parentBox.id === element.attr('id'));
            }
            if(targetCommentIndex!=-1){
                if(this.currentCommentDetail.imgData){
                    const reader = new FileReader();
                    reader.onload = ((event: any) => {
                       let commentImg = '<img src="' + event.target.result + '" id="comment-reply-' + ($('.comment-reply').length) + '-img"></img>'
                       element.find('#comment-reply-'+($('.comment-reply').length)).find('.reply-user-massege-img').html(commentImg)
                       replyComment.imgData = this.currentCommentDetail.imgData
                       this.currentCommentDetail.imgData = null;
                       if(subaction!="replyChild" && subaction!=Constants.general.event.load.html){
                        if(!this.comments[targetCommentIndex].listComment.find((comment)=>comment.id ==replyComment.id)){
                            this.comments[targetCommentIndex].listComment.push(replyComment);
                           }
                       }else if(subaction=="replyChild"){
                           replyComment.isChild = true;
                           let targetCommentReply = this.comments[targetCommentIndex].listComment.findIndex((comment)=>comment.id === element.attr('id'))
                           this.comments[targetCommentIndex].listComment[targetCommentReply].childs.push(replyComment)
                           
                        }
    
                       if(subaction === Constants.general.event.click.save||subaction=="replyChild"){
                        this.saveDocument();
                       }
                    });
                        reader.readAsDataURL(this.currentCommentDetail.imgData[0]);
                }else{
                    if(subaction!="replyChild" && subaction!=Constants.general.event.load.html){
    
                        if(!this.comments[targetCommentIndex].listComment.find((comment)=>comment.id ==replyComment.id)){
                            this.comments[targetCommentIndex].listComment.push(replyComment);
                        }
                    }else if(subaction=="replyChild"){
                        replyComment.isChild = true;
                        let targetCommentReply = this.comments[targetCommentIndex].listComment.findIndex((comment)=>comment.id === element.attr('id'))
                        this.comments[targetCommentIndex].listComment[targetCommentReply].childs.push(replyComment)
                     }
                    if(subaction === Constants.general.event.click.save||subaction=="replyChild"){
                        this.saveDocument();
                    }
                }
            }

            this.handles(this.actions.handle.handleComment,element)
        }

    }
    dataURLToBlob = function(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
          var parts = dataURL.split(',');
          var contentType = parts[0].split(':')[1];
          var raw = parts[1];

          return new Blob([raw], {type: contentType});
        }

        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw:any = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    }
    private handles(action: string, element?: JQuery<Element>,subaction?:string,data?:any) {
        if(action ===  this.actions.handle.handleSubForm){
            this.rootElement.find('.content-subform').find('li').click((event)=>{
                // console.log($(event.currentTarget).attr('data-subformName'))

                // this.router.navigate(['documentPreview'], { queryParams: {documentName:$(event.currentTarget).attr('data-subformName') }})
                this.goToSubForm(event);
                // this.loadHtml($(event.currentTarget).attr('data-subformName'))
            })
            this.rootElement.find('.carousel-control-next').click((event)=>{
                $('#'+ $(event.currentTarget).attr('data-subformId') ).carousel('next');
            })
            this.rootElement.find('.carousel-control-prev').click((event)=>{
                $('#'+ $(event.currentTarget).attr('data-subformId') ).carousel('prev');
            })
        }
        else if(action === this.actions.handle.handleVideo){
            setTimeout(() => {
                this.currentResult.elements.videos.forEach(video => {
                    let targetvideo = Wistia.api(video.data.streamId);
                    targetvideo.time(video.data.currentWatchingTime);
                });
            }, 100);
            this.rootElement.find('.content-video').click((event)=>{
                console.log($(event.currentTarget).attr('id'))
                let targetVideoIndex = this.currentResult.elements.videos.findIndex((video)=>video.id === $(event.currentTarget).attr('id')+ '-video')
                let targetVideo =  this.currentResult.elements.videos[targetVideoIndex];
                console.log(targetVideo);
                if(targetVideo.data.channelStream==='wistia'){
                    let video = Wistia.api(targetVideo.data.streamId);
                    video.bind("secondchange", ()=> {
                        console.log(video.time())
                        this.currentResult.elements.videos[targetVideoIndex].data.currentWatchingTime =  video.time();
                        this.handles(this.actions.handle.handleProgressBar)
                    })
                }
            })

        }
        else if(action === this.actions.handle.handleProgressBar){
            let summaryOfCurrentWatchingTime = 0;
            let totalTime = 0;
            this.currentResult.elements.videos.forEach((video)=>{
                totalTime +=  video.data.duration;
                summaryOfCurrentWatchingTime  += video.data.currentWatchingTime;
            });
            let percentProgress = (summaryOfCurrentWatchingTime/totalTime) * 100;
            this.rootElement.find('.content-progress-bar').find('.progress-bar').css('width',percentProgress +'%');            
        }
        else if(action === this.actions.handle.handleComment){
      
                this.rootElement.find('.content-comment').find('.comment-form').find('.comment-btn-post').unbind('click').bind('click',(event)=>{
                    this.currentCommentDetail.isChild = false;
                    this.currentCommentDetail.message =  this.rootElement.find('.content-comment').find('textarea').val().toString();
                    if( this.currentCommentDetail.message || this.currentCommentDetail.imgData){
                     this.addElements(this.actions.element.addElReplyCommentBox,$('#'+$(event.currentTarget).attr('data-commentId')),Constants.general.event.click.save)
              
                    }
                 })
                 
                //  this.rootElement.find('.content-comment').find('.comment-form').find('#comment-question').bind('click',(element)=>{

                //  })
            this.rootElement.find('.content-comment').find('.comment-form').find('#comment-attach').bind('click',(element)=>{
                let parentBoxId = $(element.currentTarget).attr('data-commentBoxId')
                $(element.currentTarget).unbind('click');
                $(element.currentTarget).find('#comment-input-file').trigger('click')
                $(element.currentTarget).find('#comment-input-file').unbind('change').bind('change',(fileEvent:any) => {
                    this.currentCommentDetail.imgData = fileEvent.target.files;
                    const reader = new FileReader();
                    reader.onload = ((event: any) => {
                       let commentImg = '<img  src="' + event.target.result +'"/>'
                       console.log( this.rootElement.find('#'+parentBoxId).find('.comment-massege-img'));
                       this.rootElement.find('#'+parentBoxId).find('.comment-massege-img').html(commentImg)
                    });
                    reader.readAsDataURL(this.currentCommentDetail.imgData[0]);     
                })
               this.handles(this.actions.handle.handleComment)

            });
            if(element){
                element.find('.reply-tool').find('.reply-text').unbind().bind('click',(element)=>{
                    let targetBoxReply =  $(element.currentTarget).attr('data-commentReplyId')
                    this.rootElement.find('#comment-box-current').remove();
                    this.addElements(this.actions.element.addElCommentBox,$('#'+targetBoxReply),'replyChild')
                    // this.
                   // console.log($(element.currentTarget).attr('data-commentReplyId'))
                })

                element.find('.reply-tool').find('.liked-text').unbind().bind('click',(event)=>{
                   let liked =  $(event.currentTarget).attr('data-numberlike')
                   console.log()
                    $(event.currentTarget).text('Liked '+ (parseInt(liked)+1))
                    $(event.currentTarget).attr('data-numberlike',parseInt(liked)+1)
                    console.log(element.attr('id'));
  
                    if($(event.currentTarget).parents('.comment-reply').hasClass('comment-reply-child')){
                        let targetParentBoxRootIndex = this.comments.findIndex(parentBox=>parentBox.id === element.parents('.content-comment').attr('id'));
                        let targetParentBox1Index =  this.comments[targetParentBoxRootIndex].listComment.findIndex((parentBox)=>parentBox.id === element.attr('id'));
                        let targetParentBox2Index =  this.comments[targetParentBoxRootIndex].listComment[targetParentBox1Index].childs.findIndex((parentBox)=>parentBox.id === $(event.currentTarget).parents('.comment-reply').attr('id'));
                        console.log(targetParentBoxRootIndex)
                        this.comments[targetParentBoxRootIndex].listComment[targetParentBox1Index].childs[targetParentBox2Index].liked  = parseInt(liked)+1;
                    }else{
                        let targetParentBoxIndex =  this.comments.findIndex((parentBox)=>parentBox.id === element.attr('id'));
                        let targetCommentIndex = this.comments[targetParentBoxIndex].listComment.findIndex(comment=>comment.id === $(event.currentTarget).parents('.comment-reply').attr('id'))
                        this.comments[targetParentBoxIndex].listComment[targetCommentIndex].liked  = parseInt(liked)+1;
                    }
            
                    this.saveDocument();
                });
                // element.find('#comment-box-current').unbind().bind('click',(element)=>{
                //     console.log(element);
                // })

                element.find('.comment-btn-post-reply').unbind().bind('click',(event)=>{
                    this.currentCommentDetail.message = element.find('textarea').val().toString();
                    if( this.currentCommentDetail.message || this.currentCommentDetail.imgData){
                        this.currentCommentDetail.isChild = true
                        this.currentCommentDetail.liked = 0;
                        this.addElements(this.actions.element.addElReplyCommentBox,$('#'+ $(event.currentTarget).attr('data-commentreplyid')),'replyChild')
                    }
                })
                element.find('#comment-attach').unbind().bind('click',(element)=>{
                    $(element.currentTarget).unbind('click');
                    $(element.currentTarget).find('#comment-input-file').trigger('click')
                    $(element.currentTarget).find('#comment-input-file').unbind('change').bind('change',(fileEvent:any) => {
                        this.currentCommentDetail.imgData = fileEvent.target.files;
                        const reader = new FileReader();
                        reader.onload = ((event: any) => {
                           let commentImg = '<img  src="' + event.target.result +'"/>'
                           this.rootElement.find('#comment-box-current').find('.comment-massege-img').html(commentImg)
                        });
                        reader.readAsDataURL(this.currentCommentDetail.imgData[0]);     
                    })
                    this.handles(this.actions.handle.handleComment,$('#comment-box-current'))
                })
            
            
            }
 
            
      
            // this.rootElement.find('.comment-tool attach')
        }
 
    }
    private saveDocument(){
            let saveobjectTemplate:DocumentModel= {
                nameDocument: this.currentResult.nameDocument,
                previewImg: this.currentResult.previewImg,
                id:  this.currentResult.id, html: this.currentResult.html,
                status:this.currentResult.status,
                elements: {
                    boxes: this.boxes,
                    textAreas: this.textAreas,
                    imgs: this.imgs,
                    videos: this.videos,
                    subFroms: this.subForms,
                    comments: this.comments
                }
            }
           
            this.documentService.saveDocument(this.currentResult.nameDocument,saveobjectTemplate).subscribe((status)=>{
            })
   
    }

    public goToSubForm(event) {
        this.router.routeReuseStrategy.shouldReuseRoute = function(){return false;};
        let currentUrl = this.router.url + '?';
        this.router.navigateByUrl(currentUrl)
          .then(() => {
            this.router.navigated = false;
            this.router.navigate(['documentPreview'], { queryParams: {documentName:$(event.currentTarget).attr('data-subformName') }})
            // this.router.navigate([this.router.url]);
          });
    }
    private retrieveData(action: string,results: DocumentModel,element?: JQuery<Element>) {
        if (action === this.actions.data.retrieveResultData) {
            this.comments = results.elements.comments;
            this.boxes = results.elements.boxes;
            this.textAreas   = results.elements.textAreas;
            this.imgs =  results.elements.imgs;
            this.videos = results.elements.videos;
            this.subForms =  results.elements.subFroms;
        }

    }

}
