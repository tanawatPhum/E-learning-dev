import { Component, OnInit, AfterContentInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { catchError, mergeMap, toArray, map } from 'rxjs/operators';
import { Observable, of, Subject, empty, fromEvent } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { BoxContentModel } from 'src/app/models/content/elements/box-content.model';
import { CommonService } from '../../../services/common/common.service';
import { ContentModel } from 'src/app/models/content/content.model';
import { TextAreaContentModel } from '../../../models/content/elements/textarea-content.model';
import { ImgContentModel } from 'src/app/models/content/elements/img-content.model';
import { VideoContentModel } from 'src/app/models/content/elements/video-content.model';
import { ContentService } from 'src/app/services/document/content.service';
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';
import Splitting from 'splitting';





@Component({
    selector: 'create-content-page',
    templateUrl: 'create-content-page.component.html',
    styleUrls: ['create-content-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateContentPageComponent implements OnInit, AfterContentInit {
    @ViewChild('contentTemplate', { static: true }) contentTemplate: ElementRef;
    @Input() triggerElement: Subject<string>;
    @Input() contentElement: Subject<ContentModel>;
    @Input() contentTypeSelected: Subject<any>;
    private indexDB: any;
    private currentBox: any;
    private currentToolbar: string;
    private currentElement: any;
    private currentContentType: { name: null, id: null };
    private currentBrowseFile: any;
    private contentType = Constants.document.contents.types;
    private rootElement;
    private boxType = {
        boxInitial: 'box-intial',
        boxTextarea: 'box-textarea',
        boxBrowseFile: 'box-browse-file',
        boxImg: 'box-img',
        boxVideo: 'box-video',
        boxBrowseVideo: 'box-browse-video'
    };
    private contents = {
        event: {
            addElBox: 'addElBox',
            addElTextArea: 'addElTextArea',
            addElBrowseFile: 'addElBrowseFile',
            addElBrowseVideo: 'addElBrowseVideo',
            addEventBox: 'addEventBox',
            addStyleCurrentBoxBefore: 'addStyleCurrentBoxBefore',
            addStyleCurrentBoxAfter: 'addStyleCurrentBoxAfter',
            addStyleBoxBrowseSize: 'addStyleBoxBrowseSize',
            triggerCurrentBox: 'triggerCurrentBox',
            triggerAttachFileModal: 'triggerAttachFileModal',
            triggerDragBoxes: 'triggerDragBoxes',
            triggerToolbars: 'triggerToolbars',
            triggerBrowseFile: 'triggerBrowseFile',
            triggerBrowseVideo: 'triggerBrowseVideo',
            removeElBox: 'removeElBox',
            removeStyleBorderBox: 'removeStyleBorderBox',
            removeStyleBoxCurrent: 'removeStyleBoxCurrent',
            removeStyleBoxActive: 'removeStyleBoxActive',
            removeStyleBoxBrowseFileSize: 'removeStyleBoxBrowseSize',
            removeStyleBoxBrowseVideoSize: 'removeStyleBoxBrowseVideoSize',
            removeStyleBoxType: 'removeStyleBoxType',
            removeContent: 'removeBoxContent'
        },
        data: {
            addBoxData: 'addBoxData',
            addTextAreaData: 'addTextAreaData',
            addImgData: 'addImgData',
            retrieveBoxData: 'retrieveBoxData',
            retrieveTextAreaData: 'retrieveTextAreaData',
            findIndexBoxData: 'findIndexBoxData',
            findEmptyData: 'findEmptyData'
        },
        toolbar: {
            addInitalTool: 'addInitalTool',
            addTextareaTool: 'addTextareaTool',
            addBrowseFileTool: 'addBrowseFileTool',
            addBrowseVideoTool: 'addBrowseVideoTool',
            addVideoTool: 'addVideoTool',
            removeTool: 'removeTool',
            cancelTool: 'cancelTool'
        }
    };
    private boxes: BoxContentModel[] = new Array<BoxContentModel>();
    private textAreas: TextAreaContentModel[] = new Array<TextAreaContentModel>();
    private imgs: ImgContentModel[] = new Array<ImgContentModel>();
    private videos: VideoContentModel[] = new Array<VideoContentModel>();
    constructor(
        private commonService: CommonService,
        private contentService: ContentService
    ) { }
    ngOnInit() {
        this.contentElement.subscribe((result) => {
            this.rootElement.html(result.html);
            this.addElements(this.contents.event.addEventBox).then(() => {
                this.retrieveData(this.contents.data.addBoxData, result);
                this.retrieveData(this.contents.data.addTextAreaData, result);
                this.retrieveData(this.contents.data.addImgData, result);
            });
        });
        this.contentTypeSelected.subscribe((contentType) => {
            this.currentContentType = contentType;
            this.addElements(this.contents.event.addElBox);
        });
        this.triggerElement.subscribe((event) => {
            if (event === Constants.event.click.add) {
                this.addElements(this.contents.event.addElBox).then(() => {
                    this.addElements(this.contents.event.addStyleCurrentBoxBefore, this.currentBox);
                });
            } else if (event === Constants.event.click.save) {
                this.savePage();
            }

        });
    }
    ngAfterContentInit() {
        this.rootElement = $(this.contentTemplate.nativeElement);
        //   window.indexedDB = window.indexedDB;
    }
    private async addElements(action: string, element?: any, subaction?: string, subElement?: any) {
        if (action === this.contents.event.addElBox || action === this.contents.event.addEventBox) {
            this.setCurrentBox();
            this.setCurrentToolbar();
            this.setCurrentBoxBackground();
            if (action === this.contents.event.addElBox) {
                const numberOfBox = this.rootElement.find('.content-box').length;
                if (this.currentContentType.name === this.contentType.freedomLayout.name) {
                    this.rootElement.append('<div style="z-index:999" id=box_' + numberOfBox + ' class="content-box ' + this.boxType.boxInitial + '"></div>');
                    $('[id="box_' + numberOfBox + '"]').
                        $('[id="box_' + numberOfBox + '"]').css('position', 'absolute');
                    $('[id="box_' + numberOfBox + '"]').css('width', '300px');
                } else if (this.currentContentType.name === this.contentType.oneLayout.name) {
                    this.rootElement.append('<div class="row"><div class="col-12"><div style=""id=box_' + numberOfBox + ' class="content-box ' + this.boxType.boxInitial + '"></div></div></div>');
                } else if (this.currentContentType.name === this.contentType.twoLayout.name) {
                    this.rootElement.append(
                        '<div class="row">' +
                        '<div class="col">' +
                        '<div style=""id=box_' + numberOfBox + ' class="content-box ' + this.boxType.boxInitial + '">' +
                        '</div>' +
                        '</div>' +
                        '<div class="col">' +
                        '<div style=""id=box_' + (numberOfBox + 1) + ' class="content-box ' + this.boxType.boxInitial + '">' +
                        '</div>' +
                        '</div>');
                }
                this.removeElements(this.contents.toolbar.removeTool);
                this.setCurrentBox($('#box_' + numberOfBox));
                const loopForAddData = this.currentContentType.id || 0;
                this.addData(this.contents.data.addBoxData, 'box_' + numberOfBox);
            }
            if (this.currentContentType.name === this.contentType.freedomLayout.name) {
                this.rootElement.find('.content-box').draggable({
                    containment: this.contentTemplate.nativeElement,
                    stack: '.content-box',
                    scroll: false,
                    start: ((event) => {
                        this.setCurrentBoxBackground(Constants.element.css.bgWhiteColor);
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        this.addElements(this.contents.event.addStyleCurrentBoxBefore, elementFromId);
                    }),
                    stop: ((event) => {
                        this.setCurrentBoxBackground();
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        this.addElements(this.contents.event.addStyleCurrentBoxAfter, elementFromId);
                    }),
                });
            }
            this.rootElement.find('.content-box').resizable({
                handles: '',
            })
                .resizable({
                    handles: 'n, e, s, w, se, ne, sw, nw',
                    containment: this.contentTemplate.nativeElement,
                    minHeight: Constants.element.limit.resize.height,
                    minWidth: Constants.element.limit.resize.width,
                    start: ((event) => {
                        this.setCurrentBoxBackground(Constants.element.css.bgWhiteColor);
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        this.addElements(this.contents.event.addStyleCurrentBoxBefore, elementFromId);
                    }),
                    stop: ((event) => {
                        this.setCurrentBoxBackground();
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        this.addElements(this.contents.event.addStyleCurrentBoxAfter, elementFromId);

                    }),
                });
            if (this.currentContentType.name === this.contentType.freedomLayout.name) {
                this.triggerElements(this.contents.event.triggerDragBoxes);
            }

            this.triggerElements(this.contents.event.triggerCurrentBox);
            this.triggerElements(this.contents.event.triggerToolbars);
            this.triggerElements(this.contents.event.triggerBrowseFile, this.currentBox);
            this.addElements(this.contents.event.addStyleCurrentBoxBefore, this.currentBox);
        } else if (action === this.contents.event.addStyleCurrentBoxBefore) {
            this.setCurrentBox(element);
            this.addBoxCurrent(element);
            this.addBorderBox(element);
            this.addBoxActive(element);
            this.setCurrentToolbar();
            const IndexBox = this.findData(this.contents.data.findIndexBoxData, element);
            if (IndexBox !== -1) {
                if (this.boxes[IndexBox].isEmpty) {
                    this.addToolBarBox(this.currentToolbar, element);
                }
            }
        } else if (action === this.contents.event.addStyleCurrentBoxAfter) {
            this.setCurrentBox(element);
            this.addBoxCurrent(element);
            this.addBorderBox(element);
            this.setCurrentToolbar();
            this.removeElements(this.contents.event.removeStyleBoxActive);
            const IndexBox = this.findData(this.contents.data.findIndexBoxData, element);
            if (IndexBox !== -1) {
                if (this.boxes[IndexBox].isEmpty) {
                    this.addToolBarBox(this.currentToolbar, element);
                }
            }
        } else if (action === this.contents.event.addElTextArea) {
            this.setCurrentToolbar(this.contents.toolbar.addTextareaTool);
            this.addToolBarBox(this.currentToolbar, element);
            const IndexBox = this.findData(this.contents.data.findIndexBoxData, element);
            if (IndexBox !== -1) {
                this.boxes[IndexBox].isEmpty = false;
            }
            element.append('<textarea id="' + element.attr('id') + '_textarea" class="content-textarea"></textarea>');
            element.find('textarea').focus();
        } else if (action === this.contents.event.addElBrowseFile) {
            const reader = new FileReader();
            reader.onload = ((event: any) => {
                this.imgs.push({
                    id: element.attr('id') + '_img',
                    path: event.target.result
                });
                element.append('<img src="' + event.target.result + '" id="' + element.attr('id') + '_img" class="content-img"></img>');
            });
            reader.readAsDataURL(this.currentBrowseFile[0]);
        } else if (action === this.contents.event.addElBrowseVideo) {
            if (subaction === 'videoSource') {
                const reader = new FileReader();
                reader.onload = ((event: any) => {
                    this.videos.push({
                        id: element.attr('id') + '_video',
                        path: event.target.result
                    });
                    element.append('<video src="' + event.target.result + '" id="' + element.attr('id') + '_video" class="content-video" controls ></video>');
                });
                reader.readAsDataURL(this.currentBrowseFile[0]);
            } else if (subaction === 'videoUrl') {
                this.videos.push({
                    id: element.attr('id') + '_video',
                    path: this.currentBrowseFile
                });
                element.append('<iframe src="' + this.currentBrowseFile + '" id="' + element.attr('id') + '_video" class="content-video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
            }
        }
    }
    private triggerElements(action: string, element?: any) {
        if (action === this.contents.event.triggerCurrentBox) {
            this.rootElement.find('.content-box').click((event) => {
                if (event.target.id !== this.currentBox.attr('id')) {
                    const elementFromId: any = this.currentElement = $('[id="' + event.target.id + '"]');
                    if (/_textarea/.test(event.target.id)) {
                        $(elementFromId).focus();
                        this.removeElements(this.contents.toolbar.removeTool);
                    }
                    if (event.target.id && !/_textarea/.test(event.target.id)) {
                        this.setCurrentBox(elementFromId);
                    } else {
                        this.setCurrentBox(elementFromId.parent());
                    }
                    this.currentBox.draggable({ disabled: true });
                    this.addElements(this.contents.event.addStyleCurrentBoxAfter, this.currentBox);
                    // if (!this.currentBox.hasClass('content-box-current')) {
                    //     this.addElements(this.contents.event.addStyleCurrentBoxBefore, this.currentBox);
                    // } else {
                    //     this.addElements(this.contents.event.addStyleCurrentBoxAfter, this.currentBox);
                    // }
                    this.setCurrentBoxBackground();
                }

            });
        } else if (action === this.contents.event.triggerAttachFileModal) {
            element.modal('show');
        } else if (action === this.contents.event.triggerDragBoxes) {
            if (this.commonService.isPlatform === Constants.platform.device) {
                this.rootElement.find('.content-box').on('touchmove', (event) => {
                    this.rootElement.find('.content-box').draggable({ disabled: false, cancel: '' });
                });
            } else {
                this.rootElement.find('.content-box').mousemove(() => {
                    this.rootElement.find('.content-box').draggable({ disabled: false, cancel: '' });
                });
            }
        } else if (action === this.contents.event.triggerToolbars) {
            this.rootElement.find('.content-toolbar').click((event) => {
                event.stopPropagation();
                if (event.target.id === 'file-browse') {
                    this.setCurrentToolbar(this.contents.toolbar.addBrowseFileTool);
                    this.setCurrentBoxBackground();
                    console.log(event);
                    this.removeElements(this.contents.event.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxBrowseFile);
                    this.addToolBarBox(this.currentToolbar, this.currentBox);
                    // this.triggerElements(this.constants.event.triggerAttachFileModal, $('#attach-file-modal'));
                } else if (event.target.id === 'trash') {
                    this.removeElements(this.contents.event.removeElBox);
                } else if (event.target.id === 'text-area') {
                    this.removeElements(this.contents.event.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxTextarea);
                    this.addElements(this.contents.event.addElTextArea, this.currentBox);
                } else if (event.target.id === 'video-browse') {
                    this.setCurrentToolbar(this.contents.toolbar.addBrowseVideoTool);
                    this.removeElements(this.contents.event.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxBrowseVideo);
                    this.addToolBarBox(this.currentToolbar, this.currentBox);
                } else if (event.target.id === 'cancel') {
                    this.removeElements(this.contents.event.removeStyleBoxType);
                    this.removeElements(this.contents.event.removeContent);
                    this.setCurrentToolbar(this.contents.toolbar.addInitalTool);
                    this.addToolBarBox(this.contents.toolbar.addInitalTool, element);
                }
            });
        } else if (action === this.contents.event.triggerBrowseFile) {
            element.find('#btn-file').click((event) => {
                element.find('.content-browse-file').trigger('click');
                element.find('.content-browse-file').change((fileEvent) => {
                    this.removeElements(this.contents.event.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxImg);
                    this.setCurrentToolbar(this.contents.toolbar.cancelTool);
                    this.addToolBarBox(this.contents.toolbar.cancelTool, element);
                    this.currentBrowseFile = fileEvent.target.files;
                    console.log(' ❏ File :', this.currentBrowseFile);
                    this.setCurrentBoxBackground();
                    this.addElements(this.contents.event.addElBrowseFile, element);
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
                this.removeElements(this.contents.event.removeStyleBoxType);
                this.currentBox.addClass(this.boxType.boxImg);
                this.setCurrentToolbar(this.contents.toolbar.cancelTool);
                this.addToolBarBox(this.contents.toolbar.cancelTool, element);
                this.currentBrowseFile = event.originalEvent.dataTransfer.files;
                console.log(' ❏ File :', this.currentBrowseFile);
                this.setCurrentBoxBackground();
                this.addElements(this.contents.event.addElBrowseFile, element);
            });
        } else if (action === this.contents.event.triggerBrowseVideo) {
            element.find('#btn-video').click((event) => {
                element.find('.content-browse-video').trigger('click');
                element.find('.content-browse-video').change((fileEvent) => {

                    this.removeElements(this.contents.event.removeStyleBoxType);
                    this.currentBox.addClass(this.boxType.boxVideo);
                    this.setCurrentToolbar(this.contents.toolbar.cancelTool);
                    this.addToolBarBox(this.contents.toolbar.cancelTool, element);
                    this.currentBrowseFile = fileEvent.target.files;
                    console.log(' ❏ Video :', this.currentBrowseFile);
                    this.setCurrentBoxBackground();
                    this.addElements(this.contents.event.addElBrowseVideo, element);
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
                this.removeElements(this.contents.event.removeStyleBoxType);
                this.currentBox.addClass(this.boxType.boxVideo);
                this.setCurrentToolbar(this.contents.toolbar.cancelTool);
                this.addToolBarBox(this.contents.toolbar.cancelTool, element);
                this.currentBrowseFile = event.originalEvent.dataTransfer.files;
                console.log(' ❏ Video :', this.currentBrowseFile);
                this.setCurrentBoxBackground();
                this.addElements(this.contents.event.addElBrowseVideo, element, 'videoSource');
            });
            element.find('.toolbar-browse-video').find('#input-video-url').click(() => {
                element.find('.toolbar-browse-video').find('#input-video-url').focus();
                element.find('.toolbar-browse-video').find('#input-video-url').on('input', this.commonService.debounce((event) => {
                    if (event.target.value) {
                        const url = event.target.value;
                        const youtubeId = this.commonService.getYoubuteId(url);
                        if (youtubeId != null) {
                            this.currentBrowseFile = 'https://www.youtube.com/embed/' + youtubeId[1];
                        } else {
                            console.log('The youtube url is not valid.');
                            this.currentBrowseFile = event.target.value;
                        }
                        this.removeElements(this.contents.event.removeStyleBoxType);
                        this.currentBox.addClass(this.boxType.boxVideo);
                        this.setCurrentToolbar(this.contents.toolbar.cancelTool);
                        this.addToolBarBox(this.contents.toolbar.cancelTool, element);
                        console.log(' ❏ Video :', this.currentBrowseFile);
                        this.setCurrentBoxBackground();
                        this.addElements(this.contents.event.addElBrowseVideo, element, 'videoUrl');

                    }
                }, 500));
            });
        }
    }
    private removeElements(action: string, element?: any) {
        if (action === this.contents.event.removeElBox) {
            this.currentBox.remove();
        } else if (action === this.contents.toolbar.removeTool) {
            this.rootElement.find('.content-box').find('.content-toolbar').remove();
        } else if (action === this.contents.event.removeStyleBorderBox) {
            this.rootElement.find('.content-box').removeClass('border border-primary');
        } else if (action === this.contents.event.removeStyleBoxActive) {
            this.rootElement.find('.content-box').removeClass('content-box-active');
        } else if (action === this.contents.event.removeStyleBoxCurrent) {
            this.rootElement.find('.content-box').removeClass('content-box-current');
        } else if (action === this.contents.event.removeStyleBoxBrowseFileSize) {
            this.rootElement.find('.content-box').removeClass('box-browse-file-size');
        } else if (action === this.contents.event.removeStyleBoxBrowseVideoSize) {
            this.rootElement.find('.content-box').removeClass('box-browse-video-size');
        } else if (action === this.contents.event.removeStyleBoxType) {
            this.currentBox.removeClass(this.boxType.boxInitial);
            this.currentBox.removeClass(this.boxType.boxTextarea);
            this.currentBox.removeClass(this.boxType.boxImg);
            this.currentBox.removeClass(this.boxType.boxBrowseFile);
            this.currentBox.removeClass(this.boxType.boxVideo);
            this.currentBox.removeClass(this.boxType.boxBrowseVideo);
        } else if (action === this.contents.event.removeContent) {
            this.currentBox.find('.content-textarea').remove();
            this.currentBox.find('.content-img').remove();
            this.currentBox.find('.content-file').remove();
            this.currentBox.find('.content-video').remove();
        }
    }
    private addBoxBrowseSizeFile(element: any) {
        this.removeElements(this.contents.event.removeStyleBoxBrowseFileSize);
        element.addClass('box-browse-file-size');
    }
    private addBoxBrowseSizeVideo(element: any) {
        this.removeElements(this.contents.event.removeStyleBoxBrowseFileSize);
        element.addClass('box-browse-video-size');
    }
    private addBoxCurrent(element: any) {
        this.removeElements(this.contents.event.removeStyleBoxCurrent);
        element.addClass('content-box-current');
    }
    private addBoxActive(element: any) {
        this.removeElements(this.contents.event.removeStyleBoxActive);
        element.addClass('content-box-active');
    }
    private addBorderBox(element: any) {
        this.removeElements(this.contents.event.removeStyleBorderBox);
        element.addClass('border border-primary');
    }
    private async addToolBarBox(action: string, element: any) {
        let htmlTootBar;
        this.removeElements(this.contents.toolbar.removeTool);
        this.removeElements(this.contents.event.removeStyleBoxBrowseFileSize);
        this.removeElements(this.contents.event.removeStyleBoxBrowseVideoSize);
        if (action === this.contents.toolbar.addInitalTool) {
            this.removeElements(this.contents.toolbar.removeTool);
            htmlTootBar = '<div class="row content-toolbar toolbar-inital">'
                + '<div class="col-12">'
                + '<div class="row toolbar-picker">'
                + '<div class="col-4"><img id="text-area" src="assets/imgs/contentPage/text-area.svg"></div>'
                + '<div class="col-4"><img id="file-browse" src="assets/imgs/contentPage/image-picker.svg"> </div>'
                + '<div class="col-4"><img id="video-browse" src="assets/imgs/contentPage/video-camera.svg"> </div>'
                + '</div>'
                + '<div class="row toolbar-function">'
                + '<div class="col-12"><img id="trash" src="assets/imgs/contentPage/trash.svg"></div>'
                + '</div>'
                + '</div>'
                + '</div>';
            this.rootElement.find(element).append(htmlTootBar);
        } else if (action === this.contents.toolbar.addBrowseFileTool) {
            htmlTootBar = '<div class="row content-toolbar toolbar-browse-file">'
                + '<div class="col-12">'
                + '<input type="file" class="content-browse-file" id="input-file">'
                + '<img src="assets/imgs/contentPage/browse-file.svg">'
                + '<p class="content-font-title1">Drag & Drop your files,or</p>'
                + '<button id="btn-file" type="button" class="btn btn-primary">Browse</button>'
                + '</div>'
                + '</div>';
            this.rootElement.find(element).append(htmlTootBar);
            this.addBoxBrowseSizeFile(element);
            this.triggerElements(this.contents.event.triggerBrowseFile, element);
        } else if (action === this.contents.toolbar.addBrowseVideoTool) {
            htmlTootBar = '<div class="row content-toolbar toolbar-browse-video">'
                + '<div class="col-5 toolbar-drag">'
                + '<input type="file" class="content-browse-video" accept="video/mp4,video/x-m4v,video/*" id="input-video">'
                + '<img src="assets/imgs/contentPage/browse-file.svg">'
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
            this.triggerElements(this.contents.event.triggerBrowseVideo, element);
        } else if (action === this.contents.toolbar.addTextareaTool) {
            htmlTootBar = '<div class="row content-toolbar toolbar-textarea">'
                + '<div class="col-12">'
                + '</div>'
                + '</div>';
        } else if (action === this.contents.toolbar.cancelTool) {
            htmlTootBar = '<div class="row content-toolbar toolbar-cancel">'
                + '<div class="col-12">'
                + '<div  class="row toolbar-function">'
                + '<div id="cancel" class="col-12">X</div>'
                + '</div>'
                + '</div>'
                + '</div>';
            this.rootElement.find(element).append(htmlTootBar);
        }

        this.triggerElements(this.contents.event.triggerToolbars, element);
    }
    private setCurrentBox(element?) {
        if (element) {
            this.currentBox = element;
        } else {
            this.currentBox = $(this.rootElement).find('.content-box-current');
        }
    }
    private setCurrentBoxBackground(bgColor?: string) {
        // if (bgColor) {
        //     this.currentBox.css('background', bgColor);
        // } else {
        //     if (this.currentToolbar === this.constants.toolbar.addBrowseToolbar) {
        //         this.currentBox.css('background', Constants.element.css.bgWhiteColor);
        //     } else {
        //         this.currentBox.css('background', Constants.element.css.bgNoneColor);
        //     }
        // }
    }
    private setCurrentToolbar(action?) {
        if (action) {
            this.currentToolbar = action;
        } else {
            if (this.currentBox.hasClass(this.boxType.boxBrowseFile)) {
                this.currentToolbar = this.contents.toolbar.addBrowseFileTool;
            } else if (this.currentBox.hasClass(this.boxType.boxTextarea)) {
                this.currentToolbar = this.contents.toolbar.addTextareaTool;
            } else if (this.currentBox.hasClass(this.boxType.boxBrowseVideo)) {
                this.currentToolbar = this.contents.toolbar.addBrowseVideoTool;
            } else if (this.currentBox.hasClass(this.boxType.boxImg) || this.currentBox.hasClass(this.boxType.boxVideo)) {
                this.currentToolbar = this.contents.toolbar.cancelTool;
            } else {
                this.currentToolbar = this.contents.toolbar.addInitalTool;
            }
        }

    }
    private savePage() {
        const requestTran = this.indexDB.transaction(['templates'], 'readwrite');
        const objectStore = requestTran.objectStore('templates');
        this.createDataToSave().then(() => {
            const objectTemplate: ContentModel = {
                id: '01', html: this.rootElement.html(), elements: {
                    subForms: [],
                    boxes: this.boxes,
                    textAreas: this.textAreas,
                    imgs: this.imgs,
                    videos: this.videos
                }
            };
            if (objectStore.get('01')) {
                objectStore.put(objectTemplate);
            } else {
                objectStore.add(objectTemplate);
            }
            requestTran.onsuccess = ((event) => {
                console.log('data has been added to your database.');
            });
            requestTran.onerror = ((event) => {
                console.error('Unable to add data\r\ndata is aready exist in your database! ');
            });
        });


    }
    private addData(action: string, id: string, element?) {
        if (action === this.contents.data.addBoxData) {
            this.boxes.push({
                id,
                isEmpty: true,
                contentType: this.currentContentType.name
            });
        }
    }
    private findData(action: string, element?) {
        if (action === this.contents.data.findIndexBoxData) {
            return this.boxes.findIndex(box => box.id === element.attr('id'));
        }
    }
    private retrieveData(action: string, results: ContentModel) {
        if (action === this.contents.data.addBoxData) {
            this.boxes = results.elements.boxes;
        } else if (action === this.contents.data.addTextAreaData) {
            this.textAreas = results.elements.textAreas;
            this.textAreas.forEach((textArea) => {
                $(this.rootElement).find('[id="' + textArea.id + '"]').val(textArea.value);
            });
        }
        // else if (action === this.constants.data.addDataImg) {
        //     this.imgs = results.elements.imgs;
        //     this.imgs.forEach((img) => {
        //         $(this.rootElement).find('[id="' + img.id + '"]').val(textArea.value);
        //     });
        // }
    }
    private async createDataToSave() {
        await $(this.rootElement).find('.content-textarea').each((index, element) => {
            const elementTextArea = $(element);
            const objectTextArea: TextAreaContentModel = { id: elementTextArea.attr('id'), value: elementTextArea.val() && elementTextArea.val().toString() };
            this.textAreas.push(objectTextArea);
        });
    }
}
