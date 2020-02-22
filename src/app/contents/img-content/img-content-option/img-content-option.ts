import { Component, Input } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { UpdateContentModel } from '../../../models/common/common.model';
import { Constants } from '../../../global/constants';

@Component({
    moduleId: module.id,
    selector: 'img-content-option',
    templateUrl: 'img-content-option.html',
    styleUrls: ['img-content-option.scss']
})
export class ImgContentOptionComponent implements ContentOptionInterFace {
    @Input() parentBox: JQuery<Element>;
    constructor(
        private contentDCtrlService:ContentDataControlService,
    ){

    }
    public removeImg(){
        this.contentDCtrlService.poolContents.imgs = this.contentDCtrlService.poolContents.imgs.filter((img)=>img.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
        let updateContent = new UpdateContentModel();
        updateContent.actionCase = Constants.document.contents.lifeCycle.delete;
        this.contentDCtrlService.updateContent =  updateContent;
    }
}
