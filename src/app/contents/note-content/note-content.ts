import { Component, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';
import { NoteContentModel } from 'src/app/models/document/elements/note-content.model';

@Component({
    moduleId: module.id,
    selector: 'note-content',
    templateUrl: 'note-content.html',
    styleUrls: ['note-content.scss']
})
export class NoteContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    @Input() parentBox: JQuery<Element>;
    private rootElement: JQuery<Element>;
    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private contentDCtrlService: ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
    }
    ngAfterViewInit() {
        this.addNote();
    }
    addNote(){
        let note: NoteContentModel = {
            id: this.parentBox.attr('id') + '-progressBar',
            parentId:this.parentBox.attr('id'),
            text:null
        }
        this.contentDCtrlService.poolContents.notes.push(note);
        this.rootElement.find('.note-icon.writing.showCK').hide();
        this.rootElement.find('.note-icon.writing.hideCK').show();
        this.rootElement.find('.note-area').show();
    }
}
