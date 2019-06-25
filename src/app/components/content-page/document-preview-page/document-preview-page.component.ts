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
      var img = 
      $('#comment_area').html('Q')
    });
    
    $("#submit-comment" ).click(()=>{
      let comment = $('#comment_area').val()
    })

    $(".content-like").click((e)=>{
      
      if($(this).html()=="Like"){
        $(this).html('Unlike');
      }else{
        $(this).html('Like');
      }
      return false
    })
   

    $(".content-reply").click(()=>{

    })
  })
  function Controller($scope) {
    $scope.comments = [];
    $scope.btn_post = function() {
        if ($scope.commentbox != '') {
            $scope.comments.push($scope.commentbox);
            $scope.commentbox = "";
        }
    }
    $scope.post_cmt = function($home) {
        $scope.comments.splice($home, 1);
    }
}
  

      





  










    

 