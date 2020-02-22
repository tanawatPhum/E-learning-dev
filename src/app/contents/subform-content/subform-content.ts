import { Component, OnInit, Input, ElementRef, AfterViewInit, HostListener, Injector } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { SubFormContentDetailModel, SubFormContentLinkModel } from 'src/app/models/document/elements/subForm-content.model';
import { SubFormContentConditionModel, SubFormContentModel } from '../../models/document/elements/subForm-content.model';
import { ScreenDetailModel } from 'src/app/models/common/common.model';
import { UpdateContentModel } from '../../models/common/common.model';
import { Constants } from '../../global/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentTrackModel, DocumentTrackContent } from 'src/app/models/document/document.model';
import { ContentRouting } from 'src/app/app-content-routing';
import { createCustomElement } from '@angular/elements';
import { ContentsModel } from 'src/app/models/document/content.model';

@Component({
    moduleId: module.id,
    selector: 'subform-content',
    templateUrl: 'subform-content.html',
    styleUrls: ['subform-content.scss']
})
export class SubformContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    @Input() parentBox: JQuery<Element>;
    @Input() lifeCycle: string;
    @HostListener('click', ['$event']) onClick(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    public rootElement: JQuery<Element>;
    public childDocuments: SubFormContentDetailModel[] = new Array<SubFormContentDetailModel>();
    public currentSubFormType = {
        id: null,
        name: null
    };
    public contentTemplateSize: ScreenDetailModel = new ScreenDetailModel();
    public targetSubform: SubFormContentModel = new SubFormContentModel();
    public actionCase = {
        addSubform: 'addSubform',
    }
    public contentTypes = Constants.document.contents.types;
    public currentCase = this.actionCase.addSubform;
    constructor(
        private commonService: CommonService,
        private documentDCtrlService: DocumentDataControlService,
        private documentService: DocumentService,
        private contentDCtrlService: ContentDataControlService,
        private element: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private injector:Injector

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');
        this.contentTemplateSize = JSON.parse(localStorage.getItem('contentTemplateSize'))
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm
                && detail.for === this.parentBox.attr('id')
                ){
                let targetDocumentContent:ContentsModel = detail.data;
                this.targetSubform = targetDocumentContent.subFroms.find((parentBox) => parentBox.parentId === this.parentBox.attr('id'));
                if (this.targetSubform) {
                    this.currentSubFormType.id = this.targetSubform.subformType;
                    this.addSubform();
                }
    
            }
        })
    }
    ngAfterViewInit() {
        this.targetSubform = this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentId === this.parentBox.attr('id'));
        this.initialSubform();

    }
    public initialSubform() {
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.createContent) {
            this.handleAddSubform();
        } else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
            if (this.targetSubform) {
                this.currentSubFormType.id = this.targetSubform.subformType;
                this.addSubform();
            }

        }

    }
    handleAddSubform() {
        this.currentSubFormType = { id: 'subform-silde', name: 'silde' };
        let htmlDocumentList = '<div class="list-group text-left">';
        this.createDocumentChild();
        let documentSubformList = this.documentDCtrlService.documentNavList.filter((document) => document.id != this.documentDCtrlService.currentDocument.id)
        
        
        this.childDocuments.forEach((document) => {
            documentSubformList = documentSubformList.filter((documentSubform) => documentSubform.id != document.id);
        })
        documentSubformList.forEach((document, index) => {
            htmlDocumentList += '<input type="checkbox" value="' + document.nameDocument + '" id="subform-name-' + document.id + '" />';
            if (index == 0) {
                htmlDocumentList += '<label class="list-group-item border-top-0" for="subform-name-' + document.id + '">' + document.nameDocument + '</label>';
            } else {
                htmlDocumentList += '<label class="list-group-item" for="subform-name-' + document.id + '">' + document.nameDocument + '</label>';
            }
        });
        htmlDocumentList += '</div>'
        this.rootElement.find('.subform-col').html(htmlDocumentList)
        this.handleSubform();
  
    }
    handleSubform() {
        let targetSubform = this.contentDCtrlService.poolContents.subFroms.find(parentBox => parentBox.parentId === this.parentBox.attr('id'))
        if (targetSubform) {
            targetSubform.subformList.forEach((detail) => {
                this.rootElement.find('.toolbar-subform').find('#subform-name-' + detail.id).prop('checked', true);
            })
            if (targetSubform.subformList.length > 0) {
                if (targetSubform.subformList[0].type === "subform-silde") {
                    this.rootElement.find('.toolbar-subform').find('[id="' + targetSubform.subformList[0].type + '"]').text('Silde (' + targetSubform.subformList.length + ')');
                } else if (targetSubform.subformList[0].type === "subform-link") {
                    this.rootElement.find('.toolbar-subform').find('[id="' + targetSubform.subformList[0].type + '"]').text('Link (' + targetSubform.subformList.length + ')');
                }

                this.removeStyleSubformActive();
                this.addStyleSubformActive(this.rootElement.find('.toolbar-subform').find('#' + targetSubform.subformList[0].type));
            }
        }
        this.rootElement.find('.toolbar-subform').find('.nav-item').click((itemElement) => {
            this.removeStyleSubformActive();
            this.addStyleSubformActive($(itemElement.currentTarget));
            this.currentSubFormType = {
                id: $(itemElement.currentTarget).attr('id'),
                name: $(itemElement.currentTarget).data('subformtype')
            }
            this.rootElement.find('.toolbar-subform').find('#subform-silde').text('Silde (0)');
            this.rootElement.find('.toolbar-subform').find('#subform-link').text('Link (0)');
            let targetSubformIndex = this.contentDCtrlService.poolContents.subFroms.findIndex((parentBox) => parentBox.parentId === this.parentBox.attr('id'));

            if (targetSubformIndex >= 0) {
                if (this.currentSubFormType.id === "subform-silde") {
                    this.rootElement.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Silde (' + this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.length + ')');
                }
                else if (this.currentSubFormType.id === "subform-link") {
                    this.rootElement.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Link (' + this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.length + ')');
                }
                this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.forEach((detail) => {
                    detail.type = this.currentSubFormType.id;
                });
            }

        });

        this.rootElement.find('.toolbar-subform').find('input[type="checkbox"]').click((itemElement) => {
            let targetDocument = this.documentDCtrlService.documentNavList.find((document) => document.nameDocument === $(itemElement.currentTarget).val())
            let condition: SubFormContentConditionModel = new SubFormContentConditionModel();
            let newSubform: SubFormContentDetailModel = {
                id: targetDocument.id,
                documentName: targetDocument.nameDocument,
                isLinked: true,
                linkName: targetDocument.nameDocument,
                type: this.currentSubFormType.id,
                isConfirm: false,
                condition: condition
            }
            if (this.contentDCtrlService.poolContents.subFroms.length === 0 || !this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentId === this.parentBox.attr('id'))) {
                this.contentDCtrlService.poolContents.subFroms.push(
                    {
                        parentId: this.parentBox.attr('id'),
                        subformType: this.currentSubFormType.id,
                        subformList: [newSubform]
                    }
                )
            } else {
                let targetSubformIndex = this.contentDCtrlService.poolContents.subFroms.findIndex((parentBox) => parentBox.parentId === this.parentBox.attr('id'));
                let targetDocument = this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.find((document) => document.id === newSubform.id)
                if ($(itemElement.currentTarget).is(':checked') && !targetDocument) {
                    this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.push(newSubform)
                } else {
                    this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList = this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.filter((detail) => detail.documentName != $(itemElement.currentTarget).val())
                }
            }
            let targetSubform = this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentId === this.parentBox.attr('id'));
            // if(targetSubform.subformList.length>0){
            if (this.currentSubFormType.id === "subform-silde") {
                this.rootElement.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Silde (' + targetSubform.subformList.length + ')');
            }
            else if (this.currentSubFormType.id === "subform-link") {
                this.rootElement.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Link (' + targetSubform.subformList.length + ')');
            }
            this.removeStyleSubformActive();
            this.addStyleSubformActive(this.rootElement.find('.toolbar-subform').find('#' + this.currentSubFormType.id));
        });
        this.rootElement.find('.carousel-control-next').click((event) => {
            $('#' + $(event.currentTarget).attr('data-subformId')).carousel('next');
        })
        this.rootElement.find('.carousel-control-prev').click((event) => {
            $('#' + $(event.currentTarget).attr('data-subformId')).carousel('prev');
        })
        this.rootElement.find('.toolbar-subform').find('#subform-btn-submit').click((btnElement) => {
            btnElement.stopPropagation();
            let targetSubformIndex = this.contentDCtrlService.poolContents.subFroms.findIndex((parentBox) => parentBox.parentId === this.parentBox.attr('id'));
            this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.forEach((subform) => {
                subform.isConfirm = true;
            })
            this.targetSubform = this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentId === this.parentBox.attr('id'));
            this.addSubform();
        })

        this.rootElement.find('.content-box').find('.content-subform').find('.carousel-control-next').click((event) => {
            $('#' + $(event.currentTarget).attr('data-subformId')).carousel('next');
        })
        this.rootElement.find('.content-box').find('.content-subform').find('.carousel-control-prev').click((event) => {
            $('#' + $(event.currentTarget).attr('data-subformId')).carousel('prev');
        })
    }

    createDocumentChild() {
        this.childDocuments = new Array<SubFormContentDetailModel>();
        this.contentDCtrlService.poolContents.subFroms.forEach((parentBox) => {
            parentBox.subformList.forEach((subform) => {
                if (!this.childDocuments.find(childDoc => childDoc.id === subform.id)) {
                    if (subform.isConfirm) {
                        this.childDocuments.push(subform);
                    }
                }

            })
        });
    }
    removeStyleSubformActive() {
        this.rootElement.find('.toolbar-subform').find('.nav-item').removeClass('active');
        this.rootElement.find('.toolbar-subform').find('.nav-item').removeClass('text-primary');
    }
    addStyleSubformActive(element: JQuery<Element>) {
        element.addClass('active');
        element.addClass('text-primary');
    }
    async addSubform() {
        this.contentDCtrlService.setLastContent(this.parentBox);
        let htmlSubform = '';


        if (this.currentSubFormType.id === 'subform-link') {
            htmlSubform += '<ul id="' + this.parentBox.attr('id') + '-subform" data-subformType="subform-link" class="list-group content-subform mt-3">';
            this.targetSubform.subformList.forEach((subform, index) => {
                if (index == 0) {
                    htmlSubform += '<li  data-subformId="' + subform.id + '"  data-subformName="' + subform.documentName + '" class="subform-list cursor-pointer list-group-item rounded-0 border-left-0 border-right-0 border-top-0">' + subform.linkName + '</li>'
                } else {
                    htmlSubform += '<li data-subformId="' + subform.id + '" data-subformName="' + subform.documentName + '" class="subform-list cursor-pointer list-group-item rounded-0 border-left-0 border-right-0">' + subform.linkName + '</li>'
                }

            })
            htmlSubform += '</ul>';
        }
        else if (this.currentSubFormType.id === 'subform-silde') {
            htmlSubform += '<div  class="container content-subform p-0 full-screen">'
            htmlSubform += '<div  data-subformType="subform-silde" id="' + this.parentBox.attr('id') + '-subform" class="border carousel slide full-screen" data-interval="false" data-ride="carousel">'
            htmlSubform += '<div class="carousel-inner full-screen">'
            this.targetSubform.subformList.forEach((subform, index) => {
                let targetDocument = this.documentDCtrlService.documentList.find((document) => document.id === subform.id);

                if (targetDocument) {
                    let BoxesHtml = '';
                    targetDocument.contents.boxes.forEach((box)=>{
                        BoxesHtml+=this.documentService.getBoxContentPreview(box)
                    })

                    if (index == 0) {
                        htmlSubform += '<div data-subformId="' + this.parentBox.attr('id') + '-subform" class="carousel-item active full-screen subform-preview">'
                    } else {
                        htmlSubform += '<div data-subformId="' + this.parentBox.attr('id') + '-subform" class="carousel-item  full-screen subform-preview">'
                    }
                    htmlSubform += `<div class="full-screen">
                    <div id="contentTemplate" style="position:absolute; 
                    width:${this.contentTemplateSize.width}px; 
                    height:100%"> 
                    ${BoxesHtml}
                    </div></div>`
                    htmlSubform += '</div>'
                }
            });
            htmlSubform += '</div>'
            if (this.targetSubform.subformList.length > 1) {
                htmlSubform += '<div  data-subformId="' + this.parentBox.attr('id') + '-subform" class="carousel-control-prev" data-slide="prev">'
                htmlSubform += '<i style="font-size:200%" class="text-dark fa fa-angle-left cursor-pointer"></i>'
                // htmlSubform += '<span class="carousel-control-prev-icon cursor-pointer"><i class="fa fa-angle-left"></i>  </span>'
                htmlSubform += '</div>'
                htmlSubform += '<div data-subformId="' + this.parentBox.attr('id') + '-subform" class="carousel-control-next" data-slide="next">'
                htmlSubform += '<i style="font-size:200%" class="text-dark fa fa-angle-right cursor-pointer"></i>'
                // htmlSubform += '<span class="carousel-control-next-icon cursor-pointer"><i class="fa fa-angle-right"></i> </span>'
                htmlSubform += '</div>'
            }
            htmlSubform += '</div>'
            htmlSubform += '</div>'
        }
        this.defineComponent();
        this.rootElement.html(htmlSubform)
        this.rootElement.find('#'+this.documentDCtrlService.nameTemplate).css('height','100%')
        await this.targetSubform.subformList.forEach(async (subform, index) => {
            let targetDocument = this.documentDCtrlService.documentList.find((document) => document.id === subform.id);
            if(targetDocument){
                let updateAction: UpdateContentModel = new UpdateContentModel()
                updateAction.actionCase = Constants.document.contents.lifeCycle.loadsubForm;
                updateAction.data = targetDocument.contents;

                await Object.keys(targetDocument.contents).forEach((content)=>{
                    for(let detail of targetDocument.contents[content]){ 
                        if(detail['parentId']){
                            updateAction.for =  detail['parentId'];
                            this.contentDCtrlService.updateContent = updateAction
                        }
                    }
                })
    
            
            }
        })
        if (this.currentSubFormType.id === 'subform-silde') {
            setTimeout(() => {
                this.handleSubformSildeRatio();    
            });
            this.setPreviewSubformSilde();
            this.parentBox.resize(() => {
                this.handleSubformSildeRatio();
            })
        }else{
            if(this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview){
                this.setHandlePreviewSubformLink()
            }
        }
        this.updateDocumentNav();

        //this.addDocumentTrackSubform();
        
        
    


        // element.css('display', 'initial');
        // element.css('text-align', 'initial');
        // element.removeClass('box-subform-size');
        // element.css('width', Constants.common.element.css.box.width);
        // element.css('height', Constants.common.element.css.box.height);
        // element.append(htmlSubform);
        // element.find('#template-doc').attr('contenteditable', false);
        // element.find('#template-doc').css('cursor', 'move');

        // this.handles(this.actions.event.handleElRatio, element.find('#contentTemplate'), element.find('.subform-preview'))
        // this.handles(this.actions.event.handleSubForm, element);

        // this.removeStyleElements(this.actions.event.removeForPreviewSubForm, element);
        // this.createData(this.actions.data.createChildDocument);
        // this.updateData(this.actions.data.updateNavigatorData);



    }
    handleSubformSildeRatio() {
        // let parentWidth = $('#'+this.parentBox.attr('id') + '-subform').width();

        // let ratioW = parentWidth/ (this.contentTemplateSize.width );
        // let parentWidth = $('#'+this.parentBox.attr('id') + '-subform').width();

        // let ratioW = parentWidth/ (this.contentTemplateSize.width );
        // let ratioH = this.rootElement.find('.subform-preview').height() / this.contentTemplateSize.height;

        // let ratioAvg =  ratioW +ratioH/2
        // ratioW = parentWidth/ (this.contentTemplateSize.width );
        // console.log(ratioW)
        //ratioW =  100-(((this.contentTemplateSize.width-parentWidth)/this.contentTemplateSize.width) *100) + '%'

        // this.rootElement.find('.subform-preview').find('#contentTemplate').css({
        //     transform: 'scale( ' + ratioAvg + ',' + ratioAvg + ')'
        // });
        $('#'+this.parentBox.attr('id') + '-subform').find('#contentTemplate').each((index,element)=>{
            let parentWidth = $(element).closest('.subform-preview').width();
            let ratioW = parentWidth/ (this.contentTemplateSize.width );
           $(element).closest('#contentTemplate').css({
                zoom:ratioW
            })
        })
      //console.log( $('#'+this.parentBox.attr('id') + '-subform').find('#contentTemplate'))
        // $('#'+this.parentBox.attr('id') + '-subform').find('#contentTemplate').css({
        //     zoom:ratioW
        // })

        //let ratioH = this.rootElement.find('.subform-preview').height() / this.contentTemplateSize.height;

        // if(this.rootElement.find('.subform-preview').width() > this.contentTemplateSize.width){
        //     ratioW = this.rootElement.find('.subform-preview').width()/ (this.contentTemplateSize.width );
        // }else {
        //     ratioW = this.contentTemplateSize.width/this.rootElement.find('.subform-preview').width();
        // }
    
 
        // this.rootElement.find('.subform-preview').find('#contentTemplate').css({
        //     zoom:ratioW
        // })


        // this.rootElement.find('.subform-preview').find('#contentTemplate').css({
        //     transform: 'scale( ' + ratioW + ',' + ratioH + ')'
        // });
    }
    setPreviewSubformSilde() {
        let targetSubform = this.parentBox.attr('id') + '-subform';
        this.rootElement.find('[data-subformId="' + targetSubform+'"]').click((element)=>{
            element.preventDefault();
            element.stopPropagation();
            let targetButtonCarousel = $(element.currentTarget);
            let targetCarousel = $('#'+targetSubform)
            let targetCarouselItem  = targetCarousel.find('.carousel-item.active[data-subformId="'+targetSubform+'"]')

            if(targetButtonCarousel.attr('data-slide')==='next'){
                if(targetCarouselItem.next().length > 0){
                    targetCarouselItem.removeClass('active').ready(()=>{
                        targetCarouselItem.next().addClass('active')
                    })
                }else{
                    targetCarouselItem.removeClass('active').ready(()=>{
                        targetCarousel.find('.carousel-inner').find('.carousel-item[data-subformId="'+targetSubform+'"]').first().addClass('active')
                    })
                  
                }
            }
            else if(targetButtonCarousel.attr('data-slide')==='prev'){
                if(targetCarouselItem.is( ":first-child" )){
                    targetCarouselItem.removeClass('active').ready(()=>{
                        targetCarousel.find('.carousel-inner').find('.carousel-item[data-subformId="'+targetSubform+'"]').last().addClass('active')
                    })
                }else{
                    if(targetCarouselItem.prev().length > 0){
                        targetCarouselItem.removeClass('active').ready(()=>{
                            targetCarouselItem.prev().addClass('active')
                        })
                    }else{
                        targetCarouselItem.removeClass('active').ready(()=>{
                            targetCarousel.find('.carousel-inner').find('.carousel-item[data-subformId="'+targetSubform+'"]').first().addClass('active')
                        })
                    }
                }
            }
   
            // console.log(targetCarousel);
            // targetCarousel.carousel(targetButtonCarousel.attr('data-slide'));
            // if(targetButtonCarousel.attr('data-slide')==='next'){
            //      targetCarousel.carousel("next");
            // }
            // else if(targetButtonCarousel.attr('data-slide')==='prev'){

            // }

            // console.log(targetButtonCarousel.attr('data-slide'))

        })

        // if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor) {
        //     this.rootElement.find('.subform-preview').find('.template-doc').attr('contenteditable', 'false')
        //         .css('cursor', 'default')
        //         .css('pointer-events', 'none')
        // }
        // else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
        //     this.rootElement.find('.subform-preview').find('.template-doc').attr('contenteditable', 'false')
        //         .css('cursor', 'default')
        //         .css('pointer-events', 'auto')
        //         .css('overflow', 'auto')
        // }


        // this.rootElement.find('.subform-preview').find('.content-box').removeClass('ui-resizable');
        // this.rootElement.find('.subform-preview').find('.content-box').find('.ui-resizable-handle').remove();
        // this.rootElement.find('.subform-preview').find('.content-box').removeClass('.ui-draggable ui-draggable-handle');
        // this.rootElement.find('.subform-preview').find('.content-box').find('.content-box-label').hide()
        this.rootElement.find('.subform-preview').find('.content-box').css('border', 'none');
        this.rootElement.find('.subform-preview').find('.content-box').css('cursor', 'default');
        this.rootElement.find('.subform-preview').find('.content-box').find('.content-textarea').attr('contenteditable', 'false')
        this.rootElement.find('.subform-preview').find('.content-box').find('.content-textarea').css('cursor', 'default')

  
 
        // this.rootElement.find('.subform-preview').find('.content-box').find('.content-video').css('pointer-events', 'initial');
    }
    public setHandlePreviewSubformLink(){
        this.rootElement.find('.content-subform').find('.subform-list').click((element)=>{
            this.goToSubForm($(element.currentTarget));
        })
    }



    public async goToSubForm(element: JQuery<Element>) {
        let targetContentIndex = await this.documentDCtrlService.currentDocumentTrack.contents.findIndex((content) => content.id === element.parents('.content-subform').attr('id')) 
        if (targetContentIndex >= 0) {
            let targetLinkIndex = this.documentDCtrlService.currentDocumentTrack.contents[targetContentIndex].conditions.subformCondition.isClickLinks.findIndex(link => link.linkName === element.attr('data-subformName'))
            this.documentDCtrlService.currentDocumentTrack.contents[targetContentIndex].conditions.subformCondition.isClickLinks[targetLinkIndex].isClicked = true;
        }
        let currentDocument =  JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocument))
        let documentTrack = JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocumentTrack))
        let contents = JSON.parse(JSON.stringify(this.contentDCtrlService.poolContents))
       // console.log(this.documentDCtrlService.currentDocumentTrack.contents)
        this.documentService.handleDocumentTrack(currentDocument,documentTrack,contents).subscribe(()=>{
            let updateAction: UpdateContentModel = new UpdateContentModel()
            updateAction.actionCase = Constants.document.contents.lifeCycle.clickSubForm; 

            this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
            let currentUrl = this.router.url + '?';
            this.router.navigateByUrl(currentUrl)
                .then(() => {
                    this.router.navigated = false;
                    this.router.navigate(['documentPreview'], { queryParams: { documentName: element.attr('data-subformName') } })
                });
        });
    
    }
    handleCarouselSilde(){

    }
    updateDocumentNav() {
        let targetDocNavIndex = this.documentDCtrlService.documentNavList.findIndex((docNav) => docNav.id === this.documentDCtrlService.currentDocument.id);
         
        this.targetSubform.subformList.forEach((document,index)=>{
           if(targetDocNavIndex >= 0 &&!this.documentDCtrlService.documentNavList[targetDocNavIndex].childDocuments.find((documentChild)=>documentChild.id === document.id)){
            this.documentDCtrlService.documentNavList[targetDocNavIndex].childDocuments.push(document)
           }
 
        })
        // console.log(this.documentDCtrlService.documentNavList)
        // console.log(this.documentDCtrlService.currentDocumentNav)
        if (targetDocNavIndex >= 0) {
            let updateContent =  new UpdateContentModel();
            updateContent.actionCase = Constants.document.lifeCycle.updateDocumentNav;
            this.contentDCtrlService.updateContent =  updateContent;
            // this.eventToParent.emit({ action: Constants.common.event.click.update, data: 'updateDocNav' })
        }
    }

    // public addDocumentTrackSubform() {
    //     if(!this.documentDCtrlService.documentTrack.contents.find((content)=>content.parentId ===this.parentBox.attr('id'))){
    //         let documentTrackContent = new DocumentTrackContent;
    //         documentTrackContent.contentType = this.contentTypes.subform;
    //         documentTrackContent.parentId = this.parentBox.attr('id');
    //         documentTrackContent.name = this.parentBox.attr('name');
    //         documentTrackContent.id = this.parentBox.attr('id') + '-subform'
    //         documentTrackContent.progress = 0;
    //         documentTrackContent.conditions.subformCondition.haveInDoList = false;
    //         // documentTrackContent.conditions.subformCondition.haveInProgressBar = false;
    //         let targetSubform =  this.parentBox.find('#'+documentTrackContent.id);
    //         if(targetSubform.attr('data-subformtype') ==='subform-link'){
    //             targetSubform.find('.subform-list').each((index,element)=>{
    //               if(!documentTrackContent.conditions.subformCondition.isClickLinks.find(link=>link.linkId === $(element).attr('data-subformid'))) { 
    //                 let link:SubFormContentLinkModel={
    //                     linkId:$(element).attr('data-subformid'),
    //                     linkName: $(element).attr('data-subformname'),
    //                     isClicked:false,
    //                     progress:0
    //                   }
    //                   documentTrackContent.conditions.subformCondition.isClickLinks.push(link);
    //               }
    
    //             })
    //         }
    //         console.log(documentTrackContent)
    //         this.documentDCtrlService.documentTrack.contents.push(documentTrackContent)
    //     }


    // }

    private defineComponent() {
        ContentRouting.routes.forEach((route) => {
            const customElement = createCustomElement(route.component, { injector: this.injector });
            customElements.get(route.contentName) || customElements.define(route.contentName, customElement)
        })
    }




}
