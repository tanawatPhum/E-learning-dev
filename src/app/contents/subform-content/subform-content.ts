import { Component, OnInit, Input, ElementRef, AfterViewInit, HostListener } from '@angular/core';
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

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');
        this.contentTemplateSize = JSON.parse(localStorage.getItem('contentTemplateSize'))
    }
    ngAfterViewInit() {
        this.initialSubform();

    }
    public initialSubform() {
        this.targetSubform = this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'));
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
        this.currentSubFormType = { id: 'subform-link', name: 'link' };
        let htmlDocumentList = '<div class="list-group text-left">';
        this.createDocumentChild();
        let documentSubformList = this.documentDCtrlService.documentNavList.filter((document) => document.nameDocument != this.documentDCtrlService.currentDocumentName)
        this.childDocuments.forEach((document) => {
            documentSubformList = documentSubformList.filter((documentSubform) => documentSubform.id != document.id);
        })
        documentSubformList.forEach((document, index) => {
            htmlDocumentList += '<input type="checkbox" value="' + document.nameDocument + '" id="subform-name-' + this.commonService.getPatternId(document.nameDocument) + '" />';
            if (index == 0) {
                htmlDocumentList += '<label class="list-group-item border-top-0" for="subform-name-' + this.commonService.getPatternId(document.nameDocument) + '">' + document.nameDocument + '</label>';
            } else {
                htmlDocumentList += '<label class="list-group-item" for="subform-name-' + this.commonService.getPatternId(document.nameDocument) + '">' + document.nameDocument + '</label>';
            }
        });
        htmlDocumentList += '</div>'
        this.rootElement.find('.subform-col').html(htmlDocumentList)
        this.handleSubform();
  
    }
    handleSubform() {
        let targetSubform = this.contentDCtrlService.poolContents.subFroms.find(parentBox => parentBox.parentBoxId === this.parentBox.attr('id'))
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
            let targetSubformIndex = this.contentDCtrlService.poolContents.subFroms.findIndex((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'));

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
            if (this.contentDCtrlService.poolContents.subFroms.length === 0 || !this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'))) {
                this.contentDCtrlService.poolContents.subFroms.push(
                    {
                        parentBoxId: this.parentBox.attr('id'),
                        subformType: this.currentSubFormType.id,
                        subformList: [newSubform]
                    }
                )
            } else {
                let targetSubformIndex = this.contentDCtrlService.poolContents.subFroms.findIndex((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'));
                let targetDocument = this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.find((document) => document.id === newSubform.id)
                if ($(itemElement.currentTarget).is(':checked') && !targetDocument) {
                    this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.push(newSubform)
                } else {
                    this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList = this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.filter((detail) => detail.documentName != $(itemElement.currentTarget).val())
                }
            }
            let targetSubform = this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'));
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
            let targetSubformIndex = this.contentDCtrlService.poolContents.subFroms.findIndex((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'));
            this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.forEach((subform) => {
                subform.isConfirm = true;
            })
            this.targetSubform = this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'));
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
    addSubform() {
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
                    if (index == 0) {
                        htmlSubform += '<div  class="carousel-item active full-screen subform-preview">'
                    } else {
                        htmlSubform += '<div  class="carousel-item  full-screen subform-preview">'
                    }
                    htmlSubform += `<div class="full-screen item-middle">
                    <div id="contentTemplate" style="position:absolute; 
                    width: ${this.contentTemplateSize.width}px;
                    height:${this.contentTemplateSize.height}px"> 
                    ${targetDocument.html}
                    </div></div>`
                    htmlSubform += '</div>'
                }
            });
            htmlSubform += '</div>'
            if (this.targetSubform.subformList.length > 1) {
                htmlSubform += '<div data-subformId="' + this.parentBox.attr('id') + '-subform" class="carousel-control-prev" data-slide="prev">'
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

        this.rootElement.html(htmlSubform)
        this.targetSubform.subformList.forEach((subform, index) => {
            let targetDocument = this.documentDCtrlService.documentList.find((document) => document.id === subform.id);
            let updateAction: UpdateContentModel = new UpdateContentModel()
            updateAction.actionCase = Constants.document.contents.lifeCycle.loadsubForm;
            updateAction.data = targetDocument.contents;
            this.contentDCtrlService.updateContent = updateAction
        })
        if (this.currentSubFormType.id === 'subform-silde') {
            this.handleSubformSildeRatio();
            setTimeout(() => {
                this.setPreviewSubformSilde();
            });
            this.parentBox.resize(() => {
                this.handleSubformSildeRatio();
            })
        }else{
            if(this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview){
                this.setHandlePreviewSubformLink()
            }
        }

        this.addDocumentTrackSubform();
        
        this.contentDCtrlService.setLastContent(this.parentBox);


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
        let ratioW = this.rootElement.find('.subform-preview').width() / this.contentTemplateSize.width;
        let ratioH = this.rootElement.find('.subform-preview').height() / this.contentTemplateSize.height;
        this.rootElement.find('.subform-preview').find('#contentTemplate').css({
            transform: 'scale( ' + ratioW + ',' + ratioH + ')'
        });
    }
    setPreviewSubformSilde() {
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor) {
            this.rootElement.find('.subform-preview').find('.template-doc').attr('contenteditable', 'false')
                .css('cursor', 'default')
                .css('pointer-events', 'none')
        }
        else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview) {
            this.rootElement.find('.subform-preview').find('.template-doc').attr('contenteditable', 'false')
                .css('cursor', 'default')
                .css('pointer-events', 'auto')
                .css('overflow', 'auto')
        }


        this.rootElement.find('.subform-preview').find('.content-box').removeClass('ui-resizable');
        this.rootElement.find('.subform-preview').find('.content-box').find('.ui-resizable-handle').remove();
        this.rootElement.find('.subform-preview').find('.content-box').removeClass('.ui-draggable ui-draggable-handle');
        this.rootElement.find('.subform-preview').find('.content-box').find('.content-box-label').hide()
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
      
        this.documentService.handleDocumentTrack(this.documentDCtrlService.currentDocumentName).subscribe(()=>{
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

    public addDocumentTrackSubform() {
        if(!this.documentDCtrlService.documentTrack.contents.find((content)=>content.parentId ===this.parentBox.attr('id'))){
            let documentTrackContent = new DocumentTrackContent;
            documentTrackContent.contentType = this.contentTypes.subform;
            documentTrackContent.parentId = this.parentBox.attr('id');
            documentTrackContent.name = this.parentBox.attr('name');
            documentTrackContent.id = this.parentBox.attr('id') + '-subform'
            documentTrackContent.progress = 0;
            documentTrackContent.conditions.subformCondition.haveInDoList = false;
            // documentTrackContent.conditions.subformCondition.haveInProgressBar = false;
            let targetSubform =  this.parentBox.find('#'+documentTrackContent.id);
            if(targetSubform.attr('data-subformtype') ==='subform-link'){
                targetSubform.find('.subform-list').each((index,element)=>{
                  if(!documentTrackContent.conditions.subformCondition.isClickLinks.find(link=>link.linkId === $(element).attr('data-subformid'))) { 
                    let link:SubFormContentLinkModel={
                        linkId:$(element).attr('data-subformid'),
                        linkName: $(element).attr('data-subformname'),
                        isClicked:false,
                        progress:0
                      }
                      documentTrackContent.conditions.subformCondition.isClickLinks.push(link);
                  }
    
                })
            }
            console.log(documentTrackContent)
            this.documentDCtrlService.documentTrack.contents.push(documentTrackContent)
        }


    }






}
