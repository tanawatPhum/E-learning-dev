import { Component, Input } from '@angular/core';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ContentOptionInterFace } from '../../interface/content-option.interface';

@Component({
    selector: 'subform-content-option',
    templateUrl: 'subform-content-option.html',
    styleUrls: ['subform-content-option.scss']
})
export class SubformContentOptionComponent implements ContentOptionInterFace {
    @Input() parentBox: JQuery<Element>;
    constructor(
        private contentDCtrlService:ContentDataControlService,
    ){

    }
    private removeSubform(){
        this.contentDCtrlService.poolContents.subFroms = this.contentDCtrlService.poolContents.subFroms.filter((subFrom)=>subFrom.parentBoxId !== this.parentBox.attr('id'));
        this.parentBox.remove();
    }
}
