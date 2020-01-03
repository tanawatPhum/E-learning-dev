import { Component, Input } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';

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
    private removeImg(){
        this.contentDCtrlService.poolContents.imgs = this.contentDCtrlService.poolContents.imgs.filter((img)=>img.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
    }
}
