import { Component, OnInit, AfterContentInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { catchError, mergeMap, toArray, map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Constants } from 'src/app/global/constants';






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
            removeBox: 'removeBox',
            removeCssBorderBox: 'removeCssBorderBox',
            removeCssToolbar: 'removeCssToolbar',
            removeCssBoxActive: 'removeCssBoxActive'
        }
    };
    constructor(
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
                this.addElements(this.constants.event.addEventBox);
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
            }
            this.removeElements(this.constants.event.removeCssBoxActive);
            this.removeElements(this.constants.event.removeCssToolbar);
            this.removeElements(this.constants.event.removeCssBorderBox);
            this.triggerElements(this.constants.event.triggerCurrentBox);
            await this.rootElement.find('.content-box').draggable({
                containment: this.contentTemplate.nativeElement,
                stack: '.content-box',
                start: ((event) => {
                    const elementFromId: any = $('[id="' + event.target.id + '"]');
                    this.removeElements(this.constants.event.removeCssBoxActive);
                    this.removeElements(this.constants.event.removeCssToolbar);
                    this.addElements(this.constants.event.addCssCurrentBox, elementFromId);
                }),
                stop: ((event) => {
                    setTimeout(() => {
                        this.removeElements(this.constants.event.removeCssBoxActive);
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
                        this.removeElements(this.constants.event.removeCssBoxActive);
                        this.removeElements(this.constants.event.removeCssToolbar);
                        this.addElements(this.constants.event.addCssCurrentBox, elementFromId);
                    }),
                    stop: ((event) => {
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        setTimeout(() => {
                            this.removeElements(this.constants.event.removeCssBoxActive);
                            this.removeElements(this.constants.event.removeCssToolbar);
                            this.addElements(this.constants.event.addCssCurrentBox, elementFromId);
                        });
                    }),
                });
        } else if (action === this.constants.event.addCssCurrentBox) {
            this.removeElements(this.constants.event.removeCssBoxActive);
            this.removeElements(this.constants.event.removeCssToolbar);
            element.addClass('content-box-active');
            this.addBorderBox(element);
            this.addToolBarBox(element);
        } else if (action === this.constants.event.addTextArea) {
            this.removeElements(this.constants.event.removeCssToolbar);
            element.append('<textarea></textarea>');
        }
    }
    private triggerElements(action: string, element?: any) {
        if (action === this.constants.event.triggerCurrentBox) {
            this.rootElement.find('.content-box').click((event) => {
                const elementFromId: any = $('[id="' + event.target.id + '"]');
                this.removeElements(this.constants.event.removeCssBoxActive);
                this.removeElements(this.constants.event.removeCssToolbar);
                this.addElements(this.constants.event.addCssCurrentBox, elementFromId);
            });
        } else if (action === this.constants.event.triggerAttachFileModal) {
            element.modal('show');
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

    private addBorderBox(element: any) {
        this.removeElements(this.constants.event.removeCssBorderBox);
        this.currentBox = element;
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
                this.addElements(this.constants.event.addTextArea,$(this.currentBox));
            }
        });
    }
    private savePage() {
        const requestTran = this.indexDB.transaction(['templates'], 'readwrite');
        const objectStore = requestTran.objectStore('templates');
        const objectPage = {
            id: '01', html: this.rootElement.html(), contents: {
                boxes: [
                    {id: '', hasElement: false}
                ]
            }
        };
        this.retrieveData();
        if (objectStore.get('01')) {
            objectStore.put(objectPage);
        } else {
            objectStore.add(objectPage);
        }
        requestTran.onsuccess = ((event) => {
            console.log('data has been added to your database.');
        });
        requestTran.onerror = ((event) => {
            // this.indexDB.transaction(['templates'], 'readwrite')
            // .objectStore('templates')
            // .put({ id: '01', html: JSON.stringify(this.rootElement.html()) });
            console.error('Unable to add data\r\ndata is aready exist in your database! ');
        });

    }
    private retrieveData() {
        $(this.rootElement).find('.content-box').each((index, element) => {
            console.log($(element).attr('id'));
        });
    }
    





}
