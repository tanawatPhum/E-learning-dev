import { Component, Input } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';

@Component({
    selector: 'commet-content-option',
    templateUrl: 'commet-content-option.html',
    styleUrls: ['commet-content-option.scss']
})
export class CommetContentOptionComponent implements ContentOptionInterFace{
    @Input() parentBox: JQuery<Element>;
    constructor(
        private contentDCtrlService:ContentDataControlService,
    ){

    }
    private removeComment(){
        this.contentDCtrlService.poolContents.comments = this.contentDCtrlService.poolContents.comments.filter((comment)=>comment.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
    }

}
