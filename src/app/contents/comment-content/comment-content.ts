import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { CommonService } from 'src/app/services/common/common.service';
import { commentContentModel } from '../../models/document/elements/comment-content.model';

@Component({
    moduleId: module.id,
    selector: 'comment-content',
    templateUrl: 'comment-content.html',
    styleUrls: ['comment-content.scss']
})
export class CommentContentComponent implements OnInit,ContentInterFace {
    @Input() parentBox: JQuery<Element>;
    @Input() lifeCycle:string;
    private rootElement:JQuery<Element>;
    constructor(
        private commonService :CommonService,
        private documentService:DocumentService,
        private contentDCtrlService:ContentDataControlService,
        private element: ElementRef
        
    ){}
    ngOnInit(){
        this.rootElement = $(this.element.nativeElement); 
        this.parentBox = this.rootElement.parents('.content-box');
    }
    ngAfterViewInit(){
        this.addComment();   
    }
    private addComment(){
        this.rootElement.find('.content-comment').attr('id',this.parentBox.attr('id') + '-comment')
        .find('#comment-attach').attr('data-commentBoxId',this.parentBox.attr('id') + '-comment')
        .find('.comment-btn-post').attr('data-commentId',this.parentBox.attr('id') + '-comment')

        let comment:commentContentModel = {
            parentId:this.parentBox.attr('id'),
            id: this.parentBox.attr('id') + '-comment',
            listComment: []
        }
        this.contentDCtrlService.poolContents.comments.push(comment);
    }

}
