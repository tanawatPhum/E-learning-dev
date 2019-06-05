import { Component, OnInit, AfterContentInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { catchError, mergeMap, toArray, map } from 'rxjs/operators';
import { Observable, of, Subject, empty } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { BoxContentModel } from 'src/app/models/box-content.model';
import { CommonService } from '../../../services/common/common.service';






@Component({
    selector: 'app-create-content-page',
    templateUrl: 'create-content-page.component.html',
    styleUrls: ['create-content-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateContentPageComponent implements OnInit, AfterContentInit {
    @ViewChild('contentTemplate', { static: true }) contentTemplate: ElementRef;
    @Input() triggerElement: Subject<string>;
    private indexDB: any;
    private currentBox: any;
    private rootElement;
    private constants = {
        event: {
            addBox: 'addBox',
            addEventBox: 'addEventBox',
            addTextArea: 'addTextArea',
            addCssCurrentBox: 'addEventCurrentBox',
            triggerCurrentBox: 'triggerCurrentBox',
            triggerAttachFileModal: 'triggerAttachFileModal',
            triggerDragAllBoxes: 'triggerDrag',
            removeBox: 'removeBox',
            removeCssBorderBox: 'removeCssBorderBox',
            removeCssToolbar: 'removeCssToolbar',
            removeCssBoxActive: 'removeCssBoxActive'
        },
        data: {
            findIndexBox: 'findBox',
            findBoxEmpty: 'findBoxEmpty'
        }
    };
    private boxes: BoxContentModel[] = new Array<BoxContentModel>();
    constructor(
        private commonService: CommonService
    ) { }
    ngOnInit() {
        this.initalDB();
        this.triggerElement.subscribe((event) => {
            if (event === Constants.event.click.add) {
                this.addElements(this.constants.event.addBox).then(() => {
                    this.addElements(this.constants.event.addCssCurrentBox, this.currentBox);
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
    private async initalDB() {
        const requestDB = await window.indexedDB.open('e-learning', 1);
        requestDB.onerror = ((error) => {
            console.error('error: ', error);
        });
        requestDB.onsuccess = ((event) => {
            this.indexDB = requestDB.result;
            this.loadHTMLFromDB();
            console.log('success: ' + this.indexDB);
        });
        requestDB.onupgradeneeded = ((event: any) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore('templates', { keyPath: 'id' });
        });
    }
    private loadHTMLFromDB() {
        const transaction = this.indexDB.transaction(['templates']);
        const objectStore = transaction.objectStore('templates');
        const request = objectStore.get('01');

        request.onerror = ((event) => {
            console.error('Unable to retrieve daa from database!');
        });

        request.onsuccess = ((event) => {
            // Do something with the request.result!
            if (request.result) {
                this.rootElement.html(request.result.html);
                this.addElements(this.constants.event.addEventBox).then(() => {
                    this.retrieveData(request.result);
                });
                console.log('request.result', request.result);
            } else {
                console.error('couldn\'t be found in your database!');
            }
        });


    }
    private async addElements(action: string, element?: any) {
        if (action === this.constants.event.addBox || action === this.constants.event.addEventBox) {
            if (action === this.constants.event.addBox) {
                const numberOfBox = this.rootElement.find('.content-box').length;
                this.rootElement.append('<div style="z-index:999" id=box_' + numberOfBox + ' class="content-box"></div>');
                this.currentBox = $('#box_' + numberOfBox);
                this.boxes.push({
                    id: 'box_' + numberOfBox,
                    html: null,
                    isEmpty: true
                });
            }
            this.triggerElements(this.constants.event.triggerCurrentBox);
            await this.rootElement.find('.content-box').draggable({
                containment: this.contentTemplate.nativeElement,
                stack: '.content-box',
                start: ((event) => {
                    const elementFromId: any = $('[id="' + event.target.id + '"]');
                    this.addElements(this.constants.event.addCssCurrentBox, elementFromId);
                }),
                stop: ((event) => {
                    setTimeout(() => {
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        this.addElements(this.constants.event.addCssCurrentBox, elementFromId).then(() => {
                            this.removeElements(this.constants.event.removeCssBoxActive);
                        });

                    });
                }),
            })
                .resizable({
                    handles: '',
                })
                .resizable({
                    handles: 'n, e, s, w',
                    containment: this.contentTemplate.nativeElement,
                    minHeight: Constants.element.limit.resize.height,
                    minWidth: Constants.element.limit.resize.width,
                    start: ((event) => {
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        this.addElements(this.constants.event.addCssCurrentBox, elementFromId);
                    }),
                    stop: ((event) => {
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        setTimeout(() => {
                            this.addElements(this.constants.event.addCssCurrentBox, elementFromId).then(() => {
                                this.removeElements(this.constants.event.removeCssBoxActive);
                            });
                        });
                    }),
                });
            this.triggerElements(this.constants.event.triggerDragAllBoxes);
        } else if (action === this.constants.event.addCssCurrentBox) {
            this.currentBox = element;
            this.addBoxActive(element);
            this.addBorderBox(element);
            const IndexBox = this.findData(this.constants.data.findIndexBox, element);
            if (IndexBox !== -1) {
                if (this.boxes[IndexBox].isEmpty) {
                    this.addToolBarBox(element);
                }
            }
        } else if (action === this.constants.event.addTextArea) {
            this.removeElements(this.constants.event.removeCssToolbar);
            const IndexBox = this.findData(this.constants.data.findIndexBox, element);
            if (IndexBox !== -1) {
                this.boxes[IndexBox].isEmpty = false;
            }
            element.append('<textarea id="' + element.attr('id') + '_textarea" class="content-textarea"></textarea>');
            element.find('textarea').focus();
        }
    }
    private triggerElements(action: string, element?: any) {
        if (action === this.constants.event.triggerCurrentBox) {
            this.rootElement.find('.content-box').click((event) => {
                let elementFromId: any = $('[id="' + event.target.id + '"]');
                if (event.target.id && !/_textarea/.test(event.target.id)) {
                    this.currentBox = elementFromId;
                } else {
                    elementFromId = $(this.currentBox);
                }
                $(elementFromId).draggable({ disabled: true });
                if (!$(elementFromId).hasClass('border border-primary')) {
                    this.addElements(this.constants.event.addCssCurrentBox, elementFromId);
                } else {
                    this.removeElements(this.constants.event.removeCssBoxActive);
                    this.removeElements(this.constants.event.removeCssBorderBox);
                    this.removeElements(this.constants.event.removeCssToolbar);
                }
            });
        } else if (action === this.constants.event.triggerAttachFileModal) {
            element.modal('show');
        } else if (action === this.constants.event.triggerDragAllBoxes) {
            if (this.commonService.isPlatform === Constants.platform.device) {
                this.rootElement.find('.content-box').on('touchmove', (event) => {
                    this.rootElement.find('.content-box').draggable({ disabled: false, cancel: '' });
                });
            } else {
                this.rootElement.find('.content-box').mousemove(() => {
                    this.rootElement.find('.content-box').draggable({ disabled: false, cancel: '' });
                });
            }
        }
    }
    private removeElements(action: string, element?: any) {
        if (action === this.constants.event.removeBox) {
            element.remove();
        } else if (action === this.constants.event.removeCssBorderBox) {
            this.rootElement.find('.content-box').removeClass('border border-primary');
        } else if (action === this.constants.event.removeCssBoxActive) {
            this.rootElement.find('.content-box').removeClass('content-box-active');
        } else if (action === this.constants.event.removeCssToolbar) {
            this.rootElement.find('.content-toolbar').remove();
        }
    }
    private addBoxActive(element: any) {
        this.removeElements(this.constants.event.removeCssBoxActive);
        element.addClass('content-box-active');
        this.addBorderBox(element);
    }
    private addBorderBox(element: any) {
        this.removeElements(this.constants.event.removeCssBorderBox);
        $(element).addClass('border border-primary');
    }
    private async addToolBarBox(element: any) {
        this.removeElements(this.constants.event.removeCssToolbar);
        const htmlTootBar = '<div class="row content-toolbar">'
            + '<div class="col-12">'
            + '<div class="row toolbar-picker">'
            + '<div class="col-4"><img id="text-area" src="assets/imgs/contentPage/text-area.svg"></div>'
            + '<div class="col-4"><img id="img-picker" src="assets/imgs/contentPage/image-picker.svg"> </div>'
            + '<div class="col-4"><img src="assets/imgs/contentPage/video-camera.svg"> </div>'
            + '</div>'
            + '<div class="row toolbar-function">'
            + '<div class="col-12"><img id="trash" src="assets/imgs/contentPage/trash.svg"></div>'
            + '</div>'
            + '</div>'
            + '</div>';
        this.rootElement.find(element).append(htmlTootBar);
        this.rootElement.find('.content-toolbar').click((event) => {
            event.stopPropagation();
            if (event.target.id === 'img-picker') {
                this.triggerElements(this.constants.event.triggerAttachFileModal, $('#attach-file-modal'));
            } else if (event.target.id === 'trash') {
                this.removeElements(this.constants.event.removeBox, $(this.currentBox));
            } else if (event.target.id === 'text-area') {
                this.addElements(this.constants.event.addTextArea, $(this.currentBox));
            }
        });
    }
    private savePage() {
        const requestTran = this.indexDB.transaction(['templates'], 'readwrite');
        const objectStore = requestTran.objectStore('templates');
        const objectPage = {
            id: '01', html: this.rootElement.html(), contents: {
                boxes: this.boxes
            }
        };
        if (objectStore.get('01')) {
            objectStore.put(objectPage);
        } else {
            objectStore.add(objectPage);
        }
        requestTran.onsuccess = ((event) => {
            console.log('data has been added to your database.');
        });
        requestTran.onerror = ((event) => {
            console.error('Unable to add data\r\ndata is aready exist in your database! ');
        });

    }
    private findData(action, element?) {
        if (action === this.constants.data.findIndexBox) {
            return this.boxes.findIndex(box => box.id === element.attr('id'));
        }
    }
    private retrieveData(results) {
        this.boxes = [];
        if (results) {
            if (results.contents.boxes.length === 0) {
                $(this.rootElement).find('.content-box').each((index, element) => {
                    const object: BoxContentModel = {
                        id: $(element).attr('id'),
                        isEmpty: true,
                        html: ''
                    };
                    this.boxes.push(object);
                });
            } else {
                this.boxes = results.contents.boxes;
            }
        }
    }
}
