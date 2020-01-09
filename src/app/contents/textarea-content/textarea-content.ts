import { Component, OnInit, Input, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { TextAreaContentModel } from 'src/app/models/document/elements/textarea-content.model';

@Component({
    moduleId: module.id,
    selector: 'textarea-content',
    templateUrl: 'textarea-content.html',
    styleUrls: ['textarea-content.scss']
})
export class TextareaContentComponent implements OnInit,ContentInterFace,AfterViewInit{
    @Input() parentBox: JQuery<Element>
    private rootElement:JQuery<Element>;
    @HostListener('click',['$event']) onClick(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        $(event.currentTarget).find('.content-textarea').focus();
    }
    // @HostListener('blur',['$event']) onBlur(event) {
    //     this.parentBox.draggable({ disabled: false });
    // }

    constructor(
        private commonService :CommonService,
        private documentService:DocumentService,
        private contentDCtrlService:ContentDataControlService,
        private element: ElementRef
        
        ){}

        ngOnInit() {
            this.rootElement = $(this.element.nativeElement); 
        }
        ngAfterViewInit(){
            this.parentBox.draggable({
                handle: this.parentBox.find('.content-box-label')
            })
           this.addTextarea()
        }

        addTextarea(){
            let textArea: TextAreaContentModel = {parentId:this.parentBox.attr('id'), id: this.parentBox.attr('id')+'-img', value: '' };
            this.contentDCtrlService.poolContents.textAreas.push(textArea);
        }
        handleTextarea(event?,action?){
            if(action==='input'){
               let targetIndexTextArea =  this.contentDCtrlService.poolContents.textAreas.findIndex((textarea)=>textarea.parentId  === this.parentBox.attr('id'));
               if(targetIndexTextArea >= 0){
                this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].value  = $(event.target).text().toString();
                console.log( this.contentDCtrlService.poolContents.textAreas)
               }
            }
        }

        
}
