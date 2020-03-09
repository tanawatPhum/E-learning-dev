import { Injectable } from '@angular/core';
import { RulerDetailModel } from '../../models/common/common.model';



@Injectable()
export class ContentService {
    public insertRulerOnParagraph(rulerDetail:RulerDetailModel) {
        let currentCaret = window.getSelection().getRangeAt(0);
        let targetText  =  $(currentCaret.startContainer)
        if(targetText.prop("tagName") !== 'P'){
            targetText =  targetText.parents('p')
        }
        if(targetText.length > 0 ){
            targetText.css('padding-left',rulerDetail.paddingLeft+'%')
            targetText.css('padding-right',100-rulerDetail.paddingRight+'%')   
        }
    }

    
     
     
    
}