import { Component, OnInit, AfterContentInit, ViewEncapsulation, ViewChild, ElementRef, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { catchError, mergeMap, toArray, map } from 'rxjs/operators';
import { Observable, of, Subject, empty, fromEvent, VirtualTimeScheduler } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { BoxContentModel } from 'src/app/models/document/elements/box-content.model';
import { CommonService } from '../../../../services/common/common.service';
import { DocumentModel } from 'src/app/models/document/content.model';
import { TextAreaContentModel } from '../../../../models/document/elements/textarea-content.model';
import { ImgContentModel } from 'src/app/models/document/elements/img-content.model';
import { VideoContentModel, VideoConetentDataModel } from 'src/app/models/document/elements/video-content.model';
import { DocumentService } from 'src/app/services/document/document.service';
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';
import Splitting from 'splitting';
import { TriggerEventModel, DocumentNavigatorModel } from 'src/app/models/document/document.model';
import { SubFormContentModel } from '../../../../models/document/elements/subForm-content.model';
import { ScreenDetailModel } from '../../../../models/general/general.model';
import { DocumentDataControlService } from '../../../../services/document/document-data-control.service';
import { element } from 'protractor';
import html2canvas from 'html2canvas';
declare var electron: any;
declare var rangy: any;
declare var CKEDITOR:any;
declare var Wistia:any;
@Component({
    selector: 'create-content-page',
    templateUrl: 'create-content-page.component.html',
    styleUrls: ['create-content-page.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class CreateContentPageComponent implements OnInit, AfterViewInit {
    @ViewChild('contentTemplate', { static: true }) contentTemplate: ElementRef;
    @ViewChild('contentOptionTool', { static: true }) contentOptionTool: ElementRef;
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
    public currentElementTool: any;
    public currentSubFormType = { id: 'subform-silde', name: 'silde' };
    public contentTypes = Constants.document.contents.types;
    public toolTypes = Constants.document.tools.types;
    public rootElement: JQuery<Element>;
    public templateDoc: JQuery<Element>;
    public rootOptionTool: JQuery<Element>;
    public boxType = {
        boxInitial: 'box-intial',
        boxTextarea: 'box-textarea',
        boxBrowseFile: 'box-browse-file',
        boxImg: 'box-img',
        boxVideo: 'box-video',
        boxBrowseVideo: 'box-browse-video',
        boxSubform: 'box-subform',
        boxAddSubform: 'box-add-subform',
    };
    public actions = {
        event: {
            addElBox: 'addElBox',
            addElTextArea: 'addElTextArea',
            addElBrowseFile: 'addElBrowseFile',
            addElBrowseVideo: 'addElBrowseVideo',
            addElSubForm: 'addElSubForm',
            addEventBox: 'addEventBox',
            addSubForm: 'addSubForm',
            addStyleBoxBrowseSize: 'addStyleBoxBrowseSize',
            dropTool: 'dropTool',
            handleCurrentBox: 'handleCurrentBox',
            handleAttachFileModal: 'handleAttachFileModal',
            handleDragBoxes: 'handleDragBoxes',
            handleToolbars: 'handleToolbars',
            handleBrowseFile: 'handleBrowseFile',
            handleBrowseVideo: 'handleBrowseVideo',
            handleSubForm: 'handleSubForm',
            handleTemplateDoc: 'handleTemplateDoc',
            handleWistia: 'handleWistia',
            handleOptionTool: 'handleOptionTool',
            removeElBox: 'removeElBox',
            removeContent: 'removeBoxContent',
            removeForPreviewSubForm: 'removeForPreviewSubForm',
        },
        data: {
            addBoxData: 'addBoxData',
            addTextAreaData: 'addTextAreaData',
            addImgData: 'addImgData',
            createDataToSave: 'createDataToSave',
            createNavigatorData: 'createNavigatorData',
            retrieveBoxData: 'retrieveBoxData',
            retrieveTextAreaData: 'retrieveTextAreaData',
            removeAllContentObj: 'removeAllContentObj',
            findIndexBoxData: 'findIndexBoxData',
            findEmptyData: 'findEmptyData'
        },
        toolbar: {
            templateDocTool: 'templateDocTool',
            addInitalTool: 'addInitalTool',
            addTextareaTool: 'addTextareaTool',
            addBrowseFileTool: 'addBrowseFileTool',
            addBrowseVideoTool: 'addBrowseVideoTool',
            addSubform: 'addSubform',
            addVideoTool: 'addVideoTool',
            removeTool: 'removeTool',
            cancelTool: 'cancelTool'
        },
        style:{
            addOptionStyle:'addOptionStyle',
            removeAllStyleBoxCurrent:'removeAllStyleBoxCurrent',
            addStyleBoxCurrent: 'addStyleBoxCurrent',
            removeStyleBorderBox: 'removeStyleBorderBox',
            removeStyleBoxCurrent: 'removeStyleBoxCurrent',
            removeStyleBoxActive: 'removeStyleBoxActive',
            removeStyleBoxBrowseFileSize: 'removeStyleBoxBrowseSize',
            removeStyleBoxBrowseVideoSize: 'removeStyleBoxBrowseVideoSize',
            removeStyleBoxType: 'removeStyleBoxType',
        },
        option: {
            removeOptionTool: 'removeOptionTool',
        },
        template:{
            document:'document'
        }
    };
    public boxes: BoxContentModel[] = new Array<BoxContentModel>();
    public textAreas: TextAreaContentModel[] = new Array<TextAreaContentModel>();
    public imgs: ImgContentModel[] = new Array<ImgContentModel>();
    public videos: VideoContentModel[] = new Array<VideoContentModel>();
    public subForms: SubFormContentModel[] = new Array<SubFormContentModel>();

    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private documentDataService: DocumentDataControlService,
    ) { }
    ngOnInit() {
        this.contentElement.subscribe((result) => {
           this.rootElement.append(result.html);
           this.setTemplate(this.actions.template.document);
            this.addElements(this.actions.event.addEventBox).then(() => {
                this.removeData(this.actions.data.removeAllContentObj);
                this.retrieveData(this.actions.data.addBoxData, result);
                this.retrieveData(this.actions.data.addTextAreaData, result);
                this.retrieveData(this.actions.data.addImgData, result);
            });
        });
        this.contentTypeSelected.subscribe((contentType) => {
            this.currentContentType = contentType;
            this.addElements(this.actions.event.addElBox);
        });
        this.dropElement.subscribe((tool) => {
            
            if (tool.action === this.actions.event.dropTool) {
                this.currentContentType = this.contentTypes.freedomLayout;
                if (tool.data.toolType === this.toolTypes.videoBrowse.name) {
                    this.setCurrentToolbar(this.actions.toolbar.addBrowseVideoTool);
                }
                else if (tool.data.toolType === this.toolTypes.fileBrowse.name) {
                    this.setCurrentToolbar(this.actions.toolbar.addBrowseFileTool);
                }
                else if (tool.data.toolType === this.toolTypes.subform.name) {
                    this.setCurrentToolbar(this.actions.toolbar.addSubform);
                }
                else if (tool.data.toolType === this.toolTypes.textArea.name) {
                    this.setCurrentToolbar(this.actions.toolbar.addTextareaTool);
                }
                this.currentElementTool = tool.data.element;
                this.addElements(this.actions.event.addElBox, null, this.actions.event.dropTool)
                //remove tranfer img icon to ckeditor
                //if(this.rootElement.find('p').find('img'))
                //this.rootElement.find('p').find('img').remove();
                this.rootElement.find('.template-doc').find('p').find('img').unwrap().remove();
          
            }
        })
        this.triggerElement.subscribe((event) => {
            if (event.action === Constants.general.event.click.add) {
                this.addElements(this.actions.event.addElBox).then(() => {
                    this.addElements(this.actions.style.addStyleBoxCurrent, this.currentBox);
                });
            } else if (event.action === Constants.general.event.click.save) {
                this.saveDocument(event.data, Constants.general.event.click.save);
            } else if (event.action === Constants.general.event.click.new) {
                // this.removeData(this.contents.data.removeAllContentObj);
                // this.rootElement.html(null);
                this.saveDocument(event.data, Constants.general.event.click.new);
            }

        });
    }
    ngAfterViewInit() {
        this.rootElement = $(this.contentTemplate.nativeElement);
        this.rootOptionTool = $(this.contentOptionTool.nativeElement);
        this.setEditor();
        let contentSize: ScreenDetailModel = new ScreenDetailModel();
        this.setCurrentToolbar(this.actions.toolbar.templateDocTool);
        this.addOptionToolBar();
        contentSize.height = $('.content-template').outerHeight();
        contentSize.width = $('.content-template').outerWidth();
        localStorage.setItem('contentSize', JSON.stringify(contentSize))
    }
    private setTemplate(action){
        if(action === this.actions.template.document){
            this.documentDataService.nameTemplate  = 'template-doc';
           $('#template-doc').focus();
           this.handles(this.actions.event.handleTemplateDoc, $('.template-doc'));
        }
    }
    private setEditor(){
        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline( 'template-doc' );
        CKEDITOR.in
        // CKEDITOR.on('instanceReady',  (ev)=> {  
        //     $('#'+ ev.editor.id + '_top').css('display','none')
        //  });
    }
    private async addElements(action: string, element?: any, subaction?: string, subElement?: any ,data?:any) {
        if (action === this.actions.event.addElBox || action === this.actions.event.addEventBox) {
            if (action === this.actions.event.addElBox) {
                const numberOfBox = this.rootElement.find('.content-box').length;
                if (this.currentContentType.name === this.contentTypes.freedomLayout.name) {
                    this.rootElement.append('<div style="z-index:999" id=box-' + numberOfBox + ' class="content-box ' + this.boxType.boxInitial + ' freedom-layout"></div>');
                    $('[id="box-' + numberOfBox + '"]').css('position', 'absolute');
                    if (subaction === this.actions.event.dropTool) {
                        setTimeout(() => {
                            if ($('[id="box-' + numberOfBox + '"]').outerWidth() + this.currentElementTool.layerX > this.rootElement.outerWidth()) {
                                $('[id="box-' + numberOfBox + '"]').css('left', this.currentElementTool.layerX - $('[id="box-' + numberOfBox + '"]').outerWidth())
                            } else {
                                $('[id="box-' + numberOfBox + '"]').css('left', this.currentElementTool.layerX)
                            }
                            if ($('[id="box-' + numberOfBox + '"]').outerHeight() + this.currentElementTool.layerY > this.rootElement.outerHeight()) {
                                if (this.currentElementTool.layerY - $('[id="box-' + numberOfBox + '"]').outerHeight() < 0) {
                                    $('[id="box-' + numberOfBox + '"]').css('top', this.currentElementTool.layerY)
                                } else {

                                    $('[id="box-' + numberOfBox + '"]').css('top', this.currentElementTool.layerY - $('[id="box-' + numberOfBox + '"]').outerHeight())
                                }

                            } else {
                                $('[id="box-' + numberOfBox + '"]').css('top', this.currentElementTool.layerY)
                            }
                        });
                    } else {
                        setTimeout(() => {
                            $('[id="box-' + numberOfBox + '"]').css('top', this.commonService.calPositionCenter(this.rootElement, $('[id="box-' + numberOfBox + '"]')).top);
                            $('[id="box-' + numberOfBox + '"]').css('left', this.commonService.calPositionCenter(this.rootElement, $('[id="box-' + numberOfBox + '"]')).left);
                        });
                    }
                    $('[id="box-' + numberOfBox + '"]').css('width', Constants.general.element.css.box.width);
                    $('[id="box-' + numberOfBox + '"]').css('height', Constants.general.element.css.box.height);
                } else if (this.currentContentType.name === this.contentTypes.oneLayout.name) {
                    this.rootElement.append('<div style=""id=box-' + numberOfBox + ' class="content-box ' + this.boxType.boxInitial + ' one-layout"></div>');
                    $('[id="box-' + numberOfBox + '"]').css('cursor', 'default')
                    $('[id="box-' + numberOfBox + '"]').css('height', Constants.general.element.css.box.height)
                } else if (this.currentContentType.name === this.contentTypes.twoLayout.name) {
                    this.rootElement.append(
                        '<div class="row">' +
                        '<div class="col">' +
                        '<div style=""id=box-' + numberOfBox + ' class="content-box ' + this.boxType.boxInitial + '">' +
                        '</div>' +

                        '</div>' +
                        '<div class="col">' +
                        '<div style=""id=box-' + (numberOfBox + 1) + ' class="content-box ' + this.boxType.boxInitial + '">' +
                        '</div>' +
                        '</div>');
                }
                this.setCurrentBox();
                this.removeElements(this.actions.toolbar.removeTool);
                this.setCurrentBox($('#box-' + numberOfBox));
                this.addData(this.actions.data.addBoxData, 'box-' + numberOfBox);
                if (subaction === this.actions.event.dropTool) {
                    if (this.currentToolbar === this.actions.toolbar.addBrowseVideoTool) {
                        this.currentBox.addClass(this.boxType.boxBrowseVideo);
                    }
                    else if (this.currentToolbar === this.actions.toolbar.addBrowseFileTool) {
                        this.currentBox.addClass(this.boxType.boxBrowseFile);
                    }
                    else if (this.currentToolbar === this.actions.toolbar.addTextareaTool) {
                        this.currentBox.addClass(this.boxType.boxTextarea);
                        this.addElements(this.actions.event.addElTextArea, this.currentBox);
                    }
                    else if (this.currentToolbar === this.actions.toolbar.addSubform) {
                        this.currentBox.addClass(this.boxType.boxAddSubform);
                    }
                } else {
                    this.setCurrentToolbar();
                }
            }
            this.rootElement.find('.freedom-layout').draggable({
                containment: this.contentTemplate.nativeElement,
                stack: '.freedom-layout',
                scroll: true,
                start: ((event) => {
                    this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target) ,'startDrag');
                }),
                stop: ((event) => {
                    this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target) ,'endDrag');
                }),
            });

            this.rootElement.find('.content-box').resizable({
                handles: '',
            })
                .resizable({
                    handles: 'n, e, s, w, se, ne, sw, nw',
                    containment: this.contentTemplate.nativeElement,
                    start: ((event) => {
                        this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target) ,'startResize');
                    }),
                    stop: ((event) => {
                        this.addElements(this.actions.style.addStyleBoxCurrent, $(event.target) ,'endResize' );
                    }),
                });


            this.handles(this.actions.event.handleDragBoxes);
            this.handles(this.actions.event.handleCurrentBox);
            this.handles(this.actions.event.handleToolbars);
            this.handles(this.actions.event.handleBrowseFile, this.currentBox);
            this.addElements(this.actions.style.addStyleBoxCurrent, this.currentBox);
        } else if (action === this.actions.style.addStyleBoxCurrent) {
            this.setCurrentBox(element);
            this.addBoxCurrent(element);
            this.addBorderBox(element);
            // console.log(CKEDITOR.instances[this.documentDataService.nameTemplate])
           // CKEDITOR.instances[this.documentDataService.nameTemplate].setReadOnly(true);
            if(subaction === 'startDrag' || subaction === 'click' || subaction === 'startResize'){
                this.addBoxActive(element);
            }else{
                this.removeElements(this.actions.style.removeStyleBoxActive); 
            }
      
            this.setCurrentToolbar();
            const IndexBox = this.findData(this.actions.data.findIndexBoxData, element);
            if (IndexBox !== -1) {
                if (this.boxes[IndexBox].isEmpty) {
                    this.addToolBarBox(this.currentToolbar, element);
                }
            }
            this.addOptionToolBar();
     
        } 
        else if (action === this.actions.event.addElTextArea) {
            const IndexBox = this.findData(this.actions.data.findIndexBoxData, element);

            if (IndexBox !== -1) {
                this.boxes[IndexBox].isEmpty = false;
            }

            element.append('<textarea id="' + element.attr('id') + '-textarea" class="content-textarea"></textarea>');
            element.find('textarea').focus();
        } else if (action === this.actions.event.addElBrowseFile) {
            const reader = new FileReader();
            reader.onload = ((event: any) => {
                this.imgs.push({
                    id: element.attr('id') + '-img',
                    path: event.target.result
                });
                element.append('<img src="' + event.target.result + '" id="' + element.attr('id') + '-img" class="content-img"></img>');
            });
            reader.readAsDataURL(this.currentBrowseFile[0]);

        } else if (action === this.actions.event.addElBrowseVideo) {
            let streamData:VideoConetentDataModel  = data;
            if (subaction === 'videoSource') {
                const reader = new FileReader();
                reader.onload = ((event: any) => {
                    this.videos.push({
                        id: element.attr('id') + '-video',
                        data:streamData,
                        path: event.target.result
                    });
                    element.append('<video src="' + event.target.result + '" id="' + element.attr('id') + '-video" class="content-video" controls ></video>');
                });
                reader.readAsDataURL(this.currentBrowseFile[0]);
            } else if (subaction === 'youtube') {
                this.videos.push({
                    id: element.attr('id') + '-video',
                    data:streamData,
                    path: this.currentBrowseFile
                });
                element.append('<iframe src="' + this.currentBrowseFile + '" id="' + element.attr('id') + '-video" class="content-video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
            }
            else if (subaction === 'wistia') {
                element.append('<div  id="'+ element.attr('id') +'" class="content-video"><div class="wistia_responsive wistia_embed wistia_async_'+ this.currentBrowseFile +' full-screen">&nbsp;</div></div>')
                setTimeout(()=>{
                    let video = Wistia.api(streamData.streamId);
                    streamData.duration =  video.duration();
                    console.log($('.wistia_async_'+ this.currentBrowseFile))
                    // $('.wistia_async_'+ this.currentBrowseFile).css('pointer-events','none');
                    this.videos.push({
                        id: element.attr('id') + '-video',
                        data:streamData,
                        path: this.currentBrowseFile
                    });
                    this.handles(this.actions.event.handleWistia,element)
                },500)
            }
           
            // let wistiaObj = Wistia.api("bm82offozy")
            // console.log('wistiaObj',wistiaObj)
        }
        else if (action === this.actions.event.addElSubForm) {
            let htmlSubform = '';
            if (this.currentSubFormType.id === 'subform-link') {
                htmlSubform += '<ul class="list-group content-subform mt-3">';
                this.subForms.forEach((subform, index) => {
                    if (index == 0) {
                        htmlSubform += '<li class="cursor-pointer list-group-item rounded-0 border-left-0 border-right-0 border-top-0">' + subform.nameDocument + '</li>'
                    } else {
                        htmlSubform += '<li class="cursor-pointer list-group-item rounded-0 border-left-0 border-right-0">' + subform.nameDocument + '</li>'
                    }

                })
                htmlSubform += '</ul>';
            }
            else if (this.currentSubFormType.id === 'subform-silde') {
                htmlSubform += '<div  class="container p-0 full-screen">'
                htmlSubform += '<div  class="carousel slide full-screen" data-ride="carousel">'
                htmlSubform += '<ul class="carousel-indicators">'
                htmlSubform += '<li data-target="#demo" data-slide-to="0" class="active"></li>'
                htmlSubform += '<li data-target="#demo" data-slide-to="1"></li>'
                htmlSubform += '</ul>'
                htmlSubform += '<div class="carousel-inner full-screen overflow-auto">'

                this.subForms.forEach((subform, index) => {
                    let targetDocument = this.documentDataService.documentList.find((document) => document.id === subform.id);
                    if (targetDocument) {
                        htmlSubform += '<div  class="carousel-item active full-screen subform-preview">'
                        htmlSubform += '<img src="assets/imgs/documentPage/test.jpg">'
                        htmlSubform += '</div>'
                        htmlSubform += '<div  class="carousel-item  full-screen subform-preview">'
                        htmlSubform += '<img src="assets/imgs/documentPage/test1.jpg">'
                        htmlSubform += '</div>'
                    }
                });
                htmlSubform += '</div>'
                htmlSubform += '<div class="carousel-control-prev" data-slide="prev">'
                htmlSubform += '<span class="carousel-control-prev-icon cursor-pointer"></span>'
                htmlSubform += '</div>'
                htmlSubform += '<div class="carousel-control-next" data-slide="next">'
                htmlSubform += '<span class="carousel-control-next-icon cursor-pointer"></span>'
                htmlSubform += '</div>'
                htmlSubform += '</div>'
                htmlSubform += '</div>'
            }
            // element.css('display','initial');
            element.append(htmlSubform);
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
            this.removeElements(this.actions.event.removeForPreviewSubForm, element);

            this.rootElement.find('.content-box').find(".subform-preview").find('.content-box').each((index, contentBox) => {
                // let targetDocument = this.documentDataService.documentList.find((document) => document.id === subform.id);
                // this.retrieveData(this.contents.data.retrieveTextAreaData,)
                let oldScreen: ScreenDetailModel = JSON.parse(localStorage.getItem('contentSize'))
                this.commonService.calPositionForNewScreen(contentBox, oldScreen).subscribe((elementDetail) => {
                    $(contentBox).css('height', elementDetail.screenDetail.height + "%");
                    $(contentBox).css('width', elementDetail.screenDetail.width + "%");
                    $(contentBox).css('left', elementDetail.postitionDetail.left + "%");
                    $(contentBox).css('top', elementDetail.postitionDetail.top + "%");
                })
            });
        }
    }
    private handles(action: string, element?: any) {
        if (action === this.actions.event.handleCurrentBox) {
            this.rootElement.find('.content-box').click((event) => {
                if (event.target.id !== (this.currentBox && this.currentBox.attr('id')) || !this.currentBox) {
                    const elementFromId: any = this.currentElement = $('[id="' + event.target.id + '"]');
                    if (/-textarea/.test(event.target.id)) {
                        $(elementFromId).focus();
                        this.removeElements(this.actions.toolbar.removeTool);
                    }
                    if (event.target.id && !/-textarea/.test(event.target.id)) {
                        this.setCurrentBox(elementFromId);
                    } else {
                        this.setCurrentBox(elementFromId.parent());
                    }
                    this.currentBox.draggable({ disabled: true });
                    // this.addOptionToolBar();
                    this.addElements(this.actions.style.addStyleBoxCurrent, this.currentBox ,'click');
                    
                    // if (!this.currentBox.hasClass('content-box-current')) {
                    //     this.addElements(this.contents.event.addStyleCurrentBoxBefore, this.currentBox);
                    // } else {
                    //     this.addElements(this.contents.event.addStyleCurrentBoxAfter, this.currentBox);
                    // }

                }

            });
        } else if (action === this.actions.event.handleAttachFileModal) {
            element.modal('show');
        } else if (action === this.actions.event.handleDragBoxes) {
            if (this.commonService.isPlatform === Constants.platform.device) {
                this.rootElement.find('.freedom-layout').on('touchmove', (event) => {
                    this.rootElement.find('.freedom-layout').draggable({ disabled: false, cancel: '' });
                });
            } else {
                this.rootElement.find('.freedom-layout').mousemove(() => {
                    this.rootElement.find('.freedom-layout').draggable({ disabled: false, cancel: '' });
                });
            }
        } else if (action === this.actions.event.handleToolbars) {
            this.rootElement.find('.content-toolbar').click((event) => {
                event.stopPropagation();
                if (event.target.id === 'file-browse') {
                    this.setCurrentToolbar(this.actions.toolbar.addBrowseFileTool);
                    this.removeElements(this.actions.style.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxBrowseFile);
                    this.addToolBarBox(this.currentToolbar, this.currentBox);
                    // this.triggerElements(this.constants.event.triggerAttachFileModal, $('#attach-file-modal'));
                } else if (event.target.id === 'trash') {
                    this.removeElements(this.actions.event.removeElBox);
                } else if (event.target.id === 'text-area') {
                    this.removeElements(this.actions.style.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxTextarea);
                    this.setCurrentToolbar(this.actions.toolbar.addTextareaTool);
                    this.addToolBarBox(this.currentToolbar, element);
                    this.addElements(this.actions.event.addElTextArea, this.currentBox);
                } else if (event.target.id === 'video-browse') {
                    this.setCurrentToolbar(this.actions.toolbar.addBrowseVideoTool);
                    this.removeElements(this.actions.style.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxBrowseVideo);
                    this.addToolBarBox(this.currentToolbar, this.currentBox);
                }
                else if (event.target.id === 'subform') {
                    this.setCurrentToolbar(this.actions.toolbar.addSubform);
                    this.addToolBarBox(this.currentToolbar, this.currentBox);
                    this.currentBox.addClass(this.boxType.boxAddSubform);
                    // this.removeElements(this.contents.event.removeStyleBoxType);
                    // this.currentBox.addClass(this.boxType.boxBrowseVideo);
                    // this.addToolBarBox(this.currentToolbar, this.currentBox); this.addToolBarBox(this.currentToolbar, this.currentBox);
                }
                else if (event.target.id === 'cancel') {
                    this.removeElements(this.actions.event.removeElBox);
                    // if (element.hasClass(this.boxType.boxSubform)) {

                    // }
                    // this.removeElements(this.actions.style.removeStyleBoxType);
                    // this.removeElements(this.actions.event.removeContent);
                    // this.setCurrentToolbar(this.actions.toolbar.addInitalTool);
                    // this.addToolBarBox(this.actions.toolbar.addInitalTool, element);
                }
            });
        } else if (action === this.actions.event.handleBrowseFile) {
            element.find('#btn-file').click((event) => {
                element.find('.content-browse-file').trigger('click');
                element.find('.content-browse-file').change((fileEvent) => {
                    this.removeElements(this.actions.style.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxImg);
                    this.setCurrentToolbar(this.actions.toolbar.cancelTool);
                    this.addToolBarBox(this.actions.toolbar.cancelTool, element);
                    this.currentBrowseFile = fileEvent.target.files;
                    console.log(' ❏ File :', this.currentBrowseFile);

                    this.addElements(this.actions.event.addElBrowseFile, element);
                });
            });
            element.find('.toolbar-browse-file').on('dragover', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
            element.find('.toolbar-browse-file').on('dragleave', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
            element.find('.toolbar-browse-file').on('drop', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.removeElements(this.actions.style.removeStyleBoxType);
                this.currentBox.addClass(this.boxType.boxImg);
                this.setCurrentToolbar(this.actions.toolbar.cancelTool);
                this.addToolBarBox(this.actions.toolbar.cancelTool, element);
                this.currentBrowseFile = event.originalEvent.dataTransfer.files;
                console.log(' ❏ File :', this.currentBrowseFile);

                this.addElements(this.actions.event.addElBrowseFile, element);
            });
        } else if (action === this.actions.event.handleBrowseVideo) {
            element.find('#btn-video').click((event) => {
                element.find('.content-browse-video').trigger('click');
                element.find('.content-browse-video').change((fileEvent) => {
                    this.removeElements(this.actions.style.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxVideo);
                    this.setCurrentToolbar(this.actions.toolbar.cancelTool);
                    this.addToolBarBox(this.actions.toolbar.cancelTool, element);
                    this.currentBrowseFile = fileEvent.target.files;
                    console.log(' ❏ Video :', this.currentBrowseFile);

                    this.addElements(this.actions.event.addElBrowseVideo, element);
                });
            });
            element.find('.toolbar-browse-video').find('.toolbar-drag').on('dragover', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
            element.find('.toolbar-browse-video').find('.toolbar-drag').on('dragleave', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
            element.find('.toolbar-browse-video').find('.toolbar-drag').on('drop', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.removeElements(this.actions.style.removeStyleBoxType);
                this.currentBox.addClass(this.boxType.boxVideo);
                this.setCurrentToolbar(this.actions.toolbar.cancelTool);
                this.addToolBarBox(this.actions.toolbar.cancelTool, element);
                this.currentBrowseFile = event.originalEvent.dataTransfer.files;
                console.log(' ❏ Video :', this.currentBrowseFile);

                this.addElements(this.actions.event.addElBrowseVideo, element, 'videoSource');
            });
            element.find('.toolbar-browse-video').find('#input-video-url').click(() => {
                element.find('.toolbar-browse-video').find('#input-video-url').focus();
                element.find('.toolbar-browse-video').find('#input-video-url').on('input', this.commonService.debounce((event) => {
                    if (event.target.value) {
                        const url = event.target.value;
                        let dataStreaming  = new VideoConetentDataModel();
                        const streamId = this.commonService.getStreamId(url);
                        if (streamId.streamId != null && streamId.channelStream=='youtube') {
                            this.currentBrowseFile = 'https://www.youtube.com/embed/' + streamId.streamId;
                            dataStreaming.streamId = streamId.streamId;
                            dataStreaming.channelStream  = streamId.channelStream;
                        }
                        else if(streamId.streamId != null && streamId.channelStream=='wistia'){
                            this.currentBrowseFile  =  streamId.streamId;
                            dataStreaming.streamId = streamId.streamId;
                            dataStreaming.channelStream  = streamId.channelStream;
                        }
                        else {
                            console.log('The youtube url is not valid.');
                            this.currentBrowseFile = event.target.value;
                        }
                        this.removeElements(this.actions.style.removeStyleBoxType);
                        this.currentBox.addClass(this.boxType.boxVideo);
                        this.setCurrentToolbar(this.actions.toolbar.cancelTool);
                        this.addToolBarBox(this.actions.toolbar.cancelTool, element);
                        console.log(' ❏ Video :', this.currentBrowseFile);
                        this.addElements(this.actions.event.addElBrowseVideo, element, dataStreaming.channelStream,null,dataStreaming);
                    }
                }, 500));
            });

        } else if (action === this.actions.event.handleSubForm) {
            element.find('.toolbar-subform').find('.nav-item').click((itemElement) => {
                $(element).find('.toolbar-subform').find('.nav-item').removeClass('active');
                $(element).find('.toolbar-subform').find('.nav-item').removeClass('text-primary');
                $(itemElement.currentTarget).addClass('active');
                $(itemElement.currentTarget).addClass('text-primary');
                this.currentSubFormType = {
                    id: $(itemElement.currentTarget).attr('id'),
                    name: $(itemElement.currentTarget).data('subformtype')
                }
                element.find('.toolbar-subform').find('#subform-silde').text('Silde (0)');
                element.find('.toolbar-subform').find('#subform-link').text('Link (0)');
                if (this.currentSubFormType.id === "subform-silde") {
                    element.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Silde (' + this.subForms.length + ')');
                }
                else if (this.currentSubFormType.id === "subform-link") {
                    element.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Link (' + this.subForms.length + ')');
                }
            });
            element.find('.toolbar-subform').find('#subform-btn-submit').click((btnElement) => {
                btnElement.stopPropagation();
                this.removeElements(this.actions.style.removeStyleBoxType);
                this.currentBox.addClass(this.boxType.boxSubform);
                this.setCurrentToolbar(this.actions.toolbar.cancelTool);
                this.addToolBarBox(this.actions.toolbar.cancelTool, element);
                this.addElements(this.actions.event.addElSubForm, element)
                console.log(' ❏ Subforms :', this.subForms);


            })
            element.find('.toolbar-subform').find('input[type="checkbox"]').click((itemElement) => {
                if (!this.subForms.find(form => form.id === $(itemElement.currentTarget).val())) {
                    let targetDocument = this.documentDataService.documentNavList.find((document) => document.id === $(itemElement.currentTarget).val())
                    this.subForms.push({
                        id: targetDocument.id,
                        nameDocument: targetDocument.nameDocument,
                        isLinked: true,
                        type: this.currentSubFormType.id
                    });
                    //    $(this.currentSubFormType.id).text('test')
                } else {
                    this.subForms = this.subForms.filter((form) => form.id != $(itemElement.currentTarget).val())
                }
                if (this.currentSubFormType.id === "subform-silde") {
                    element.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Silde (' + this.subForms.length + ')');
                }
                else if (this.currentSubFormType.id === "subform-link") {
                    element.find('.toolbar-subform').find('[id="' + this.currentSubFormType.id + '"]').text('Link (' + this.subForms.length + ')');
                }
            })

        }
        else if (action === this.actions.event.handleTemplateDoc) {
            element.click((event) => {
               // this.addElements(this.actions.style.addStyleCurrentBox, this.currentBox ,'click');
            this.removeElements(this.actions.style.removeAllStyleBoxCurrent);
                this.setCurrentToolbar(this.actions.toolbar.templateDocTool);
                this.addToolBarBox(this.actions.toolbar.cancelTool,element);
                this.setCurrentBox($(event.currentTarget))
                this.addOptionToolBar();   
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
        else if (action === this.actions.event.handleOptionTool) {
            $('#option-font-family').fontselect(
                {
                    searchable: false,
                }
            ).on('change', (ev)=> {
                let font:any  = $(ev.currentTarget).val().toString();
                font = font.replace(/\+/g, ' ');
                font = font.split(':');
                let fontFamily = font[0];
                let fontWeight = font[1] || 400;
                let style =  'font-family:"' + fontFamily + '";font-weight:' +fontWeight ;
                this.addStylesElement(this.actions.style.addOptionStyle,style)
            });
            $('#option-format-paragraph').change((element) => {
                let style =  '';
                this.addStylesElement(this.actions.style.addOptionStyle,style, $(element.currentTarget).val().toString())
            });
            $('#option-font-size').change((element) => {
                let style =  'font-size:'+ $(element.currentTarget).val() + 'px';
                this.addStylesElement(this.actions.style.addOptionStyle,style)
            });
            $('.option-font-alignment').click((element) => {
                let style =  'text-align:'+ $(element.currentTarget).attr('data-font-alignment');
                let editor = CKEDITOR.instances[this.documentDataService.nameTemplate];
                let selectedElement = $(editor.getSelection().getStartElement().$);
                let tagName;
                this.addStylesElement(this.actions.style.addOptionStyle,style,'p')
            });
            $('.option-font-style').click((element) => {
                let style;
                let dataStyle =  $(element.currentTarget).attr('data-font-style');
                let editor = CKEDITOR.instances[this.documentDataService.nameTemplate];
                let selectedElement = $(editor.getSelection().getStartElement().$);
                let allwrapElement =  $( 'span:contains("'+selectedElement.text() +'")');
                if(dataStyle === 'bold'){
                    if(allwrapElement.css('font-weight')==='700'){
                        style =  'font-weight:400';
                    }else{
                        style =  'font-weight:'+ $(element.currentTarget).attr('data-font-style');
                    }   
                }
                else if(dataStyle === 'italic'){
                    if(allwrapElement.css('font-style')==='italic'){
                        style =  'font-style:normal';
                    }else{
                        style =  'font-style:'+ $(element.currentTarget).attr('data-font-style');
                    }
                }
                else if(dataStyle === 'underline'){
                    if(/none/.test(allwrapElement.css('text-decoration'))){
                        style =  'text-decoration:'+ $(element.currentTarget).attr('data-font-style');
                    }else{
                        style =  'text-decoration:none'
                    }  
                }
                this.addStylesElement(this.actions.style.addOptionStyle,style)
            });
            $('.option-action-trash').click(() => {
                this.removeElements(this.actions.option.removeOptionTool);
                this.removeElements(this.actions.event.removeElBox);
            });
            
        }
        else if (action === this.actions.event.handleWistia) {
                element.click((event)=>{
                    let videoIndex = this.videos.findIndex((video)=>video.id ===$(event.currentTarget).attr('id')+'-video');
                    let video = Wistia.api(this.videos[videoIndex].data.streamId);
                    // video.pause();
                    // console.log('cxcxcx');
                    this.videos[videoIndex].data.currentWatchingTime =  video.time();       
                });
        }
    }
    private removeElements(action: string, element?: any) {
        if (action === this.actions.event.removeElBox) {
            this.currentBox.remove();
            this.currentBox  = null;
        } else if (action === this.actions.toolbar.removeTool) {
            this.rootElement.find('.content-box').find('.content-toolbar').remove();
        } else if (action === this.actions.style.removeStyleBorderBox) {
            this.rootElement.find('.content-box').removeClass('border border-primary');
        } else if (action === this.actions.style.removeStyleBoxActive) {
            this.rootElement.find('.content-box').removeClass('content-box-active');
        } else if (action === this.actions.style.removeStyleBoxCurrent) {
            this.rootElement.find('.content-box').removeClass('content-box-current');
        } 
        else if (action === this.actions.style.removeAllStyleBoxCurrent) {
            this.rootElement.find('.content-box').removeClass('content-box-current');
            this.rootElement.find('.content-box').removeClass('content-box-active');
            this.rootElement.find('.content-box').removeClass('border border-primary');
        } 
        else if (action === this.actions.style.removeStyleBoxBrowseFileSize) {
            this.rootElement.find('.content-box').removeClass('box-browse-file-size');
        } else if (action === this.actions.style.removeStyleBoxBrowseVideoSize) {
            this.rootElement.find('.content-box').removeClass('box-browse-video-size');
        } else if (action === this.actions.event.removeForPreviewSubForm) {
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
            this.currentBox.removeClass(this.boxType.boxBrowseFile);
            this.currentBox.removeClass(this.boxType.boxVideo);
            this.currentBox.removeClass(this.boxType.boxBrowseVideo);
            this.currentBox.removeClass(this.boxType.boxAddSubform);
            this.currentBox.removeClass(this.boxType.boxSubform);
        } else if (action === this.actions.event.removeContent) {
            this.currentBox.find('.content-textarea').remove();
            this.currentBox.find('.content-img').remove();
            this.currentBox.find('.content-file').remove();
            this.currentBox.find('.content-video').remove();
            this.currentBox.find('.content-subform').remove()
        }
        else if (action === this.actions.option.removeOptionTool) {
            console.log(this.rootElement.find('.container-option-content'))
            $('.container-option-content').find('.content-option-tool').html('');
        }
    }
    private addBoxBrowseSizeFile(element: any) {
        this.removeElements(this.actions.style.removeStyleBoxBrowseFileSize);
        element.addClass('box-browse-file-size');
    }
    private addBoxBrowseSizeVideo(element: any) {
        this.removeElements(this.actions.style.removeStyleBoxBrowseFileSize);
        element.addClass('box-browse-video-size');
    }
    private addBoxCurrent(element: any) {
        this.removeElements(this.actions.style.removeStyleBoxCurrent);
        element.addClass('content-box-current');
    }
    private addBoxActive(element: any) {
        this.removeElements(this.actions.style.removeStyleBoxActive);
        element.addClass('content-box-active');
    }
    private addBorderBox(element: any) {
        this.removeElements(this.actions.style.removeStyleBorderBox);
        element.addClass('border border-primary');
    }
    private addStylesElement(action:string,styles:string,subaction?:string) {
        if(action === this.actions.style.addOptionStyle){
            this.documentService.compileStyles(styles,subaction);
        }
    }
    private async addToolBarBox(action: string, element: any) {
        let htmlTootBar;
        this.removeElements(this.actions.toolbar.removeTool);
        this.removeElements(this.actions.style.removeStyleBoxBrowseFileSize);
        this.removeElements(this.actions.style.removeStyleBoxBrowseVideoSize);
        if (action === this.actions.toolbar.addInitalTool) {
            this.removeElements(this.actions.toolbar.removeTool);
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
        } else if (action === this.actions.toolbar.addBrowseFileTool) {
            htmlTootBar = '<div class="row content-toolbar toolbar-browse-file">'
                + '<div class="col-12">'
                + '<input type="file" class="content-browse-file" id="input-file">'
                + '<img  src="assets/imgs/contentPage/browse-file.svg">'
                + '<p class="content-font-title1">Drag & Drop your files,or</p>'
                + '<button id="btn-file" type="button" class="btn btn-primary">Browse</button>'
                + '</div>'
                + '</div>';
            this.rootElement.find(element).append(htmlTootBar);
            this.addBoxBrowseSizeFile(element);
            this.handles(this.actions.event.handleBrowseFile, element);
        } else if (action === this.actions.toolbar.addBrowseVideoTool) {
            htmlTootBar = '<div class="row content-toolbar toolbar-browse-video">'
                + '<div class="col-5 toolbar-drag">'
                + '<input type="file" class="content-browse-video" accept="video/mp4,video/x-m4v,video/*" id="input-video">'
                + '<img  src="assets/imgs/contentPage/browse-file.svg">'
                + '<p class="content-font-title1">Drag & Drop your files</p>'
                + '<button id="btn-video" type="button" class="btn btn-primary">Browse</button>'
                + '</div>'
                + '<div class="col-2">'
                + 'OR'
                + '</div>'
                + '<div class="col-5 toolbar-drag">'
                + '<div class="form-group">'
                + '<input placeholder="https://example.com" type="text" class="form-control" id="input-video-url">'
                + '</div>'
                + '<p class="content-font-title1">Get your URL</p>'
                + '</div>'
                + '</div>';
            this.rootElement.find(element).append(htmlTootBar);
            this.addBoxBrowseSizeVideo(element);
            this.handles(this.actions.event.handleBrowseVideo, element);
        } else if (action === this.actions.toolbar.addTextareaTool) {
            htmlTootBar = '<div class="row content-toolbar toolbar-textarea">'
                + '<div class="col-12">'
                + '</div>'
                + '</div>';
        }
        else if (action === this.actions.toolbar.addSubform) {
            let htmlDocumentList = '<div class="list-group text-left">';
            let documentSubformList = this.documentDataService.documentNavList.filter((document) => document.nameDocument != this.documentDataService.currentDocumentName)
            documentSubformList.forEach((document, index) => {
                htmlDocumentList += '<input type="checkbox" value="' + document.nameDocument + '" id="subform-name-' + this.commonService.getPatternId(document.nameDocument) + '" />';

                if (index == 0) {
                    htmlDocumentList += '<label class="list-group-item border-top-0" for="subform-name-' + this.commonService.getPatternId(document.nameDocument) + '">' + document.nameDocument + '</label>';
                } else {
                    htmlDocumentList += '<label class="list-group-item" for="subform-name-' + this.commonService.getPatternId(document.nameDocument) + '">' + document.nameDocument + '</label>';
                }
            });
            htmlDocumentList += '</div>'
            htmlTootBar = '<div class="row content-toolbar toolbar-subform">'
                + '<div class="col-12">'
                + '<nav>'
                + '<div class="nav nav-tabs text-lightGrey ">'
                + '<a data-subformtype="silde" id="subform-silde" class="nav-item nav-link cursor-pointer w-50 active text-primary border-top-0 rounded-0">Silde (0)</a>'
                + '<a data-subformtype="link" id="subform-link" class="nav-item nav-link cursor-pointer w-50 border-top-0 rounded-0" >Link (0)</a>'
                + '</nav>'
                + htmlDocumentList
                + '</div>'
                + '<div  class="nav-footer nav-footer-custome">'
                + '<button type="button" id="subform-btn-submit" class="btn btn-outline-success">Submit</button>'
                + '</div>'
                + '</div>';
            this.rootElement.find(element).append(htmlTootBar);
            this.handles(this.actions.event.handleSubForm, element);
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

        this.handles(this.actions.event.handleToolbars, element);
    }
    private async addOptionToolBar() {
        let htmlOptionToolBar;
        if (this.currentToolbar === this.actions.toolbar.addTextareaTool || this.currentToolbar === this.actions.toolbar.templateDocTool) {
            const constFontSizeList = Constants.general.style.fontSizeList
            let htmlFontSizeList = "";
            constFontSizeList.forEach((fontsize) => {
                htmlFontSizeList += '<option>' + fontsize + '</option>'
            })
            htmlOptionToolBar =
                '<div class="row p-0 m-0 mt-3">'
                + '<div class="col-12 d-flex justify-content-center border-bottom">'
                + '<div class="form-group w-70 text-center">'
                + '<label>Style</label>'
                + '<select id="option-format-paragraph" class="form-control">'
                + '<option value="h1">Heading 1</option>'
                + '<option value="h2">Heading 2</option>'
                + '<option value="h3">Heading 3</option>'
                + '<option value="pre">Formatted</option>'
                + '</select>'
                + '</div>'
                + '</div>'
                + '<div class="col-12 d-flex justify-content-center">'
                + '<div class="form-group w-70 text-center">'
                + '<label class="mt-2">Font</label>'
                + '<input value="Arial" id="option-font-family" class="form-control mb-2 pl-5">'
                + '<select class="form-control" id="option-font-size">'
                + htmlFontSizeList
                + '</select>'
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
            this.handles(this.actions.event.handleOptionTool);
        }
        if (this.currentToolbar === this.actions.toolbar.addBrowseFileTool) {
            htmlOptionToolBar =
             '<div class="row p-0 m-0 mt-3">'
            + '<div class="col-12 d-flex justify-content-center border-bottom">'
            + '<div class="form-group text-center">'
            + '<label>Action</label>'
            + '<div w-70 d-flex justify-content-between p-1">'
            + '<img  class="option-action-trash" src="assets/imgs/contentPage/trash.svg">'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            this.rootOptionTool.html(htmlOptionToolBar)
            this.handles(this.actions.event.handleOptionTool);
             //this.handles(this.actions.event.handleOptionToolTextarea);
        }

    }
    private setCurrentBox(element?) {
        if (element) {
            this.currentBox = element;
        } else {
            this.currentBox = $(this.rootElement).find('.content-box-current');
        }
    }
    private setCurrentToolbar(action?) {
        if (action) {
            this.currentToolbar = action;
        } else {
            if (this.currentBox.hasClass(this.boxType.boxBrowseFile)) {
                this.currentToolbar = this.actions.toolbar.addBrowseFileTool;
            } else if (this.currentBox.hasClass(this.boxType.boxTextarea)) {
                this.currentToolbar = this.actions.toolbar.addTextareaTool;
            } else if (this.currentBox.hasClass(this.boxType.boxBrowseVideo)) {
                this.currentToolbar = this.actions.toolbar.addBrowseVideoTool;
            } else if (this.currentBox.hasClass(this.boxType.boxImg) || this.currentBox.hasClass(this.boxType.boxVideo) || this.currentBox.hasClass(this.boxType.boxSubform)) {
                this.currentToolbar = this.actions.toolbar.cancelTool;
            }
            else if (this.currentBox.hasClass(this.boxType.boxAddSubform)) {
                this.currentToolbar = this.actions.toolbar.addSubform;
            }
            else {
                this.currentToolbar = this.actions.toolbar.addInitalTool;
            }
        }

    }
    private saveDocument(nameDocument: string, eventAction?: string) {
        console.log(document.querySelector('#contentTemplate'))
        html2canvas(document.querySelector('#contentTemplate')).then((canvas) => {
            var imgdata = canvas.toDataURL('image/png');
            console.log("imgdata", imgdata)
            // document.body.appendChild(canvas);
        });
        if (electron) {
            this.createData(this.actions.data.createDataToSave).then(() => {
                const objectTemplate: DocumentModel = {
                    nameDocument: nameDocument,
                    id: this.commonService.getPatternId(nameDocument), html: this.rootElement.html(), elements: {
                        boxes: this.boxes,
                        textAreas: this.textAreas,
                        imgs: this.imgs,
                        videos: this.videos,
                        subFroms: this.subForms
                    }
                };
                console.log(' ❏ Object for Save :', objectTemplate);
                electron.ipcRenderer.send('request-save-document', JSON.stringify(objectTemplate))
                electron.ipcRenderer.once('reponse-save-document', (event, status) => {
                    electron.ipcRenderer.send('request-read-document-list', null)
                    console.log('data has been saved to your file.');

                    //this.eventToParent.emit({ action: Constants.general.event.load.success, data: event })
                });
                electron.ipcRenderer.once('reponse-read-document-list', (event, documentList) => {
                    let newDocumentList: DocumentNavigatorModel[] = new Array<DocumentNavigatorModel>();
                    if (documentList && documentList.length > 0) {
                        console.log(documentList);
                        console.log(nameDocument);
                        if (!documentList.find((document) => document.nameDocument == nameDocument)) {
                            newDocumentList = documentList
                            newDocumentList.push({
                                id: this.commonService.getPatternId(nameDocument),
                                nameDocument: nameDocument,
                                childDocuments: this.subForms
                            });
                            electron.ipcRenderer.send('request-save-document-list', JSON.stringify(newDocumentList))
                        } else {
                            let indexTargetDocument = documentList.findIndex((document) => document.nameDocument == nameDocument)
                            newDocumentList = documentList;
                            newDocumentList[indexTargetDocument] = {
                                id: this.commonService.getPatternId(nameDocument),
                                nameDocument: nameDocument,
                                childDocuments: this.subForms
                            }
                            electron.ipcRenderer.send('request-save-document-list', JSON.stringify(newDocumentList))
                            // this.eventToParent.emit({ action: Constants.general.event.load.success, data: event })
                        }
                    } else {
                        newDocumentList.push({
                            id: this.commonService.getPatternId(nameDocument),
                            nameDocument: nameDocument,
                            childDocuments: this.subForms
                        });
                        electron.ipcRenderer.send('request-save-document-list', JSON.stringify(newDocumentList))
                    };
                });
                electron.ipcRenderer.once('response-save-document-list', (event, status) => {
                    console.log('heeloo');
                    this.eventToParent.emit({ action: Constants.general.event.load.success, data: eventAction })
                });
            });
        } else {
            const requestTableDoc = this.documentService.indexDB.transaction(['documents'], 'readwrite');
            const objectStoreDoc = requestTableDoc.objectStore('documents');
            this.createData(this.actions.data.createDataToSave).then(() => {
                const objectDocument: DocumentModel = {
                    id: this.commonService.getPatternId(nameDocument),
                    nameDocument: nameDocument,
                    html: this.rootElement.html(), elements: {
                        boxes: this.boxes,
                        textAreas: this.textAreas,
                        imgs: this.imgs,
                        videos: this.videos,
                        subFroms: this.subForms
                    }
                };
                console.log(' ❏ Object for Save :', objectDocument);
                if (objectStoreDoc.get(nameDocument)) {
                    objectStoreDoc.put(objectDocument).onsuccess = (event) => {
                        this.eventToParent.emit({ action: Constants.general.event.load.success, data: eventAction })
                        console.log('data has been updated to your database.');
                    };
                } else {
                    objectStoreDoc.add(objectDocument).onsuccess = (event) => {
                        this.eventToParent.emit({ action: Constants.general.event.load.success, data: eventAction })
                        console.log('data has been added to your database.');
                    };
                }
                const requestTableNav = this.documentService.indexDB.transaction(['navigators'], 'readwrite');
                const objectStoreNav = requestTableNav.objectStore('navigators');
                const objectNavigator: DocumentNavigatorModel = {
                    id: this.commonService.getPatternId(nameDocument),
                    nameDocument: nameDocument,
                    childDocuments: this.subForms
                };
                if (objectStoreNav.get(nameDocument)) {
                    objectStoreNav.put(objectNavigator)
                } else {
                    objectStoreNav.add(objectNavigator)
                }
            });

        }
    }
    private saveTempDocument(nameDocument) {
        const requestTableNav = this.documentService.indexDB.transaction(['temp-navigators'], 'readwrite');
        const objectStoreNav = requestTableNav.objectStore('temp-navigators');
        const objectNavigator: DocumentNavigatorModel = {
            id: this.commonService.getPatternId(nameDocument),
            nameDocument: nameDocument,
            childDocuments: this.subForms
        };
        if (objectStoreNav.get(nameDocument)) {
            objectStoreNav.put(objectNavigator)
        } else {
            objectStoreNav.add(objectNavigator)
        }
    }
    private addData(action: string, id: string, element?) {
        if (action === this.actions.data.addBoxData) {
            this.boxes.push({
                id,
                isEmpty: true,
                contentType: this.currentContentType.name
            });
        }
    }
    private findData(action: string, element?) {
        if (action === this.actions.data.findIndexBoxData) {
            return this.boxes.findIndex(box => box.id === element.attr('id'));
        }
    }
    private retrieveData(action: string, results: DocumentModel, element?: JQuery<Element>) {
        if (action === this.actions.data.addBoxData) {
            this.boxes = results.elements.boxes;
        } else if (action === this.actions.data.addTextAreaData) {
            this.textAreas = results.elements.textAreas;
            this.textAreas.forEach((textArea) => {
                if (element) {
                    $(element).find('[id="' + textArea.id + '"]').val(textArea.value);
                } else {
                    $(this.rootElement).find('[id="' + textArea.id + '"]').val(textArea.value);
                }

            });
        }
        // else if (action === this.constants.data.addDataImg) {
        //     this.imgs = results.elements.imgs;
        //     this.imgs.forEach((img) => {
        //         $(this.rootElement).find('[id="' + img.id + '"]').val(textArea.value);
        //     });
        // }
    }
    private async createData(action: string) {
        if (action === this.actions.data.createDataToSave) {
            this.textAreas = new Array<TextAreaContentModel>();
            await $(this.rootElement).find('.content-textarea').each((index, element) => {
                const elementTextArea = $(element);
                const objectTextArea: TextAreaContentModel = { id: elementTextArea.attr('id'), value: elementTextArea.val() && elementTextArea.val().toString() };
                this.textAreas.push(objectTextArea);
            });
        }
    }
    private removeData(action: string, element?: any) {
        if (action === this.actions.data.removeAllContentObj) {
            this.boxes = new Array<BoxContentModel>();
            this.textAreas = new Array<TextAreaContentModel>();
            this.imgs = new Array<ImgContentModel>();
            this.videos = new Array<VideoContentModel>();
            this.subForms = new Array<SubFormContentModel>();
        }
        if (action === this.actions.data.removeAllContentObj) {

        }
    }
    private openModal(action) {

    }
    // public replaceSelectedText(replacementText) {
    //     var sel = rangy.getSelection();
    //     if (sel.rangeCount > 0) {
    //         // var htmlcontent='<span id="AuniqueId" class="style1">test</span>'
    //         var range = sel.getRangeAt(0).getNodes();
    //          console.log($(sel.getRangeAt(0).getNodes()))
    //         if($(sel.getRangeAt(0).getNodes()[0]).prop('tagName')==='span'){
    //             console.log('xcxxcxcxcx');
    //             $(sel.getRangeAt(0).getNodes()[0]).remove();
    //         }
    //         // $(sel.getRangeAt(0).getNodes()[0]).remove();
    //         // range.deleteContents();
    //         // sel.deleteFromDocument();
    //         var el = document.createElement('span');
    //         el.innerHTML = 'test';
    //         var range = sel.getRangeAt(0);
    //         range.insertNode(el);
    //         sel.setSingleRange(range);
    //     }
    // }
}
