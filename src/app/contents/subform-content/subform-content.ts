import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { SubFormContentDetailModel } from 'src/app/models/document/elements/subForm-content.model';
import { SubFormContentConditionModel } from '../../models/document/elements/subForm-content.model';
import { ScreenDetailModel } from 'src/app/models/common/common.model';

@Component({
    moduleId: module.id,
    selector: 'subform-content',
    templateUrl: 'subform-content.html',
    styleUrls: ['subform-content.scss']
})
export class SubformContentComponent  implements OnInit,ContentInterFace,AfterViewInit  {
    @Input() parentBox: JQuery<Element>;
    @Input() lifeCycle:string;
    private rootElement:JQuery<Element>;
    private childDocuments: SubFormContentDetailModel[] = new Array<SubFormContentDetailModel>();
    private currentSubFormType;
    private contentTemplateSize: ScreenDetailModel = new ScreenDetailModel();
    private actionCase = {
        addSubform:'addSubform',
    }
    private currentCase = this.actionCase.addSubform;
    constructor(
        private commonService :CommonService,
        private documentDService:DocumentDataControlService,
        private documentService:DocumentService,
        private contentDCtrlService:ContentDataControlService,
        private element: ElementRef
        
    ){}
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement); 
        this.parentBox = this.rootElement.parents('.content-box');
        this.contentTemplateSize =    JSON.parse(localStorage.getItem('contentTemplateSize'))
    }
    ngAfterViewInit(){
        this.handleAddSubform();
    }
    handleAddSubform(){
        this.currentSubFormType = { id: 'subform-link', name: 'link' };
        let htmlDocumentList = '<div class="list-group text-left">';
        this.createDocumentChild();
        let documentSubformList = this.documentDService.documentNavList.filter((document) => document.nameDocument != this.documentDService.currentDocumentName)
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
    handleSubform(){
  
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
                    this.addStyleSubformActive( this.rootElement.find('.toolbar-subform').find('#' + targetSubform.subformList[0].type));
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
                
                if(targetSubformIndex >= 0){
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
                let targetDocument = this.documentDService.documentNavList.find((document) => document.nameDocument === $(itemElement.currentTarget).val())
                let condition:SubFormContentConditionModel =  new SubFormContentConditionModel();
                let newSubform: SubFormContentDetailModel = {
                    id: targetDocument.id,
                    documentName: targetDocument.nameDocument,
                    isLinked: true,
                    linkName: targetDocument.nameDocument,
                    type: this.currentSubFormType.id,
                    isConfirm: false,
                    condition:condition
                }
                if (this.contentDCtrlService.poolContents.subFroms.length === 0 || !this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'))) {
                    this.contentDCtrlService.poolContents.subFroms.push(
                        {
                            parentBoxId: this.parentBox.attr('id'),
                            subformList: [newSubform]
                        }
                    )
                } else {
                    let targetSubformIndex = this.contentDCtrlService.poolContents.subFroms.findIndex((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'));
                    if ($(itemElement.currentTarget).is(':checked')) {
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

            console.log( this.rootElement.find('.toolbar-subform').find('#subform-btn-submit'))
            this.rootElement.find('.toolbar-subform').find('#subform-btn-submit').click((btnElement) => {
                btnElement.stopPropagation();
                let targetSubformIndex = this.contentDCtrlService.poolContents.subFroms.findIndex((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'));
                this.contentDCtrlService.poolContents.subFroms[targetSubformIndex].subformList.forEach((subform) => {
                    subform.isConfirm = true;
                })
                this.addSubform();
            })

        this.rootElement.find('.content-box').find('.content-subform').find('.carousel-control-next').click((event) => {
            $('#' + $(event.currentTarget).attr('data-subformId')).carousel('next');
        })
        this.rootElement.find('.content-box').find('.content-subform').find('.carousel-control-prev').click((event) => {
            $('#' + $(event.currentTarget).attr('data-subformId')).carousel('prev');
        })
    }
    createDocumentChild(){
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
    removeStyleSubformActive(){
        this.rootElement.find('.toolbar-subform').find('.nav-item').removeClass('active');
        this.rootElement.find('.toolbar-subform').find('.nav-item').removeClass('text-primary');
    }
    addStyleSubformActive(element:JQuery<Element>){
        element.addClass('active');
        element.addClass('text-primary');
    }
    addSubform(){
        let htmlSubform = '';
        let targetSubform = this.contentDCtrlService.poolContents.subFroms.find((parentBox) => parentBox.parentBoxId === this.parentBox.attr('id'));
        if (this.currentSubFormType.id === 'subform-link') {
            htmlSubform += '<ul id="' + this.parentBox.attr('id') + '-subform" data-subformType="subform-link" class="list-group content-subform mt-3">';
            targetSubform.subformList.forEach((subform, index) => {
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
            console.log("targetSubform.subformList",targetSubform.subformList, this.documentDService.documentList)
            targetSubform.subformList.forEach((subform, index) => {
                let targetDocument = this.documentDService.documentList.find((document) => document.id === subform.id);
                if (targetDocument) {
                    if (index == 0) {
                        htmlSubform += '<div  class="carousel-item active full-screen subform-preview">'
                    } else {
                        htmlSubform += '<div  class="carousel-item  full-screen subform-preview">'
                    }
                    htmlSubform += '<div class="full-screen item-middle"><div id="contentTemplate" style="position:absolute; width:' + this.contentTemplateSize.width + 'px;height:' + this.contentTemplateSize.height + 'px">' + targetDocument.html + '</div></div>'
                    htmlSubform += '</div>'
                }
            });
            htmlSubform += '</div>'
            if (targetSubform.subformList.length > 1) {
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
        console.log(htmlSubform)
        this.rootElement.html(htmlSubform)
        if (this.currentSubFormType.id === 'subform-silde') {
            this.handleSubformSildeRatio();
        }
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
    handleSubformSildeRatio(){
        let ratioW = this.rootElement.find('.subform-preview').width() / this.contentTemplateSize.width;
        let ratioH = this.rootElement.height() / this.contentTemplateSize.height;
        if (ratioW > ratioH) {
            this.rootElement.find('#contentTemplate').css({
                transform: "scale(" + ratioW + ")"
            });
    
        } else {
            this.rootElement.find('#contentTemplate').css({
                transform: "scale(" + ratioH + ")"
            });
    
        }
    }

    
    

}
