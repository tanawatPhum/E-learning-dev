import { Component, OnInit, NgModule } from '@angular/core';
import { ContentModel } from '../../../models/content/content.model';
import { ContentService } from '../../../services/document/content.service';
import { Subject } from 'rxjs';
// import * as $ from "jquery";



import { element } from 'protractor';
import { TextAreaContentModel } from '../../../models/content/elements/textarea-content.model';
import { CommentStmt } from '@angular/compiler';
@Component({
    selector: 'document-preview-page',
    templateUrl: 'document-preview-page.component.html',
    styleUrls: ['document-preview-page.component.scss']
})
export class DocumentPreviewPageComponent implements OnInit   {
    constructor(private contentService:ContentService){

    }
    private contentElement: Subject<ContentModel> = new Subject<ContentModel>();

    ngAfterViewInit(){
      // $('#summernote').summernote({
      //   placeholder: 'Hello bootstrap 4',
      //   tabsize: 2,
      //   height: 100
      // });

  }
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
  const form = $("#comment-form")
  const commentList = $(".collection")
  const commentInput = $("#comment_area")
  loadEventListeners();

  function loadEventListeners() {
    document.addEventListener('DOMContentLoaded', getComment); 
    document.getElementById("submit-comment").addEventListener("click", addComment)
   
}

function getComment() {
    let listOfComment;
    if (localStorage.getItem('listOfComment') === null) {
        listOfComment = [];
    } else {
        listOfComment = JSON.parse(localStorage.getItem('listOfComment'));
    }

    listOfComment.forEach(function(commentVal) {
        const li = document.createElement('li');
        li.className = 'collection-item'; 
        li.appendChild(document.createTextNode(commentVal));
        commentList.append(li);
        console.log(commentVal)
    });
}


function addComment() {
    if (commentInput.val() === '') {
        alert('Add a comment');
        return false;
    }

    const li = document.createElement('li'); 
    li.className = 'collection-item'; 
    
    li.appendChild(document.createTextNode(commentInput.val()));
    commentList.append(li);
    storeTaskInLocalStorage(commentInput.val()); 
    
}


function storeTaskInLocalStorage(comment) {
    let listOfComment;
    if (localStorage.getItem('listOfComment') === null) {
        listOfComment = [];
    } else {
        listOfComment = JSON.parse(localStorage.getItem('listOfComment')); 
    }
    listOfComment.push(comment);
    localStorage.setItem('listOfComment', JSON.stringify(listOfComment));
}
 


    $("button").click(()=>{
      $("#content-go-back-create").attr("href", "/document");
    });
    // $("button").click(()=>{
    //   $("$note").attr("href","/note");
    // })
    $('#button-question').click(()=>{
      $('#comment_area').html('#question-icon')
    });
    // $('#submit-comment').click(()=>{
    //   event.preventDefault();
    //   var cmt = $("#comment_area").val()  
    //   var storagediv = $(".storage").html()   
    //   localStorage.cmts = cmt;
    //   localStorage.div = storagediv
    //   console.log(cmt)
    //   // $("#replied-box").html(localStorage.getItem("cmts"));
    //   // $("#test").html(localStorage.getItem("div"));
    
    // })
      
    $("#bold").click(()=>{
      $("#text").css("font-weight","Bold")
    });
    $("#italic").click(()=>{
      $("#text").css("font-style","italic")
    });
    $("#underline").click(()=>{
      $("#text").css("text-decoration", "underline")
    });

    $("#content-like").click((e)=>{
      if($(this).html()=="Like"){
        $(this).html('Unlike');
      }else{
        $(this).html('Like');
      }
      return false
    });

  })

  
  

  
 

  










    

 