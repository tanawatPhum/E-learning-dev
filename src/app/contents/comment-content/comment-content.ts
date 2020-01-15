import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { CommonService } from 'src/app/services/common/common.service';
import { commentContentModel, commentDetailModel } from '../../models/document/elements/comment-content.model';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { Constants } from '../../global/constants';
import { find, findIndex } from 'rxjs/operators';
import { CommonDataControlService } from '../../services/common/common-data-control.service';
import { element } from 'protractor';
import { UploadFileModel, UpdateContentModel } from 'src/app/models/common/common.model';

@Component({
    moduleId: module.id,
    selector: 'comment-content',
    templateUrl: 'comment-content.html',
    styleUrls: ['comment-content.scss']
})
export class CommentContentComponent implements OnInit,ContentInterFace {
    @Input() parentBox: JQuery<Element>;
    @Input() lifeCycle:string;
    public updateAction: UpdateContentModel = new UpdateContentModel();
    

    
    public rootElement:JQuery<Element>;
    public userId = this.commonDCtrlService.userId;
    public targetFile:any;
    public targetComment:commentContentModel  = new commentContentModel();
    

    constructor(
        private commonService :CommonService,
        private commonDCtrlService:CommonDataControlService,
        private documentService:DocumentService,
        private documentDCtrlService:DocumentDataControlService,
        private contentDCtrlService:ContentDataControlService,
        private element: ElementRef
        
    ){}
    ngOnInit(){
        this.rootElement = $(this.element.nativeElement); 
        this.parentBox = this.rootElement.parents('.content-box');
    }
    ngAfterViewInit(){
        this.initialComment();
        console.log(this.contentDCtrlService.poolContents.comments)
         
    }
    public initialComment(){
        if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.createContent){
            this.addComment();
        }
        else if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview){
            this.loadComment();
            if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview){
                this.handleComment();
                this.loadCommentReply();
            }
        } 
    }
    public addComment(){
        this.rootElement.find('.content-comment').attr('id',this.parentBox.attr('id') + '-comment')
        .find('#comment-attach').attr('data-commentBoxId',this.parentBox.attr('id') + '-comment')
        .find('.comment-btn-post').attr('data-commentId',this.parentBox.attr('id') + '-comment')

        let comment:commentContentModel = {
            parentId:this.parentBox.attr('id'),
            id: this.parentBox.attr('id') + '-comment',
            listComment: []
        }
        this.contentDCtrlService.poolContents.comments.push(comment);
        this.contentDCtrlService.setLastContent(this.parentBox);
    }
    public loadComment(){
        this.rootElement.find('.content-comment').attr('id',this.parentBox.attr('id') + '-comment')
        .find('#comment-attach').attr('data-commentBoxId',this.parentBox.attr('id') + '-comment')
        .find('.comment-btn-post').attr('data-commentId',this.parentBox.attr('id') + '-comment')
    }
    public async loadCommentReply(){
        this.targetComment =  this.contentDCtrlService.poolContents.comments.find((comment)=>comment.parentId === this.parentBox.attr('id'))
        for await (let comment of this.targetComment.listComment){
            this.rootElement.find('.comment-replys > .col-12').append(
                this.rootElement.find('.comment-reply-draft').clone()
                .removeAttr('hidden')
                .removeClass('comment-reply-draft')
                .addClass('comment-reply') 
                .attr('id',comment.id) 
            ).ready(async ()=>{
                let parentComment = this.rootElement.find('#'+comment.id);
                parentComment.find('.reply-user-massege')
                .find('.reply-user-massege-text').text(comment.message);
                if(comment.imgData){
                    parentComment.find('.reply-user-massege')
                    .find('.reply-user-massege-img').html('<img  src="' + comment.imgData + '"/>')
                }
                if(comment.liked > 0){
                    parentComment.find('.liked-number').text(comment.liked)
                }
           
                for await (let commentChild of comment.childs){
                    parentComment.append(
                        this.rootElement.find('.comment-reply-draft').clone()
                        .removeAttr('hidden')
                        .removeClass('comment-reply-draft')
                        .addClass('comment-reply') 
                        .attr('id',commentChild.id)       
                    ).ready(async ()=>{
                        let targetcomment = this.rootElement.find('#'+commentChild.id);
                        this.targetFile = commentChild.imgData;
                        if(commentChild.liked > 0){
                            targetcomment.find('.liked-number').text(commentChild.liked)
                        }
                        this.handleChildComment(parentComment,targetcomment,commentChild.message)
                    })
                }
            });
        }
        this.handleComment();
    }
    public handleComment(){
        this.rootElement.find('.comment-tool.attach').unbind('click').bind('click', (element) => {
            $(element.currentTarget).unbind('click')
            $(element.currentTarget).find('#comment-input-file').trigger('click')
            let parentCommentBox =  $(element.currentTarget).parents('.comment-form')
            $(element.currentTarget).find('#comment-input-file').unbind('change').bind('change', (fileEvent: any) => {
                let targetFile = fileEvent.target.files
                this.uploadFile(parentCommentBox,targetFile)
     
            })
        })
        this.rootElement.find('.reply-tool').find('.reply-text').unbind('click').bind('click', (element) => {
            let parentCommentReplyBox =  $(element.currentTarget).parents('.comment-reply')
            if(parentCommentReplyBox.find('.comment-form-child').length > 0){
                parentCommentReplyBox.find('.comment-form-child').remove();
            }else{
                parentCommentReplyBox.append(this.rootElement.find('.comment-form-draft').clone()
                .removeAttr('hidden')
                .removeClass('comment-form-draft')
                .addClass('comment-form')
                .addClass('comment-form-child')
                ).find('.comment-btn-post')
                .addClass('comment-btn-post-reply')
                .ready(()=>{
                    parentCommentReplyBox.find('.comment-form-child').find('.comment-tool.attach').unbind('click').bind('click',(element)=>{
                        let parentCommentBox =  $(element.currentTarget).parents('.comment-form-child')
                        $(element.currentTarget).unbind('click')
                        $(element.currentTarget).find('#comment-input-file').trigger('click')
                        $(element.currentTarget).find('#comment-input-file').unbind('change').bind('change', (fileEvent: any) => {
                            let targetFile = fileEvent.target.files
                            this.uploadFile(parentCommentBox,targetFile)
                        })
                    })
    
                    parentCommentReplyBox.find('.comment-form-child').find('.comment-btn-post-reply').unbind('click').bind('click',(element)=>{
                        this.postCommentChild(parentCommentReplyBox)
                    })
                })   
            }
        });
        this.rootElement.find('.reply-tool').find('.liked-text').unbind('click').bind('click', (element) => {
            let likeNumber = parseInt($(element.currentTarget).find('.liked-number').text()||'0') +1
            $(element.currentTarget).find('.liked-number').text(likeNumber)
            let targetCommentReply = $(element.currentTarget).parents('.comment-reply');
            let targetIndexComment =  this.contentDCtrlService.poolContents.comments.findIndex((comment)=>comment.parentId === this.parentBox.attr('id'));
            let targetIndexCommentReply =   this.contentDCtrlService.poolContents.comments[targetIndexComment].listComment
            .findIndex((commentReply)=>commentReply.id === targetCommentReply.attr('id'))
            if(targetIndexCommentReply >= 0){
                this.contentDCtrlService.poolContents.comments[targetIndexComment].listComment[targetIndexCommentReply].liked  = likeNumber;
                this.saveDocument();
            }
        })
    }
    public handleChildComment(parentCommentReplyBox,targetComment,targetInput){
        targetComment.addClass('comment-reply-child')
        targetComment.find('.reply-text').remove();
        targetComment.find('.reply-user-massege')
        .find('.reply-user-massege-text').text(targetInput);
        if(this.targetFile){
            targetComment.find('.reply-user-massege')
            .find('.reply-user-massege-img').html('<img  src="' + this.targetFile + '"/>')
            this.targetFile = null;
        }
        targetComment.find('.reply-tool').find('.liked-text').unbind('click').bind('click', (element) => {
            let likeNumber = parseInt($(element.currentTarget).find('.liked-number').text()||'0') +1
            $(element.currentTarget).find('.liked-number').text(likeNumber)
            let targetIndexComment =  this.contentDCtrlService.poolContents.comments.findIndex((comment)=>comment.parentId === this.parentBox.attr('id'));
            let targetIndexCommentReply =   this.contentDCtrlService.poolContents.comments[targetIndexComment].listComment
            .findIndex((commentReply)=>commentReply.id === parentCommentReplyBox.attr('id'))
            if(targetIndexCommentReply >= 0){
                let targetIndexCommentReplyChild =  this.contentDCtrlService.poolContents.comments[targetIndexComment].listComment[targetIndexCommentReply].childs.
                findIndex((commentReplyChild)=>commentReplyChild.id === targetComment.attr('id'))
                if(targetIndexCommentReplyChild >= 0){
                    this.contentDCtrlService.poolContents.comments[targetIndexComment].listComment[targetIndexCommentReply].childs[targetIndexCommentReplyChild].liked =likeNumber; 
                    this.saveDocument();
                }
            }
        
        })

    
    }
    public uploadFile(parentCommentBox,targetFile){
        let awsFileName = this.commonService.getPatternAWSName(targetFile[0].name) || 'fileName';
        let uploadFile: UploadFileModel = {
            data: targetFile[0],
            awsFileName: awsFileName
        }
        let loading = this.rootElement.find('.loading').clone().removeAttr('hidden')
        parentCommentBox.find('.comment-massege-img').html(null).append(loading)
        this.documentService.uploadFile([uploadFile]).subscribe(() => {
            let imgPath = this.targetFile = Constants.common.host.storage + awsFileName;
            let commentImg = '<img  src="' + imgPath + '"/>'
            parentCommentBox.find('.comment-massege-img').html(commentImg)
        })
    }
    public postComment(event){
        let targetInput  =  $(event.target).parents('.comment-form').find('.comment-textarea').val().toString();
        if(targetInput){
            let idCommentReply = "comment-reply-";
            let currentNumberReply = 0;
            this.rootElement.find('[id^="comment-reply-"]').each((index,element)=>{
               let numberReply =  parseInt($(element).attr('id').toString().replace('comment-reply-',''))
                if(numberReply > currentNumberReply){
                    currentNumberReply = numberReply;
                }
            }).ready(()=>{
                idCommentReply = idCommentReply+(currentNumberReply+1)
                this.rootElement.find('.comment-replys > .col-12').append(
                    this.rootElement.find('.comment-reply-draft').clone()
                    .removeAttr('hidden')
                    .removeClass('comment-reply-draft')
                    .addClass('comment-reply') 
                    .attr('id',idCommentReply)       
                )
                .ready(()=>{
                    this.rootElement.find('#'+idCommentReply).find('.reply-user-massege')
                    .find('.reply-user-massege-text').text(targetInput);
                    if(this.targetFile){
                        this.rootElement.find('#'+idCommentReply).find('.reply-user-massege')
                        .find('.reply-user-massege-img').html('<img  src="' + this.targetFile + '"/>')
                    }
                    this.rootElement.find('#'+idCommentReply).find('.reply-text').trigger('click');
                    let commentDetail:commentDetailModel = new commentDetailModel();
                    commentDetail  = {
                        id:idCommentReply,
                        userId:this.userId,
                        message:targetInput,
                        isQuestion:false,
                        imgData:this.targetFile,
                        isChild:false,
                        liked:0,
                        childs:[]
                    }
                    let targetIndexComment =  this.contentDCtrlService.poolContents.comments.findIndex((comment)=>comment.parentId === this.parentBox.attr('id'));
                    this.contentDCtrlService.poolContents.comments[targetIndexComment].listComment.push(commentDetail)
                    $(event.target).parents('.comment-form').find('.comment-textarea').val(null);
                    $(event.target).parents('.comment-form').find('.comment-massege-img').html(null)
                    this.targetFile = null;
                    this.handleComment()
                    this.saveDocument();
                })
            });
    
        }
    }
    public postCommentChild(parentCommentReplyBox:JQuery<Element>){
        let targetInput  = parentCommentReplyBox.find('.comment-form-child').find('.comment-textarea').val().toString();
        if(targetInput){
            let idCommentReply = "comment-reply-";
            let currentNumberReply = 0;
            this.rootElement.find('[id^="comment-reply-"]').each((index,element)=>{
               let numberReply =  parseInt($(element).attr('id').toString().replace('comment-reply-',''))
                if(numberReply > currentNumberReply){
                    currentNumberReply = numberReply;
                }
            }).ready(()=>{
                idCommentReply = idCommentReply+(currentNumberReply+1)
                parentCommentReplyBox.append(
                    this.rootElement.find('.comment-reply-draft').clone()
                    .removeAttr('hidden')
                    .removeClass('comment-reply-draft')
                    .addClass('comment-reply') 
                    .attr('id',idCommentReply)       
                )
                .ready(()=>{
                    let targetComment = parentCommentReplyBox.find('#'+idCommentReply);
                    let commentDetail:commentDetailModel = new commentDetailModel();
                    commentDetail  = {
                        id:idCommentReply,
                        userId:this.userId,
                        message:targetInput,
                        isQuestion:false,
                        imgData:this.targetFile,
                        isChild:false,
                        liked:0,
                        childs:[]
                    }
                    let targetIndexComment =  this.contentDCtrlService.poolContents.comments.findIndex((comment)=>comment.parentId === this.parentBox.attr('id'));
                
                    let targetIndexParentCommentReply =  this.contentDCtrlService.poolContents.comments[targetIndexComment].listComment
                    .findIndex((commentReply)=>commentReply.id === parentCommentReplyBox.attr('id'))
                    if(targetIndexParentCommentReply >= 0){
                        this.contentDCtrlService.poolContents.comments[targetIndexComment].listComment[targetIndexParentCommentReply]
                        .childs.push(commentDetail)
                    }
                    parentCommentReplyBox.find('.comment-form-child').remove();
                    this.handleChildComment(parentCommentReplyBox,targetComment,targetInput) 
                    this.saveDocument();   
                })
            });
    
        }
    }

    public saveDocument() {
        this.updateAction.actionCase = Constants.document.contents.lifeCycle.saveDocument;
        this.contentDCtrlService.updateContent = this.updateAction
    }

}
