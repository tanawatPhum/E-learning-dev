import { Component, OnInit, AfterContentInit, ViewEncapsulation, ViewChild, ElementRef, Input, EventEmitter, Output, AfterViewInit, ComponentFactoryResolver, Type, Compiler, Injector, NgModuleRef, NgModule, ComponentRef, Renderer2, ApplicationRef, OnDestroy, NgZone } from '@angular/core';
import { catchError, mergeMap, toArray, map, find } from 'rxjs/operators';
import { Observable, of, Subject, empty, fromEvent, VirtualTimeScheduler, Subscription } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { BoxContentModel } from 'src/app/models/document/elements/box-content.model';
import { CommonService } from '../../../../services/common/common.service';
import { DocumentModel, ContentsModel, OtherDetailModel } from 'src/app/models/document/content.model';
import { TextAreaContentModel } from '../../../../models/document/elements/textarea-content.model';
import { ImgContentModel } from 'src/app/models/document/elements/img-content.model';
import { VideoContentModel, VideoConetentDataModel, VideoConetentConditionModel } from 'src/app/models/document/elements/video-content.model';
import { DocumentService } from 'src/app/services/document/document.service';
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';
import Splitting from 'splitting';
import { TriggerEventModel, DocumentNavigatorModel, DocumentTrackContentCondition } from 'src/app/models/document/document.model';
import { SubFormContentModel, SubFormContentDetailModel, SubFormContentConditionModel, SubFormContentLinkModel } from '../../../../models/document/elements/subForm-content.model';
import { ScreenDetailModel, RulerDetailModel, UploadFileModel, UpdateContentModel } from '../../../../models/common/common.model';
import { DocumentDataControlService } from '../../../../services/document/document-data-control.service';
import { element } from 'protractor';
import html2canvas from 'html2canvas';
import { commentContentModel } from 'src/app/models/document/elements/comment-content.model';
import { ToDoListBoxListModel, ObjectToDoList, ToDoListCurrentModel as ToDoListSelectCurrentModel } from 'src/app/models/document/elements/todoList-content.model';
import { ToDoListContentModel, ToDoListContentOrderModel } from '../../../../models/document/elements/todoList-content.model';
import { IfStmt } from '@angular/compiler';
import { ProgressBarContentModel, ProgressBoxListModel } from 'src/app/models/document/elements/progressBar-content-model';
import { DocumentTrackModel, DocumentTrackContent } from '../../../../models/document/document.model';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import { ProgressBarContentObjectModel } from '../../../../models/document/elements/progressBar-content-model';
import { HttpClientService } from 'src/app/services/common/httpClient.service';
import { FileContentModel } from 'src/app/models/document/elements/file-content.model';
import { LinkContentModel } from 'src/app/models/document/elements/link-content.model';
import { ExamContentModel } from 'src/app/models/document/elements/exam-content.model';
import { NoteContentModel } from 'src/app/models/document/elements/note-content.model';
import { ninvoke, async } from 'q';
import { AdHost } from '../../../../directives/ad-host/ad-host.directive';
import { ContentRouting } from '../../../../app-content-routing';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ContentInterFace } from 'src/app/contents/interface/content.interface';
import { createCustomElement, NgElement, WithProperties } from '@angular/elements';
import { VideoContentComponent } from '../../../../contents/video-content/video-content';
import { ImgContentComponent } from '../../../../contents/img-content/img-content';
import { LayoutRouting } from '../../../../app-layout-routing';
import { ContextMenu } from 'src/app/models/document/context-menu.model';
import { BoxHTMLModel } from '../../../../models/document/elements/box-content.model';
import { LayoutContentModel } from 'src/app/models/document/elements/layout-content.model';
declare var electron: any;
declare var rangy: any;
declare var CKEDITOR: any;
declare var Wistia: any;
@Component({
    selector: 'create-content-page',
    templateUrl: 'create-content-page.component.html',
    styleUrls: ['create-content-page.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class CreateContentPageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('contentTemplate', { static: true }) contentTemplate: ElementRef;
    @ViewChild('contentOptionTool', { static: true }) contentOptionTool: ElementRef;
    @ViewChild(AdHost, { static: true }) adHost: AdHost;
    @Input() triggerElement: Subject<TriggerEventModel>;
    @Input() contentElement: Subject<DocumentModel>;
    @Input() contentTypeSelected: Subject<any>;
    @Input() dropElement: Subject<TriggerEventModel>;
    @Output() eventToParent = new EventEmitter<TriggerEventModel>();
    public indexDB: any;
    public currentBox: JQuery<Element>;
    public currentLayout: JQuery<Element>;
    public currentTextSelection: Range;
    public currentToolbar: string;
    public currentElement: any;
    public currentContentType: any
    public currentBrowseFile: any;
    public currentBrowseLink: string;
    public currentinput: string;
    public currentElementTool: any;
    public currentColorCode: string;
    public currentDocument: DocumentModel = new DocumentModel();
    public currentSelectTaskList: ToDoListSelectCurrentModel[] = new Array<ToDoListSelectCurrentModel>();
    public currentSubFormType = { id: 'subform-link', name: 'link' };
    public layoutTypes = Constants.document.layouts.types;
    public toolTypes = Constants.document.tools.types;
    public rootElement: JQuery<Element>;
    public templateDoc: JQuery<Element>;
    public rootOptionTool: JQuery<Element>;
    public contentTemplateSize: ScreenDetailModel = new ScreenDetailModel();
    public childDocuments: SubFormContentDetailModel[] = new Array<SubFormContentDetailModel>();
    public toDoListBoxList: ToDoListBoxListModel[] = new Array<ToDoListBoxListModel>();
    public progressBoxList: ProgressBoxListModel[] = new Array<ProgressBoxListModel>();
    public documentTrack: DocumentTrackModel = new DocumentTrackModel();
    public rulerDetail: RulerDetailModel = new RulerDetailModel();

    public rulerDetailSubject: Subject<RulerDetailModel> = new Subject<RulerDetailModel>();

    public boxType = Constants.document.boxes.types;
    public contentType = Constants.document.contents.types;
    public ContextMenuList: ContextMenu[] = new Array<ContextMenu>();

    public controlSubscribe = new Subscription();



    private cmpRef: ComponentRef<any>;

    public actions = {
        event: {
            addElBox: 'addElBox',
            addContextMenu: 'addContextMenu',
            addElLayout: 'addElLayout',
            addElExam: 'addElExam',
            addEventBox: 'addEventBox',
            addEventLayout: 'addEventLayout',
            addSubForm: 'addSubForm',
            dropTool: 'dropTool',
            dropAny: 'dropAny',
            handleCurrentBox: 'handleCurrentBox',
            handleCurrentLayout: 'handleCurrentLayout',
            handleDragBoxes: 'handleDragBoxes',
            handleOptionToolTextArea: 'handleOptionToolTextArea',
            handleBrowseExam: 'handleBrowseExam',
            handleNote: 'handleNote',
            handleTemplateDoc: 'handleTemplateDoc',
            handleOptionToolExam: 'handleOptionToolExam',
            handleElRatio: 'handleElRatio',
            removeElBox: 'removeElBox',
            removeContent: 'removeBoxContent',
            removeForPreviewSubForm: 'removeForPreviewSubForm',
        },
        data: {
            addBoxType: 'addBoxType',
            createDataToSave: 'createDataToSave',
            updateNavigatorData: 'createNavigatorData',
            createChildDocument: 'createChildDocument',
            createToDoListBoxList: 'createToDoListBoxList',
            createProgressBoxList: 'createProgressBoxList',
            createDocumentTrack: 'createDocumentTrack',
            retrieveBoxData: 'retrieveBoxData',
            retrieveContentsData: 'retrieveContentsData',
            removeNavigatorData: 'removeNavigatorData',
            removeDocTrackProgress: 'removeDocTrackProgress',
            findIndexBoxData: 'findIndexBoxData',
            findContentId: 'findBoxType',
            findEmptyData: 'findEmptyData',
            findProgressDocumentTrack: 'findProgressDocumentTrack',
            findTrackProgressData: 'findTrackProgressData'
        },
        toolbar: {
            templateDocTool: 'templateDocTool',
            addBrowseExamTool: 'addBrowseExamTool',
            addCreateSubformTool: 'addCreateSubformTool',
            addSubformTool: 'addSubformTool',
            addExamTool: 'addExamTool',
            removeTool: 'removeTool',
            cancelTool: 'cancelTool'
        },
        style: {
            addOptionStyle: 'addOptionStyle',
            removeAllStyleBoxCurrent: 'removeAllStyleBoxCurrent',
            addStyleBoxCurrent: 'addStyleBoxCurrent',
            addStyleLayoutCurrent: 'addStyleLayoutCurrent',


            addStyleBoxSubformSize: 'addStyleBoxSubformSize',
            addStyleSubformActive: 'addStyleSubformActive',
            addStyleBoxActive: 'addStyleBoxActive',
            addStyleBorderBox: 'addStyleBorderBox',




            removeStyleBorderBox: 'removeStyleBorderBox',
            removeStyleBoxCurrent: 'removeStyleBoxCurrent',
            removeStyleLayoutCurrent: 'removeStyleLayoutCurrent',
            removeStyleBoxActive: 'removeStyleBoxActive',
            removeStyleBoxSubformSize: 'removeStyleBoxSubformSize',
            removeStyleBoxType: 'removeStyleBoxType',
            removeStyleSubformActive: 'removeStyleActiveSubform'
        },
        option: {
            removeOptionTool: 'removeOptionTool',
        },
        template: {
            setDocument: 'setDocument',
            setHTML: 'setHTML',
            setDocumentTrack: 'setDocumentTrack',



        },
        editor: {
            setEditor: 'setEditor',
            setEditorContentNote: 'setEditorContentNote',
            openEditorContentNote: 'openEditorContentNote',
            closeEditorContentNote: 'closeEditorContentNote',
        }
    };

    public subForms: SubFormContentModel[] = new Array<SubFormContentModel>();
    public exams: ExamContentModel[] = new Array<ExamContentModel>();
    public boxes: BoxContentModel[] = new Array<BoxContentModel>();
    public loading: boolean = true;

 



    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private documentDataService: DocumentDataControlService,
        private contentDCtrlService: ContentDataControlService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private render: Renderer2,
        private ngZone:NgZone,
        private applicationRef: ApplicationRef,

    ) { }
    ngOnInit() {
        this.loading = true;
        this.documentDataService.lifeCycle = Constants.document.lifeCycle.loadEditor;
        this.contentDCtrlService.poolContents = new ContentsModel();
        this.documentDataService.documentTrack = new DocumentTrackModel();
        // this.http.httpPost().subscribe((result)=>{
        //     console.log(result)
        // });
        this.controlSubscribe = this.contentElement.subscribe((result) => {
            this.documentDataService.documentTrack = new DocumentTrackModel();
            this.documentDataService.lifeCycle = Constants.document.lifeCycle.loadEditor;
            console.log('result', result)
            this.currentDocument = result || new DocumentModel();

            // this.setTemplate(this.actions.template.setDocument);
            // this.setTemplate(this.actions.template.setDocumentTrack);
            // if (res.actionCase === Constants.document.lifeCycle.initialEditor) {
            //     this.setTemplate(this.actions.template.setDocument);
            //     this.setTemplate(this.actions.template.setDocumentTrack);
            // }
            // else if(res.actionCase === Constants.document.contents.lifeCycle.delete){
            //     this.rootElement.find('.template-doc').focus();
            //     this.removeStyleElements(this.actions.style.removeAllStyleBoxCurrent)
            //     this.currentToolbar = this.actions.toolbar.templateDocTool;
            //     this.addOptionToolBar();
            // }


            this.contentDCtrlService.poolContents =  result && result.contents || new ContentsModel();
            let updateContent = new UpdateContentModel();
            updateContent.actionCase = Constants.document.lifeCycle.initialEditor;
            updateContent.data = result && result.contents;
            this.contentDCtrlService.updateContent = updateContent;
            this.rulerDetailSubject.next(result && result.otherDetail.rulerDevDetail)                
       


        });
        this.contentDCtrlService.getUpdateContent().subscribe((res) => {
            if (res.actionCase === Constants.document.lifeCycle.initialEditor) {
                this.setTemplate(this.actions.template.setDocument);
                this.setTemplate(this.actions.template.setDocumentTrack);
            }
            else if(res.actionCase === Constants.document.contents.lifeCycle.delete){
                this.rootElement.find('.template-doc').focus();
                this.removeStyleElements(this.actions.style.removeAllStyleBoxCurrent)
                this.rootOptionTool.html(null);
                // this.currentToolbar = this.actions.toolbar.templateDocTool;
              //  this.addOptionToolBar();
            }
        });
        this.contentTypeSelected.subscribe((contentType) => {
            this.currentContentType = contentType;
            this.addElements(this.actions.event.addElBox);
        });
        this.dropElement.subscribe((tool) => {
            if (tool.action === this.actions.event.dropAny) {
                this.currentContentType = this.layoutTypes.freedomLayout;
                this.addElements(this.actions.event.addElBox, null, this.actions.event.dropAny, null, tool.data)

            }
            else if (tool.action === this.actions.event.dropTool && tool.data.contentName) {
                this.currentContentType = this.layoutTypes.freedomLayout;
                this.currentElementTool = tool.data.element;
                this.addElements(this.actions.event.addElBox, null, this.actions.event.dropTool, null, tool.data.contentName)


                //remove tranfer img icon to ckeditor
                //if(this.rootElement.find('p').find('img'))
                //this.rootElement.find('p').find('img').remove();


            }
            else if (tool.action === this.actions.event.dropTool && tool.data.layoutName) {
                this.addElements(this.actions.event.addElLayout, null, this.actions.event.dropTool, null, tool.data)
            }

            // this.rootElement.find('.template-doc').find('p').remove();
            this.rootElement.find('.template-doc').find('p').find('img').remove()
            // this.rootElement.find('.template-doc').find('p').find('img').unwrap().remove();
            this.rootElement.find('.template-doc').find('content-layout').find('p').find('img[content-name]').unwrap().remove();


        })
        this.triggerElement.subscribe((event) => {
            if (event.action === Constants.common.event.click.add) {
                this.addElements(this.actions.event.addElBox).then(() => {
                    this.addElements(this.actions.style.addStyleBoxCurrent, this.currentBox);
                });
            } else if (event.action === Constants.common.event.click.save) {
                this.saveDocument(Constants.common.event.click.save);
            } else if (event.action === Constants.common.event.click.new) {
                // this.removeData(this.contents.data.removeAllContentObj);
                // this.rootElement.html(null);
                this.saveDocument(Constants.common.event.click.new);
            }

        });

    }
    ngAfterViewInit() {

        this.rootElement = $(this.contentTemplate.nativeElement);
        this.rootOptionTool = $(this.contentOptionTool.nativeElement);
        this.setCurrentToolbar(this.actions.toolbar.templateDocTool);
        //this.addOptionToolBar();


    }
    ngOnDestroy() {
        this.controlSubscribe.unsubscribe();
    }
    private async setTemplate(action) {
        if (action === this.actions.template.setDocument) {
            if ($('.template-doc').length == 0) {
                this.rootElement.append('<div id="template-doc"  class="template-doc"></div>')
            }
            this.handleEditor(this.actions.editor.setEditor);             
       
   
            // this.handleEditor(this.actions.editor.closeEditorContentNote,this.rootElement);
            //this.handles(this.actions.event.handleNote);
            // this.handles(this.actions.event.handleTextArea);

            this.handles(this.actions.event.handleTemplateDoc, $('.template-doc'));


        }
        else if (action === this.actions.template.setDocumentTrack) {
            this.documentService.loadDocTrackFromDB().subscribe((documentTrack) => {
                if (documentTrack && documentTrack.length > 0) {
                    this.documentTrack = this.documentDataService.documentTrack = documentTrack.find((documentTrack) => documentTrack.id === this.documentDataService.currentDocument.id) || new DocumentTrackModel();
                    //remove progress preview
                    this.removeData(this.actions.data.removeDocTrackProgress);
                }

            })
        }
        else if (action === this.actions.template.setHTML) {
            if (this.currentDocument.status !== Constants.common.message.status.notFound.text) {
                this.retrieveData(this.actions.data.retrieveBoxData, this.currentDocument);
                this.retrieveData(this.actions.data.retrieveContentsData, this.currentDocument);

            }
            $('#' + this.documentDataService.nameTemplate).attr('contenteditable', 'true');
            $('#' + this.documentDataService.nameTemplate).css('overflow-y', 'auto')
        }
    }
    private getContentTemplateSize() {
        let contentTemplateSize: ScreenDetailModel = new ScreenDetailModel();
        // let parentContentHeight = $('.container-content').outerHeight();
        // $('.content-template').css('height', parentContentHeight * 75 / 100)
        contentTemplateSize.height = this.rootElement.height();
        contentTemplateSize.width = this.rootElement.width();
        this.contentTemplateSize = contentTemplateSize;
        console.log('this.contentTemplateSize', this.contentTemplateSize)
        localStorage.setItem('contentTemplateSize', JSON.stringify(contentTemplateSize))
    }



    private handleEditor(action: string, element?: JQuery<Element>) {
        if (action === this.actions.editor.setEditor) {

            this.documentDataService.nameTemplate = 'template-doc';
            this.defineComponent();
            // this.rootElement.html(this.currentDocument.html).ready(() => {
            this.rootElement.find('#' + this.documentDataService.nameTemplate).attr('contenteditable', 'true')
            CKEDITOR.disableAutoInline = true;
            CKEDITOR.inline(this.documentDataService.nameTemplate, {
                allowedContent: true,
                menu_groups: '',
                removePlugins: 'contextmenu,liststyle,tabletools'
            });

            CKEDITOR.instances[this.documentDataService.nameTemplate].on('instanceReady', (ev) => {
                $('.cke_top').css('display', 'none')
                $(ev.editor.element.$).removeAttr("title");
                $('#' + this.documentDataService.nameTemplate).click((event) => {
                    $("#context-menu").removeClass("show").hide();
                    this.rootOptionTool.html(null);
                    // this.removeStyleElements(this.actions.style.removeAllStyleBoxCurrent)
                    // this.currentToolbar = this.actions.toolbar.templateDocTool;
                    // this.addOptionToolBar();
                })
                $('#' + this.documentDataService.nameTemplate).html(this.currentDocument.html)
                //CKEDITOR.instances[this.documentDataService.nameTemplate].insertHtml(this.currentDocument.html);
                // CKEDITOR.instances[this.documentDataService.nameTemplate].editable().on('click',  (event)=> {
                //     console.log('xxxxxxxxxxxxxxxxx');
                //     this.removeStyleElements(this.actions.style.removeAllStyleBoxCurrent)
                //     this.currentToolbar = this.actions.toolbar.templateDocTool;
                //     this.addOptionToolBar();
                // });

                this.addElements(this.actions.event.addElLayout).then(() => {
                    //this.removeData(this.actions.data.removeAllContentObj);
                });
                this.addElements(this.actions.event.addContextMenu, this.rootElement)

                this.addElements(this.actions.event.addEventBox).then(() => {

                });

                // setTimeout(() => {
                //     this.addElements(this.actions.event.addEventBox).then(() => {
                //         //this.removeData(this.actions.data.removeAllContentObj);
                //     });


                // }, 500);
                this.getContentTemplateSize();
                this.rootElement.find('.template-doc').find('.content-box').css('position', 'absolute')

                $('#' + this.documentDataService.nameTemplate).on('selectstart', () => {
                    $(document).one('mouseup', (element) => {
                        this.currentTextSelection = window.getSelection().getRangeAt(0);
                    });
                });

                // 

            });



            // });

            // this.setTemplate(this.actions.template.setHTML)
            //console.log(CKEDITOR.instances[this.documentDataService.nameTemplate])




            // console.log($('#'+this.documentDataService.nameTemplate))  
            // $('#'+this.documentDataService.nameTemplate).click(()=>{
            //     console.log('xxxxxxx')
            // })         
            // ev.editor.on('focus',  (e)=> {  
            //     $('.cke').css('display','none')

            // }); 
            // $('#template-doc').on('drop', (event: any) => {
            //     // event.preventDefault();
            //     // event.stopPropagation();
            //     let targetFile = event.originalEvent.dataTransfer.files
            //     if(targetFile.length>0){
            //         let targetContentType = this.documentService.getComponentType(targetFile[0].type);
            //         let targetContent =  ContentRouting.routes.find((content)=>content.contentName === targetContentType);
            //         if(targetContent){
            //             let data = {
            //                 targetContent:targetContent,
            //                 result:targetFile
            //             }
            //             this.currentContentType = this.layoutTypes.freedomLayout;
            //             this.addElements(this.actions.event.addElBox, null, this.actions.event.dropAny, null, data)
            //         }
            //     }




            //     // this.createContent(targetContent.component,targetContent.contentName)
            //     // this.currentBox.find('[content-name]').show();
            //     // $('.content-box').find('[content-name][content-last!="true"]').hide();
            //     // this.rootOptionTool.html(this.createContentOption(targetContent.option))



            // });

            // $('#template-doc').droppable({
            //     drop:  (event, ui)=> {
            //         console.log(event);
            //     }
            // });

            // $('#template-doc').on('drop',(event)=>{
            //     console.log(event.dataTransfer)
            // //     setTimeout(() => {
            // //         console.log($('#box-'+ this.commonService.getBoxCurrentId()));
            // //    $('#box-'+ this.commonService.getBoxCurrentId()).detach().appendTo($('#template-doc'))
            // //     },500)
            // })


        }
        // if(action===this.actions.editor.setEditorContentNote){
        //     CKEDITOR.disableAutoInline = true;
        //     CKEDITOR.inline(element.attr('id')+'-note-area');
        //     CKEDITOR.on('instanceReady',  (ev)=> {
        //       ev.editor.focus();
        //       this.addStyleElements(this.actions.style.addStyleBoxContentNote,element);
        //       ev.editor.on('focus',  (e)=> {  
        //         // $('#cke_note-area').show()
        //         this.addStyleElements(this.actions.style.addStyleBoxContentNote,element);
        //      });  
        //      ev.editor.on('blur',  (e)=> {  
        //       if(element.find('#cke_note-area').hasClass('currentShow')){
        //         element.find('#cke_note-area').show()
        //         this.addStyleElements(this.actions.style.addStyleBoxContentNote,element);
        //        }

        //      });   
        //     });
        // }
        else if (action === this.actions.editor.openEditorContentNote) {

            element.find('.note-icon.writing.hideCK').hide();
            element.find('.note-icon.writing.showCK').show();
            element.find('.note-icon.writing.showCK').css('width', $('.note-icon.writing.hideCK').width() - ($('.note-icon.writing.hideCK').width() * 70 / 100))
        }
        else if (action === this.actions.editor.closeEditorContentNote) {

            element.find('.note-icon.writing.showCK').hide();
            element.find('.note-icon.writing.hideCK').show();
            element.find('.note-area').show();
            // element.find('#cke_'+ element.attr('id')+'-note-area').hide();

        }
    }
    private async addElements(action: string, element?: any, subaction?: string, subElement?: any, data?: any) {
        if (action === this.actions.event.addElLayout || action === this.actions.event.addEventLayout) {
            if (data && data.layoutName === Constants.document.layouts.types.gridLayout && action === this.actions.event.addElLayout) {
                let targetLayout = data.detail;
                let layoutHtml = ''
                let numberOfLayout;
                if (targetLayout.status == 'create') {
                    numberOfLayout = this.commonService.getBoxId();
                    layoutHtml = `<div layout-name="${data.layoutName}"  id="layout-${numberOfLayout}" class="content-layout">`;
                } else {
                    layoutHtml = `<div  class="content-layout layout-draft">`;
                }
                layoutHtml += '<table  class="table layout-grid m-0"><tbody>'
                for (let tr = 0; tr < targetLayout.rowNumber; tr++) {
                    layoutHtml += '<tr>'
                    for (let td = 0; td < targetLayout.colNumber; td++) {
                        layoutHtml += `<td class="layout-column border">
                        <p contenteditable="true" >&nbsp </p></td>`
                    }
                    layoutHtml += '</tr>'
                }
                layoutHtml += '</tbody></table>'
                layoutHtml += '</div>'
                $('.layout-draft').remove().ready(() => {
                    $('#' + this.documentDataService.nameTemplate).append(layoutHtml).ready(() => {
                        if (targetLayout.status == 'create') {
                            this.setCurrentLayout(this.rootElement.find('#layout-' + numberOfLayout))
                            if (this.currentLayout.next('p').length == 0) {
                                $("<p layout-end>&nbsp</p>").insertAfter(this.currentLayout)
                                this.addElements(this.actions.event.addContextMenu, this.currentLayout)
                            }
                            // $(this.currentLayout).detach().appendTo($('#template-doc'))
                        } else {
                            //this.rootElement.find('#layout-draft').detach().appendTo($('#template-doc'))
                        }
                    });
                })
            }
            setTimeout(() => {
                // this.rootElement.find('.layout-grid').colResizable({liveDrag:true});    
                this.rootElement.find('.layout-column').resizable({
                    start: (event) => {

                        //this.rootElement.find('.layout-column').removeClass('cke_table-faked-selection')
                        //CKEDITOR.instances[this.documentDataService.nameTemplate].getSelection().reset(); 
                    },
                    resize: function (event, ui) {
                        var col = $(this).index() + 1;
                        $(this).closest('table').find('tr td:nth-child(' + col + ')').width(ui.size.width);
                        $(this).parent().find('td').height(ui.size.height);
                    }
                })
                this.handles(this.actions.event.handleCurrentLayout)
            }, 1000);



            // this.rootElement.find('.content-layout').draggable({
            //     containment: this.contentTemplate.nativeElement,
            //     start:((event)=>{
            //         console.log(event);
            //     }),
            //     // handle: this.currentLayout.find('.content-box-label'),
            //     stop: ((event) => {

            //         let l = (100 * parseFloat(($(event.target).position().left / $(event.target).parent().width()).toString()));
            //         let t = (100 * parseFloat((($(event.target).position().top + $('#template-doc').scrollTop()) / $(event.target).parent().height()).toString()));

            //         if (l > 100 || l < 0) {
            //             l = 0;
            //         }
            //         $(event.target).css("left", l + '%');
            //         $(event.target).css("top", t + '%');


            //     }),
            // })

            // this.rootElement.find('.content-layout').find('.layout-column').droppable({
            //     drop: (event, ui) => {

            //         //  $(this.currentBox).css('left','40%')
            //         // $(this.currentBox).css('top',0)

            //         $(this.currentBox).detach().appendTo($(event.target))
            //         $(event.target).addClass("ui-state-highlight")
            //     }
            // });
            // this.rootElement.find('.content-layout').resizable({
            //     handles: '',
            // })
            //     .resizable({
            //         handles: 's,e,w',
            //         containment: this.contentTemplate.nativeElement,
            //         stop: ((event) => {
            //             let w = (100 * parseFloat(($(event.target).width() / $(event.target).parent().width()).toString())) + "%";
            //             // let h = (100 * parseFloat(($(event.target).height() / $(event.target).parent().height()).toString())) + "%";
            //             $(event.target).css("width", w);
            //             //$(event.target).find('.layout-column').css('height',$(event.target).height())
            //             // $(event.target).css("height", h);
            //         })
            //     })
            // this.handles(this.actions.event.handleCurrentLayout);

        }
        else if (action === this.actions.event.addElBox || action === this.actions.event.addEventBox) {
            let createBox = async (boxId: string, htmlDetail: BoxHTMLModel, targetContent, data?) => {
                let topZindex = 0;
                this.rootElement.find('.content-box').each((index,element)=>{
                   let targetZindex =  parseInt($(element).css('z-index'))
                   if(targetZindex >  topZindex){
                        topZindex  =  targetZindex;
                   }
                })


                this.rootElement.append(`<div contenteditable="false" id="${boxId}" class="content-box ${this.boxType.boxInitial} freedom-layout"
                     name="${boxId}" ><div class="content-box-label">${boxId}</div> </div>`).ready(async () => {
                    this.removeStyleElements(this.actions.toolbar.removeTool); 
                    if (subaction === this.actions.event.dropTool || this.actions.event.dropAny) {
                        await this.createContent($('#' + boxId),targetContent.component, targetContent.contentName, data && data.result);
                       // this.currentBox.find('[content-name]').show();
                        if(action ===this.actions.event.addEventBox){
                            $('.content-box').find('[content-name]').attr('content-last','true');
                        }
                       // $('.content-box').find('[content-name][content-last!="true"]').hide();
                        this.rootOptionTool.html(this.createContentOption($('#' + boxId),targetContent.option))

                      //  CKEDITOR.instances[this.documentDataService.nameTemplate].insertHtml($('#' + boxId));

                        $('#' + this.documentDataService.nameTemplate).append($('#' + boxId))
                    } else {
                        // this.setCurrentToolbar();
                    }
                    $('[id="' + boxId + '"]').css('position', 'absolute');
                    $('[id="' + boxId + '"]').css('top', htmlDetail.top);
                    $('[id="' + boxId + '"]').css('left', htmlDetail.left)
                    $('[id="' + boxId + '"]').css('width', htmlDetail.width);
                    $('[id="' + boxId + '"]').css('height', htmlDetail.height)
                    $('[id="' + boxId + '"]').css('z-index',topZindex)
                })
            }
            let addEventBox = async () => {
                this.rootElement.find('.freedom-layout').draggable({
                    containment: this.contentTemplate.nativeElement,
                    stack: '.freedom-layout',
                    scroll: true,
                    start: ((event) => {
                        let updateContent = new UpdateContentModel();
                        updateContent.actionCase = Constants.document.contents.events.startDrag;
                        this.contentDCtrlService.updateContent = updateContent;
                        updateContent.for = $(event.target).attr('id');
                        this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target), 'startDrag');
                    }),
                    stop: ((event) => {
                        let updateContent = new UpdateContentModel();
                        updateContent.actionCase = Constants.document.contents.events.stopDrag;
                        updateContent.for = $(event.target).attr('id');
                        this.contentDCtrlService.updateContent = updateContent;
                        // let l = (100 * parseFloat(($(event.target).position().left / $(event.target).parent().width()).toString()));
                        // let t = (100 * parseFloat((($(event.target).position().top + $('#template-doc').scrollTop()) / $(event.target).parent().height()).toString()));
                        // // let l = (100 * parseFloat(($(event.target).position().left  / this.rootElement.width()).toString())) + "%";
                        // // let t = (100 * parseFloat((($(event.target).position().top+$('#template-doc').scrollTop()) / this.rootElement.height()).toString())) + "%";
    
                        // //    console.log($(event.target).position().top)
                        // //     console.log($('#template-doc').scrollTop())
                        // if (l > 100 || l < 0) {
                        //     l = 0;
                        // }
                        // $(event.target).css("left", l + '%');
                        // $(event.target).css("top", t + '%');
                       this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target), 'endDrag');
                        //this.removeStyleElements(this.actions.style.removeStyleBoxActive);
                        // console.log($('#template-doc').scrollTop())
                    }),
                });
                this.rootElement.find('.content-box')
                    .resizable({
                        disabled: true,
                        handles: 'n, e, s, w, se, ne, sw, nw',
                        containment: this.contentTemplate.nativeElement,
                        start: ((event) => {
                            let updateContent = new UpdateContentModel();
                            updateContent.actionCase = Constants.document.contents.events.startResize;
                            updateContent.for = $(event.target).attr('id');
                            this.contentDCtrlService.updateContent = updateContent;
                            this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target), 'startResize');
                        }),
                        stop: ((event) => {
                            let updateContent = new UpdateContentModel();
                            updateContent.actionCase = Constants.document.contents.events.stopResize;
                            updateContent.for = $(event.target).attr('id');
                            this.contentDCtrlService.updateContent = updateContent;
                            // let w = (100 * parseFloat(($(event.target).width() / $(event.target).parent().width()).toString())) + "%";
                            // let h = (100 * parseFloat(($(event.target).height() / $(event.target).parent().height()).toString())) + "%";
    
                            // // let w = (100 * parseFloat(($(event.target).width() / this.rootElement.width()).toString())) + "%";
                            // // let h = (100 * parseFloat(($(event.target).height() / this.rootElement.height()).toString())) + "%";
                            // $(event.target).css("width", w);
                            // $(event.target).css("height", h);
                            this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target), 'endResize');
                            //this.removeStyleElements(this.actions.style.removeStyleBoxActive);
                            if ($(event.target).hasClass(this.boxType.boxSubform)) {
                                this.handles(this.actions.event.handleElRatio, $(event.target).find('#contentTemplate'), $(event.target).find('.subform-preview'))
                            }
                        }),
                    }).ready(() => {
                        this.rootElement.find('.content-box')
                            .resizable({ disabled: false })
                    })
                    this.handles(this.actions.event.handleCurrentBox);
            }


            if (action === this.actions.event.addElBox) {
                if (subaction === this.actions.event.dropTool || this.actions.event.dropAny) {
                    this.documentDataService.lifeCycle = Constants.document.lifeCycle.createContent;
                    let boxId = 'box-' + this.commonService.getBoxId();
                    let htmlDetail = new BoxHTMLModel();
                    htmlDetail.height = Constants.common.element.css.box.height;
                    htmlDetail.width = Constants.common.element.css.box.width;
                    htmlDetail.top = Math.max(0, (((this.rootElement.height() - htmlDetail.height) / 2) +
                        this.rootElement.scrollTop()))
                    htmlDetail.left = Math.max(0, (((this.rootElement.width() - htmlDetail.width) / 2) +
                        this.rootElement.scrollLeft()))
                    let targetContent;
                    if (subaction === this.actions.event.dropTool) {
                        targetContent = ContentRouting.routes.find((content) => content.contentName === data)
                    } else {
                        targetContent = data.targetContent;
                    }
                    createBox(boxId, htmlDetail, targetContent,data).then(()=>{
                        setTimeout(() => {
                            this.documentDataService.lifeCycle = Constants.document.lifeCycle.loadEditor;
                            this.setCurrentBox($('#' + boxId));
                            addEventBox();
                        });
                    })
                }
            } else if (action === this.actions.event.addEventBox) {
                let boxes = this.currentDocument.contents.boxes
                boxes.forEach((box) => {
                    let boxId = box.id
                    let htmlDetail = box.htmlDetail;
                    let targetContent = ContentRouting.routes.find((content) => content.contentName === htmlDetail.selector)
                    createBox(boxId, htmlDetail, targetContent).then(()=>{
                        addEventBox();
                    })
                })
            }
      
            // .find('.ui-resizable-handle').removeClass('ui-icon ui-icon-gripsmall-diagonal-se'); 
            // this.rootElement.find('.content-box').css("border", "");
            // this.rootElement.find('.content-box').find('.content-box-label').show();
            // this.rootElement.find('.content-box').css('cursor','move')
            // this.handles(this.actions.event.handleCurrentBox);

            // if (this.currentBox) {
            //     // this.handles(this.actions.event.handleBrowseImg, this.currentBox);
            //     this.addElements(this.actions.style.addStyleBoxCurrent, this.currentBox);
            // }
        } else if (action === this.actions.style.addStyleBoxCurrent) {
         
            this.setCurrentBox(element);
            

            // this.addStyleElements(this.actions.style.addStyleBoxCurrent, element);
            // this.addStyleElements(this.actions.style.addStyleBorderBox, element);
            // console.log(CKEDITOR.instances[this.documentDataService.nameTemplate])
            // CKEDITOR.instances[this.documentDataService.nameTemplate].setReadOnly(true);
            // if (subaction === 'startDrag' || subaction === 'click' || subaction === 'startResize') {
            //     this.addStyleElements(this.actions.style.addStyleBoxActive, element);
            // } else {

            //     this.removeStyleElements(this.actions.style.removeStyleBoxActive);
            // }
        }
        else if (action === this.actions.event.addContextMenu) {
            element.contextmenu((e) => {
                let top = e.pageY - 57;
                let left = e.pageX - 270;
                let target = $(e.currentTarget);
                if (target.hasClass('content-layout')) {
                    this.ContextMenuList = [{
                        layoutType: this.layoutTypes.gridLayout,
                        contentType: null,
                        action: 'merge',
                        name: 'Merge',
                        targetElement: target
                    }]
                } else {
                    this.ContextMenuList = [{
                        layoutType: null,
                        contentType: this.contentType.link,
                        action: 'link',
                        name: 'Link',
                        targetElement: target
                    }]
                }

                $("#context-menu").css({
                    display: "block",
                    top: top,
                    left: left
                }).addClass("show");
                return false; //blocks default Webbrowser right click menu
            }).on("click", () => {
                
                $("#context-menu").removeClass("show").hide();
            });
            $("#context-menu a").on("click", (e) => {
                $(e.currentTarget).parent().removeClass("show").hide();
            });
        }










        else if (action === this.actions.event.addElExam) {

            let hostname = (new URL(this.currentBrowseLink)).hostname;
            if (!this.currentinput) {
                this.currentinput = 'Title'
            }
            this.exams.push({
                parentId: element.attr('id'),
                id: element.attr('id') + '-exam',
                path: this.currentBrowseLink,
                title: this.currentinput,
                name: hostname,
                score: '0'
            });
            let htmlExam = '<div class="row content-exam"  id="' + element.attr('id') + '-exam">'
                + '<div class="col-12 mb-3">'
                + '<input class="mb-3 exam-input-title" id="exam-input-title" type="text" value="' + this.currentinput + '" > '
                + '<a id="exam-input-url" data-name="' + hostname + '" class="content-link cursor-pointer ">' + hostname + '</a>'
                + '<h5 id="text-exam-score" class="mt-3">Score:0</h5>'
                + '</div>'
                + '</div>'
            element.html(htmlExam);
            // element.css('display','initial')


            //element.append('<a  data-name="'+hostname+'" id="' + element.attr('id') + '-link" class="content-link cursor-pointer ">'+hostname+'</a>');
        }
        this.setCurrentToolbar();
        // this.addOptionToolBar();
       // this.createData(this.actions.data.addBoxType, element)
        //this.createData(this.actions.data.createDocumentTrack);
    }
    private handles(action: string, element?: any, subElement?: any) {
        if (action === this.actions.event.handleCurrentLayout) {
            this.rootElement.find('.content-layout').unbind('click').bind('click', (event) => {
                // event.preventDefault();
                // event.stopPropagation();
                this.setCurrentLayout($(event.currentTarget))
            })
        }
        if (action === this.actions.event.handleCurrentBox) {
            this.rootElement.find('.content-box').find('.content-textarea').click((event) => {
                this.currentElement = $(event.target);
                if (!this.currentElement.parents('.content-box').hasClass('content-box-current')) {
                    this.setCurrentBox(this.currentElement.parents('.content-box'));
                }
            })

            this.rootElement.find('.content-box ,[content-name != "textarea-content"]').click((event) => {
                //event.preventDefault();
                $("#context-menu").removeClass("show").hide();
                event.stopPropagation();
                this.currentElement = $(event.target);
                if ($(event.target).hasClass('content-box')) {
                    this.setCurrentBox(this.currentElement);
                } else {
                    this.setCurrentBox(this.currentElement.parents('.content-box'));
                }
            });

        }
        else if (action === this.actions.event.handleDragBoxes) {
            // if (this.commonService.isPlatform === Constants.platform.device) {
            //     this.rootElement.find('.freedom-layout').on('touchmove', (event) => {
            //         this.rootElement.find('.freedom-layout').draggable({ disabled: false, cancel: '' });
            //     });
            // } else {
            //     this.rootElement.find('.freedom-layout').mousemove(() => {
            //         this.rootElement.find('.freedom-layout').draggable({ disabled: false, cancel: '' });
            //     });
            // }
        }
        else if (action === this.actions.event.handleElRatio) {
            // console.log(element.);
            // console.log(element.height());
            let ratioW = subElement.width() / this.contentTemplateSize.width;
            let ratioH = subElement.height() / this.contentTemplateSize.height;
            if (ratioW > ratioH) {
                element.css({
                    transform: "scale(" + ratioW + ")"
                });

            } else {
                element.css({
                    transform: "scale(" + ratioH + ")"
                });

            }


        }
        else if (action === this.actions.event.handleTemplateDoc) {
            element.click((event) => {
                // this.addElements(this.actions.style.addStyleCurrentBox, this.currentBox ,'click');
                this.removeStyleElements(this.actions.style.removeAllStyleBoxCurrent);
                // this.setCurrentToolbar(this.actions.toolbar.templateDocTool);
                // this.addToolBarBox(this.actions.toolbar.cancelTool, element);
                // this.setCurrentBox($(event.currentTarget))
                // this.addOptionToolBar();
            })
            // element.on('input', (event) => {
            //     if (!$(event.currentTarget).text()) {
            //         console.log('xcxxcxcx');
            //         this.rootElement.text('\u200B')
            //     }
            // })
            // element.on('blur', (event) => {
            //     if (!$(event.currentTarget).text()) {
            //         this.rootElement.text('\u200B')
            //     }
            // })
        }
        else if (action === this.actions.event.handleOptionToolTextArea) {
            $('#option-font-family').fontselect(
                {
                    searchable: false,
                }
            ).on('change', (ev) => {
                let font: any = $(ev.currentTarget).val().toString();
                font = font.replace(/\+/g, ' ');
                font = font.split(':');
                let fontFamily = font[0];
                let fontWeight = font[1] || 400;
                let style = 'font-family:"' + fontFamily + '";font-weight:' + fontWeight;
                this.addStyleElements(this.actions.style.addOptionStyle, null, style)
            });
            $('#option-format-paragraph').change((element) => {
                let style = '';
                this.addStyleElements(this.actions.style.addOptionStyle, null, style, $(element.currentTarget).val().toString())
            });
            $('#option-font-size').change((element) => {
                let style = 'font-size:' + $(element.currentTarget).val() + 'px';
                this.addStyleElements(this.actions.style.addOptionStyle, null, style)
            });
            $('.option-font-alignment').click((element) => {
                let style = 'text-align:' + $(element.currentTarget).attr('data-font-alignment');
                let editor = CKEDITOR.instances[this.documentDataService.nameTemplate];
                let selectedElement = $(editor.getSelection().getStartElement().$);
                let tagName;
                this.addStyleElements(this.actions.style.addOptionStyle, null, style, 'p')
            });
            $('.option-font-style').click((element) => {
                let style;
                let dataStyle = $(element.currentTarget).attr('data-font-style');
                let editor = CKEDITOR.instances[this.documentDataService.nameTemplate];
                let selectedElement = $(editor.getSelection().getStartElement().$);
                let allwrapElement = $('span:contains("' + selectedElement.text() + '")');
                if (dataStyle === 'bold') {
                    if (allwrapElement.css('font-weight') === '700') {
                        style = 'font-weight:400';
                    } else {
                        style = 'font-weight:' + $(element.currentTarget).attr('data-font-style');
                    }
                }
                else if (dataStyle === 'italic') {
                    if (allwrapElement.css('font-style') === 'italic') {
                        style = 'font-style:normal';
                    } else {
                        style = 'font-style:' + $(element.currentTarget).attr('data-font-style');
                    }
                }
                else if (dataStyle === 'underline') {
                    if (/none/.test(allwrapElement.css('text-decoration'))) {
                        style = 'text-decoration:' + $(element.currentTarget).attr('data-font-style');
                    } else {
                        style = 'text-decoration:none'
                    }
                }
                this.addStyleElements(this.actions.style.addOptionStyle, null, style);
            });
            // if(this.currentColorCode){
            //     $("#option-font-color").spectrum("set", this.currentColorCode.toHexString())
            // }

            $("#option-font-color").spectrum({
                showPalette: true,
                palette: [],
                showSelectionPalette: true, // true by default
                selectionPalette: ["red", "green", "blue"],
                change: (color) => {
                    let style = 'color:' + color.toHexString();
                    this.currentColorCode = color.toHexString();
                    this.addStyleElements(this.actions.style.addOptionStyle, null, style)
                }
            });
            if (this.currentColorCode) {
                $("#option-font-color").spectrum("set", this.currentColorCode)
            }


            $('.option-action-trash').click(() => {
                this.removeStyleElements(this.actions.option.removeOptionTool);
                this.removeStyleElements(this.actions.event.removeElBox);
            });

        }
        else if (action === this.actions.event.handleOptionToolExam) {
            $('.option-exam').find('#exam-input-url').unbind().bind('input', (element) => {
                let targetExamIndex = this.exams.findIndex(exam => exam.parentId === this.currentBox.attr('id'));
                console.log(targetExamIndex)
                if (targetExamIndex >= 0) {
                    this.exams[targetExamIndex].name = $(element.currentTarget).val().toString();
                    console.log(this.currentBox.find('.content-exam').find('#exam-input-url'))
                    this.currentBox.find('.content-exam').find('#exam-input-url').text($(element.currentTarget).val().toString());
                }
            })
            $('.option-exam').find('#exam-input-title').unbind().bind('input', (element) => {
                let targetExamIndex = this.exams.findIndex(exam => exam.parentId === this.currentBox.attr('id'));
                console.log(targetExamIndex)
                if (targetExamIndex >= 0) {
                    this.exams[targetExamIndex].name = $(element.currentTarget).val().toString();
                    this.currentBox.find('.content-exam').find('#exam-input-title').val($(element.currentTarget).val().toString());
                }
            })
            $('.option-exam').find('.option-action-trash').unbind().bind('click', () => {

                this.removeStyleElements(this.actions.option.removeOptionTool);
                this.removeStyleElements(this.actions.event.removeElBox);
            });

        }

        // else if (action === this.actions.event.handleOptionToolLink) {
        //     $('.option-link').find('#link-input-url').unbind().bind('input', (element) => {
        //         console.log(element)
        //         let targetLinkIndex = this.links.findIndex(link=>link.parentId === this.currentBox.attr('id'))
        //         if(targetLinkIndex>=0){
        //             this.links[targetLinkIndex].name =  $(element.currentTarget).val().toString();
        //             this.currentBox.find('.content-link').text($(element.currentTarget).val().toString());
        //             this.currentBox.find('.content-link').attr('data-name',$(element.currentTarget).val().toString());
        //         }

        //     })
        //     $('.option-link').find('.option-action-trash').unbind().bind('click', () => {
        //         this.removeData(this.actions.data.removeBoxData);
        //         this.removeStyleElements(this.actions.option.removeOptionTool);
        //         this.removeStyleElements(this.actions.event.removeElBox);
        //     });

        // }


        else if (action === this.actions.event.handleBrowseExam) {

            element.find('.toolbar-browse-exam').find('#exam-input-title').unbind().bind('click', (event) => {
                element.find('.toolbar-browse-exam').find('#exam-input-title').focus();
                element.find('.toolbar-browse-exam').find('#exam-input-title').unbind().bind('input', (event) => {
                    this.currentinput = event.target.value;
                })
            });
            element.find('.toolbar-browse-exam').find('#exam-input-url').unbind().bind('click', () => {
                element.find('.toolbar-browse-exam').find('#exam-input-url').focus();
                element.find('.toolbar-browse-exam').find('#exam-input-url').on('input', this.commonService.debounce((event) => {
                    if (event.target.value) {
                        this.currentBrowseLink = event.target.value;
                        this.removeStyleElements(this.actions.style.removeStyleBoxType);
                        this.currentBox.addClass(this.boxType.boxExam);
                        this.setCurrentToolbar(this.actions.toolbar.addExamTool);
                        this.addToolBarBox(this.actions.toolbar.addExamTool, element);
                        this.addElements(this.actions.event.addElExam, element);
                    }
                }, 500));
            });
        }
    }
    private removeStyleElements(action: string, element?: any) {
        if (action === this.actions.event.removeElBox) {
            this.currentBox.remove();
            this.currentBox = null;
        }
        else if (action === this.actions.style.removeStyleBoxCurrent) {
            
           // console.log(this.rootElement.find('.content-box:not(#'+element.attr('id')+')'))
   
            this.rootElement.find('.content-box:not(#'+element.attr('id')+')').find('[content-name][content-last!="true"]').hide()
            this.rootElement.find('.content-box:not(#'+element.attr('id')+')').removeClass('content-box-current content-box-active border border-primary')
    

      
        }
        else if (action === this.actions.style.removeStyleLayoutCurrent) {
            // this.rootElement.find('.content-layout').removeClass('content-layout-current')
            //     .removeClass('content-layout-active')
            //     .removeClass('border-primary')
            //  console.log( this.rootElement.find('.content-layout').find('.layout-column'))
            this.rootElement.find('.content-layout').find('.layout-column').removeClass('border-primary');

        }
        else if (action === this.actions.toolbar.removeTool) {
            // this.rootElement.find('.content-box').find('.content-toolbar').remove();
        } else if (action === this.actions.style.removeStyleBorderBox) {
            this.rootElement.find('.content-box').removeClass('border border-primary');
        } else if (action === this.actions.style.removeStyleBoxActive) {
            this.rootElement.find('.content-box').removeClass('content-box-active');
        }
        else if (action === this.actions.style.removeAllStyleBoxCurrent) {
            this.rootElement.find('.content-box').find('[name="section-content"]').hide();
            this.rootElement.find('.content-box').removeClass('content-box-current')
                .removeClass('content-box-active')
                .removeClass('border border-primary');
            this.removeStyleElements(this.actions.style.removeStyleLayoutCurrent)

        }
        else if (action === this.actions.style.removeStyleBoxSubformSize) {
            this.rootElement.find('.content-box').removeClass('box-subform-size');
        }

        else if (action === this.actions.event.removeForPreviewSubForm) {
            console.log(this.rootElement.find(element).find('.subform-preview'))
            this.rootElement.find(element).find('.subform-preview').find('.content-box').removeClass('content-box-active border border-primary');
            this.rootElement.find(element).find('.subform-preview').find('.content-box').removeClass('ui-draggable ui-draggable-handle');
            this.rootElement.find(element).find('.subform-preview').find('.content-box').removeClass('ui-resizable');
            this.rootElement.find(element).find('.subform-preview').find('.content-box').removeClass('freedom-layout')
            this.rootElement.find(element).find('.subform-preview').find('.content-box').removeClass('content-box-current');
            this.rootElement.find(element).find('.subform-preview').find('.content-box').css('border', 'none');
            this.rootElement.find(element).find('.subform-preview').find('.content-box').css('cursor', 'default');
            this.rootElement.find(element).find('.subform-preview').find('.content-box').find('.ui-resizable-handle').remove();
            this.rootElement.find(element).find('.subform-preview').find('.content-box').find('.content-toolbar').remove();
            this.rootElement.find(element).find('.subform-preview').find('.content-box').find('.content-video').css('pointer-events', 'initial');
        }
        else if (action === this.actions.style.removeStyleBoxType) {
            this.currentBox.removeClass(this.boxType.boxInitial);
            this.currentBox.removeClass(this.boxType.boxTextarea);
            this.currentBox.removeClass(this.boxType.boxImg);
            this.currentBox.removeClass(this.boxType.boxBrowseImg);
            this.currentBox.removeClass(this.boxType.boxBrowseFile);
            this.currentBox.removeClass(this.boxType.boxVideo);
            this.currentBox.removeClass(this.boxType.boxBrowseVideo);
            this.currentBox.removeClass(this.boxType.boxAddSubform);
            this.currentBox.removeClass(this.boxType.boxSubform);
            this.currentBox.removeClass(this.boxType.boxComment);
            this.currentBox.removeClass(this.boxType.boxToDoList);
            this.currentBox.removeClass(this.boxType.boxProgressBar);
            this.currentBox.removeClass(this.boxType.boxBrowseLink);
            this.currentBox.removeClass(this.boxType.boxLink);
            this.currentBox.removeClass(this.boxType.boxBrowseExam);
            this.currentBox.removeClass(this.boxType.boxExam);
            this.currentBox.removeClass(this.boxType.boxNote);
        } else if (action === this.actions.event.removeContent) {
            this.currentBox.find('.content-textarea').remove();
            this.currentBox.find('.content-img').remove();
            this.currentBox.find('.content-file').remove();
            this.currentBox.find('.content-video').remove();
            this.currentBox.find('.content-subform').remove()
        }
        else if (action === this.actions.option.removeOptionTool) {
            $('.container-option-content').find('.content-option-tool').html('');
        }
        else if (action === this.actions.style.removeStyleSubformActive) {
            element.find('.toolbar-subform').find('.nav-item').removeClass('active');
            element.find('.toolbar-subform').find('.nav-item').removeClass('text-primary');
        }
    }
    private addStyleElements(action: string, element?: JQuery<Element>, styles?: string, subaction?: string) {
        if (action === this.actions.style.addStyleLayoutCurrent) {
            element.find('.layout-column').addClass('border-primary')
            this.removeStyleElements(this.actions.style.removeStyleLayoutCurrent);
           // this.removeStyleElements(this.actions.style.removeStyleBoxCurrent);
            setTimeout(() => {
                element.find('.layout-column').addClass('border-primary')
                // element.addClass('border-primary')
                //     .addClass('content-layout-active')
                //     .addClass('content-layout-current')
                //     .find('.layout-column').addClass('border-right border-primary')
            })
        }
        else if (action === this.actions.style.addStyleBoxCurrent) {
           
            this.removeStyleElements(this.actions.style.removeStyleBoxCurrent,element);
            this.removeStyleElements(this.actions.style.removeStyleLayoutCurrent);   
          //  console.log(element.find('[content-name]'),element)
        //   setTimeout(() => {
            element
            .addClass('border-primary')
            .addClass('content-box-current')
            .find('[content-name]').show()              
        //   });

                 
    


            // setTimeout(() => {
            //     element.addClass('border-primary');
            //     element.find('[content-name]').show();
            //    // element.addClass('content-box-active');
            //     element.addClass('content-box-current')
            // },300);



        }
        else if (action === this.actions.style.addStyleBoxActive) {
            this.removeStyleElements(this.actions.style.removeStyleBoxActive);
            element.addClass('content-box-active');
        }
        else if (action === this.actions.style.addStyleBorderBox) {
            this.removeStyleElements(this.actions.style.removeStyleBorderBox);
            element.addClass('border border-primary');
        }
        else if (action === this.actions.style.addOptionStyle) {
            this.documentService.compileStyles(styles, subaction);
        }
        else if (action === this.actions.style.addStyleSubformActive) {
            element.addClass('active');
            element.addClass('text-primary');
        }
    }
    // private addStylesElement(action:string,styles:string,subaction?:string) {
    //     if(action === this.actions.style.addOptionStyle){
    //         this.documentService.compileStyles(styles,subaction);
    //     }
    // }
    private async addToolBarBox(action: string, element: any) {
        let htmlTootBar;
        this.removeStyleElements(this.actions.toolbar.removeTool);
        if (action === this.actions.toolbar.addBrowseExamTool) {
            htmlTootBar = '<div class="row content-toolbar toolbar-browse-exam">'
                + '<div class="col-12 toolbar-drag">'
                + '<div class="w-70 form-group m-auto">'
                + '<input class="mb-4 exam-input-title" placeholder="Title" type="text" id="exam-input-title">'
                + '<input placeholder="https://example.com" type="text" class="form-control mb-3" id="exam-input-url">'
                + '</div>'
                + '<p class="content-font-title1">Get your URL</p>'
                + '</div>'
                + '</div>';
            this.rootElement.find(element).append(htmlTootBar);
            this.handles(this.actions.event.handleBrowseExam, element);

        }
        else if (action === this.actions.toolbar.addCreateSubformTool) {
            // this.currentSubFormType = { id: 'subform-link', name: 'link' };
            // let htmlDocumentList = '<div class="list-group text-left">';
            // this.createData(this.actions.data.createChildDocument)
            // console.log(this.childDocuments);
            // // this.subForms.forEach(()=>{

            // // })
            // let documentSubformList = this.documentDataService.documentNavList.filter((document) => document.nameDocument != this.documentDataService.currentDocumentName)
            // this.childDocuments.forEach((document) => {
            //     documentSubformList = documentSubformList.filter((documentSubform) => documentSubform.id != document.id);
            // })
            // documentSubformList.forEach((document, index) => {
            //     htmlDocumentList += '<input type="checkbox" value="' + document.nameDocument + '" id="subform-name-' + this.commonService.getPatternId(document.nameDocument) + '" />';

            //     if (index == 0) {
            //         htmlDocumentList += '<label class="list-group-item border-top-0" for="subform-name-' + this.commonService.getPatternId(document.nameDocument) + '">' + document.nameDocument + '</label>';
            //     } else {
            //         htmlDocumentList += '<label class="list-group-item" for="subform-name-' + this.commonService.getPatternId(document.nameDocument) + '">' + document.nameDocument + '</label>';
            //     }
            // });
            // htmlDocumentList += '</div>'
            // htmlTootBar = '<div class="row content-toolbar toolbar-subform">'
            //     + '<nav>'
            //     + '<div class="nav nav-tabs text-lightGrey ">'
            //     + '<a data-subformtype="link" id="subform-link" class="nav-item nav-link cursor-pointer w-50 border-top-0 rounded-0 active text-primary" >Link (0)</a>'
            //     + '<a data-subformtype="silde" id="subform-silde" class="nav-item nav-link cursor-pointer w-50   border-top-0 rounded-0">Silde (0)</a>'
            //     + '</nav>'
            //     + '<div class="col-12 subform-col">'
            //     + htmlDocumentList
            //     + '</div>'
            //     + '<div  class="nav-footer nav-footer-custome">'
            //     + '<button type="button" id="subform-btn-submit" class="btn btn-outline-success">Submit</button>'
            //     + '</div>'
            //     + '</div>';
            // this.addStyleElements(this.actions.style.addStyleBoxSubformSize, element);
            // this.rootElement.find(element).append(htmlTootBar);
            // this.handles(this.actions.event.handleSubForm, element);
        }
        else if (action === this.actions.toolbar.cancelTool || action === this.actions.toolbar.templateDocTool) {
            // htmlTootBar = '<div class="row content-toolbar toolbar-cancel">'
            //     + '<div class="col-12">'
            //     + '<div  class="row toolbar-function">'
            //     + '<div  class="col-12"><img src="assets/contentPage/trash.svg"></div>'
            //     + '</div>'
            //     + '</div>'
            //     + '</div>';
            //this.rootElement.find(element).append(htmlTootBar);

        }


    }
    private async addOptionToolBar() {
        let htmlOptionToolBar;
        if (this.currentToolbar === this.actions.toolbar.templateDocTool) {
            const constFontSizeList = Constants.common.style.fontSizeList
            let htmlFontSizeList = "";
            constFontSizeList.forEach((fontsize) => {
                htmlFontSizeList += '<option>' + fontsize + '</option>'
            })
            htmlOptionToolBar =
                '<div class="row p-0 m-0 mt-3 option-textArea">'
                // + '<div class="col-12 d-flex justify-content-center border-bottom">'
                // + '<div class="form-group w-70 text-center">'
                // + '<label>Style</label>'
                // + '<select id="option-format-paragraph" class="form-control">'
                // + '<option value="h1">Heading 1</option>'
                // + '<option value="h2">Heading 2</option>'
                // + '<option value="h3">Heading 3</option>'
                // + '<option value="pre">Formatted</option>'
                // + '</select>'
                // + '</div>'
                // + '</div>'
                + '<div class="col-12 d-flex justify-content-center">'
                + '<div class="form-group w-70 text-center">'
                + '<label class="mt-2">Font</label>'
                + '<input value="Arial" id="option-font-family" class="form-control mb-2 pl-5">'
                + '<select class="form-control custom-select" id="option-font-size">'
                + htmlFontSizeList
                + '</select>'
                + '<input type="text" id="option-font-color" class="form-control mb-2 pl-5">'
                + '</div>'
                + '</div>'
                + '<div class="col-12 d-flex justify-content-center border-bottom">'
                + '<div class="form-group w-70 d-flex justify-content-between p-1">'
                + '<img data-font-style="bold" class="option-font-style" src="assets/imgs/contentPage/optionTool/bold.svg">'
                + '<img data-font-style="italic" class="option-font-style" src="assets/imgs/contentPage/optionTool/italic.svg">'
                + '<img data-font-style="underline" class="option-font-style" src="assets/imgs/contentPage/optionTool/underlined.svg">'
                + '</div>'
                + '</div>'
                + '<div class="col-12 d-flex justify-content-center border-bottom">'
                + '<div class="form-group w-70 text-center">'
                + '<label class="mt-2">Paragraph</label>'
                + '<div class="row">'
                + '<div class="col-3">'
                + '<img data-font-alignment="left" class="option-font-alignment" src="assets/imgs/contentPage/optionTool/left-alignment.svg">'
                + '</div>'
                + '<div class="col-3">'
                + '<img data-font-alignment="center" class="option-font-alignment" src="assets/imgs/contentPage/optionTool/center-alignment.svg">'
                + '</div>'
                + '<div class="col-3">'
                + '<img data-font-alignment="right" class="option-font-alignment" src="assets/imgs/contentPage/optionTool/right-alignment.svg">'
                + '</div>'
                + '<div class="col-3">'
                + '<img data-font-alignment="justify" class="option-font-alignment" src="assets/imgs/contentPage/optionTool/justify.svg">'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
                // + '<div class="col-12 d-flex justify-content-center border-bottom">'
                // + '<div class="form-group text-center">'
                // + '<label class="mt-2">Action</label>'
                // + '<div w-70 d-flex justify-content-between p-1">'
                // + '<img  id="option-action-trash" src="assets/imgs/contentPage/trash.svg">'
                // + '</div>'
                // + '</div>'
                // + '</div>'
                + '</div>'
            this.rootOptionTool.html(htmlOptionToolBar)
            this.handles(this.actions.event.handleOptionToolTextArea);
        }
        else if (this.currentToolbar === this.actions.toolbar.addExamTool) {

            htmlOptionToolBar =
                '<div class="row p-0 m-0 mt-3 option-exam">'
                + '<div class="col-12 d-flex justify-content-center border-bottom">'
                + '<div class="form-group text-center w-70">'
                + '<label>Property</label>'
                + '<input id="exam-input-title" type="text" class="form-control text-center" placeholder="Title">'
                + '<input id="exam-input-url" type="text" class="form-control text-center" placeholder="LinkName">'
                + '</div>'
                + '</div>'
                + '<div class="col-12 d-flex justify-content-center border-bottom">'
                + '<div class="form-group text-center">'
                + '<label>Action</label>'
                + '<div >'
                + '<img  class="option-action-trash" src="assets/imgs/contentPage/trash.svg">'
                + '</div>'
                + '</div>'
                + '</div>'

                + '</div>'
            this.rootOptionTool.html(htmlOptionToolBar)
            let targetExam = this.exams.find((exam) => exam.parentId === this.currentBox.attr('id'))
            if (targetExam) {
                $('.option-exam').find('#exam-input-title').val(targetExam.title);
                $('.option-exam').find('#exam-input-url').val(targetExam.name);
            }
            this.handles(this.actions.event.handleOptionToolExam);
        }
    }
    private setCurrentBox(element?) {
        // console.log(element)
        // console.log("this.currentBox",this.currentBox)
        // this.rootElement.find('[content-name]').hide().find(this.currentBox.find('[content-name]').get(0)).show();
       if(!element.hasClass('content-box-current') || !element){
            if (element) {
                this.currentBox = this.contentDCtrlService.currentBox = element;
            } else {
                this.currentBox = this.contentDCtrlService.currentBox = $(this.rootElement).find('.content-box-current');
            }
            let targetContent = ContentRouting.routes.find((content) => content.contentName === this.currentBox.find('[content-name]').attr('content-name'))
            if (targetContent) {
                this.rootOptionTool.html(this.createContentOption(this.currentBox,targetContent.option))                    
            }
            this.addStyleElements(this.actions.style.addStyleBoxCurrent, this.currentBox)
       }

        // let targetOption =  this.currentBox.find('[name="section-option"]');
        // console.log("targetOption",targetOption)
        // this.rootOptionTool.html(targetOption)
    }
    private setCurrentLayout(element?) {
        if (element) {
            this.currentLayout = element;
        } else {
            this.currentLayout = $(this.rootElement).find('.content-layout-current');
        }
        this.addStyleElements(this.actions.style.addStyleLayoutCurrent, this.currentLayout)
        let targetLayout = LayoutRouting.routes.find((layout) => layout.layoutName === this.currentLayout.attr('layout-name'))
        if (targetLayout) {
            this.rootOptionTool.html(this.createLayoutOption(targetLayout.option))
        }
    }
    private setCurrentToolbar(action?) {
        if (action) {
            this.currentToolbar = action;
        }


        // else if (this.currentBox) {
        //     if (this.currentBox.hasClass(this.boxType.boxBrowseImg)) {
        //         this.currentToolbar = this.actions.toolbar.addBrowseImgTool;
        //     } else if (this.currentBox.hasClass(this.boxType.boxTextarea)) {
        //         this.currentToolbar = this.actions.toolbar.addTextareaTool;
        //     } else if (this.currentBox.hasClass(this.boxType.boxBrowseVideo)) {
        //         this.currentToolbar = this.actions.toolbar.addBrowseVideoTool;
        //     } 
        //     else if (this.currentBox.hasClass(this.boxType.boxBrowseFile)) {
        //         this.currentToolbar = this.actions.toolbar.addBrowseFileTool;
        //     }
        //     else if (this.currentBox.hasClass(this.boxType.boxBrowseLink)) {
        //         this.currentToolbar = this.actions.toolbar.addBrowseLinkTool;
        //     }
        //     else if (this.currentBox.hasClass(this.boxType.boxImg) || this.currentBox.hasClass(this.boxType.boxFile) ||  this.currentBox.hasClass(this.boxType.boxComment)) {
        //         this.currentToolbar = this.actions.toolbar.cancelTool;
        //     }
        //     else if(this.currentBox.hasClass(this.boxType.boxLink)){
        //         this.currentToolbar = this.actions.toolbar.addLinkTool;
        //     }
        //     else if(this.currentBox.hasClass(this.boxType.boxBrowseExam)){
        //         this.currentToolbar = this.actions.toolbar.addBrowseExamTool;
        //     }
        //     else if(this.currentBox.hasClass(this.boxType.boxExam)){
        //         this.currentToolbar = this.actions.toolbar.addExamTool;
        //     }
        //     else if (this.currentBox.hasClass(this.boxType.boxProgressBar)){
        //         this.currentToolbar = this.actions.toolbar.addProgressBarTool;
        //     }
        //     else if(this.currentBox.hasClass(this.boxType.boxAddSubform)){
        //         this.currentToolbar = this.actions.toolbar.addCreateSubformTool;
        //     }
        //     else if (this.currentBox.hasClass(this.boxType.boxToDoList)) {
        //         this.currentToolbar = this.actions.toolbar.addToDoListTool;
        //     }
        //     else if (this.currentBox.hasClass(this.boxType.boxVideo)) {
        //         this.currentToolbar = this.actions.toolbar.addVideoTool;
        //     }
        //     else if (this.currentBox.hasClass(this.boxType.boxSubform)) {
        //         this.currentToolbar = this.actions.toolbar.addSubformTool;
        //     }
        //     else if(this.currentBox.hasClass(this.boxType.boxNote)){
        //         this.currentToolbar = this.actions.toolbar.addNote;
        //     }
        //     else {
        //         this.currentToolbar = this.actions.toolbar.addInitalTool;
        //     }
        // }

    }
    private async saveDocument(eventAction) {
        this.createData(this.actions.data.createChildDocument);


        // const toDataURL = url => fetch(url,{ mode: 'no-cors'})
        // .then(response => response.blob())
        // .then(blob => new Promise((resolve, reject) => {
        //     const reader = new FileReader()
        //     reader.onloadend = () => resolve(reader.result)
        //     reader.onerror = reject
        //     reader.readAsDataURL(blob)
        // }))


        // let targetCapture =  $(document).find('#contentTemplateForCaptureHTML').html($('#contentTemplate').html())
        // targetCapture.find('img').each((index,element)=>{
        //     fetch($(element).attr('src'),{ mode: 'no-cors'}).then((response)=>{
        //         console.log(response)
        //     })
        // })

        // await ContentRouting.routes.forEach(element => {
        //     // console.log(targetCapture.find('['+element.contentName+']'))
        //     targetCapture.find('['+element.contentName+']').each((index,element)=>{
        //         $(element).replaceWith($(element).html());
        //         // console.log($(element).html().toString())

        //     })
        // });
        // this.documentService.captureHTML('contentTemplate').subscribe((imgData) => {

        // })

        this.documentService.captureHTML('contentTemplate').subscribe((imgData) => {
            this.createData(this.actions.data.createDataToSave).then((result:DocumentModel) => {
                // targetCapture.html(null);
                // let contents: ContentsModel = {
                //     boxes: this.boxes,
                //     exams:this.exams,
                //     textAreas: this.textAreas,
                //     files:this.files,
                //     imgs: this.imgs,
                //     videos: this.videos,
                //     subFroms: this.subForms,
                //     comments: this.comments,
                //     todoList: this.toDoLists,
                //     links:this.links,
                //     progressBar: this.progressBars,
                //     notes:this.notes

                // }
                let idDocument = this.commonService.getPatternId();
                if (this.documentDataService.currentDocument.id) {
                    idDocument = this.documentDataService.currentDocument.id;
                }

                let contents = result.contents;
                let otherDetail: OtherDetailModel = new OtherDetailModel();
                otherDetail.screenDevDetail.height = this.contentTemplateSize.height;
                otherDetail.screenDevDetail.width = this.contentTemplateSize.width;
                otherDetail.rulerDevDetail = this.rulerDetail;




                let saveobjectTemplate: DocumentModel = {
                    userId: Constants.common.user.id,
                    nameDocument: this.documentDataService.currentDocument.nameDocument,
                    previewImg: imgData,
                    id: idDocument,
                    html: result.html,
                    status: Constants.common.message.status.created.text,
                    contents: contents,
                    otherDetail: otherDetail
                }
                let targetDocumentNav = this.documentDataService.documentNavList.find((docNav) => docNav.id === this.documentDataService.currentDocument.id)
                let saveobjectNavTemplate: DocumentNavigatorModel;
                if (targetDocumentNav) {
                    saveobjectNavTemplate = targetDocumentNav;
                    saveobjectNavTemplate.previewImg = imgData;
                    saveobjectNavTemplate.id = idDocument;
                    saveobjectNavTemplate.nameDocument = this.documentDataService.currentDocument.nameDocument;
                } else {


                    saveobjectNavTemplate = {
                        userId: Constants.common.user.id,
                        id: idDocument,
                        nameDocument: this.documentDataService.currentDocument.nameDocument,
                        previewImg: imgData,
                        status: Constants.common.message.status.created.text,
                        childDocuments: this.childDocuments
                    }
                }

                let saveObjectTrackTemplate: DocumentTrackModel = {
                    userId: Constants.common.user.id,
                    id: idDocument,
                    nameDocument: this.documentDataService.currentDocument.nameDocument,
                    status: Constants.common.message.status.created.text,
                    isTrackProgress: this.documentDataService.documentTrack.contents.length > 0 ? true : false,
                    rawProgress: this.findData(this.actions.data.findProgressDocumentTrack),
                    progress: this.findData(this.actions.data.findProgressDocumentTrack),
                    contents: this.documentDataService.documentTrack.contents
                }
                console.log("saveobjectTemplate==>", saveobjectTemplate);
                console.log("saveobjectNavTemplate==>", saveobjectNavTemplate);
                console.log("saveObjectTrackTemplate==>", saveObjectTrackTemplate);
                // this.documentService.uploadFile(this.files).subscribe((status)=>{

                this.documentService.saveDocument(this.documentDataService.currentDocument.nameDocument, saveobjectTemplate).subscribe((status) => {
                    if (status === Constants.common.event.load.success) {
                        this.documentService.saveDocumentNav(this.documentDataService.currentDocument.nameDocument, saveobjectNavTemplate).subscribe((status) => {
                            this.documentService.saveDocumentTrack(saveObjectTrackTemplate).subscribe((status) => {

                                this.documentDataService.currentDocument = saveobjectTemplate;
                                this.eventToParent.emit({ action: status, data: eventAction })
                            });
                        });
                    };
                });


                // })
            });
        })
    }
    // private saveTempDocument(nameDocument) {
    //     const requestTableNav = this.documentService.indexDB.transaction(['temp-navigators'], 'readwrite');
    //     const objectStoreNav = requestTableNav.objectStore('temp-navigators');
    //     const objectNavigator: DocumentNavigatorModel = {
    //         id: this.commonService.getPatternId(nameDocument),
    //         status: Constants.general.message.status.created.text,
    //         nameDocument: nameDocument,
    //         childDocuments: this.subForms
    //     };
    //     if (objectStoreNav.get(nameDocument)) {
    //         objectStoreNav.put(objectNavigator)
    //     } else {
    //         objectStoreNav.add(objectNavigator)
    //     }
    // }
    private addData(action: string, id: string, element?: JQuery<Element>) {
        if (action === this.actions.data.retrieveBoxData) {
            if (!this.boxes.find((box) => box.id === id)) {
                this.boxes.push({
                    id,
                    boxType: null,
                    name: element.attr('name'),
                    contentType: this.currentContentType,
                    htmlDetail: new BoxHTMLModel()
                });
            }
        }
    }
    private findData(action: string, element?): any {
        if (action === this.actions.data.findIndexBoxData) {
            return this.boxes.findIndex(box => box.id === element.attr('id'));
        }
        else if (action === this.actions.data.findProgressDocumentTrack) {
            // let haveCondition = false;
            // this.documentTrack.contents.forEach((content)=>{
            //     if(content.boxType === this.boxType.boxVideo){
            //         if(content.conditions.videoCondition.isMustWatchingEnd){
            //             haveCondition = true;
            //         }
            //     }
            //     // else if(content.boxType === this.boxType.boxSubform){
            //     //     if(content.conditions.subformCondition.haveInDoList){
            //     //         haveCondition = true;
            //     //     }
            //     //     if(content.conditions.subformCondition.haveInProgressBar){
            //     //         haveCondition = true;
            //     //     }
            //     // }
            // });
            return this.documentDataService.documentTrack.contents.length > 0 ? 0 : 100;
        }
        // if(action === this.actions.data.findContentId){
        //     if (this.currentBox.find('.'+this.boxType.boxAddSubform)) {
        //         return ;
        //     }
        //     else if (this.currentBox.find('.'+this.boxType.boxComment)) {
        //         return this.boxType.boxComment;
        //     }
        //     else if (this.currentBox.find('.'+this.boxType.boxImg)) {
        //         return this.boxType.boxImg;
        //     }
        //     else if (this.currentBox.find('.'+this.boxType.boxProgressBar)) {
        //         return this.boxType.boxProgressBar;
        //     }
        //     else if (this.currentBox.find('.'+this.boxType.boxSubform)) {
        //         return this.boxType.boxSubform;
        //     }
        //     else if (this.currentBox.find('.'+this.boxType.boxTextarea)) {
        //         return this.boxType.boxTextarea;
        //     }
        //     else if (this.currentBox.find('.'+this.boxType.boxToDoList)) {
        //         return this.boxType.boxToDoList;
        //     }
        //     else if (this.currentBox.find('.'+this.boxType.boxVideo)) {
        //         return this.boxType.boxVideo;
        //     }

        // }
        // if(action === this.actions.data.findTrackProgressData){
        //     let  isTrackProgress = false;
        //     this.videos.forEach((video)=>{
        //         if(video.isTrackProgress){
        //             isTrackProgress = true;
        //         };
        //     });
        //     this.subForms.forEach((subForm)=>{
        //         if(subForm.isTrackProgress){
        //             isTrackProgress = true;
        //         };
        //     });
        //     return isTrackProgress;
        // }
    }
    private retrieveData(action: string, results: DocumentModel, element?: JQuery<Element>) {
        if (action === this.actions.data.retrieveBoxData) {
            this.boxes = results.contents.boxes;
        } else if (action === this.actions.data.retrieveContentsData) {

            //this.contentDCtrlService.poolContents =  results.contents;
            // setTimeout(() => {
            //     this.rootElement.html(this.currentDocument.html); 
            //     this.defineComponent();            
            // }, 1000);

            // this.subForms = results.contents.subFroms || new Array<SubFormContentModel>();
            // this.imgs = results.contents.imgs||  new Array<ImgContentModel>();
            // this.comments = results.contents.comments ||  new Array<commentContentModel>();
            // this.toDoLists = results.contents.todoList ||  new Array<ToDoListContentModel>();
            // this.videos = results.contents.videos ||  new Array<VideoContentModel>();
            // this.progressBars = results.contents.progressBar ||  new Array<ProgressBarContentModel>();
            // this.files =   results.contents.files ||  new Array<FileContentModel>();
            // this.textAreas = results.contents.textAreas ||  new Array<TextAreaContentModel>();
            // this.links = results.contents.links ||  new Array<LinkContentModel>();
            // this.exams  = results.contents.exams ||  new Array<ExamContentModel>();

            // this.textAreas.forEach((textArea) => {
            //     if (element) {
            //         $(element).find('[id="' + textArea.id + '"]').val(textArea.value);
            //     } else {
            //         $(this.rootElement).find('[id="' + textArea.id + '"]').val(textArea.value);
            //     }
            // });
        }

    }
    private async createData(action: string, element?: JQuery<Element>) {
        if (action === this.actions.data.createDataToSave) {
            return new Promise(async (resolve, reject) => {
                let updateAction: UpdateContentModel = new UpdateContentModel()
                updateAction.actionCase = Constants.common.event.save.document;
                this.contentDCtrlService.updateContent = updateAction

                await this.rootElement.find('.content-box ').find('[content-name = "textarea-content"]').each((index, event) => {
                    let targetIndexTextArea = this.contentDCtrlService.poolContents.textAreas.findIndex((textarea) => textarea.parentId === $(event).parents('.content-box').attr('id'));
                    if (targetIndexTextArea >= 0) {
                        this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].value = $(event).text().toString();
                        this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].html = $(event).html();
                    }
                })
                //let boxes =  this.contentDCtrlService.poolContents.boxes;
                let createDataBoxes =  ()=>{
                    return new Promise((resolve,reject)=>{
                        let boxes = new Array<BoxContentModel>();
                        if(this.rootElement.find('.content-box').length > 0){
                            this.rootElement.find('.content-box').each((index, element) => {
                                let targetElment = $(element);
                                if (targetElment.find('[content-name]').attr('content-last')) {
                                    let newBox = new BoxContentModel()
                                    newBox.id = targetElment.attr('id');
                                    newBox.boxType = null;
                                    newBox.contentType = targetElment.find('[content-name]').attr('content-name')
                                    newBox.htmlDetail.height = targetElment.height();
                                    newBox.htmlDetail.width = targetElment.width();
                                    newBox.htmlDetail.top = targetElment.position().top;
                                    newBox.htmlDetail.left = targetElment.position().left;
                                    newBox.htmlDetail.selector = targetElment.find('[content-name]').attr('content-name');
                                    newBox.htmlDetail.level  = targetElment.css("z-index");
                                    if (!boxes.find((box) => box.id === newBox.id)) {
                                        boxes.push(newBox)
                                    }
                                    if(index === this.rootElement.find('.content-box').length-1){
                                        this.rootElement.find('.content-box').remove();
                                        this.contentDCtrlService.poolContents.boxes = boxes;
                                        resolve(Constants.common.message.status.success)
                                    }
                                }
                            })
                        }else{
                            resolve(Constants.common.message.status.success)
                        }
        
                    })
                }
                createDataBoxes().then(()=>{
                    let documentObj = new DocumentModel();
                    documentObj.html  =  CKEDITOR.instances[this.documentDataService.nameTemplate].getData()
                    documentObj.contents = this.contentDCtrlService.poolContents
                    $('#'+this.documentDataService.nameTemplate).remove();
                    resolve(documentObj)
                })
              


      
    


              


       
             
                // let layouts = new Array<LayoutContentModel>();
                // this.rootElement.find('.content-layout').each((index, element) => {
                //     let newLayout  = new LayoutContentModel();
                //     newLayout.id =     $(element).attr('id');
                //     newLayout.html = $(element).html();
                //     if (!layouts.find((layout) => layout.id === newLayout.id)) {
                //         layouts.push(newLayout)
                //     }
                // })
                // this.contentDCtrlService.poolContents.layouts =layouts;
              
                // this.rootElement.find('.content-box').find('.layout-column').removeClass('ui-resizable');
                // this.rootElement.find('.content-box').find('.ui-resizable-handle').remove();
                // this.rootElement.find('.content-layout').find('.ui-resizable-handle').remove();
                // this.rootElement.find('.content-layout').find('.ui-resizable-handle').remove();
                // this.rootElement.find('.content-box').removeClass('.ui-draggable ui-draggable-handle');
                // this.rootElement.find('.content-box').find('.content-box').css('cursor', 'default');
                // this.rootElement.find('.content-box').find('.content-box').removeClass('content-box-current');
                // this.rootElement.find('.content-box').find('.content-box-label').hide();
                // this.rootElement.find('.content-box').removeClass('content-box-active border border-primary');
                // this.rootElement.find('.content-box').css('border', 'hidden');
                // this.rootElement.find('.content-box').find('[content-name]').html(null)
               // resolve(Constants.common.message.status.success.text)






                // CKEDITOR.instances[this.documentDataService.nameTemplate].destroy()

                //resolve(Constants.common.message.status.success.text)
                // this.textAreas = new Array<TextAreaContentModel>();

                // $(this.rootElement).find('.content-textarea').each((index, element) => {
                //     const elementTextArea = $(element);

                //     // const objectTextArea: TextAreaContentModel = { id: elementTextArea.attr('id'), value: elementTextArea.text() };
                //     // this.textAreas.push(objectTextArea);
                //     // console.log("this.textAreas",this.textAreas)
                // });

                // $(this.rootElement).find('.content-textarea').each((index, element) => {

                // })
                // let numberUploadImg = 0;
                // $(this.rootElement).find('.content-img').each((index, element) => {
                //     const elementImg = $(element);
                //     let targetImg =   this.imgs.find((img)=>img.id === elementImg.attr('id'))
                //     let targetImgIndex =   this.imgs.findIndex((img)=>img.id === elementImg.attr('id'))
                //         if(targetImg && !targetImg.path){
                //             this.imgs[targetImgIndex].database64 =  null
                //             let  awsFileName =  this.commonService.getPatternAWSName(targetImg.originFile.name)|| 'fileName';
                //             let file:UploadFileModel[] = [{
                //                 awsFileName:awsFileName,
                //                 data:targetImg.originFile
                //             }];
                //             this.documentService.uploadFile(file).subscribe(()=>{
                //                 $(elementImg).attr('src',Constants.common.host.storage + awsFileName)
                //                 this.imgs[targetImgIndex].path  =  Constants.common.host.storage + awsFileName;
                //                 this.imgs[targetImgIndex].originFile = null;
                //                 numberUploadImg+=1;
                //                 if(numberUploadImg ===  this.imgs.length){
                //                     resolve(Constants.common.message.status.success.text)
                //                 }
                //             });
                //         }else{
                //             numberUploadImg+=1;
                //             if(numberUploadImg ===  this.imgs.length){
                //                 resolve(Constants.common.message.status.success.text)
                //             }
                //         }

                //     })




            })

            // let  awsFileName =  this.commonService.getPatternAWSName(this.currentBrowseFile[0].name)|| 'fileName';
            // let fileName = this.commonService.fileNameAndExt(this.currentBrowseFile[0].name)[0] || 'fileName';
            // let file = [{
            //     parentId:element.attr('id'),
            //     id:element.attr('id') + '-file',
            //     fileName:this.commonService.fileNameAndExt(this.currentBrowseFile[0].name)[0],
            //     awsFileName:awsFileName,
            //     data:this.currentBrowseFile[0]
            // }];
            // this.imgs.push(img);
            // this.documentService.uploadFile(file).subscribe((result)=>{

            //     element.append('<img src="https://e-learning-dev.s3.eu-central-1.amazonaws.com/public/' + awsFileName + '" id="' + element.attr('id') + '-img" class="content-img"></img>');


            // })
        }
        else if (action === this.actions.data.createChildDocument) {
            this.childDocuments = new Array<SubFormContentDetailModel>();
            this.subForms.forEach((parentBox) => {
                parentBox.subformList.forEach((subform) => {
                    if (!this.childDocuments.find(childDoc => childDoc.id === subform.id)) {
                        if (subform.isConfirm) {
                            this.childDocuments.push(subform);
                        }
                    }

                })
            });
        }
        else if (action === this.actions.data.addBoxType) {
            if (element) {
                let targetBoxIndex = this.boxes.findIndex((box) => box.id === element.attr('id'));
                // this.boxTypeArray.forEach((boxtype)=>{
                //     if(element.hasClass(this.boxType[boxtype])){
                //         this.boxes[targetBoxIndex].boxType = this.boxType[boxtype];
                //         return;
                //     }
                // })
                if (targetBoxIndex >= 0) {
                    if (element.hasClass(this.boxType.boxAddSubform)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxAddSubform;
                    }
                    else if (element.hasClass(this.boxType.boxBrowseImg)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxBrowseImg;
                    }
                    else if (element.hasClass(this.boxType.boxBrowseVideo)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxBrowseVideo;
                    }
                    else if (element.hasClass(this.boxType.boxComment)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxComment;
                    }
                    else if (element.hasClass(this.boxType.boxImg)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxImg;
                    }
                    else if (element.hasClass(this.boxType.boxInitial)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxInitial;
                    }
                    else if (element.hasClass(this.boxType.boxProgressBar)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxProgressBar;
                    }
                    else if (element.hasClass(this.boxType.boxSubform)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxSubform;
                    }
                    else if (element.hasClass(this.boxType.boxTextarea)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxTextarea;
                    }
                    else if (element.hasClass(this.boxType.boxToDoList)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxToDoList;
                    }
                    else if (element.hasClass(this.boxType.boxVideo)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxVideo;
                    }
                    else if (element.hasClass(this.boxType.boxBrowseFile)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxBrowseFile;
                    }
                    else if (element.hasClass(this.boxType.boxFile)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxFile;
                    }
                    else if (element.hasClass(this.boxType.boxBrowseLink)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxBrowseLink;
                    }
                    else if (element.hasClass(this.boxType.boxLink)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxLink;
                    }
                    else if (element.hasClass(this.boxType.boxExam)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxExam;
                    }
                    else if (element.hasClass(this.boxType.boxNote)) {
                        this.boxes[targetBoxIndex].boxType = this.boxType.boxNote;
                    }
                    // else if (element.hasClass(this.boxType.)) {
                    //     this.boxes[targetBoxIndex].boxType = this.boxType.boxFile;
                    // }
                }

            }
        }
        else if (action === this.actions.data.createToDoListBoxList) {
            this.toDoListBoxList = new Array<ToDoListBoxListModel>();
            this.boxes.forEach((box) => {
                if (box.boxType === this.boxType.boxVideo || box.boxType === this.boxType.boxSubform || box.boxType === this.boxType.boxExam) {
                    let boxTypeName;
                    if (box.boxType === this.boxType.boxSubform) {
                        boxTypeName = "Subform"
                    } else if (box.boxType === this.boxType.boxVideo) {
                        boxTypeName = "Video"
                    }
                    else if (box.boxType === this.boxType.boxExam) {
                        boxTypeName = "Exam"
                    }

                    this.toDoListBoxList.push({
                        id: box.id,
                        name: box.name,
                        boxType: box.boxType,
                        boxTypeName: boxTypeName,
                        isChecked: false
                    });
                }
            })
        }
        else if (action === this.actions.data.createProgressBoxList) {
            this.progressBoxList = new Array<ProgressBoxListModel>();
            this.boxes.forEach((box) => {
                if (box.boxType === this.boxType.boxVideo || box.boxType === this.boxType.boxSubform || box.boxType === this.boxType.boxExam) {
                    let boxTypeName;
                    if (box.boxType === this.boxType.boxSubform) {
                        boxTypeName = "Subform"
                    } else if (box.boxType === this.boxType.boxVideo) {
                        boxTypeName = "Video"
                    }
                    else if (box.boxType === this.boxType.boxExam) {
                        boxTypeName = "Exam"
                    }

                    this.progressBoxList.push({
                        id: box.id,
                        name: box.name,
                        boxType: box.boxType,
                        boxTypeName: boxTypeName,
                    });
                }
            })
        }
        else if (action === this.actions.data.createDocumentTrack) {
            if (this.currentBox && this.boxes.length > 0) {
                let targetBox = this.boxes.find(box => box.id === this.currentBox.attr('id'));

                if (targetBox &&
                    (targetBox.boxType === this.boxType.boxSubform ||
                        targetBox.boxType === this.boxType.boxVideo ||
                        targetBox.boxType === this.boxType.boxExam
                    )
                    && !this.documentTrack.contents.find(content => content.parentId === targetBox.id)
                ) {
                    let documentTrackContent = new DocumentTrackContent;
                    documentTrackContent.parentId = this.currentBox.attr('id');
                    documentTrackContent.name = this.currentBox.attr('name');
                    documentTrackContent.id = this.currentBox.find('[id^="' + this.currentBox.attr('id') + '-"]').attr('id');
                    documentTrackContent.progress = 0;
                    if (this.currentBox.hasClass(this.boxType.boxVideo)) {
                        documentTrackContent.conditions.videoCondition.isMustWatchingEnd = false;
                        documentTrackContent.conditions.videoCondition.isClickPlay = false;
                    }
                    else if (this.currentBox.hasClass(this.boxType.boxSubform)) {
                        documentTrackContent.conditions.subformCondition.haveInDoList = false;
                        // documentTrackContent.conditions.subformCondition.haveInProgressBar = false;
                        let targetSubform = this.currentBox.find('#' + documentTrackContent.id);
                        if (targetSubform.attr('data-subformtype') === 'subform-link') {
                            targetSubform.find('.subform-list').each((index, element) => {
                                if (!documentTrackContent.conditions.subformCondition.isClickLinks.find(link => link.linkId === $(element).attr('data-subformid'))) {
                                    let link: SubFormContentLinkModel = {
                                        linkId: $(element).attr('data-subformid'),
                                        linkName: $(element).attr('data-subformname'),
                                        isClicked: false,
                                        progress: 0
                                    }
                                    documentTrackContent.conditions.subformCondition.isClickLinks.push(link);
                                }

                            })
                        }
                        // documentTrackContent.conditions.subformCondition.isClickLink
                    }
                    else if (this.currentBox.hasClass(this.boxType.boxExam)) {
                        documentTrackContent.conditions.examCondition.isSubmitted = false;

                    }
                    documentTrackContent.contentType = targetBox.boxType;

                    this.documentTrack.contents.push(documentTrackContent);
                    console.log(this.documentTrack.contents);
                }


            }

        }

    }
    private async updateData(action: string, element?: JQuery<Element>) {
        // if (action === this.actions.data.updateNavigatorData) {
        //     let targetDocNavIndex = this.documentDataService.documentNavList.findIndex((docNav) => docNav.nameDocument === this.documentDataService.currentDocumentNav);
        //     if (targetDocNavIndex >= 0) {
        //         this.documentDataService.documentNavList[targetDocNavIndex].childDocuments = this.childDocuments;
        //         this.eventToParent.emit({ action: Constants.common.event.click.update, data: 'updateDocNav' })
        //     }

        // }
    }
    private removeData(action: string, element?: any) {


        if (action === this.actions.data.removeDocTrackProgress) {
            this.documentDataService.documentTrack.contents.forEach((content) => {
                content.progress = 0;
                if (content.contentType === this.contentType.subform) {
                    content.conditions.subformCondition.isClickLinks.forEach((link) => {
                        link.isClicked = false;
                        link.progress = 0;
                    })
                    // content.conditions.subformCondition.haveInDoList = false;
                    content.progress = 0;
                }
                else if (content.contentType === this.contentType.video) {
                    content.data = 0;
                    content.conditions.videoCondition.isClickPlay = false;
                }
                else if (content.contentType === this.contentType.link) {
                    content.conditions.linkCondition.progress = 0;
                    content.conditions.linkCondition.isClicked = false;
                    content.progress = 0;
                }
            })
            this.contentDCtrlService.poolContents.videos.forEach((video) => {
                video.data.progress = 0;
            })
            this.contentDCtrlService.poolContents.todoList.forEach((todoList, index) => {
                todoList.progress = 0;
                todoList.toDoListOrder.forEach((taskList, taskIndex) => {
                    taskList.objectTodoList.forEach((objectTodo) => {
                        objectTodo.progress = 0
                    })
                });
            });
        }
        else if (action === this.actions.data.removeNavigatorData) {
            let targetSubform = this.subForms.find((parentBox) => parentBox.parentId === this.currentBox.attr('id'))
            if (targetSubform) {
                targetSubform.subformList.forEach((subform) => {
                    this.childDocuments = this.childDocuments.filter((childDoc) => childDoc.id !== subform.id);
                })
                this.updateData(this.actions.data.updateNavigatorData);
            }
        }

    }
    public eventFromChild(eventChild: TriggerEventModel) {
        console.log(eventChild)
        if (eventChild.action === 'range-slider-event') {
            let rulerDetail: RulerDetailModel = this.rulerDetail = eventChild.data;
            if (rulerDetail.paddingLeft < 0) {
                rulerDetail.paddingLeft = 0;
            }
            $(this.contentTemplate.nativeElement).css('padding-left', rulerDetail.paddingLeft + "%")
            $(this.contentTemplate.nativeElement).css('padding-right', (100 - rulerDetail.paddingRight) + "%")
            $('.content-box').each((index, element) => {


                if (($(element).position().left + $(element).outerWidth()) > $(this.contentTemplate.nativeElement).width()) {
                    $(element).css('left', $(this.contentTemplate.nativeElement).width() - $(element).outerWidth())
                }
                else if (($(this.contentTemplate.nativeElement).position().left + parseInt($(this.contentTemplate.nativeElement).css('padding-left'))) > $(element).position().left) {
                    $(element).css('left', $(this.contentTemplate.nativeElement).position().left + parseInt($(this.contentTemplate.nativeElement).css('padding-left')))
                }
            })
            //console.log($(this.contentTemplate.nativeElement).width()) 
            // this.addElements(this.actions.event.addEventBox)

            //this.rootElement.find('.freedom-layout').draggable( "option", "containment", this.contentTemplate.nativeElement );
            //console.log(this.rootElement.find('.freedom-layout'))
            // this.rootElement.find('.freedom-layout').each((index,element)=>{
            //     console.log( $(element))
            //     $(element).draggable("option", "containment", this.contentTemplate.nativeElement);
            // })
            // console.log(this.rootElement.find('.freedom-layout'))

            // this.rootElement.find('.freedom-layout').bind("resizestop",  () =>{
            //     this.rootElement.find('.freedom-layout').draggable("option", "containment", this.contentTemplate.nativeElement);
            //   });
            // this.rootElement.find('.freedom-layout').draggable("option", "containment", this.contentTemplate.nativeElement);
        }
    }
    public createContent(parentBox,componnent: Type<any>, contentName: string, data?) {
        if (contentName) {
            const newElement = document.createElement(contentName) as NgElement & WithProperties<
                {
                    parentBox: JQuery<Element>,
                    lifeCycle: string,
                    data: any
                }>;
            newElement.setAttribute('content-name', contentName)
            newElement.classList.add("full-screen");
            newElement.parentBox = parentBox;
            newElement.data = data

            this.render.appendChild(document.getElementById(parentBox.attr('id')), newElement)

            // setTimeout(() => {
            //     this.documentDataService.lifeCycle = Constants.document.lifeCycle.loadEditor;
            // }, 1000);

            // const newComponent = document.createElement(contentName) as NgElement & WithProperties<{content :string}>;
            // newComponent.content  = "test";

            // this.render.appendChild(document.getElementById(this.currentBox.attr('id')),document.createElement(contentName))
            //     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Componnent)
            //     const viewContainerRef = this.adHost.viewContainerRef;
            // //    viewContainerRef.clear();
            //     const componentRef = viewContainerRef.createComponent(componentFactory);
            //     (<ContentInterFace>componentRef.instance).parentBox  = this.currentBox;
            //     console.log("this.currentBox",this.currentBox);
            //     return componentRef.location.nativeElement;
        }
    }
    public createLayoutOption(Componnent: Type<any>) {
        if (Componnent) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Componnent)
            const viewContainerRef = this.adHost.viewContainerRef;
            const componentRef = viewContainerRef.createComponent(componentFactory);
            (<ContentInterFace>componentRef.instance).parentBox = this.currentLayout;

            return componentRef.location.nativeElement;
        }
    }
    public createContentOption(parentBox,Componnent: Type<any>) {
        if (Componnent) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Componnent)
            const viewContainerRef = this.adHost.viewContainerRef;
            const componentRef = viewContainerRef.createComponent(componentFactory);
            (<ContentInterFace>componentRef.instance).parentBox = parentBox;
            return componentRef.location.nativeElement;
        }

    }
    public handleContextMenu(context: ContextMenu) {
        $("#context-menu").removeClass("show").hide();
        // this.currentTextSelection.replaceWith('55555')
        // var range = CKEDITOR.instances[this.documentDataService.nameTemplate].getSelection().getRanges()[0];
        // var bm = range.createBookmark();
        // console.log(    $(bm.startNode.$).offset().top,  $(bm.startNode.$).offset().left)
        // console.log(    $(bm.endNode.$).offset().top,  $(bm.endNode.$).offset().left)



        // let targetBookMark = CKEDITOR.instances[this.documentDataService.nameTemplate].getSelection().selectBookmarks( bm );
        // console.log(targetBookMark)
        // let selection =  CKEDITOR.instances[this.documentDataService.nameTemplate].getSelection();

        // let textSelection = selection.getSelectedText()


        // let s = window.getSelection();
        // let oRange = s.getRangeAt(0); //get the text range
        // let oRect = oRange.getBoundingClientRect();

        // console.log(this.rootElement.position().left)
        // console.log(this.rootElement.position().top)
        // // let top = e.pageY-57 ;
        // // let left = e.pageX-270 ;

        // // console.log('textSelection',textSelection)
        // console.log(oRect)
        // let textSelection =  CKEDITOR.instances[this.documentDataService.nameTemplate].getSelection().getSelectedText();
        if (context.layoutType) {
            if (context.action === 'merge') {
                //    let targetLayout =  context.targetElement.parents()
                //    console.log(context.targetElement)
                let firstCell = context.targetElement.find('.cke_table-faked-selection')[0];
                //console.log(firstCell)
            }
        } else {
            if (context.action === 'link') {
                let targetContent = ContentRouting.routes.find((content) => content.contentName === context.contentType);
                if (targetContent) {
                    let data = {
                        targetContent: targetContent,
                        result: this.currentTextSelection
                    }
                    this.currentContentType = this.layoutTypes.freedomLayout;
                    this.addElements(this.actions.event.addElBox, null, this.actions.event.dropAny, null, data)
                }
            }
        }




    }





    private defineComponent() {
        ContentRouting.routes.forEach((route) => {
            const customElement = createCustomElement(route.component, { injector: this.injector });
            customElements.get(route.contentName) || customElements.define(route.contentName, customElement)
        })
    }
}
