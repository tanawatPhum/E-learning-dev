import { Component, OnInit, AfterContentInit, ViewEncapsulation, ViewChild, ElementRef, Input, EventEmitter, Output, AfterViewInit, ComponentFactoryResolver, Type, Compiler, Injector, NgModuleRef, NgModule, ComponentRef, Renderer2, ApplicationRef } from '@angular/core';
import { catchError, mergeMap, toArray, map, find } from 'rxjs/operators';
import { Observable, of, Subject, empty, fromEvent, VirtualTimeScheduler } from 'rxjs';
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
import { ninvoke } from 'q';
import { AdHost } from '../../../../directives/ad-host/ad-host.directive';
import { ContentRouting } from '../../../../app-content-routing';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ContentInterFace } from 'src/app/contents/interface/content.interface';
import { createCustomElement, NgElement, WithProperties } from '@angular/elements';
import { VideoContentComponent } from '../../../../contents/video-content/video-content';
import { ImgContentComponent } from '../../../../contents/img-content/img-content';
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
export class CreateContentPageComponent implements OnInit, AfterViewInit {
    @ViewChild('contentTemplate', { static: true }) contentTemplate: ElementRef;
    @ViewChild('contentOptionTool', { static: true }) contentOptionTool: ElementRef;
    @ViewChild(AdHost, {static: true}) adHost: AdHost;
    @Input() triggerElement: Subject<TriggerEventModel>;
    @Input() contentElement: Subject<DocumentModel>;
    @Input() contentTypeSelected: Subject<any>;
    @Input() dropElement: Subject<TriggerEventModel>;
    @Output() eventToParent = new EventEmitter<TriggerEventModel>();
    public indexDB: any;
    public currentBox: JQuery<Element>;
    public currentToolbar: string;
    public currentElement: any;
    public currentContentType: any
    public currentBrowseFile: any;
    public currentBrowseLink:string;
    public currentinput:string;
    public currentElementTool: any;
    public currentColorCode:string;
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
    public rulerDetail:RulerDetailModel = new RulerDetailModel();

    public rulerDetailSubject: Subject<RulerDetailModel> = new Subject<RulerDetailModel>();

    public boxType = Constants.document.boxes.types;
    public contentType = Constants.document.contents.types;

    private cmpRef: ComponentRef<any>;

