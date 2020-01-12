import { Component, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';
import { LinkContentModel } from '../../models/document/elements/link-content.model';
import { UpdateContentModel } from '../../models/common/common.model';

@Component({
    moduleId: module.id,
    selector: 'link-content',
    templateUrl: 'link-content.html',
    styleUrls: ['link-content.scss']
})
export class LinkContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    @Input() lifeCycle:string;
    @Input() parentBox: JQuery<Element>;
    private rootElement: JQuery<Element>;
    private targetLink;
    private actionCase = {
        browseLink: 'browseLink',
        showLink:'showLink'
    }
    private currentCase = this.actionCase.browseLink;
    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private contentDCtrlService: ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');
    }
    ngAfterViewInit() {
        this.handleBrowseLink();
        
    }
    private handleBrowseLink(){
        this.rootElement.find('.toolbar-browse-link').find('#link-input-url').click(() => {
            this.rootElement.find('.toolbar-browse-link').find('#link-input-url').focus();
            this.rootElement.find('.toolbar-browse-link').find('#link-input-url').on('input', this.commonService.debounce((event) => {
                if (event.target.value) {
                    this.targetLink = event.target.value;
                    this.addLink();
                }
            }, 2000));
        });
        this.rootElement.find('.toolbar-browse-link').find('#link-input-url').bind("paste", (event:any)=>{
            event.preventDefault();
            event.stopPropagation();
            let pastedData = event.originalEvent.clipboardData.getData('text');
            this.targetLink = pastedData;
            this.addLink();
        });
    }
    private addLink(){
        let hostname = (new URL(this.targetLink)).hostname;
        let links:LinkContentModel = {
            parentId:this.parentBox.attr('id'),
            id:this.parentBox.attr('id') + '-link',
            path:this.targetLink,
            name:hostname,
        };
        this.currentCase =  this.actionCase.showLink;
        this.contentDCtrlService.setLastContent(this.parentBox);
        this.contentDCtrlService.poolContents.links.push(links)
        this.rootElement.find('.content-link').attr('data-name',hostname)
        .attr('id', this.parentBox.attr('id') + '-link')
        .text(hostname)
        let updateAction:UpdateContentModel = new UpdateContentModel()
        updateAction.actionCase  = 'showLink'
        this.contentDCtrlService.updateContent = updateAction
    }

}
