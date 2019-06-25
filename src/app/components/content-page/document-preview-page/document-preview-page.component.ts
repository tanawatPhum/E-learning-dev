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
      $('#comment_area').html('#question-icon')
      
    });
    
    $("#submit-comment" ).click(()=>{
      let comment = $('#comment_area').val()
    })
    $("#bold").click(()=>{
      $("#text").css("font-weight","Bold")
    })
    $("#italic").click(()=>{
      $("#text").css("font-style","italic")
    })
    $("#underline").click(()=>{
      $("#text").css("text-decoration", "underline")
    })

    $("#content-like").click((e)=>{
      if($(this).html()=="Like"){
        $(this).html('Unlike');
      }else{
        $(this).html('Like');
      }
      return false
    })
 
  })
  
  

  function Controller($scope) {
    "use strict";
    $scope.comments = [];
     $scope.btn_post = function() {
         if ($scope.cmtName != '') {
             $scope.comments.push($scope.cmtName);
             $scope.cmtName = "";
         }
     }
     $scope.post_cmt = function($home) {
         $scope.comments.splice($home, 1);
     }
 }
  

      





  










    

 