    public actions = {
        event: {
            addElBox: 'addElBox',
            addElVideo: 'addElVideo',
            addElExam:'addElExam',
            addElNote:'addElNote',
            addElProgressBar: 'addElProgressBar',
            addElToDoList: 'addElToDoList',
            addElComment: 'addElComment',
            addElSubForm: 'addElSubForm',
            addEventBox: 'addEventBox',
            addSubForm: 'addSubForm',
            dropTool: 'dropTool',
            handleCurrentBox: 'handleCurrentBox',
            handleAttachImgModal: 'handleAttachImgModal',
            handleDragBoxes: 'handleDragBoxes',
            handleToolbars: 'handleToolbars',
            handleNote:'handleNote',
            handleSubForm: 'handleSubForm',
            handleBrowseExam: 'handleBrowseExam',
            handleTemplateDoc: 'handleTemplateDoc',
            handleWistia: 'handleWistia',
            handleOptionToolTextArea: 'handleOptionToolTextArea',
            handleOptionToolToDoList: 'handleOptionToolToDoList',
            handleOptionToolVideo: 'handleOptionToolVideo',
            handleOptionToolExam: 'handleOptionToolExam',
            handleOptionToolLink: 'handleOptionToolLink',
            handleOptionToolProgressBar:'handleOptionToolProgressBar',
            handleOptionToolSubform: 'handleOptionToolSubform',
            handleOptionTools: 'handleOptionTool',
            handleCarousel: 'handleCarousel',
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
            createProgressBoxList:'createProgressBoxList',
            createDocumentTrack:'createDocumentTrack',
            retrieveBoxData: 'retrieveBoxData',
            retrieveContentsData: 'retrieveContentsData',
            removeAllContentObj: 'removeAllContentObj',
            removeBoxData: 'removeBoxData',
            removeDocumentTrackData:'removeDocumentTrackData',
            removeNavigatorData: 'removeNavigatorData',
            removeImgData: 'removeImgData',
            removeObjInTodoList:'removeObjInTodoList',
            removeObjInProgressBar:'removeObjInProgressBar',
            removeDocTrackProgress:'removeDocTrackProgress',
            findIndexBoxData: 'findIndexBoxData',
            findContentId:'findBoxType',
            findEmptyData: 'findEmptyData',
            findProgressDocumentTrack:'findProgressDocumentTrack',
            findTrackProgressData: 'findTrackProgressData'
        },
        toolbar: {
            templateDocTool: 'templateDocTool',
            addInitalTool: 'addInitalTool',
            addTextareaTool: 'addTextareaTool',
            addBrowseLinkTool:'addBrowseLinkTool',
            addExamTool:'addExamTool',
            addBrowseExamTool:'addBrowseExamTool',
            addProgressBarTool: 'addProgressBarTool',
            addNote:'addNote',
            addToDoListTool: 'addToDoListTool',
            addCommentTool: 'addCommentTool',
            addCreateSubformTool: 'addCreateSubformTool',
            addSubformTool: 'addSubformTool',
            addVideoTool: 'addVideoTool',
            addLinkTool: 'addLinkTool',
            removeTool: 'removeTool',
            cancelTool: 'cancelTool'
        },
        style: {
            addOptionStyle: 'addOptionStyle',
            removeAllStyleBoxCurrent: 'removeAllStyleBoxCurrent',
            addStyleBoxCurrent: 'addStyleBoxCurrent',
            addStyleBoxBrowseImgSize: 'addStyleBoxBrowseImgSize',
            addStyleBoxBrowseFileSize: 'addStyleBoxBrowseFileSize',
            addStyleBoxBrowseVideoSize: 'addStyleBoxBrowseVideoSize',
            addStyleBoxProgressBarSize: 'addStyleBoxProgressBarSize',
            addStyleBoxCommentSize: 'addStyleBoxCommentSize',
            addStyleBoxSubformSize: 'addStyleBoxSubformSize',
            addStyleSubformActive: 'addStyleSubformActive',
            addStyleBoxActive: 'addStyleBoxActive',
            addStyleBorderBox: 'addStyleBorderBox',
            addStyleBoxContentNote:'addStyleBoxContentNote',
            
            removeStyleBorderBox: 'removeStyleBorderBox',
            removeStyleBoxCurrent: 'removeStyleBoxCurrent',
            removeStyleBoxActive: 'removeStyleBoxActive',
            removeStyleBoxBrowseImgSize: 'removeStyleBoxBrowseImgSize',
            removeStyleBoxSubformSize: 'removeStyleBoxSubformSize',
            removeStyleBoxBrowseVideoSize: 'removeStyleBoxBrowseVideoSize',
            removeStyleBoxProgressBarSize: 'removeStyleBoxProgressBar',
            removeStyleBoxCommentSize: 'removeStyleBoxCommentSize',
            removeStyleBoxType: 'removeStyleBoxType',
            removeStyleSubformActive: 'removeStyleActiveSubform'
        },
        option: {
            removeOptionTool: 'removeOptionTool',
        },
        template: {
            setDocument: 'setDocument',
            setHTML:'setHTML',
            setDocumentTrack: 'setDocumentTrack',
            setContentEditable:'setContentEditable',
            

        },
        editor:{
            setEditor:'setEditor',
            setEditorContentNote:'setEditorContentNote',
            openEditorContentNote:'openEditorContentNote',
            closeEditorContentNote:'closeEditorContentNote',
        }
    };
    public boxes: BoxContentModel[] = new Array<BoxContentModel>();
    public textAreas: TextAreaContentModel[] = new Array<TextAreaContentModel>();
    public imgs: ImgContentModel[] = new Array<ImgContentModel>();
    public files:FileContentModel[] = new Array<FileContentModel>();
    public videos: VideoContentModel[] = new Array<VideoContentModel>();
    public subForms: SubFormContentModel[] = new Array<SubFormContentModel>();
    public comments: commentContentModel[] = new Array<commentContentModel>();
    public progressBars: ProgressBarContentModel[] = new Array<ProgressBarContentModel>();
    public toDoLists: ToDoListContentModel[] = new Array<ToDoListContentModel>();
    public links:LinkContentModel[] =new Array<LinkContentModel>();
    public exams:ExamContentModel[]  = new Array<ExamContentModel>();
    public notes: NoteContentModel[] = new Array<NoteContentModel>();
    public loading:boolean =true;



    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private documentDataService: DocumentDataControlService,
        private contentDCtrlService:ContentDataControlService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector:Injector,
        private render:Renderer2,
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
        this.contentElement.subscribe((result) => {
            this.contentDCtrlService.poolContents = new ContentsModel();
            this.documentDataService.documentTrack = new DocumentTrackModel();
            this.documentDataService.lifeCycle = Constants.document.lifeCycle.loadEditor; 
            this.loading = false;
            this.currentDocument = result;
            this.rulerDetailSubject.next(result.otherDetail.rulerDevDetail)
            this.setTemplate(this.actions.template.setDocument);
            this.setTemplate(this.actions.template.setDocumentTrack);
           
        
          
          

       

        });
        this.contentTypeSelected.subscribe((contentType) => {
            this.currentContentType = contentType;
            this.addElements(this.actions.event.addElBox);
        });
        this.dropElement.subscribe((tool) => {

            if (tool.action === this.actions.event.dropTool) {
                this.currentContentType = this.layoutTypes.freedomLayout;
                this.currentElementTool = tool.data.element;
                this.addElements(this.actions.event.addElBox, null, this.actions.event.dropTool,null,tool.data.contentName)
                //remove tranfer img icon to ckeditor
                //if(this.rootElement.find('p').find('img'))
                //this.rootElement.find('p').find('img').remove();
                this.rootElement.find('.template-doc').find('p').find('img').unwrap().remove();

            }
        })
        this.triggerElement.subscribe((event) => {
            if (event.action === Constants.common.event.click.add) {
                this.addElements(this.actions.event.addElBox).then(() => {
                    this.addElements(this.actions.style.addStyleBoxCurrent, this.currentBox);
                });
            } else if (event.action === Constants.common.event.click.save) {
                this.saveDocument(event.data, Constants.common.event.click.save);
            } else if (event.action === Constants.common.event.click.new) {
                // this.removeData(this.contents.data.removeAllContentObj);
                // this.rootElement.html(null);
                this.saveDocument(event.data, Constants.common.event.click.new);
            }

        });

    }
    ngAfterViewInit() {
   
            this.rootElement = $(this.contentTemplate.nativeElement);
            this.rootOptionTool = $(this.contentOptionTool.nativeElement);
            this.setCurrentToolbar(this.actions.toolbar.templateDocTool);
            this.addOptionToolBar();
            this.getContentTemplateSize();  
    


    }
    private async setTemplate(action) {
        if (action === this.actions.template.setDocument) {
            if ($('.template-doc').length == 0) {
                this.rootElement.append('<div id="template-doc" class="template-doc"></div>')
                
            }
            this.handleEditor(this.actions.editor.setEditor);
            // this.handleEditor(this.actions.editor.closeEditorContentNote,this.rootElement);
            this.handles(this.actions.event.handleNote);
            // this.handles(this.actions.event.handleTextArea);
    
            this.handles(this.actions.event.handleTemplateDoc, $('.template-doc'));                
          
       
        }
        else if (action === this.actions.template.setDocumentTrack) {
            this.documentService.loadDocTrackFromDB().subscribe((documentTrack) => {
               if(documentTrack&&documentTrack.length>0){
                this.documentTrack = this.documentDataService.documentTrack =  documentTrack.find((documentTrack)=>documentTrack.id === this.commonService.getPatternId(this.documentDataService.currentDocumentName)) || new DocumentTrackModel();
                //remove progress preview
                this.removeData(this.actions.data.removeDocTrackProgress);
                }
               
            })
        }
        else if(action === this.actions.template.setHTML){
            //this.createComponentFromRaw(this.currentDocument.html)
           
         
                await this.rootElement.html(this.currentDocument.html); 
                if (this.currentDocument.status!== Constants.common.message.status.notFound.text) {
                    this.retrieveData(this.actions.data.retrieveBoxData, this.currentDocument);
                    this.retrieveData(this.actions.data.retrieveContentsData, this.currentDocument);
             
               }
               $('#'+this.documentDataService.nameTemplate).attr('contenteditable','true');
               $('#'+this.documentDataService.nameTemplate).css('overflow-y','auto')
               this.defineComponent();
       
        }
    }
    private getContentTemplateSize() {
        let contentTemplateSize: ScreenDetailModel = new ScreenDetailModel();
        // let parentContentHeight = $('.container-content').outerHeight();
        // $('.content-template').css('height', parentContentHeight * 75 / 100)
        contentTemplateSize.height = $('.content-template').height();
        contentTemplateSize.width = $('.content-template').width();
        this.contentTemplateSize = contentTemplateSize;
        localStorage.setItem('contentTemplateSize', JSON.stringify(contentTemplateSize))
    }
    private handleEditor(action:string,element?:JQuery<Element>){
        if(action===this.actions.editor.setEditor){
           
            this.documentDataService.nameTemplate = 'template-doc';
          
      
            this.setTemplate(this.actions.template.setHTML)
            //console.log(CKEDITOR.instances[this.documentDataService.nameTemplate])
            CKEDITOR.inline(this.documentDataService.nameTemplate);
            CKEDITOR.disableAutoInline = true;
            CKEDITOR.on('instanceReady', (ev) => {
               
                     $('.cke_top').css('display','none')
                    
                     $('#'+this.documentDataService.nameTemplate).click(()=>{
                        this.removeStyleElements(this.actions.style.removeAllStyleBoxCurrent)
                        this.currentToolbar = this.actions.toolbar.templateDocTool;
                        this.addOptionToolBar();
                     })
                   
                     this.addElements(this.actions.event.addEventBox).then(() => {
                        this.removeData(this.actions.data.removeAllContentObj);
                    });
              
           
                     $(ev.editor.element.$).removeAttr("title");
                  
                    
         
            });
            // console.log($('#'+this.documentDataService.nameTemplate))  
            // $('#'+this.documentDataService.nameTemplate).click(()=>{
            //     console.log('xxxxxxx')
            // })         
                  // ev.editor.on('focus',  (e)=> {  
                    //     $('.cke').css('display','none')
                    
                    // }); 
  
            
    
            // $('#template-doc').on('drop',(event)=>{
            //     setTimeout(() => {
            //         console.log($('#box-'+ this.commonService.getBoxCurrentId()));
            //    $('#box-'+ this.commonService.getBoxCurrentId()).detach().appendTo($('#template-doc'))
            //     },500)
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
       else if(action===this.actions.editor.openEditorContentNote){
            
            element.find('.note-icon.writing.hideCK').hide();
            element.find('.note-icon.writing.showCK').show();
            element.find('.note-icon.writing.showCK').css('width',$('.note-icon.writing.hideCK').width()-($('.note-icon.writing.hideCK').width()*70/100))
        }
        else if(action===this.actions.editor.closeEditorContentNote){
         
                element.find('.note-icon.writing.showCK').hide();
                element.find('.note-icon.writing.hideCK').show();
                element.find('.note-area').show();
               // element.find('#cke_'+ element.attr('id')+'-note-area').hide();
          
        }
    }
    private async addElements(action: string, element?: any, subaction?: string, subElement?: any, data?: any) {
        if (action === this.actions.event.addElBox || action === this.actions.event.addEventBox) {
            if (action === this.actions.event.addElBox) {
                const numberOfBox = this.commonService.getBoxId();
                // const numberOfBox = this.rootElement.find('.content-box').length;
                if (this.currentContentType.name === this.layoutTypes.freedomLayout.name) {
                    this.rootElement.append('<div contenteditable="false" style="z-index:999" id=box-' + numberOfBox + ' class="content-box ' + this.boxType.boxInitial + ' freedom-layout" name="box-' + numberOfBox + '" ><div class="content-box-label">box-' + numberOfBox + '</div> </div>');
                    $('[id="box-' + numberOfBox + '"]').css('position', 'absolute');
                    if (subaction === this.actions.event.dropTool) {
                        setTimeout(() => {
                            let x;
                            if ($('[id="box-' + numberOfBox + '"]').outerWidth() + this.currentElementTool.layerX > this.rootElement.outerWidth()) {
                                x = (100 * parseFloat(((this.currentElementTool.layerX - $('[id="box-' + numberOfBox + '"]').outerWidth()) / this.rootElement.width()).toString())) + "%";
                            } else {
                                x = (100 * parseFloat((this.currentElementTool.layerX / this.rootElement.width()).toString())) + "%";
                            }
                            let y = (100 * parseFloat((this.currentElementTool.layerY / this.rootElement.height()).toString())) + "%";
                            $('[id="box-' + numberOfBox + '"]').css('left', x);
                            $('[id="box-' + numberOfBox + '"]').css('top', y);
                        });
                    } else {
                        setTimeout(() => {
                            this.commonService.calPositionCenter(this.rootElement, $('[id="box-' + numberOfBox + '"]')).top
                            this.commonService.calPositionCenter(this.rootElement, $('[id="box-' + numberOfBox + '"]')).left
                        });
                    }
                    $('[id="box-' + numberOfBox + '"]').css('width', Constants.common.element.css.box.width);
                    $('[id="box-' + numberOfBox + '"]').css('height', Constants.common.element.css.box.height);
                } 
                
                this.removeStyleElements(this.actions.toolbar.removeTool);
                this.setCurrentBox($('#box-' + numberOfBox));
                this.addData(this.actions.data.retrieveBoxData, 'box-' + numberOfBox, $('[id="box-' + numberOfBox + '"]'));
                if (subaction === this.actions.event.dropTool) {
                    let targetContent  = ContentRouting.routes.find((content)=>content.contentName === data)
                    await this.createContent(targetContent.component, targetContent.contentName);
                    this.documentDataService.lifeCycle  = Constants.document.lifeCycle.loadEditor;
                    // this.currentBox.append(targetContentHtml);
                    this.currentBox.find('[content-name]').show();
                    $('.content-box').find('[content-name][content-last!="true"]').hide();
                    this.rootOptionTool.html(this.createContentOption(targetContent.option))
              

                   $(this.currentBox).detach().appendTo($('#template-doc'))
                } else {
                    this.setCurrentToolbar();
                }
            }
            this.rootElement.find('.freedom-layout').draggable({
                containment: this.contentTemplate.nativeElement,
                stack: '.freedom-layout',
                scroll: true,
                start: ((event) => {
                    this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target), 'startDrag');
                }),
                stop: ((event) => {
                //     let l = (100 * parseFloat(($(event.target).position().left  / this.rootElement.width()).toString())) + "%";
                //     let t = (100 * parseFloat((($(event.target).position().top+$('#template-doc').scrollTop()) / this.rootElement.height()).toString())) + "%";
                   
                // //    console.log($(event.target).position().top)
                // //     console.log($('#template-doc').scrollTop())

                //     $(event.target).css("left", l);
                //     $(event.target).css("top", t);
                    // this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target), 'endDrag');
                    this.removeStyleElements(this.actions.style.removeStyleBoxActive);
                    // console.log($('#template-doc').scrollTop())
                }),
            });
            this.rootElement.find('.content-box').resizable({
                handles: '',
            })
                .resizable({
                    handles: 'n, e, s, w, se, ne, sw, nw',
                    containment: this.contentTemplate.nativeElement,
                    start: ((event) => {
                        this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target), 'startResize');
                    }),
                    stop: ((event) => {
                    //     let w = (100 * parseFloat(($(event.target).width() / this.rootElement.width()).toString())) + "%";
                    //     let h = (100 * parseFloat(($(event.target).height() / this.rootElement.height()).toString())) + "%";
                    //     $(event.target).css("width", w);
                    //   $(event.target).css("height", h);
                        //this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target), 'endResize');
                        this.removeStyleElements(this.actions.style.removeStyleBoxActive);
                        if ($(event.target).hasClass(this.boxType.boxSubform)) {
                            this.handles(this.actions.event.handleElRatio, $(event.target).find('#contentTemplate'), $(event.target).find('.subform-preview'))
                        }
                    }),
                })
                // .find('.ui-resizable-handle').removeClass('ui-icon ui-icon-gripsmall-diagonal-se'); 
                this.rootElement.find('.content-box').css("border", "");
                this.rootElement.find('.content-box').find('.content-box-label').show();
                // this.rootElement.find('.content-box').css('cursor','move')


            this.handles(this.actions.event.handleCurrentBox);
            this.handles(this.actions.event.handleToolbars);
            this.handles(this.actions.event.handleSubForm);
            
            if (this.currentBox) {
                // this.handles(this.actions.event.handleBrowseImg, this.currentBox);
                this.addElements(this.actions.style.addStyleBoxCurrent, this.currentBox);
            }
        } else if (action === this.actions.style.addStyleBoxCurrent) {

            this.setCurrentBox(element);
            // this.addStyleElements(this.actions.style.addStyleBoxCurrent, element);
            // this.addStyleElements(this.actions.style.addStyleBorderBox, element);
            // console.log(CKEDITOR.instances[this.documentDataService.nameTemplate])
            // CKEDITOR.instances[this.documentDataService.nameTemplate].setReadOnly(true);
            if (subaction === 'startDrag' || subaction === 'click' || subaction === 'startResize') {
                this.addStyleElements(this.actions.style.addStyleBoxActive, element);
            } else {
                this.removeStyleElements(this.actions.style.removeStyleBoxActive);
            }

            // this.setCurrentToolbar();
            // const IndexBox = this.findData(this.actions.data.findIndexBoxData, element);
            // $('.content-box').find('[name="section-content"]').hide();
            // this.currentBox.find('[name="section-content"]').show();
            // if (IndexBox !== -1) {
            //     if (this.boxes[IndexBox].isEmpty) {
            //         this.addToolBarBox(this.currentToolbar, element);
            //     }
            // }
            //this.addOptionToolBar();
        }
        else if (action === this.actions.event.addElExam) {
            
            let hostname = (new URL(this.currentBrowseLink)).hostname;
            if(!this.currentinput){
                this.currentinput = 'Title'
            }
            this.exams.push({
                parentId:element.attr('id'),
                id:element.attr('id') + '-exam',
                path:this.currentBrowseLink,
                title:this.currentinput,
                name:hostname,
                score:'0'
            });
            let htmlExam  = '<div class="row content-exam"  id="' + element.attr('id') + '-exam">' 
            +'<div class="col-12 mb-3">' 
            +'<input class="mb-3 exam-input-title" id="exam-input-title" type="text" value="'+this.currentinput+'" > '     
            +'<a id="exam-input-url" data-name="'+hostname+'" class="content-link cursor-pointer ">'+hostname+'</a>'
            + '<h5 id="text-exam-score" class="mt-3">Score:0</h5>'
            +'</div>'
            +'</div>'
            element.html(htmlExam);
            // element.css('display','initial')


            //element.append('<a  data-name="'+hostname+'" id="' + element.attr('id') + '-link" class="content-link cursor-pointer ">'+hostname+'</a>');
        }

        else if (action === this.actions.event.addElVideo) {
            let streamData: VideoConetentDataModel = data;
            let condition:VideoConetentConditionModel = new VideoConetentConditionModel();
            condition.isMustWatchingEnd  = false;
            let video = {
                id: element.attr('id') + '-video',
                data: streamData,
                path: null,
                parentId: element.attr('id'),
                condition:condition
            }
            if (subaction === 'videoSource') {
                const reader = new FileReader();
                reader.onload = ((event: any) => {
                    video.path = event.target.result;
                    element.append('<video src="' + event.target.result + '" id="' + element.attr('id') + '-video" class="content-video" controls ></video>');
                    this.videos.push(video);
                });
                reader.readAsDataURL(this.currentBrowseFile[0]);
            } else if (subaction === 'youtube') {
                video.path = this.currentBrowseFile;
                element.append('<iframe src="' + this.currentBrowseFile + '" id="' + element.attr('id') + '-video" class="content-video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
                this.videos.push(video);
            }
            else if (subaction === 'wistia') {
                element.append('<div id="' + element.attr('id') + '-video" class="content-video"><div class="wistia_responsive wistia_embed wistia_async_' + this.currentBrowseFile + ' full-screen">&nbsp;</div></div>')
                setTimeout(() => {
                    // let videoWist = Wistia.api(streamData.streamId);
                    // streamData.duration = video.duration();
                    video.path = this.currentBrowseFile;
                    video.data.wistiaId =  $(element.find('#'+element.attr('id') + '-video').find('.wistia_responsive')).attr('id');
                    this.videos.push(video);
                    this.handles(this.actions.event.handleWistia, element)
                }, 500)
            }
            // console.log($(element.find('#'+element.attr('id') + '-video').find('.wistia_responsive'))[0])
 
     
      
         
            // let documentTrackContent = new DocumentTrackContent;
            // documentTrackContent.boxType = this.
            // this.

            // this.addOptionToolBar();
            // let wistiaObj = Wistia.api("bm82offozy")
            // console.log('wistiaObj',wistiaObj)
        }
        else if (action === this.actions.event.addElSubForm) {
            let htmlSubform = '';
            let targetSubform = this.subForms.find((parentBox) => parentBox.parentBoxId === element.attr('id'));
            if (this.currentSubFormType.id === 'subform-link') {
                htmlSubform += '<ul id="' + element.attr('id') + '-subform" data-subformType="subform-link" class="list-group content-subform mt-3">';
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
                htmlSubform += '<div  data-subformType="subform-silde" id="' + element.attr('id') + '-subform" class="border carousel slide full-screen" data-interval="false" data-ride="carousel">'
                // htmlSubform += '<ul class="carousel-indicators">'
                // htmlSubform += '<li data-target="#demo" data-slide-to="0" class="active"></li>'
                // htmlSubform += '<li data-target="#demo" data-slide-to="1"></li>'
                // htmlSubform += '</ul>'
                htmlSubform += '<div class="carousel-inner full-screen">'
                targetSubform.subformList.forEach((subform, index) => {
                    let targetDocument = this.documentDataService.documentList.find((document) => document.id === subform.id);
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
                    htmlSubform += '<div data-subformId="' + element.attr('id') + '-subform" class="carousel-control-prev" data-slide="prev">'
                    htmlSubform += '<i style="font-size:200%" class="text-dark fa fa-angle-left cursor-pointer"></i>'
                    // htmlSubform += '<span class="carousel-control-prev-icon cursor-pointer"><i class="fa fa-angle-left"></i>  </span>'
                    htmlSubform += '</div>'
                    htmlSubform += '<div data-subformId="' + element.attr('id') + '-subform" class="carousel-control-next" data-slide="next">'
                    htmlSubform += '<i style="font-size:200%" class="text-dark fa fa-angle-right cursor-pointer"></i>'
                    // htmlSubform += '<span class="carousel-control-next-icon cursor-pointer"><i class="fa fa-angle-right"></i> </span>'
                    htmlSubform += '</div>'
                }
                htmlSubform += '</div>'
                htmlSubform += '</div>'
            }
            element.css('display', 'initial');
            element.css('text-align', 'initial');
            element.removeClass('box-subform-size');
            element.css('width', Constants.common.element.css.box.width);
            element.css('height', Constants.common.element.css.box.height);
            element.append(htmlSubform);
            element.find('#template-doc').attr('contenteditable', false);
            element.find('#template-doc').css('cursor', 'move');

            this.handles(this.actions.event.handleElRatio, element.find('#contentTemplate'), element.find('.subform-preview'))
            this.handles(this.actions.event.handleSubForm, element);

            // this.addOptionToolBar();

            // setTimeout(() => {       
            //         $('.carousel-control').click(function(e){
            //             e.stopPropagation();
            //             var goTo = $(this).data('slide');
            //             if(goTo=="prev") {
            //                 $('#carousel-id').carousel('prev'); 
            //             } else {
            //                 $('#carousel-id').carousel('next'); 
            //             }
            //         });   
            // });
            this.removeStyleElements(this.actions.event.removeForPreviewSubForm, element);
            this.createData(this.actions.data.createChildDocument);
            this.updateData(this.actions.data.updateNavigatorData);
            // this.rootElement.find('.content-box').find(".subform-preview").find('.content-box').each((index, contentBox) => {
            //     // let targetDocument = this.documentDataService.documentList.find((document) => document.id === subform.id);
            //     // this.retrieveData(this.contents.data.retrieveTextAreaData,)
            //     let oldScreen: ScreenDetailModel = JSON.parse(localStorage.getItem('contentSize'))
            //     this.commonService.calPositionForNewScreen(contentBox, oldScreen).subscribe((elementDetail) => {
            //         $(contentBox).css('height', elementDetail.screenDetail.height + "%");
            //         $(contentBox).css('width', elementDetail.screenDetail.width + "%");
            //         $(contentBox).css('left', elementDetail.postitionDetail.left + "%");
            //         $(contentBox).css('top', elementDetail.postitionDetail.top + "%");
            //     })
            // });
        }
        else if (action === this.actions.event.addElProgressBar) {
            element.append(
                '<div id="' + element.attr('id') + '-progressBar" class="content-progress-bar progress full-screen">'
                + '<div class="progress-bar bg-success"  style="width:40%">'
                + '</div>'
                + '</div>'
            )
            let progressBar: ProgressBarContentModel = {
                id: element.attr('id') + '-progressBar',
                parentId:element.attr('id'),
                progress: 0,
                contentList:new Array<ProgressBarContentObjectModel>()
            }
            this.progressBars.push(progressBar);
            this.addStyleElements(this.actions.style.addStyleBoxProgressBarSize, element);
        }
        else if (action === this.actions.event.addElComment) {
            let htmlToolComment = '<div id="' + element.attr('id') + '-comment" class="content-comment">';
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
            htmlToolComment += '<div data-commentBoxId="' + element.attr('id') + '-comment" id="comment-attach" class="comment-tool attach">';
            htmlToolComment += '<input type="file" class="comment-browse-file" id="comment-input-file">'
            htmlToolComment += '<img src="assets/imgs/contentPage/attachment.svg">';
            htmlToolComment += '</div>';
            htmlToolComment += '<div id="comment-question" class="comment-tool question">';
            // htmlToolComment += '<img  src="assets/imgs/contentPage/question.svg">';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '<div class="col pt-3 ">';
            htmlToolComment += '<button data-commentId="' + element.attr('id') + '-comment"  type="button" class="btn btn-primary float-right comment-btn-post">Post Comment</button>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            htmlToolComment += '</div>';
            element.append(htmlToolComment);
            this.comments.push({
                parentId:element.attr('id'),
                id: element.attr('id') + '-comment',
                listComment: []
            })
            this.addStyleElements(this.actions.style.addStyleBoxCommentSize, element)
        }
        else if (action === this.actions.event.addElToDoList) {
            let targetTodoList = this.toDoLists.find((parentBox) => parentBox.parentId === this.currentBox.attr('id'));
            let orderList = "";
            if (targetTodoList) {
                targetTodoList.toDoListOrder.forEach((order) => {
                    orderList += '<div id="' + order.id + '"  class="toDoList-list list-group-item text-left"><p>' + order.displayName + '</p></div>'
                })
            }
            element.css('display', 'initial')
            let htmlToolToDoList = '<div class="list-group text-left content-toDoList"></div>'
            if(element.find('.content-toDoList').length==0){
                element.append(htmlToolToDoList)
            }
            let htmlToolToDoListTask = '<div class="list-group text-left">';
            htmlToolToDoListTask += orderList
            htmlToolToDoListTask += '</div>'
            // element.find('.content-toDoList').find('.toDoList-list').attr('data-before','&#9675;');
            element.find('.content-toDoList').html(htmlToolToDoListTask);
        }
        else if(action === this.actions.event.addElNote){
            let note: NoteContentModel = {
                id: element.attr('id') + '-progressBar',
                parentId:element.attr('id'),
                text:null,
                html:null,
                status:'show'
            }
            this.notes.push(note);
            
            element.append(
                `
                    <div id="${element.attr('id')}-note" class="content-note">
                        <img data-parentId="${element.attr('id')}" src="assets/imgs/contentPage/note-writing.svg" class="rounded-circle note-icon writing hideCK">
                
                        <div data-parentId="${element.attr('id')}" class="note-icon writing showCK">
                            <img  src="assets/imgs/contentPage/others/arrow-button-left.svg" class="rounded-circle note-icon arrow pointer-events">
                            <img src="assets/imgs/contentPage/note-writing.svg" class="rounded-circle note-icon writing pointer-events">
                        </div>
                        <div contenteditable id="${element.attr('id')}-note-area" class="note-area border">
                        </div>
                    </div>
                `
                )
                this.handles(this.actions.event.handleNote,element)
                this.handleEditor(this.actions.editor.closeEditorContentNote,element)
        }

        this.setCurrentToolbar();
       // this.addOptionToolBar();
        this.createData(this.actions.data.addBoxType, element)
        this.createData(this.actions.data.createDocumentTrack);
    }
    private handles(action: string, element?: any, subElement?: any) {
        if (action === this.actions.event.handleCurrentBox) {
            this.rootElement.find('.content-box').find('.content-textarea').click((event) => {
                this.currentElement = $(event.target);
                if(!this.currentElement.parents('.content-box').hasClass('content-box-current')){
                    this.setCurrentBox(this.currentElement.parents('.content-box'));
                }
            })

            this.rootElement.find('.content-box').click((event) => {
                this.currentElement = $(event.target);
                if ($(event.target).hasClass('content-box')) {
                    this.setCurrentBox(this.currentElement);
                }else{
                    this.setCurrentBox(this.currentElement.parents('.content-box'));
                }

          
                // this.addStyleElements(this.actions.style.addStyleBoxCurrent,this.currentBox)
                // this.addElements(this.actions.style.addStyleBoxCurrent, this.currentBox, 'click');
                
                // if ($(event.currentTarget).attr('id') !== (this.currentBox && this.currentBox.attr('id'))) {
                //     console.log(event.currentTarget)
                // //    console.log('afiokdjffdjdsfopfjdslkdfs');
                //     this.currentElement = $(event.target);
                //     if (/-textarea/.test(event.target.id)) {
                //         this.currentElement.focus();
                //         this.removeStyleElements(this.actions.toolbar.removeTool);
                //     }
                //     if (event.target.id && !/-textarea/.test(event.target.id) && $(event.target).hasClass('content-box')) {
                //         this.setCurrentBox(this.currentElement);
                //     } else {
                //         this.setCurrentBox(this.currentElement.parents('.content-box'));
                //     }
                //     // console.log()
                //     // this.currentBox.draggable({ disabled: true });
                //     // this.addOptionToolBar();
                //     this.addElements(this.actions.style.addStyleBoxCurrent, this.currentBox, 'click');

                //     // if (!this.currentBox.hasClass('content-box-current')) {
                //     //     this.addElements(this.contents.event.addStyleCurrentBoxBefore, this.currentBox);
                //     // } else {
                //     //     this.addElements(this.contents.event.addStyleCurrentBoxAfter, this.currentBox);
                //     // }

                // }

            });
        
        }
        else if (action === this.actions.event.handleAttachImgModal) {
            element.modal('show');
        } else if (action === this.actions.event.handleDragBoxes) {
            // if (this.commonService.isPlatform === Constants.platform.device) {
            //     this.rootElement.find('.freedom-layout').on('touchmove', (event) => {
            //         this.rootElement.find('.freedom-layout').draggable({ disabled: false, cancel: '' });
            //     });
            // } else {
            //     this.rootElement.find('.freedom-layout').mousemove(() => {
            //         this.rootElement.find('.freedom-layout').draggable({ disabled: false, cancel: '' });
            //     });
            // }
        } else if (action === this.actions.event.handleToolbars) {
            // this.rootElement.find('.content-toolbar').click((event) => {
            //     event.stopPropagation();
            //     if (event.target.id === 'file-browse') {
            //         this.setCurrentToolbar(this.actions.toolbar.addBrowseImgTool);
            //         this.removeStyleElements(this.actions.style.removeStyleBoxType);
            //         this.currentBox.addClass(this.boxType.boxBrowseImg);
            //         this.addToolBarBox(this.currentToolbar, this.currentBox);
            //         // this.triggerElements(this.constants.event.triggerAttachFileModal, $('#attach-file-modal'));
            //     } else if (event.target.id === 'trash') {
            //         this.removeStyleElements(this.actions.event.removeElBox);
            //     } else if (event.target.id === 'text-area') {
            //         this.removeStyleElements(this.actions.style.removeStyleBoxType);
            //         this.currentBox.addClass(this.boxType.boxTextarea);
            //         this.setCurrentToolbar(this.actions.toolbar.addTextareaTool);
            //         this.addToolBarBox(this.currentToolbar, element);
            //         this.addElements(this.actions.event.addElTextArea, this.currentBox);
            //     } else if (event.target.id === 'video-browse') {
            //         this.setCurrentToolbar(this.actions.toolbar.addBrowseVideoTool);
            //         this.removeStyleElements(this.actions.style.removeStyleBoxType);
            //         this.currentBox.addClass(this.boxType.boxBrowseVideo);
            //         this.addToolBarBox(this.currentToolbar, this.currentBox);
            //     }
            //     else if (event.target.id === 'subform') {
            //         this.setCurrentToolbar(this.actions.toolbar.addCreateSubformTool);
            //         this.addToolBarBox(this.currentToolbar, this.currentBox);
            //         this.currentBox.addClass(this.boxType.boxAddSubform);
            //         // this.removeElements(this.contents.event.removeStyleBoxType);
            //         // this.currentBox.addClass(this.boxType.boxBrowseVideo);
            //         // this.addToolBarBox(this.currentToolbar, this.currentBox); this.addToolBarBox(this.currentToolbar, this.currentBox);
            //     }
            //     else if (event.target.id === 'cancel') {
            //         this.removeStyleElements(this.actions.event.removeElBox);
            //         // if (element.hasClass(this.boxType.boxSubform)) {

            //         // }
            //         // this.removeElements(this.actions.style.removeStyleBoxType);
            //         // this.removeElements(this.actions.event.removeContent);
            //         // this.setCurrentToolbar(this.actions.toolbar.addInitalTool);
            //         // this.addToolBarBox(this.actions.toolbar.addInitalTool, element);
            //     }
            // });
            // this.rootElement.find('.content-toolbar').find('.form-group').attr('contenteditable','false')
        }
         else if (action === this.actions.event.handleSubForm) {
            if (element) {
                let targetSubform = this.subForms.find(parentBox => parentBox.parentBoxId === element.attr('id'))
                if (targetSubform) {
                    targetSubform.subformList.forEach((detail) => {
                        element.find('.toolbar-subform').find('#subform-name-' + detail.id).prop('checked', true);
                    })
                    if (targetSubform.subformList.length > 0) {
                        if (targetSubform.subformList[0].type === "subform-silde") {
                            element.find('.toolbar-subform').find('[id="' + targetSubform.subformList[0].type + '"]').text('Silde (' + targetSubform.subformList.length + ')');
                        } else if (targetSubform.subformList[0].type === "subform-link") {
                            element.find('.toolbar-subform').find('[id="' + targetSubform.subformList[0].type + '"]').text('Link (' + targetSubform.subformList.length + ')');
                        }

                        this.removeStyleElements(this.actions.style.removeStyleSubformActive, element);
                        this.addStyleElements(this.actions.style.addStyleSubformActive, element.find('.toolbar-subform').find('#' + targetSubform.subformList[0].type));
                    }
                }
                element.find('.toolbar-subform').find('.nav-item').click((itemElement) => {
                    this.removeStyleElements(this.actions.style.removeStyleSubformActive, element);
                    this.addStyleElements(this.actions.style.addStyleSubformActive, $(itemElement.currentTarget));
                    this.currentSubFormType = {
                        id: $(itemElement.currentTarget).attr('id'),
                        name: $(itemElement.currentTarget).data('subformtype')
                    }
                    element.find('.toolbar-subform').find('#subform-silde').text('Silde (0)');
                    element.find('.toolbar-subform').find('#subform-link').text('Link (0)');
                    let targetSubformIndex = this.subForms.findIndex((parentBox) => parentBox.parentBoxId === element.attr('id'));
                    console.log('this.subForms',this.subForms)
                    if (this.currentSubFormType.id === "subform-silde") {
                        element.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Silde (' + this.subForms[targetSubformIndex].subformList.length + ')');
                    }
                    else if (this.currentSubFormType.id === "subform-link") {
                        element.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Link (' + this.subForms[targetSubformIndex].subformList.length + ')');
                    }
                    this.subForms[targetSubformIndex].subformList.forEach((detail) => {
                        detail.type = this.currentSubFormType.id;
                    });
                });
                element.find('.toolbar-subform').find('#subform-btn-submit').click((btnElement) => {
                    btnElement.stopPropagation();
                    let targetSubformIndex = this.subForms.findIndex((parentBox) => parentBox.parentBoxId === element.attr('id'));
                    this.subForms[targetSubformIndex].subformList.forEach((subform) => {
                        subform.isConfirm = true;
                    })

                    this.removeStyleElements(this.actions.style.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxSubform);
                    this.setCurrentToolbar(this.actions.toolbar.cancelTool);
                    this.addToolBarBox(this.actions.toolbar.cancelTool, element);
                    this.addElements(this.actions.event.addElSubForm, element)

                    console.log(' ❏ Subforms :', this.subForms);


                })
                element.find('.toolbar-subform').find('input[type="checkbox"]').click((itemElement) => {
                    let targetDocument = this.documentDataService.documentNavList.find((document) => document.nameDocument === $(itemElement.currentTarget).val())
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
                    if (this.subForms.length === 0 || !this.subForms.find((parentBox) => parentBox.parentBoxId === element.attr('id'))) {
                        this.subForms.push(
                            {
                                parentBoxId: element.attr('id'),
                                subformType:null,
                                subformList: [newSubform]
                            }
                        )
                    } else {
                        let targetSubformIndex = this.subForms.findIndex((parentBox) => parentBox.parentBoxId === element.attr('id'));
                        if ($(itemElement.currentTarget).is(':checked')) {
                            this.subForms[targetSubformIndex].subformList.push(newSubform)
                        } else {
                            this.subForms[targetSubformIndex].subformList = this.subForms[targetSubformIndex].subformList.filter((detail) => detail.documentName != $(itemElement.currentTarget).val())
                        }
                    }
                    let targetSubform = this.subForms.find((parentBox) => parentBox.parentBoxId === element.attr('id'));
                    // if(targetSubform.subformList.length>0){
                    if (this.currentSubFormType.id === "subform-silde") {
                        element.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Silde (' + targetSubform.subformList.length + ')');
                    }
                    else if (this.currentSubFormType.id === "subform-link") {
                        element.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Link (' + targetSubform.subformList.length + ')');
                    }
                    this.removeStyleElements(this.actions.style.removeStyleSubformActive, element);
                    this.addStyleElements(this.actions.style.addStyleSubformActive, element.find('.toolbar-subform').find('#' + this.currentSubFormType.id));
                });
                element.find('.carousel-control-next').click((event) => {
                    $('#' + $(event.currentTarget).attr('data-subformId')).carousel('next');
                })
                element.find('.carousel-control-prev').click((event) => {
                    $('#' + $(event.currentTarget).attr('data-subformId')).carousel('prev');
                })
            }

            this.rootElement.find('.content-box').find('.content-subform').find('.carousel-control-next').click((event) => {
                $('#' + $(event.currentTarget).attr('data-subformId')).carousel('next');
            })
            this.rootElement.find('.content-box').find('.content-subform').find('.carousel-control-prev').click((event) => {
                $('#' + $(event.currentTarget).attr('data-subformId')).carousel('prev');
            })
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
        else if (action === this.actions.event.handleOptionTools) {
            $('.option-action-trash').click(() => {
                this.removeData(this.actions.data.removeBoxData);
                this.removeStyleElements(this.actions.option.removeOptionTool);
                this.removeStyleElements(this.actions.event.removeElBox);
            });
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
                palette: [ ],
                showSelectionPalette: true, // true by default
                selectionPalette: ["red", "green", "blue"],
                change:(color)=> {
                    let style = 'color:' + color.toHexString();
                    this.currentColorCode =  color.toHexString();
                    this.addStyleElements(this.actions.style.addOptionStyle, null, style)
                }
            });
            if(this.currentColorCode){
                $("#option-font-color").spectrum("set", this.currentColorCode)
            }
    

            $('.option-action-trash').click(() => {
                this.removeData(this.actions.data.removeBoxData);
                this.removeStyleElements(this.actions.option.removeOptionTool);
                this.removeStyleElements(this.actions.event.removeElBox);
            });

        }
        else if (action === this.actions.event.handleWistia) {
            element.click((event) => {
                let videoIndex = this.videos.findIndex((video) => video.id === $(event.currentTarget).attr('id') + '-video');
                let video = Wistia.api(this.videos[videoIndex].data.streamId);
                // video.pause();
                // console.log('cxcxcx');
                this.videos[videoIndex].data.currentWatchingTime = video.time();
            });
        }
        else if (action === this.actions.event.handleOptionToolToDoList) {
            $('.option-toDoList').find('.toDoList-btnPlus').unbind().bind('click', () => {
                let taskName = $('.option-toDoList').find('#toDoList-inputTask').val().toString();
                let taskLength = ($('.option-toDoList').find('.toDoList-taskList').find('.list-group-item').length + 1)
                let displayName = 'Step' + taskLength + ' : ' + taskName;
                let task = '<div data-boxId="' + this.currentBox.attr('id') + '"  id="taskList-' + taskLength + '" data-taskName="' + taskName + '" class="rounded-0 list-group-item border-0 pl-4 cursor-pointer">' + displayName +  '</div>';

                if (taskName) {
                    $('.option-toDoList').find('.toDoList-taskList').append(task);
                    if (!this.toDoLists.find(parentBox => parentBox.parentId === this.currentBox.attr('id') + '-todoList')) {
                        let todoList: ToDoListContentModel = {
                            parentId: this.currentBox.attr('id'),
                            id: this.currentBox.attr('id') + '-todoList',
                            progress: 0,
                            toDoListOrder: new Array<ToDoListContentOrderModel>()
                        }
                        this.toDoLists.push(todoList)
                    }
                    let toDoListOrder: ToDoListContentOrderModel = {
                        id: 'taskList-' + taskLength,
                        name: taskName,
                        displayName: displayName,
                        progress: 0,
                        step: taskLength,
                        objectTodoList: new Array<ObjectToDoList>()
                    }
                    let targetTodoListIndex = this.toDoLists.findIndex(parentBox => parentBox.parentId === this.currentBox.attr('id'))
                    if (targetTodoListIndex >= 0 && !this.toDoLists[targetTodoListIndex].toDoListOrder.find(order => order.id === 'taskList-' + taskLength)) {
                        this.toDoLists[targetTodoListIndex].toDoListOrder.push(toDoListOrder)
                    }
                    this.handles(this.actions.event.handleOptionToolToDoList)
                    this.addElements(this.actions.event.addElToDoList, this.currentBox)
                }

            });
            $('.option-toDoList').find('.toDoList-taskList').find('.list-group-item').unbind().bind('click', (element) => {
                $('.option-toDoList').find('.toDoList-taskList').find('.list-group-item').removeClass('task-active')
                $(element.currentTarget).addClass('task-active')
                
                if (!this.currentSelectTaskList.find(box => box.boxId === this.currentBox.attr('id'))) {
                    this.currentSelectTaskList.push({
                        boxId: this.currentBox.attr('id'),
                        taskId: $(element.currentTarget).attr('id')
                    })
                } else {
                    let targetBoxIndex = this.currentSelectTaskList.findIndex(box => box.boxId === this.currentBox.attr('id'))
                    this.currentSelectTaskList[targetBoxIndex].taskId = $(element.currentTarget).attr('id');
                }
                this.createData(this.actions.data.createToDoListBoxList)
                let listBox = '';
                this.toDoListBoxList.forEach((box, index) => {
                    listBox += '<input data-taskId="' + $(element.currentTarget).attr('id') + '" type="checkbox" value="' + box.id + '" id="compontentList-box-' + box.id + '" />';
                    listBox += '<label class="list-group-item border-0" for="compontentList-box-' + box.id + '">' + box.name + '(' + box.boxTypeName + ')' + '</label>';
                });

                if (listBox) {
                    $('.option-toDoList').find('.toDoList-componentList').html(listBox);
                }

                let targetTodoListIndex = this.toDoLists.findIndex(parentBox => parentBox.parentId === this.currentBox.attr('id'))
                let targetIndexTodoOrder = this.toDoLists[targetTodoListIndex].toDoListOrder.findIndex((order) => order.id === $(element.currentTarget).attr('id'));
                this.toDoLists[targetTodoListIndex].toDoListOrder[targetIndexTodoOrder].objectTodoList.forEach((object) => {
                    $('.option-toDoList').find('.toDoList-componentList').find('input[type="checkbox"]').each((index, element) => {
                        if (object.id === $(element).val()) {
                            $(element).prop('checked', true);
                        }
                    });
                })

                this.handles(this.actions.event.handleOptionToolToDoList)
            });
            $('.option-toDoList').find('.toDoList-componentList').find('input[type="checkbox"]').unbind().bind('click', (element) => {
                let targetToDoListIndex = this.toDoLists.findIndex(parentBox => parentBox.parentId === this.currentBox.attr('id'))
                let targetToDoOrderIndex = this.toDoLists[targetToDoListIndex].toDoListOrder.findIndex((order) => order.id === $(element.currentTarget).attr('data-taskId'));
                 let targetDocumentTrackContentIndex =  this.documentTrack.contents.findIndex(content=>content.parentId ===$(element.currentTarget).val().toString());
                if ($(element.currentTarget).prop('checked')) {
                    let objectTodoList: ObjectToDoList = {
                        id: $(element.currentTarget).val().toString(),
                        progress: 0
                    }
        
                    this.toDoLists[targetToDoListIndex].toDoListOrder[targetToDoOrderIndex].objectTodoList.push(objectTodoList)
                    if( this.documentTrack.contents[targetDocumentTrackContentIndex].contentType === this.boxType.boxSubform){
                        this.documentTrack.contents[targetDocumentTrackContentIndex].conditions.subformCondition.haveInDoList = true;
                    }
                } else {
                    this.toDoLists[targetToDoListIndex].toDoListOrder[targetToDoOrderIndex].objectTodoList =
                    this.toDoLists[targetToDoListIndex].toDoListOrder[targetToDoOrderIndex].objectTodoList.filter((object) => object.id != $(element.currentTarget).val().toString())
                    if( this.documentTrack.contents[targetDocumentTrackContentIndex].contentType === this.boxType.boxSubform){
                        this.documentTrack.contents[targetDocumentTrackContentIndex].conditions.subformCondition.haveInDoList = false;
                    }
                }

            })
            $('.option-toDoList').find('.toDoList-taskList').find('.taskList-text').unbind().bind('input', (element) => {
                let taskId   =  $(element.currentTarget).attr('data-taskId');
                let targetToDoListIndex = this.toDoLists.findIndex(parentBox => parentBox.parentId === this.currentBox.attr('id'))
                let targetToDoListTaskIndex  =   this.toDoLists[targetToDoListIndex].toDoListOrder.findIndex(task=>task.id===taskId);
                this.toDoLists[targetToDoListIndex].toDoListOrder[targetToDoListTaskIndex].displayName  =  $(element.currentTarget).text();
                this.currentBox.find('.content-toDoList').find('#'+taskId).find('p').text($(element.currentTarget).text())


                // let targetToDoOrderIndex = this.toDoLists[targetToDoListIndex].toDoListOrder.findIndex((order) => order.id === $(element.currentTarget).attr('data-taskId'));
                // if()
                // $(element.currentTarget).val()
                // $(element.currentTarget

            })
            $('.option-toDoList').find('.toDoList-taskList').find('.taskList-trash').unbind().bind('click', (element) => {
                element.stopPropagation()
                let taskId =  $(element.currentTarget).attr('data-taskid');
                this.currentBox.find('.content-toDoList').find('#'+taskId).remove();
                 $('.option-toDoList').find('.toDoList-taskList').find('#'+taskId).remove();
                let  targetParentBoxIndex =    this.toDoLists.findIndex((parentBox)=>parentBox.parentId === this.currentBox.attr('id'));
                if(targetParentBoxIndex>=0){
                    this.toDoLists[targetParentBoxIndex].toDoListOrder =  this.toDoLists[targetParentBoxIndex].toDoListOrder.filter((task)=>task.id !== taskId);
                }
                
                this.toDoLists[targetParentBoxIndex].toDoListOrder.forEach((task,index)=>{
                    this.toDoLists[targetParentBoxIndex].toDoListOrder[index].id =  'taskList-'+index+1;                    
                })
                this.currentBox.find('.content-toDoList').find('.toDoList-list').each((index,element)=>{
                        $(element).attr('id','taskList-'+(index+1));
                });
                $('.option-toDoList').find('.toDoList-taskList').find('.list-group-item').each((index,element)=>{
                        $(element).attr('id','taskList-'+(index+1));
                });
            });

            $('.option-toDoList').find('.toDoList-trash').find('.option-action-trash').unbind().bind('click', () => {
                this.removeData(this.actions.data.removeBoxData);
                this.removeStyleElements(this.actions.option.removeOptionTool);
                this.removeStyleElements(this.actions.event.removeElBox);
            });

        }
        else if (action === this.actions.event.handleOptionToolVideo) {
            $('.option-video').find('.video-tracker').unbind().bind('click', (element) => {
                let targetVideoIndex = this.videos.findIndex((video) => video.parentId === this.currentBox.attr('id'))
                let targetVideoTrackIndex =  this.documentTrack.contents.findIndex((video)=>video.id === this.videos[targetVideoIndex].id);
                if (targetVideoIndex >= 0) {
                    if($('.option-video').find('.video-tracker').prop('checked')){
                        this.videos[targetVideoIndex].condition.isMustWatchingEnd = true;
                        this.documentTrack.contents[targetVideoTrackIndex].conditions.videoCondition.isMustWatchingEnd = true
                    }else{
                        this.videos[targetVideoIndex].condition.isMustWatchingEnd = false;
                        this.documentTrack.contents[targetVideoTrackIndex].conditions.videoCondition.isMustWatchingEnd = false;
                    }
                }
            });

            $('.option-video').find('.option-action-trash').unbind().bind('click', () => {
                this.removeData(this.actions.data.removeBoxData);
                this.removeStyleElements(this.actions.option.removeOptionTool);
                this.removeStyleElements(this.actions.event.removeElBox);
            });
        }

        else if (action === this.actions.event.handleOptionToolLink) {
            $('.option-link').find('#link-input-url').unbind().bind('input', (element) => {
                console.log(element)
                let targetLinkIndex = this.links.findIndex(link=>link.parentId === this.currentBox.attr('id'))
                if(targetLinkIndex>=0){
                    this.links[targetLinkIndex].name =  $(element.currentTarget).val().toString();
                    this.currentBox.find('.content-link').text($(element.currentTarget).val().toString());
                    this.currentBox.find('.content-link').attr('data-name',$(element.currentTarget).val().toString());
                }

            })
            $('.option-link').find('.option-action-trash').unbind().bind('click', () => {
                this.removeData(this.actions.data.removeBoxData);
                this.removeStyleElements(this.actions.option.removeOptionTool);
                this.removeStyleElements(this.actions.event.removeElBox);
            });

        }

        else if (action === this.actions.event.handleOptionToolExam) {
            $('.option-exam').find('#exam-input-url').unbind().bind('input', (element) => {
                let targetExamIndex = this.exams.findIndex(exam=>exam.parentId === this.currentBox.attr('id'));
                console.log(targetExamIndex)
                if(targetExamIndex>=0){
                    this.exams[targetExamIndex].name =  $(element.currentTarget).val().toString();
                    console.log(this.currentBox.find('.content-exam').find('#exam-input-url'))
                    this.currentBox.find('.content-exam').find('#exam-input-url').text($(element.currentTarget).val().toString());
                }
            })
            $('.option-exam').find('#exam-input-title').unbind().bind('input', (element) => {
                let targetExamIndex = this.exams.findIndex(exam=>exam.parentId === this.currentBox.attr('id'));
                console.log(targetExamIndex)
                if(targetExamIndex>=0){
                    this.exams[targetExamIndex].name =  $(element.currentTarget).val().toString();
                    this.currentBox.find('.content-exam').find('#exam-input-title').val($(element.currentTarget).val().toString());
                }
            })
            $('.option-exam').find('.option-action-trash').unbind().bind('click', () => {
                this.removeData(this.actions.data.removeBoxData);
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

        else if (action === this.actions.event.handleOptionToolSubform) {
            // $('.option-subform').find('.subform-tracker').unbind().bind('click', (element) => {
            //     let targetDocumentTrackContentIndex =  this.documentTrack.contents.findIndex(content=>content.parentId === this.currentBox.attr('id'));
            //     if ($('.option-subform').find('.subform-tracker').prop('checked')) {
            //         this.documentTrack.contents[targetDocumentTrackContentIndex].conditions.subformCondition.haveInDoList = true;
            //         this.documentTrack.contents[targetDocumentTrackContentIndex].progress = 0;
            //         // this.documentTrack.contents[targetDocumentTrackContentIndex].conditions.subformCondition.isClickLinks.forEach((link)=>{

            //         // })
            //     }else{
            //         this.documentTrack.contents[targetDocumentTrackContentIndex].conditions.subformCondition.haveInDoList = false;
            //         this.documentTrack.contents[targetDocumentTrackContentIndex].progress = 100;
            //     }
            // })

            // $('.option-subform').find('.subform-tracker').unbind().bind('click', (element) => {
            //     let targetParentBoxIndex = this.subForms.findIndex((subform) => subform.parentBoxId === this.currentBox.attr('id'))
            //     this.subForms[targetParentBoxIndex].subformList.forEach((subform) => {
            //         if ($('.option-subform').find('.subform-tracker').prop('checked')) {
            //             this
            //         }else{

            //         }
            //         // if ($('.option-subform').find('.subform-tracker').prop('checked')) {
            //         //     if (!this.documentTrack.contents.find(content => content.id === subform.id)) {
            //         //         let content: DocumentTrackContent = {
            //         //             parentId: this.currentBox.attr('id'),
            //         //             id: subform.id,
            //         //             data: null,
            //         //             boxType: this.boxType.boxSubform,
            //         //             progress: 0,
            //         //             isTrackProgress: true
            //         //         }
            //         //         this.documentTrack.contents.push(content)
            //         //     }
            //         // } else {
            //         //     this.documentTrack.contents = this.documentTrack.contents.filter((content) => content.id !== subform.id);
            //         // }

            //     })

            // });
            $('.option-subform').find('.subform-input').unbind().bind('input', (element) => {
               let targetElementSubform =  this.currentBox.find('.content-subform').find('li'+"[data-subformid='" + $(element.currentTarget).attr('data-subformid') + "']")
                let targetParentBoxIndex =  this.subForms.findIndex((parentBox)=>parentBox.parentBoxId === this.currentBox.attr('id'));
                let targetSubformIndex =  this.subForms[targetParentBoxIndex].subformList.findIndex(subform=>subform.id === $(element.currentTarget).attr('data-subformid'))
                this.subForms[targetParentBoxIndex].subformList[targetSubformIndex].linkName =  $(element.currentTarget).val().toString();
                targetElementSubform.text($(element.currentTarget).val().toString()) 

            });
            $('.option-subform').find('.option-action-trash').unbind().bind('click', () => {
                this.removeData(this.actions.data.removeBoxData);
                this.removeStyleElements(this.actions.option.removeOptionTool);
                this.removeStyleElements(this.actions.event.removeElBox);
            });
        }
        else if (action === this.actions.event.handleOptionToolProgressBar) {
            $('.option-progressBar').find('.progressBar-componentList').find('input[type="checkbox"]').unbind().bind('click', (element) => {
                let targetProgressBarIndex  =  this.progressBars.findIndex(progressBar=>progressBar.parentId  === this.currentBox.attr('id'));
                let targetdocumentTrack= this.documentTrack.contents.find(content => content.parentId  === $(element.currentTarget).val().toString())
                console.log(targetdocumentTrack)
                // console.log(targetdocumentTrack)
                if(targetProgressBarIndex>=0){
                    if($(element.currentTarget).prop('checked')){
                        if(!this.progressBars[targetProgressBarIndex].contentList.find(content=>content.parentId === $(element.currentTarget).val().toString())){
                            // this.documentTrack.contents[targetParentBoxSubformIndex].conditions.subformCondition.haveInProgressBar  =true;
                            // this.subForms[targetParentBoxSubformIndex].subformList.forEach((subform)=>{
                                // this.documentTrack.contents.forEach((content)=>{
                                //     if(content.boxType ===this.boxType.boxSubform){
                                //         content.conditions.subformCondition.haveInProgressBar = true;
                                //     }
                                // });
                            // })
                          let targetDocTrack =  this.documentTrack.contents.find((content)=>content.parentId === $(element.currentTarget).val().toString())
                         console.log("targetDocTrack", $(element.currentTarget).val().toString())
                          let progressBarContentObj:ProgressBarContentObjectModel = {
                                id:targetDocTrack.id,
                                parentId:targetDocTrack.parentId,
                                boxType:targetdocumentTrack.contentType
                            }
                            this.progressBars[targetProgressBarIndex].contentList.push(progressBarContentObj)
                           }
                    }else{
                        this.progressBars[targetProgressBarIndex].contentList =  this.progressBars[targetProgressBarIndex].contentList.filter((content)=>content.parentId !== $(element.currentTarget).val().toString())
                        // this.documentTrack.contents[targetParentBoxSubformIndex].conditions.subformCondition.haveInProgressBar  =false;
                    }
                    console.log(this.progressBars)
                }
            });
            $('.option-progressBar').find('.option-action-trash').unbind().bind('click', () => {
                this.removeData(this.actions.data.removeBoxData);
                this.removeStyleElements(this.actions.option.removeOptionTool);
                this.removeStyleElements(this.actions.event.removeElBox);
            });

        }
 

        else if(action === this.actions.event.handleBrowseExam){

            element.find('.toolbar-browse-exam').find('#exam-input-title').unbind().bind('click',(event)=>{
                element.find('.toolbar-browse-exam').find('#exam-input-title').focus();
                element.find('.toolbar-browse-exam').find('#exam-input-title').unbind().bind('input',(event)=>{
                    this.currentinput = event.target.value;
                })
            });
            element.find('.toolbar-browse-exam').find('#exam-input-url').unbind().bind('click',()=> {
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
        else if(action === this.actions.event.handleNote){
           
                    if(element&&element.find('.content-note').length ===0){
                        this.addElements(this.actions.event.addElNote, element);
                    }else{
                        this.rootElement.find('.note-icon.writing.hideCK').click((event)=>{
                            let parentId =  $(event.target).attr('data-parentid')
                            
                            // if(!CKEDITOR.instances[element.attr('id')+'-note-area']){
                            //     this.handleEditor(this.actions.editor.setEditorContentNote,element);
                            // }
                            this.handleEditor(this.actions.editor.openEditorContentNote,$('#'+parentId));
                        })
                        this.rootElement.find('.note-icon.writing.showCK').click((event)=>{
                            let parentId =  $(event.target).attr('data-parentid')
                            this.handleEditor(this.actions.editor.closeEditorContentNote,$('#'+parentId));
                        })
                    }
                
          
            

        }
    }
    private removeStyleElements(action: string, element?: any) {
        if (action === this.actions.event.removeElBox) {
            this.currentBox.remove();
            this.currentBox = null;
        } 
        else if (action === this.actions.style.removeStyleBoxCurrent) {
            this.rootElement.find('.content-box').find('[content-name][content-last!="true"]').hide();
            this.rootElement.find('.content-box').removeClass('content-box-current');
            this.rootElement.find('.content-box').removeClass('content-box-active');
            this.rootElement.find('.content-box').removeClass('border border-primary');
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
            this.rootElement.find('.content-box').removeClass('content-box-current');
            this.rootElement.find('.content-box').removeClass('content-box-active');
            this.rootElement.find('.content-box').removeClass('border border-primary');
        }
        else if (action === this.actions.style.removeStyleBoxBrowseImgSize) {
            this.rootElement.find('.content-box').removeClass('box-browse-img-size');
        } else if (action === this.actions.style.removeStyleBoxBrowseVideoSize) {
            this.rootElement.find('.content-box').removeClass('box-browse-video-size');
        }
        else if (action === this.actions.style.removeStyleBoxProgressBarSize) {
            this.rootElement.find('.content-box').removeClass('box-progress-bar-size');
        }
        else if (action === this.actions.style.removeStyleBoxSubformSize) {
            this.rootElement.find('.content-box').removeClass('box-subform-size');
        }
        else if (action === this.actions.style.removeStyleBoxCommentSize) {
            this.rootElement.find('.content-box').removeClass('box-comment-size');
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
        if (action === this.actions.style.addStyleBoxCurrent) {
            this.removeStyleElements(this.actions.style.removeStyleBoxCurrent);
            setTimeout(() => {
                element.find('[content-name]').show();
                element.addClass('border border-primary');
                element.addClass('content-box-active');
                element.addClass('content-box-current');            
            });
                    
          

        }
        else if (action === this.actions.style.addStyleBoxBrowseImgSize) {
            element.addClass('box-browse-img-size');
        }
        else if (action === this.actions.style.addStyleBoxBrowseVideoSize) {
            element.addClass('box-browse-video-size');
        }
        else if (action === this.actions.style.addStyleBoxBrowseFileSize) {
            element.addClass('box-browse-file-size');
        }
        else if (action === this.actions.style.addStyleBoxProgressBarSize) {
            element.addClass('box-progress-bar-size');
        }
        else if (action === this.actions.style.addStyleBoxSubformSize) {
            element.addClass('box-subform-size');
        }
        else if (action === this.actions.style.addStyleBoxCommentSize) {
            element.addClass('box-comment-size');
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
        else if (action === this.actions.style.addStyleBoxContentNote) {
            // element.find('#cke_note-area').css('z-index',10)
            // element.find('#cke_note-area').css('width',$('.note-area').outerWidth())
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
        this.removeStyleElements(this.actions.style.removeStyleBoxBrowseImgSize);
        this.removeStyleElements(this.actions.style.removeStyleBoxBrowseVideoSize);
        if (action === this.actions.toolbar.addInitalTool) {
            this.removeStyleElements(this.actions.toolbar.removeTool);
            htmlTootBar = '<div class="row content-toolbar toolbar-inital">'
                + '<div class="col-12">'
                + '<div class="row toolbar-picker">'
                + '<div class="col-3"><img id="text-area" src="assets/imgs/contentPage/text-area.svg"></div>'
                + '<div class="col-3"><img id="file-browse" src="assets/imgs/contentPage/image-picker.svg"> </div>'
                + '<div class="col-3"><img id="video-browse" src="assets/imgs/contentPage/video-camera.svg"> </div>'
                + '<div class="col-3"><img id="subform" src="assets/imgs/contentPage/subform.svg"> </div>'
                + '</div>'
                + '<div class="row toolbar-function">'
                + '<div class="col-12"><img id="trash" src="assets/imgs/contentPage/trash.svg"></div>'
                + '</div>'
                + '</div>'
                + '</div>';
            this.rootElement.find(element).append(htmlTootBar);
        }
        else if (action === this.actions.toolbar.addBrowseExamTool) {
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

        else if (action === this.actions.toolbar.addTextareaTool) {
            htmlTootBar = '<div class="row content-toolbar toolbar-textarea">'
                + '<div class="col-12">'
                + '</div>'
                + '</div>';
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
        else if (this.currentToolbar === this.actions.toolbar.addNote) {
            // htmlTootBar = '<img src="assets/imgs/contentPage/note-writing.svg"  class="rounded-circle">'
            // this.rootElement.find(element).html(htmlTootBar);
            this.handles(this.actions.event.handleNote, element);
        }
        this.handles(this.actions.event.handleToolbars, element);
    }
    private async addOptionToolBar() {
        let htmlOptionToolBar;
        if (this.currentToolbar === this.actions.toolbar.addTextareaTool || this.currentToolbar === this.actions.toolbar.templateDocTool) {
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
        else if (
            this.currentToolbar === this.actions.toolbar.addCreateSubformTool
            || this.currentToolbar === this.actions.toolbar.addCommentTool
            || this.currentToolbar === this.actions.toolbar.addBrowseLinkTool
            || this.currentToolbar === this.actions.toolbar.addBrowseExamTool
            || this.currentToolbar === this.actions.toolbar.addNote
            || this.currentToolbar === this.actions.toolbar.cancelTool) {
            htmlOptionToolBar =
                '<div class="row p-0 m-0 mt-3 option-cancle">'
                + '<div class="col-12 d-flex justify-content-center border-bottom">'
                + '<div class="form-group text-center">'
                + '<label >Action</label>'
                + '<div >'
                + '<img  class="option-action-trash" src="assets/imgs/contentPage/trash.svg">'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'

            this.rootOptionTool.html(htmlOptionToolBar)
            this.handles(this.actions.event.handleOptionTools);

        }
        else if (this.currentToolbar === this.actions.toolbar.addVideoTool) {

            // htmlOptionToolBar =
            //     '<div class="row p-0 m-0 mt-3 option-video">'
            //     + '<div class="col-12 d-flex justify-content-center border-bottom">'
            //     + '<div class="form-group text-center">'
            //     + '<label>Property</label>'
            //     + '<div class="custom-control custom-switch">'
            //     + '<input  type="checkbox" class="custom-control-input video-tracker" id="switch">'
            //     + '<label class="custom-control-label" for="switch">Must finish watching</label>'
            //     + '</div>'
            //     + '</div>'
            //     + '</div>'

            //     + '<div class="col-12 d-flex justify-content-center border-bottom">'
            //     + '<div class="form-group text-center">'
            //     + '<label>Action</label>'
            //     + '<div >'
            //     + '<img  class="option-action-trash" src="assets/imgs/contentPage/trash.svg">'
            //     + '</div>'
            //     + '</div>'
            //     + '</div>'

            //     + '</div>'
            // this.rootOptionTool.html(htmlOptionToolBar)
            // let targetVideo = this.videos.find((video) => video.parentId === this.currentBox.attr('id'))
            // if (targetVideo) {
            //     if (targetVideo.condition.isMustWatchingEnd) {
            //         $('.option-video').find('.video-tracker').prop('checked', true)
            //     }
            // }
            // this.handles(this.actions.event.handleOptionToolVideo);
        }

        else if (this.currentToolbar === this.actions.toolbar.addLinkTool) {

            htmlOptionToolBar =
                '<div class="row p-0 m-0 mt-3 option-link">'
                + '<div class="col-12 d-flex justify-content-center border-bottom">'
                + '<div class="form-group text-center w-70">'
                + '<label>Property</label>'
               + '<input id="link-input-url" type="text" class="form-control text-center" placeholder="LinkName">'
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
            let targetLink = this.links.find((link)=>link.parentId === this.currentBox.attr('id'))
            if(targetLink){
                $('.option-link').find('#link-input-url').val(targetLink.name);
            }
            this.handles(this.actions.event.handleOptionToolLink);
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
            let targetExam = this.exams.find((exam)=>exam.parentId === this.currentBox.attr('id'))
            if(targetExam){
                $('.option-exam').find('#exam-input-title').val(targetExam.title);
                $('.option-exam').find('#exam-input-url').val(targetExam.name);
            }
            this.handles(this.actions.event.handleOptionToolExam);
        }


        else if (this.currentToolbar === this.actions.toolbar.addSubformTool) {
            let targetParentBox =  this.subForms.find(parentBox=>parentBox.parentBoxId === this.currentBox.attr('id'))
            let subformList = '';
            if(targetParentBox){
       
                targetParentBox.subformList.forEach((subform)=>{
                    if(subform.type === 'subform-link'){
                        subformList+= '<div class="form-group w-70 m-auto">';
                        subformList+= '<input data-subformid="'+subform.id+'" value="'+subform.linkName+'" type="text" class="form-control subform-input mt-2"  placeholder="Document Name">';
                        subformList+= '</div>';
                    }
                })
            }
            htmlOptionToolBar =
                '<div class="row p-0 m-0 mt-3 option-subform">'
                + '<div class="col-12 d-flex justify-content-center border-bottom">'
                + '<div class="form-group text-center">'
                + '<label>Property</label>'
                // + '<div class="custom-control custom-switch">'
                // + '<input  type="checkbox" class="custom-control-input subform-tracker" id="switch">'
                // + '<label class="custom-control-label" for="switch">Track Progress</label>'
                // + '</div>'
                + subformList
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
            // let targetSubform = this.documentTrack.contents.find((content) => content.parentId === this.currentBox.attr('id'))
            // if (targetSubform) {
            //     if (targetSubform.isTrackProgress) {
            //         $('.option-subform').find('.subform-tracker').prop('checked', true)
            //     }
            // }
            this.handles(this.actions.event.handleOptionToolSubform);
        }
        else if (this.currentToolbar === this.actions.toolbar.addToDoListTool) {
            let targetToDoListIndex = this.toDoLists.findIndex(toDoList => toDoList.parentId === this.currentBox.attr('id'))
            let taskList = "";
            if (targetToDoListIndex >= 0) {
                this.toDoLists[targetToDoListIndex].toDoListOrder.forEach(order => {
                    taskList += '<div data-boxId="' + this.currentBox.attr('id') + '"  id="' + order.id + '" data-taskName="' + order.name + '" class="rounded-0 list-group-item border-0 pl-4 cursor-pointer"><p data-taskId="'+order.id+'" class="taskList-text" contenteditable="true"> Step ' + order.step + ' : ' + order.name
                    +'</p><div data-taskId="'+order.id+'" class="float-right ml-3 taskList-trash"><img id="trash" src="assets/imgs/contentPage/trash.svg"></div></div>';
                });

            }

            // this.toDoLists.forEach((toDoList)=>{
            //     toDoList.
            // })
            // let taskLength= ($('.option-toDoList').find('.toDoList-taskList').find('.list-group-item').length + 1) 
            // let task = '<div data-boxId="'+this.currentBox.attr('id')+'"  id="taskList-'+taskLength +'" data-taskName="' + taskName + '" class="rounded-0 list-group-item border-0 pl-4 cursor-pointer"> Step ' + taskLength + ' : ' + taskName + '</div>';
            // if (taskName) {
            //     $('.option-toDoList').find('.toDoList-taskList').append(task);
            //     this.handles(this.actions.event.handleOptionToolToDoList)
            // }

            // htmlOptionToolBar=+ '</div>'

            htmlOptionToolBar =
                '<div class="row p-0 m-0 mt-3 option-toDoList">'
                + '<div class="col-12">'
                + '<div class="row p-0 m-0">'
                + '<div class="col-1">'
                + '</div>'
                + '<div class="col-8 item-middle">'
                + '<input id="toDoList-inputTask" type="text" class="form-control " placeholder="ToDoList...">'
                + '</div>'
                + '<div class="col-3 item-middle toDoList-btnPlus">'
                + '<img src="assets/imgs/contentPage/optionTool/plus.svg">'
                + '</div>'
                + '<div class="col">'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<div class="col-12 mt-3">'
                + '<div class="border border-left-0 border-right-0 toDoList-taskList-text d-flex align-items-center"><p class="pl-3">Task List</p></div>'
                + '<div class="list-group text-left toDoList-taskList">'
                + '</div>'
                + '<div class="border border-left-0 border-right-0 toDoList-componentList-text d-flex align-items-center"><p class="pl-3">Component List</p></div>'
                + '<div class="list-group text-left toDoList-componentList">'
                + '</div>'
                + '</div>'
                + '<div class="col-12 mt-3">'
                + '<div class="border border-left-0 border-right-0 toDoList-label-text d-flex align-items-center"><p class="pl-3">Action</p></div>'
                + '<div class="list-group toDoList-trash">'
                + '<img  class="option-action-trash m-auto" src="assets/imgs/contentPage/trash.svg">'
                + '</div>'
                + '</div>'
                + '</div>'
            this.rootOptionTool.html(htmlOptionToolBar)
            if (taskList) {
                $('.option-toDoList').find('.toDoList-taskList').append(taskList);
                let targetBox = this.currentSelectTaskList.find((box) => box.boxId === this.currentBox.attr('id'))
                if (targetBox) {
                    $('.option-toDoList').find('.toDoList-taskList').find('#' + targetBox.taskId).addClass('task-active')
                    this.createData(this.actions.data.createToDoListBoxList)
                    let listBox = '';
                    this.toDoListBoxList.forEach((box, index) => {
                        listBox += '<input data-taskId="' + targetBox.taskId + '" type="checkbox" value="' + box.id + '" id="compontentList-box-' + box.id + '" />';
                        listBox += '<label class="list-group-item border-top-0 border-left-0 border-right-0" for="compontentList-box-' + box.id + '">' + box.name + '(' + box.boxTypeName + ')' + '</label>';
                    });

                    if (listBox) {
                        $('.option-toDoList').find('.toDoList-componentList').html(listBox);
                    }

                    let targetTodoListIndex = this.toDoLists.findIndex(parentBox => parentBox.parentId === this.currentBox.attr('id'))
                    let targetIndexTodoOrder = this.toDoLists[targetTodoListIndex].toDoListOrder.findIndex((order) => order.id === targetBox.taskId);
                    this.toDoLists[targetTodoListIndex].toDoListOrder[targetIndexTodoOrder].objectTodoList.forEach((object) => {
                        $('.option-toDoList').find('.toDoList-componentList').find('input[type="checkbox"]').each((index, element) => {
                            if (object.id === $(element).val()) {
                                $(element).prop('checked', true);
                            }
                        });
                    })
                }
            }
            this.handles(this.actions.event.handleOptionToolToDoList);

        }
        else if (this.currentToolbar === this.actions.toolbar.addProgressBarTool) {
            let listBox = '';
            //let targetProgressBar = this.progressBars.find((parentBox)=>parentBox.parentId === this.currentBox.attr('id'))
            this.createData(this.actions.data.createProgressBoxList)
            this.progressBoxList.forEach((box, index)=>{
                listBox += '<input  type="checkbox" value="' + box.id + '" id="compontentList-box-' + box.id + '" />';
                listBox += '<label class="list-group-item border-0" for="compontentList-box-' + box.id + '">' + box.name + '(' + box.boxTypeName + ')' + '</label>';
            })
            htmlOptionToolBar =
            '<div class="row p-0 m-0 mt-3 option-progressBar">'
            + '<div class="col-12 mt-3">'
            + '<div class="border border-left-0 border-right-0 progressBar-componentList-text d-flex align-items-center"><p class="pl-3">Component List</p></div>'
            + '<div class="list-group text-left progressBar-componentList"></div>'
            + '</div>'
            + '<div class="col-12 mt-3">'
            + '<div class="border border-left-0 border-right-0 progressBar-label-text d-flex align-items-center"><p class="pl-3">Action</p></div>'
            + '<div class="list-group progressBar-trash">'
            + '<img  class="option-action-trash m-auto" src="assets/imgs/contentPage/trash.svg">'
            + '</div>'
            + '</div>'
            + '</div>'
            this.rootOptionTool.html(htmlOptionToolBar)
            if (listBox) {
                $('.option-progressBar').find('.progressBar-componentList').html(listBox);
            }    
            $('.option-progressBar').find('.progressBar-componentList').find('input[type="checkbox"]').each((index,element)=>{
                let targetProgressBarIndex  =  this.progressBars.findIndex(progressBar=>progressBar.parentId  === this.currentBox.attr('id'));
                if(targetProgressBarIndex>=0){
                   if(this.progressBars[targetProgressBarIndex].contentList.find(content=>content.parentId === $(element).val().toString())){
                         $(element).prop('checked',true);
                    // let progressBarContentObj  =  new  ProgressBarContentObjectModel();
                    // progressBarContentObj.parentId =  $(element.currentTarget).val().toString();
                    // this.progressBars[targetProgressBarIndex].contentList.push(progressBarContentObj)
                   }
                }

            });
 
            this.handles(this.actions.event.handleOptionToolProgressBar);

        }


    }
    private setCurrentBox(element?) {
        if (element) {
            this.currentBox =  this.contentDCtrlService.currentBox =  element;
        } else {
            this.currentBox = this.contentDCtrlService.currentBox = $(this.rootElement).find('.content-box-current');
        }
        this.addStyleElements(this.actions.style.addStyleBoxCurrent,this.currentBox)
        
        let targetContent  = ContentRouting.routes.find((content)=>content.contentName === this.currentBox.find('[content-name]').attr('content-name'))
        if(targetContent){
            this.rootOptionTool.html(this.createContentOption(targetContent.option))
        }
        // let targetOption =  this.currentBox.find('[name="section-option"]');
        // console.log("targetOption",targetOption)
        // this.rootOptionTool.html(targetOption)
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
    private saveDocument(nameDocument: string, eventAction?: string) {
        this.createData(this.actions.data.createChildDocument);
        this.documentService.captureHTML('contentTemplate' ).subscribe((imgData) => {
            this.createData(this.actions.data.createDataToSave).then(() => {

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
                let contents = this.contentDCtrlService.poolContents;
                let otherDetail:OtherDetailModel = new OtherDetailModel();
                otherDetail.screenDevDetail.height = this.contentTemplateSize.height;
                otherDetail.screenDevDetail.width = this.contentTemplateSize.width;
                otherDetail.rulerDevDetail = this.rulerDetail;

                let saveobjectTemplate: DocumentModel = {
                    userId:Constants.common.user.id,
                    nameDocument: nameDocument,
                    previewImg: imgData,
                    id: this.commonService.getPatternId(nameDocument), html: this.rootElement.html(),
                    status: Constants.common.message.status.created.text,
                    contents: contents,
                    otherDetail:otherDetail
                }
                let saveobjectNavTemplate: DocumentNavigatorModel = {
                    userId:Constants.common.user.id,
                    id: this.commonService.getPatternId(nameDocument),
                    nameDocument: nameDocument,
                    previewImg: imgData,
                    status: Constants.common.message.status.created.text,
                    childDocuments: this.childDocuments
                }
                let saveObjectTrackTemplate: DocumentTrackModel = {
                    userId:Constants.common.user.id,
                    id: this.commonService.getPatternId(nameDocument),
                    nameDocument: nameDocument,
                    status: Constants.common.message.status.created.text,
                    isTrackProgress: this.documentDataService.documentTrack.contents.length > 0 ? true : false,
                    progress: this.findData(this.actions.data.findProgressDocumentTrack),
                    contents: this.documentDataService.documentTrack.contents
                }
                console.log("saveobjectTemplate==>",saveobjectTemplate);
                console.log("saveObjectTrackTemplate==>",saveObjectTrackTemplate);
                // this.documentService.uploadFile(this.files).subscribe((status)=>{
                  
                        this.documentService.saveDocument(nameDocument, saveobjectTemplate).subscribe((status) => {
                            if (status === Constants.common.event.load.success) {
                                this.documentService.saveDocumentNav(nameDocument, saveobjectNavTemplate).subscribe((status) => {
                                    this.documentService.saveDocumentTrack(nameDocument, saveObjectTrackTemplate).subscribe((status) => {
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
                    isEmpty: true,
                    contentType: this.currentContentType.name
                });
            }
        }
    }
    private findData(action: string, element?): any {
        if (action === this.actions.data.findIndexBoxData) {
            return this.boxes.findIndex(box => box.id === element.attr('id'));
        }
        else if(action === this.actions.data.findProgressDocumentTrack){  
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
            return this.documentDataService.documentTrack.contents.length > 0 ? 0:100;
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
  
            this.contentDCtrlService.poolContents =  results.contents;
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
            return new Promise(async (resolve,reject)=>{
                let updateAction:UpdateContentModel = new UpdateContentModel()
                updateAction.actionCase  = Constants.common.event.save.document;
                this.contentDCtrlService.updateContent = updateAction

                await this.rootElement.find('.content-box ').find('[content-name = "textarea-content"]').each((index,event)=>{
                    let targetIndexTextArea = this.contentDCtrlService.poolContents.textAreas.findIndex((textarea) => textarea.parentId === $(event).parents('.content-box').attr('id'));
                    if(targetIndexTextArea >=0){
                        this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].value = $(event).text().toString();
                        this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].html = $(event).html();
                    }
                })


                this.rootElement.find('.content-box').removeClass('ui-resizable');
                this.rootElement.find('.content-box').find('.ui-resizable-handle').remove();
                this.rootElement.find('.content-box').removeClass('.ui-draggable ui-draggable-handle');
                this.rootElement.find('.content-box').find('.content-box').css('cursor', 'default');
                this.rootElement.find('.content-box').find('.content-box').removeClass('content-box-current');
                this.rootElement.find('.content-box').find('.content-box-label').hide();
                this.rootElement.find('.content-box').removeClass('content-box-active border border-primary');
                this.rootElement.find('.content-box').css('border', 'hidden');

                // console.log("xxxx",this.rootElement.find('.content-box').find('[content-name]'))
                this.rootElement.find('.content-box').find('[content-name]').html(null)


                // CKEDITOR.instances[this.documentDataService.nameTemplate].destroy()
                
                resolve(Constants.common.message.status.success.text)
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
                        boxTypeName:boxTypeName,
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
                        boxTypeName:boxTypeName,
                    });
                }
            })
        }
        else if (action === this.actions.data.createDocumentTrack) {
            if(this.currentBox&&this.boxes.length >0){
                let targetBox = this.boxes.find(box=>box.id=== this.currentBox.attr('id'));

                if(targetBox &&
                    (targetBox.boxType === this.boxType.boxSubform||
                    targetBox.boxType === this.boxType.boxVideo || 
                    targetBox.boxType === this.boxType.boxExam
                    )
                    &&  !this.documentTrack.contents.find(content=>content.parentId ===targetBox.id )
                ){
                    let documentTrackContent = new DocumentTrackContent;
                    documentTrackContent.parentId  = this.currentBox.attr('id');
                    documentTrackContent.name  = this.currentBox.attr('name');
                    documentTrackContent.id = this.currentBox.find('[id^="'+this.currentBox.attr('id')+'-"]').attr('id');
                    documentTrackContent.progress= 0;
                    if(this.currentBox.hasClass(this.boxType.boxVideo)){
                        documentTrackContent.conditions.videoCondition.isMustWatchingEnd = false;
                        documentTrackContent.conditions.videoCondition.isClickPlay = false;
                    }
                    else if(this.currentBox.hasClass(this.boxType.boxSubform)){
                        documentTrackContent.conditions.subformCondition.haveInDoList = false;
                        // documentTrackContent.conditions.subformCondition.haveInProgressBar = false;
                        let targetSubform =  this.currentBox.find('#'+documentTrackContent.id);
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
                        // documentTrackContent.conditions.subformCondition.isClickLink
                    }
                    else if(this.currentBox.hasClass(this.boxType.boxExam)){
                        documentTrackContent.conditions.examCondition.isSubmitted = false;

                    }
                    documentTrackContent.contentType  = targetBox.boxType;
        
                    this.documentTrack.contents.push(documentTrackContent);
                    console.log(this.documentTrack.contents);
                }
   
                
            }
      
        }

    }
    private async updateData(action: string, element?: JQuery<Element>) {
        if(action === this.actions.data.updateNavigatorData){
            let targetDocNavIndex = this.documentDataService.documentNavList.findIndex((docNav)=>docNav.nameDocument ===  this.documentDataService.currentDocumentNav);
            if(targetDocNavIndex>=0){
                this.documentDataService.documentNavList[targetDocNavIndex].childDocuments = this.childDocuments;
                this.eventToParent.emit({ action: Constants.common.event.click.update, data: 'updateDocNav' })
            }

        }
    }
    private removeData(action: string, element?: any) {
        if (action === this.actions.data.removeAllContentObj) {
            this.boxes = new Array<BoxContentModel>();
            this.textAreas = new Array<TextAreaContentModel>();
            this.imgs = new Array<ImgContentModel>();
            this.videos = new Array<VideoContentModel>();
            this.subForms = new Array<SubFormContentModel>();
            this.comments = new Array<commentContentModel>();
            this.progressBars = new Array<ProgressBarContentModel>();
            this.toDoLists = new Array<ToDoListContentModel>();
            this.links =  new Array<LinkContentModel>();
            this.exams  = new  Array<ExamContentModel>();
            this.notes  = new Array<NoteContentModel>();
        }
        else if (action === this.actions.data.removeAllContentObj) {


        }
        else if (action === this.actions.data.removeBoxData) {
            let currentBoxId = this.currentBox.attr('id');
            this.boxes = this.boxes.filter((box) => box.id !== currentBoxId);
            if (this.currentBox.hasClass(this.boxType.boxComment)) {
                this.comments = this.comments.filter((comment) => comment.id !== currentBoxId + '-comment');
            }
            else if (this.currentBox.hasClass(this.boxType.boxImg)) {
                this.imgs = this.imgs.filter((img) => img.id !== currentBoxId + '-img');
            }
            else if (this.currentBox.hasClass(this.boxType.boxProgressBar)) {
                this.progressBars = this.progressBars.filter((progressBar) => progressBar.id !== currentBoxId + '-progressBar');
            }
            else if (this.currentBox.hasClass(this.boxType.boxSubform)) {
                this.removeData(this.actions.data.removeNavigatorData);
                this.subForms = this.subForms.filter((subform) => subform.parentBoxId !== currentBoxId);
            }
            else if (this.currentBox.hasClass(this.boxType.boxTextarea)) {
                this.textAreas = this.textAreas.filter((textArea) => textArea.id !== currentBoxId + '-textArea');
            }
            else if (this.currentBox.hasClass(this.boxType.boxToDoList)) {
                this.toDoLists = this.toDoLists.filter((toDoList) => toDoList.id !== currentBoxId + '-todoList');
            }
            else if (this.currentBox.hasClass(this.boxType.boxVideo)) {
                this.videos = this.videos.filter((video) => video.id !== currentBoxId + '-video');
            }
            else if (this.currentBox.hasClass(this.boxType.boxFile)) {
                this.files = this.files.filter((file) => file.id !== currentBoxId + '-file');
            }
            else if (this.currentBox.hasClass(this.boxType.boxLink)) {
                this.links = this.links.filter((link) => link.id !== currentBoxId + '-link');
            }
            else if (this.currentBox.hasClass(this.boxType.boxExam)) {
                this.exams = this.exams.filter((exam) => exam.id !== currentBoxId + '-exam');
            }
            else if (this.currentBox.hasClass(this.boxType.boxNote)) {
                this.notes = this.notes.filter((note) => note.id !== currentBoxId + '-note');
            }
            this.removeData(this.actions.data.removeDocumentTrackData);
            this.removeData(this.actions.data.removeObjInTodoList);
            this.removeData(this.actions.data.removeObjInProgressBar);
            
        }
        else if(action === this.actions.data.removeObjInTodoList){
            this.toDoLists.forEach((parentBox)=>{
                parentBox.toDoListOrder.forEach((task)=>{
                    task.objectTodoList = task.objectTodoList.filter((content)=>content.id != this.currentBox.attr('id'))
                })

            })

        }
        else if(action === this.actions.data.removeDocTrackProgress){
            this.documentDataService.documentTrack.contents.forEach((content)=>{
                content.progress = 0;
                if(content.contentType === this.contentType.subform){
                    content.conditions.subformCondition.isClickLinks.forEach((link)=>{
                        link.isClicked = false;
                        link.progress = 0;
                    })
                    // content.conditions.subformCondition.haveInDoList = false;
                    content.progress = 0;
                }
                else if(content.contentType === this.contentType.video){
                    content.data = 0;
                    content.conditions.videoCondition.isClickPlay = false;
                   
                }
            })
            this.contentDCtrlService.poolContents.videos.forEach((video)=>{
                video.data.progress = 0;
            })
            this.contentDCtrlService.poolContents.todoList.forEach((todoList,index)=>{
                todoList.progress = 0;
                todoList.toDoListOrder.forEach((taskList,taskIndex)=>{
                    taskList.objectTodoList.forEach((objectTodo)=>{
                        objectTodo.progress = 0
                    })
                });    
            });
            console.log(this.contentDCtrlService.poolContents.todoList)
            console.log(this.documentDataService.documentTrack.contents)
        }
        else if(action === this.actions.data.removeDocumentTrackData){
            this.documentTrack.contents  = this.documentTrack.contents.filter((content)=>content.parentId !== this.currentBox.attr('id')); 
        }  

        else if(action === this.actions.data.removeObjInProgressBar){
            this.progressBars.forEach((parentBox)=>{
                parentBox.contentList = parentBox.contentList.filter((content)=>content.parentId !== this.currentBox.attr('id'))

            }); 
        }  
        else if(action === this.actions.data.removeNavigatorData){
            let targetSubform = this.subForms.find((parentBox)=>parentBox.parentBoxId === this.currentBox.attr('id'))
            if(targetSubform){
                targetSubform.subformList.forEach((subform)=>{
                    this.childDocuments = this.childDocuments.filter((childDoc)=>childDoc.id !==  subform.id);
                })
                this.updateData(this.actions.data.updateNavigatorData);
            }
        }

    }
    public eventFromChild(eventChild: TriggerEventModel) {
        console.log(eventChild)
        if (eventChild.action === 'range-slider-event') {
            let rulerDetail:RulerDetailModel = this.rulerDetail =  eventChild.data;
            if(rulerDetail.paddingLeft<0){
                rulerDetail.paddingLeft = 0;
            }
            $(this.contentTemplate.nativeElement).css('padding-left',rulerDetail.paddingLeft+ "%")
            $(this.contentTemplate.nativeElement).css('padding-right',(100-rulerDetail.paddingRight)+ "%")
            $('.content-box').each((index,element)=>{
               
               
                if(($(element).position().left+$(element).outerWidth()) > $(this.contentTemplate.nativeElement).width()){
                    $(element).css('left', $(this.contentTemplate.nativeElement).width()-$(element).outerWidth())
                }
                else if( ($(this.contentTemplate.nativeElement).position().left + parseInt($(this.contentTemplate.nativeElement).css('padding-left'))) > $(element).position().left ){
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
    public createContent(componnent:Type<any>,contentName:string){
 
        if(contentName){
            this.documentDataService.lifeCycle = Constants.document.lifeCycle.createContent;
            const newElement = document.createElement(contentName) as NgElement & WithProperties<{parentBox: JQuery<Element>,lifeCycle:string}>;
            newElement.setAttribute('content-name',contentName)
            newElement.classList.add("full-screen");
            newElement.parentBox  =this.currentBox;
            this.render.appendChild(document.getElementById(this.currentBox.attr('id')),newElement)
        
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
    public createContentOption(Componnent:Type<any>){
        if(Componnent){
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Componnent)
            const viewContainerRef = this.adHost.viewContainerRef;
            const componentRef = viewContainerRef.createComponent(componentFactory);
            (<ContentInterFace>componentRef.instance).parentBox  = this.currentBox;
            return componentRef.location.nativeElement;
        }

    }

    private defineComponent() {
      
        
        ContentRouting.routes.forEach((route)=>{
            const customElement = createCustomElement(route.component, { injector:this.injector });
            customElements.get(route.contentName) || customElements.define(route.contentName, customElement)

             
            
        //    console.log(this.adHost.viewContainerRef.gets())
            // this.contentTemplate.nativeElement.createElement(route.contentName)
            // document.createElement(route.contentName)
        })
        
        // let updateAction:UpdateContentModel = new UpdateContentModel()
        // updateAction.actionCase  = Constants.common.event.load.component;
        // this.contentDCtrlService.updateContent = updateAction
    
        
    }
}
