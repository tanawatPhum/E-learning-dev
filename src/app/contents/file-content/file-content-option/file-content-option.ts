import { Component, Input } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from '../../../services/content/content-data-control.service';

@Component({
    moduleId: module.id,
    selector: 'file-content-option',
    templateUrl: 'file-content-option.html',
    styleUrls: ['file-content-option.scss']
})
export class FileContentOptionComponent implements ContentOptionInterFace {
    constructor(
        private contentDCtrlService: ContentDataControlService,
    ){

    }
    @Input() parentBox: JQuery<Element>;
    private removeFile(){
        this.contentDCtrlService.poolContents.files = this.contentDCtrlService.poolContents.files.filter((file)=>file.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
    }
}
