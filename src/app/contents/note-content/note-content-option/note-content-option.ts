import { Component, Input } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';

@Component({
    selector: 'note-content-option',
    templateUrl: 'note-content-option.html',
    styleUrls: ['note-content-option.scss']
})
export class NoteContentOptionComponent implements ContentOptionInterFace {
    @Input() parentBox: JQuery<Element>;
    constructor(
        private contentDCtrlService:ContentDataControlService,
    ){

    }
    public removeNote(){
        this.contentDCtrlService.poolContents.notes = this.contentDCtrlService.poolContents.notes.filter((note)=>note.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
    }
}
