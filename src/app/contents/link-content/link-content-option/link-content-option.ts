import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';

@Component({
    selector: 'link-content-option',
    templateUrl: 'link-content-option.html',
    styleUrls: ['link-content-option.scss']
})
export class LinkContentOptionComponent implements ContentOptionInterFace, OnInit {
    @Input() parentBox: JQuery<Element>;
    private rootElement: JQuery<Element>;
    private actionCase = {
        browseLink: 'browseLink',
        showLink: 'showLink'
    }
    private currentCase = this.actionCase.browseLink;

    constructor(
        private contentDCtrlService: ContentDataControlService,
        private element: ElementRef
    ) {

    }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.handleSection();
        this.handleOptionLink();
        this.contentDCtrlService.getUpdateContent().subscribe((detail) => {
            this.handleSection();

        })
    }
    handleSection() {
        setTimeout(() => {
            if (this.parentBox.find('.content-toolbar:visible').length > 0) {
                this.currentCase = this.actionCase.browseLink;
            }
            else if (this.parentBox.find('.content-link:visible').length > 0) {
                this.currentCase = this.actionCase.showLink;
                let targetLink = this.contentDCtrlService.poolContents.links.find((link)=>link.parentId === this.parentBox.attr('id'))
                if(targetLink){
                    $('.option-link').find('#link-input-url').val(targetLink.name);
                }
            }
        });
    }
    handleOptionLink(){
        this.rootElement.find('.option-link').find('#link-input-url').unbind().bind('input', (element) => {
            let targetLinkIndex = this.contentDCtrlService.poolContents.links.findIndex(link=>link.parentId === this.parentBox.attr('id'))
            if(targetLinkIndex>=0){
                this.contentDCtrlService.poolContents.links[targetLinkIndex].name =  $(element.currentTarget).val().toString();
                this.parentBox.find('.content-link').text($(element.currentTarget).val().toString());
                this.parentBox.find('.content-link').attr('data-name',$(element.currentTarget).val().toString());
            }
        })
    }
    private removeLink() {
        this.contentDCtrlService.poolContents.links = this.contentDCtrlService.poolContents.links.filter((link) => link.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
    }
}
