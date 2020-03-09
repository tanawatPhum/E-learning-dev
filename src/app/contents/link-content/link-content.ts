import { Component, OnInit, AfterViewInit, Input, ElementRef, HostListener } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';
import { LinkContentModel, LinkContentConditionModel } from '../../models/document/elements/link-content.model';
import { UpdateContentModel } from '../../models/common/common.model';
import { Constants } from 'src/app/global/constants';
import { ContentsModel } from 'src/app/models/document/content.model';
import { SubFormContentDetailModel, SubFormContentLinkModel } from 'src/app/models/document/elements/subForm-content.model';
import { DocumentNavigatorModel, DocumentTrackContent } from '../../models/document/document.model';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'link-content',
    templateUrl: 'link-content.html',
    styleUrls: ['link-content.scss']
})
export class LinkContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    @Input() lifeCycle: string;
    @Input() parentBox: JQuery<Element>;
    @Input() data: Range;
    public documentList:DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
    // public childDocuments: SubFormContentDetailModel[] = new Array<SubFormContentDetailModel>();
    public selectDocument: DocumentNavigatorModel = new DocumentNavigatorModel();
    public currentTextSelection:Range;
    public contentTypes = Constants.document.contents.types;
    public createLink:LinkContentModel = new LinkContentModel();
    public linkType = Constants.document.contents.constats.linkTypes;

    @HostListener('click', ['$event']) onClick(event) {
        event.preventDefault();
        event.stopPropagation();

    }
    public rootElement: JQuery<Element>;
    public targetLinkInsert;
    public targetLink: LinkContentModel = new LinkContentModel();
    public actionCase = {
        browseLink: 'browseLink',
        showLink: 'showLink'
    }
    public currentCase = this.actionCase.browseLink;
    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private contentDCtrlService: ContentDataControlService,
        private documentDCtrlService: DocumentDataControlService,
        private element: ElementRef,
        private router: Router,

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');
        this.contentDCtrlService.getUpdateContent().subscribe((detail) => {
            if (detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm && detail.for === this.parentBox.attr('id')) {
                let targetDocumentContent: ContentsModel = detail.data;
                this.targetLink = targetDocumentContent.links.find((link) => link.parentId === this.parentBox.attr('id'))
                this.initialLink()
            }
        })
    }
    ngAfterViewInit() {
        this.currentTextSelection =  this.data;
        this.targetLink = this.contentDCtrlService.poolContents.links.find((link) => link.parentId === this.parentBox.attr('id'))
        this.initialLink();

    }
    public initialLink() {
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.createContent) {
            //this.handleBrowseLink()
            this.createDocumentList();
        }
        else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
            if (this.targetLink) {
                this.loadLink()
                if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
                    this.handleLink();
                }
            }
        }
    }
    public handleBrowseLink(event) {
        event.stopPropagation();
        // this.rootElement.find('.toolbar-browse-link').find('#link-input-url').unbind('click').bind('click',() => {
        //     this.rootElement.find('.toolbar-browse-link').find('#link-input-url').focus();
        //     this.rootElement.find('.toolbar-browse-link').find('#link-input-url').on('input', this.commonService.debounce((event) => {
        //         if (event.target.value) {
        //             this.createLink.path = event.target.value;
        //             //this.targetLinkInsert = event.target.value;
        //             // this.addLink();
        //         }
        //     },0));
        // });
        // console.log(this.rootElement.find('.toolbar-browse-link').find('#link-input-url'))
        // this.rootElement.find('.toolbar-browse-link').find('#link-input-url').bind("paste", (event: any) => {

        //     event.preventDefault();
        //     event.stopPropagation();
        //     let pastedData = event.originalEvent.clipboardData.getData('text');
        //     this.createLink.path = pastedData;
        //     // this.targetLinkInsert = pastedData;
        //     // this.addLink();
        // });
    }
    public addLink() {
        if(this.currentTextSelection){
            this.parentBox.css('display','inline-block')
            this.parentBox.css('position','initial')
            this.parentBox.css('width','auto')
            this.parentBox.css('height','auto')
            this.parentBox.removeClass('ui-resizable');
            this.parentBox.find('.ui-resizable-handle').remove();
            this.parentBox.find('.content-box-label').remove();
            this.replaceSelectionWithHtml(this.parentBox)
            this.parentBox.css('height','auto')
            this.parentBox.css('width','auto') 
            let updateAction: UpdateContentModel = new UpdateContentModel()
            updateAction.actionCase = Constants.document.contents.lifeCycle.updateHandleContentBox
            this.contentDCtrlService.updateContent = updateAction
            this.contentDCtrlService.setLastContent(this.parentBox);
            this.parentBox.attr('content-box-type','text')
           // this.parentBox.wrapInner("<div/>").children(0).unwrap()

        }else{
            this.parentBox.css('height','auto')
            this.parentBox.css('width','70') 
            this.parentBox.css('min-width','70')
        }

 
        
        if(this.createLink.type === this.linkType.url && !this.createLink.name){
            try{
                this.createLink.name = (new URL(this.createLink.path)).hostname;
            }catch(e){}
        }else if(this.createLink.type === this.linkType.document){
            let targetDocument =   this.documentList.find((document)=>document.id  === this.createLink.childId )
            if(targetDocument){
                if(!this.createLink.name){
                    this.createLink.name = targetDocument.nameDocument;
                }
                this.createLink.path  =  targetDocument.nameDocument;
  
            }
        }
        this.createLink.parentId  =  this.parentBox.attr('id');
        this.createLink.id  =  this.parentBox.attr('id')+ '-link';
        let link: LinkContentModel = {
            type:this.createLink.type,
            parentId: this.createLink.parentId,
            id: this.createLink.id,
            path: this.createLink.path,
            name: this.createLink.name,
            childId:this.createLink.childId,
            styles:null
        };
        this.currentCase = this.actionCase.showLink;
        this.contentDCtrlService.setLastContent(this.parentBox);
        this.contentDCtrlService.poolContents.links.push(link)
        this.rootElement.find('.content-link').attr('data-name', this.createLink.name)
            .attr('id', this.parentBox.attr('id') + '-link')
            .text(this.createLink.name)
        let updateAction: UpdateContentModel = new UpdateContentModel()
        updateAction.actionCase = 'showLink'
        this.contentDCtrlService.updateContent = updateAction
        this.contentDCtrlService.setLastContent(this.parentBox);
        this.addDocumentTrackLink();
    }
    public loadLink() {
        this.currentCase = this.actionCase.showLink;
        if(this.parentBox.attr('content-box-type')){
            this.parentBox.css('position','initial')
            let updateAction: UpdateContentModel = new UpdateContentModel()
            updateAction.actionCase = Constants.document.contents.lifeCycle.updateHandleContentBox
            this.contentDCtrlService.updateContent = updateAction
        }
        this.rootElement.find('.content-link').attr('data-name', this.targetLink.name)
            .attr('id', this.parentBox.attr('id') + '-link')
            .text(this.targetLink.name)

        if(this.targetLink.styles){
            this.rootElement.find('.content-link').attr('style',this.targetLink.styles)
        } 
           
    }
    public handleLink() {

        this.rootElement.find('.content-link').unbind().bind('click', (element) => {
            let targetContentIndex = this.documentDCtrlService.currentDocumentTrack.contents.findIndex((content) => content.parentId === this.parentBox.attr('id')) 
            if (targetContentIndex >= 0) {
                this.documentDCtrlService.currentDocumentTrack.contents[targetContentIndex].conditions.linkCondition.isClicked  =true;
            }
            let currentDocument =  JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocument))
            let documentTrack = JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocumentTrack))
            let contents = JSON.parse(JSON.stringify(this.contentDCtrlService.poolContents))

            this.documentService.handleDocumentTrack(currentDocument,documentTrack,contents).subscribe(()=>{
                let updateAction: UpdateContentModel = new UpdateContentModel()
                updateAction.actionCase = Constants.document.contents.lifeCycle.clickLink; 
                this.contentDCtrlService.updateContent = updateAction;

                if(this.targetLink.type  ===  this.linkType.url){
                    window.open(this.targetLink.path)

                }else if(this.targetLink.type  ===  this.linkType.document){        
                    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
                    let currentUrl = this.router.url + '?';
                    this.router.navigateByUrl(currentUrl)
                        .then(() => {
                            this.router.navigated = false;
                            this.router.navigate(['documentPreview'], { queryParams: { documentName: this.targetLink.path } })
                        });
                }

     
            });
     
        });
        
    }
    public changeLinkType(event) {
        // setTimeout(() => {
        //     this.handleBrowseLink();            
        // },1000);

    }
    public changeDocument(documentId){
        console.log(documentId)
        let targetDocument  =   this.documentList.find((document)=>document.id  === documentId)
        if(targetDocument){
            this.createLink.childId  = targetDocument.id;
        }

    }
    public createDocumentList() {
        this.documentList = this.documentDCtrlService.documentNavList.filter((document) => document.id != this.documentDCtrlService.currentDocument.id)
    }
    public removeLink() {
        this.contentDCtrlService.poolContents.links = this.contentDCtrlService.poolContents.links.filter((link) => link.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
    }

    public addDocumentTrackLink() {
        if(!this.documentDCtrlService.documentTrack.contents.find((content)=>content.parentId ===this.parentBox.attr('id'))){
            let documentTrackContent = new DocumentTrackContent;
            documentTrackContent.contentType = this.contentTypes.link;
            documentTrackContent.parentId = this.createLink.parentId;
            documentTrackContent.name = this.parentBox.attr('name');
            documentTrackContent.id = this.createLink.id
            documentTrackContent.progress = 0;
            let link:LinkContentConditionModel  = {
                 progress: 0,
                 linkId: this.createLink.childId,
                 linkName:this.createLink.name,
                 isClicked:false,
                 linkType:this.createLink.type
            }
            documentTrackContent.conditions.linkCondition  =link;
     

            // documentTrackContent.conditions.subformCondition.haveInProgressBar = false;
            // let targetSubform =  this.parentBox.find('#'+documentTrackContent.id);
            // if(targetSubform.attr('data-subformtype') ==='subform-link'){
            //     targetSubform.find('.subform-list').each((index,element)=>{
            //       if(!documentTrackContent.conditions.subformCondition.isClickLinks.find(link=>link.linkId === $(element).attr('data-subformid'))) { 
            //         let link:SubFormContentLinkModel={
            //             linkId:$(element).attr('data-subformid'),
            //             linkName: $(element).attr('data-subformname'),
            //             isClicked:false,
            //             progress:0
            //           }
            //           documentTrackContent.conditions.subformCondition.isClickLinks.push(link);
            //       }
    
            //     })
            // }
            //console.log(documentTrackContent)
            this.documentDCtrlService.documentTrack.contents.push(documentTrackContent)
        }


    }
    private replaceSelectionWithHtml(element:JQuery<Element>) {
        var range;
        if (this.currentTextSelection) {
            range = this.currentTextSelection;
            range.deleteContents();
            // var div = document.createElement("div");
            // div.innerHTML = html;
            var frag = document.createDocumentFragment(), child;
            // while ( (child = div.firstChild) ) {
          
            $(element).detach().appendTo(frag)
            
           // $(element).wrap('<span></span>')
   
            // }
            range.insertNode(frag);

          //  $('<span>&nbsp;</span>').insertAfter(element)
        }
     
    }

}
