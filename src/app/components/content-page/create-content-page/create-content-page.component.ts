import { Component, OnInit, AfterContentInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { catchError, mergeMap, toArray, map } from 'rxjs/operators';
import { Observable, of, Subject, empty } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { BoxContentModel } from 'src/app/models/content/elements/box-content.model';
import { CommonService } from '../../../services/common/common.service';
import { TemplateModel } from 'src/app/models/content/template.model';
import { TextAreaContentModel } from '../../../models/content/elements/textarea-content.model';






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
    private currentToolbar: string;
    private currentElement: any;
    private rootElement;
    private constants = {
        event: {
            addBox: 'addBox',
            addEventBox: 'addEventBox',
            addTextArea: 'addTextArea',
            addCssCurrentBoxBefore: 'addCssCurrentBoxBefore',
            addCssCurrentBoxAfter: 'addCssCurrentBoxAfter',
            addCssBoxBrowseSize: 'addCssBoxBrowseSize',
            triggerCurrentBox: 'triggerCurrentBox',
            triggerAttachFileModal: 'triggerAttachFileModal',
            triggerDragBoxes: 'triggerDragBoxes',
            triggerToolbars: 'triggerToolbars',
            triggerbtnBrowseFile: 'triggerbtnBrowseFile',
            removeBox: 'removeBox',
            removeCssBorderBox: 'removeCssBorderBox',
            removeCssToolbar: 'removeCssToolbar',
            removeCssBoxCurrent: 'removeCssBoxCurrent',
            removeCssBoxActive: 'removeCssBoxActive',
            removeCssBoxBrowseSize: 'removeCssBoxBrowseSize'
        },
        data: {
            addDataBox: 'addDataBox',
            addDataTextArea: 'addDataTextArea',
            retrieveDataBox: 'retrieveDataBox',
            retrieveDataTextArea: 'retrieveDataTextArea',
            findIndexBox: 'findBox',
            findBoxEmpty: 'findBoxEmpty'
        },
        toobar: {
            addInitalToolbar: 'addInitalToolbar',
            addTextareaToolbar: 'addTextareaToolbar',
            addBrowseToolbar: 'addBrowseToolbar'
        }
    };
    private boxes: BoxContentModel[] = new Array<BoxContentModel>();
    private textAreas: TextAreaContentModel[] = new Array<TextAreaContentModel>();
    constructor(
        private commonService: CommonService
    ) { }
    ngOnInit() {
        this.initalDB();
        this.triggerElement.subscribe((event) => {
            if (event === Constants.event.click.add) {
                this.addElements(this.constants.event.addBox).then(() => {
                    this.addElements(this.constants.event.addCssCurrentBoxBefore, this.currentBox);
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
            // console.log('success: ' + this.indexDB);
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
                console.log('☛ Result from Database : ', request.result);
                this.rootElement.html(request.result.html);
                this.addElements(this.constants.event.addEventBox).then(() => {
                    this.retrieveData(this.constants.data.addDataBox, request.result);
                    this.retrieveData(this.constants.data.addDataTextArea, request.result);
                });
            } else {
                console.error('couldn\'t be found in your database!');
            }
        });


    }
    private async addElements(action: string, element?: any) {
        if (action === this.constants.event.addBox || action === this.constants.event.addEventBox) {
            this.setCurrentBox();
            if (action === this.constants.event.addBox) {
                const numberOfBox = this.rootElement.find('.content-box').length;
                this.rootElement.append('<div style="z-index:999" id=box_' + numberOfBox + ' class="content-box"></div>');
                this.setCurrentBox($('#box_' + numberOfBox));
                this.addData(this.constants.data.addDataBox, 'box_' + numberOfBox);
                this.setCurrentToolbar();
            }
            await this.rootElement.find('.content-box').draggable({
                containment: this.contentTemplate.nativeElement,
                stack: '.content-box',
                start: ((event) => {
                    const elementFromId: any = $('[id="' + event.target.id + '"]');
                    this.addElements(this.constants.event.addCssCurrentBoxBefore, elementFromId);
                }),
                stop: ((event) => {
                    setTimeout(() => {
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        this.addElements(this.constants.event.addCssCurrentBoxAfter, elementFromId);
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
                        console.log('testyy');
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        this.addElements(this.constants.event.addCssCurrentBoxBefore, elementFromId);
                    }),
                    stop: ((event) => {
                        console.log('testxx');
                        const elementFromId: any = $('[id="' + event.target.id + '"]');
                        setTimeout(() => {
                            this.addElements(this.constants.event.addCssCurrentBoxAfter, elementFromId);
                        });
                    }),
                });
            this.triggerElements(this.constants.event.triggerCurrentBox);
            this.triggerElements(this.constants.event.triggerDragBoxes);
            this.triggerElements(this.constants.event.triggerToolbars);
            this.triggerElements(this.constants.event.triggerToolbars, this.currentBox);
        } else if (action === this.constants.event.addCssCurrentBoxBefore) {
            this.setCurrentBox(element);
            this.addBoxCurrent(element);
            this.addBorderBox(element);
            this.addBoxActive(element);
            this.setCurrentToolbar();
            const IndexBox = this.findData(this.constants.data.findIndexBox, element);
            if (IndexBox !== -1) {
                if (this.boxes[IndexBox].isEmpty) {
                    this.addToolBarBox(this.currentToolbar, element);
                }
            }
        } else if (action === this.constants.event.addCssCurrentBoxAfter) {
            this.setCurrentBox(element);
            this.addBoxCurrent(element);
            this.addBorderBox(element);
            this.setCurrentToolbar();
            this.removeElements(this.constants.event.removeCssBoxActive);
            const IndexBox = this.findData(this.constants.data.findIndexBox, element);
            if (IndexBox !== -1) {
                if (this.boxes[IndexBox].isEmpty) {
                    this.addToolBarBox(this.currentToolbar, element);
                }
            }
        } else if (action === this.constants.event.addTextArea) {
            this.setCurrentToolbar(this.constants.toobar.addTextareaToolbar);
            this.addToolBarBox(this.currentToolbar, element);
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
                const elementFromId: any = this.currentElement = $('[id="' + event.target.id + '"]');
                if (/_textarea/.test(event.target.id)) {
                    $(elementFromId).focus();
                }
                if (event.target.id && !/_textarea/.test(event.target.id)) {
                    this.setCurrentBox(elementFromId);
                } else {
                    this.setCurrentBox(elementFromId.parent());
                }
                this.currentBox.draggable({ disabled: true });
                if (!this.currentBox.hasClass('content-box-current')) {
                    this.addElements(this.constants.event.addCssCurrentBoxBefore, this.currentBox);
                } else {
                    this.addElements(this.constants.event.addCssCurrentBoxAfter, this.currentBox);
                }
            });
        } else if (action === this.constants.event.triggerAttachFileModal) {
            element.modal('show');
        } else if (action === this.constants.event.triggerDragBoxes) {
            if (this.commonService.isPlatform === Constants.platform.device) {
                this.rootElement.find('.content-box').on('touchmove', (event) => {
                    this.rootElement.find('.content-box').draggable({ disabled: false, cancel: '' });
                });
            } else {
                this.rootElement.find('.content-box').mousemove(() => {
                    this.rootElement.find('.content-box').draggable({ disabled: false, cancel: '' });
                });
            }
        } else if (action === this.constants.event.triggerToolbars) {
            this.rootElement.find('.content-toolbar').click((event) => {
                event.stopPropagation();
                if (event.target.id === 'img-picker') {
                    this.setCurrentToolbar(this.constants.toobar.addBrowseToolbar);
                    this.addToolBarBox(this.currentToolbar,this.currentBox);
                    // this.triggerElements(this.constants.event.triggerAttachFileModal, $('#attach-file-modal'));
                } else if (event.target.id === 'trash') {
                    this.removeElements(this.constants.event.removeBox, this.currentBox);
                } else if (event.target.id === 'text-area') {
                    this.addElements(this.constants.event.addTextArea, this.currentBox);
                }
            });
        } else if (action === this.constants.event.triggerbtnBrowseFile) {
            element.find('#btn-file').click((event) => {
                element.find('.content-browse-file').trigger('click');
            });
            element.find('.toolbar-browse').on('dragover', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
            element.find('.toolbar-browse').on('dragleave',  (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
            element.find('.toolbar-browse').on('drop', (event) => {
                event.preventDefault();
                event.stopPropagation();
                alert('Dropped!');
            });
            // element.find('.toolbar-browse').on('mouseover', (event) => {
            //     console.log('test');
            //     //    event.preventDefault();
            //     //     event.stopPropagation();

            // });
            // console.log(element);
            // element.find('.content-toolbar').find('.content-browse-file').find('button').click((event) => {
            //     console.log('xxxxx');
            //     element.find('.content-browse-file').trigger('click');
            // });
        }
    }
    private removeElements(action: string, element?: any) {
        if (action === this.constants.event.removeBox) {
            element.remove();
        } else if (action === this.constants.event.removeCssToolbar) {
            this.rootElement.find('.content-toolbar').remove();
        } else if (action === this.constants.event.removeCssBorderBox) {
            this.rootElement.find('.content-box').removeClass('border border-primary');
        } else if (action === this.constants.event.removeCssBoxActive) {
            this.rootElement.find('.content-box').removeClass('content-box-active');
        } else if (action === this.constants.event.removeCssBoxCurrent) {
            this.rootElement.find('.content-box').removeClass('content-box-current');
        } else if (action === this.constants.event.removeCssBoxBrowseSize) {
            this.rootElement.find('.content-box').removeClass('box-browse-size');
        }
    }
    private addBoxBrowseSize(element: any) {
        this.removeElements(this.constants.event.removeCssBoxBrowseSize);
        element.addClass('box-browse-size');
    }
    private addBoxCurrent(element: any) {
        this.removeElements(this.constants.event.removeCssBoxCurrent);
        element.addClass('content-box-current');
    }
    private addBoxActive(element: any) {
        this.removeElements(this.constants.event.removeCssBoxActive);
        element.addClass('content-box-active');
    }
    private addBorderBox(element: any) {
        this.removeElements(this.constants.event.removeCssBorderBox);
        element.addClass('border border-primary');
    }
    private async addToolBarBox(action: string, element: any) {
        let htmlTootBar;
        this.removeElements(this.constants.event.removeCssToolbar);
        this.removeElements(this.constants.event.removeCssBoxBrowseSize);
        if (action === this.constants.toobar.addInitalToolbar) {
            this.removeElements(this.constants.event.removeCssToolbar);
            htmlTootBar = '<div class="row content-toolbar toolbar-inital">'
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
        }
        if (action === this.constants.toobar.addBrowseToolbar) {
            htmlTootBar = '<div class="row content-toolbar toolbar-browse">'
                + '<div class="col-12">'
                + '<input type="file" class="content-browse-file" id="input-file">'
                + '<img src="assets/imgs/contentPage/browse-file.svg">'
                + '<p class="content-font-title1">Drag & Drop your files,or</p>'
                + '<button id="btn-file" type="button" class="btn btn-primary">Browse</button>'
                + '</div>'
                + '</div>';
            this.rootElement.find(element).append(htmlTootBar);
            this.addBoxBrowseSize(element);
            this.triggerElements(this.constants.event.triggerbtnBrowseFile, element);
        }
        if (action === this.constants.toobar.addTextareaToolbar) {
            htmlTootBar = '<div class="row content-toolbar toolbar-textarea">'
                + '<div class="col-12">'
                + '</div>'
                + '</div>';
        }

        this.triggerElements(this.constants.event.triggerToolbars, element);
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
            if (this.currentBox.find('.content-toolbar').hasClass('toolbar-inital')) {
                this.currentToolbar = this.constants.toobar.addInitalToolbar;
            } else if (this.currentBox.find('.content-toolbar').hasClass('toolbar-browse')) {
                this.currentToolbar = this.constants.toobar.addBrowseToolbar;
            } else if (this.currentBox.find('.content-toolbar').hasClass('toolbar-textarea')) {
                this.currentToolbar = this.constants.toobar.addTextareaToolbar;
            } else {
                this.currentToolbar = this.constants.toobar.addInitalToolbar;
            }
        }

    }
    private savePage() {
        const requestTran = this.indexDB.transaction(['templates'], 'readwrite');
        const objectStore = requestTran.objectStore('templates');
        this.createDataToSave().then(() => {
            // this.removeElements(this.constants.event.removeCssBoxActive);
            // this.removeElements(this.constants.event.removeCssBorderBox);
            // this.removeElements(this.constants.event.removeCssToolbar);
            const objectTemplate: TemplateModel = {
                id: '01', html: this.rootElement.html(), elements: {
                    boxes: this.boxes,
                    textAreas: this.textAreas
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
        if (action === this.constants.data.addDataBox) {
            this.boxes.push({
                id,
                isEmpty: true
            });
        }
    }
    private findData(action: string, element?) {
        if (action === this.constants.data.findIndexBox) {
            return this.boxes.findIndex(box => box.id === element.attr('id'));
        }
    }
    private retrieveData(action: string, results: TemplateModel) {
        if (action === this.constants.data.addDataBox) {
            this.boxes = results.elements.boxes;
        } else if (action === this.constants.data.addDataTextArea) {
            this.textAreas = results.elements.textAreas;
            this.textAreas.forEach((textArea) => {
                $(this.rootElement).find('[id="' + textArea.id + '"]').val(textArea.value);
            });
        }
    }
    private async createDataToSave() {
        await $(this.rootElement).find('.content-textarea').each((index, element) => {
            const elementTextArea = $(element);
            const objectTextArea: TextAreaContentModel = { id: elementTextArea.attr('id'), value: elementTextArea.val() && elementTextArea.val().toString() };
            this.textAreas.push(objectTextArea);
        });
    }
}
