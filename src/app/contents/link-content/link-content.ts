import { Component, OnInit, AfterViewInit, Input, ElementRef, HostListener } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';
import { LinkContentModel } from '../../models/document/elements/link-content.model';
import { UpdateContentModel } from '../../models/common/common.model';
import { Constants } from 'src/app/global/constants';
import { ContentsModel } from 'src/app/models/document/content.model';

@Component({
    moduleId: module.id,
    selector: 'link-content',
    templateUrl: 'link-content.html',
    styleUrls: ['link-content.scss']
})
export class LinkContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    @Input() lifeCycle:string;
    @Input() parentBox: JQuery<Element>;

    @HostListener('click', ['$event']) onClick(event) {
        event.preventDefault();
        event.stopPropagation();

    }
    public rootElement: JQuery<Element>;
    public targetLinkInsert;
    public targetLink:LinkContentModel  = new LinkContentModel();
    public actionCase = {
        browseLink: 'browseLink',
        showLink:'showLink'
    }
    public currentCase = this.actionCase.browseLink;
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
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm){
                let targetDocumentContent:ContentsModel = detail.data;
                this.targetLink = targetDocumentContent.links.find((link) => link.parentId === this.parentBox.attr('id'))
                this.initialLink()
            }
        })
    }
    ngAfterViewInit() {
        this.targetLink = this.contentDCtrlService.poolContents.links.find((link) => link.parentId === this.parentBox.attr('id'))
        this.initialLink();
        
    }
    public initialLink(){
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.createContent) {
            this.handleBrowseLink()
        }
        else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview) {
            if(this.targetLink){
                this.loadLink()
                if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview){
                    this.handleLink();
                }
            }
        }
    }
    public handleBrowseLink(){
        this.rootElement.find('.toolbar-browse-link').find('#link-input-url').click(() => {
            this.rootElement.find('.toolbar-browse-link').find('#link-input-url').focus();
            this.rootElement.find('.toolbar-browse-link').find('#link-input-url').on('input', this.commonService.debounce((event) => {
                if (event.target.value) {
                    this.targetLinkInsert = event.target.value;
                    this.addLink();
                }
            }, 2000));
        });
        this.rootElement.find('.toolbar-browse-link').find('#link-input-url').bind("paste", (event:any)=>{
            event.preventDefault();
            event.stopPropagation();
            let pastedData = event.originalEvent.clipboardData.getData('text');
            this.targetLinkInsert = pastedData;
            this.addLink();
        });
    }
    public addLink(){
        let hostname = (new URL(this.targetLinkInsert)).hostname;
        let links:LinkContentModel = {
            parentId:this.parentBox.attr('id'),
            id:this.parentBox.attr('id') + '-link',
            path:this.targetLinkInsert,
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
        this.contentDCtrlService.setLastContent(this.parentBox);
    }
    public loadLink(){
        this.currentCase  = this.actionCase.showLink;
        this.rootElement.find('.content-link').attr('data-name',this.targetLink.name)
        .attr('id', this.parentBox.attr('id') + '-link')
        .text(this.targetLink.name)
    }
    public handleLink(){
        this.rootElement.find('.content-link').unbind().bind('click',(element)=>{
            window.open(this.targetLink.path)
        });
    }

}
