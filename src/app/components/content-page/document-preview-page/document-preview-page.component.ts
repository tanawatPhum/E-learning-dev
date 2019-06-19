import { Component, OnInit } from '@angular/core';
import { ContentModel } from '../../../models/content/content.model';
import { ContentService } from '../../../services/document/content.service';
import { Subject } from 'rxjs';
import { element } from 'protractor';
@Component({
    selector: 'document-preview-page',
    templateUrl: 'document-preview-page.component.html',
    styleUrls: ['document-preview-page.component.scss']
})
export class DocumentPreviewPageComponent implements OnInit {
    constructor(private contentService:ContentService){

    }
    private contentElement: Subject<ContentModel> = new Subject<ContentModel>();

    ngOnInit(){
        this.contentService.loadHTMLFromDB().subscribe((result) => {
            this.contentElement.next(result);
           $('#content-preview').html(result.html)
                 console.log(result)
                 $('.content-textarea').click(function() {
                   console.log($(this).prop('id'))
                  });
     
        });
        
    }
}
$(document).ready(function(){
    $("button").click(function(){
      $("#content-go-back-create").attr("href", "/document");
    });
  });