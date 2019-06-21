import { Component, OnInit } from '@angular/core';
import { ContentModel } from '../../../models/content/content.model';
import { ContentService } from '../../../services/document/content.service';
import { Subject } from 'rxjs';


import { element } from 'protractor';
import { TextAreaContentModel } from '../../../models/content/elements/textarea-content.model';
@Component({
    selector: 'document-preview-page',
    templateUrl: 'document-preview-page.component.html',
    styleUrls: ['document-preview-page.component.scss']
})
export class DocumentPreviewPageComponent implements OnInit   {
    constructor(private contentService:ContentService){

    }
    private contentElement: Subject<ContentModel> = new Subject<ContentModel>();

    ngOnInit(){
        this.contentService.loadHTMLFromDB().subscribe((result) => {
            this.contentElement.next(result);
           $('#content-preview').html(result.html)
                 console.log(result)

                let textAreas = result.elements.textAreas;
                textAreas.forEach((obj, idx)=>{
                  $('#'+ obj.id).val(obj.value);
                })
        });
        
        
    }


    
}
$(document).ready(function(){

    $("button").click(()=>{
      $("#content-go-back-create").attr("href", "/document");
    });
    $('#button-question').click(()=>{
      $('#comment-area').val('question icon')
    })
      
    // $('#submit-comment').click(()=>{
    //   var9[] commentpost = $('#comment-area').val()
    // })
    
    $('#submit-comment').on('submit',function(event){
      event.preventDefault()

      var form_data =$(this).serialize();
      $.ajax({
        url:"add_comment.php",
        method:"POST",
        data:form_data,
        dataType:"JSON"
       
        
      })
    })
  });
  









    

 