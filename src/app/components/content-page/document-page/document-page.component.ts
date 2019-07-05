import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Constants } from 'src/app/global/constants';
import { ContentService } from '../../../services/document/content.service';
import { ContentModel } from '../../../models/content/content.model';

@Component({
    templateUrl: 'document-page.component.html',
    styleUrls: ['document-page.component.scss']
})
export class DocumentPageComponent implements OnInit {
    private triggerElement: Subject<string> = new Subject<string>();
    private contentElement: Subject<ContentModel> = new Subject<ContentModel>();
    private contentType =  Constants.document.contents.types;
    private contentTypeSelected: Subject<any> = new Subject<any>();
    private isOpenMenu :boolean  = true;
    constructor(
        private contentService: ContentService
    ) { }
    ngOnInit() {
        this.contentService.loadHTMLFromDB().subscribe((result) => {
           this.contentElement.next(result);
        });
    }
    private addElement() {
        this.triggerElement.next(Constants.event.click.add);
    }
    private savePage() {
        this.triggerElement.next(Constants.event.click.save);
    }
    private newPage() {

    }
    private createContent(contentType: string) {
        this.contentTypeSelected.next(contentType);
    }
    private toggleMenu(){
        this.isOpenMenu = !this.isOpenMenu;
        $('#document-sidenav').slider();
    }
    
}
$(document).ready(function(){
    $("button").click(function(){
      $("#previewDoc").attr("href", "/documentPreview");
    });
  });
