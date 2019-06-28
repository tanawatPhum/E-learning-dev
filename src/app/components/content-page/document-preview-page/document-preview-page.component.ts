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
  getComment();
  function loadEventListeners() {
    // document.addEventListener('DOMContentLoaded', ); 
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
        const li = document.createElement('div');

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
    const li = document.createElement('div'); 
    const div = document.createElement('div');
   const divrow = document.createElement('div');
   const divcol1 = document.createElement('div');
   const divcol10 = document.createElement('div');
   const p1 = document.createElement('p');
   const p2 = document.createElement('p');
   const pcmt = document.createElement('p');
   divcol1.className = 'col-md-1';
   divcol10.className = 'col-md-10';
   p1.className = 'name';
   pcmt.className = 'comment'
   divrow.className = 'row';
   div.className = 'card-body';
  //  $(".card-body").html(divrow)
  //  $(".row").html('<div class="col-md-1" style="padding: 13px"><img src="https://image.ibb.co/jw55Ex/def_face.jpg" class="img img-rounded img-fluid" style="max-width: 90%; margin-top: 0px;" /></div><div class="col-md-10"><p><a class="float-left"><strong>Name</strong></a></p> <div class="clearfix"></div> <p style="margin-top: 10px">'+commentInput+'</p>')
    li.className = 'collection-item'; 
    // $(".collection-item").html('<div class="collection-item" style="font-size: 13px"><div class="row"><div class="col-md-1" style="padding: 13px"><img src="https://image.ibb.co/jw55Ex/def_face.jpg" class="img img-rounded img-fluid" style="max-width: 90%; margin-top: 0px;" /></div><div class="col-md-10"><p><a class="float-left"><strong>Name</strong></a></p> <div class="clearfix"></div> <p style="margin-top: 10px">'+commentInput.val()+'</p></div></div></div>')
    // $(".collection-item").html(div)
    // div.appendChild(document.createTextNode(commentInput.val()));
    div.appendChild(divrow)
    divrow.appendChild(divcol1)
    divcol1.prepend(divcol10)
    divcol10.appendChild(pcmt)
    pcmt.appendChild(document.createTextNode(commentInput.val()))
    li.appendChild(div);
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
    
    $("#bold").click(()=>{
      $("#text").css("font-weight","Bold")
    });
    $("#italic").click(()=>{
      $("#text").css("font-style","italic")
    });
    $("#underline").click(()=>{
      $("#text").css("text-decoration", "underline")
    });

    $('#save-button').click(()=>{
      var container = document.querySelector('#text');
    var anchor = document.querySelector('a');

    anchor.onclick = function() {
    anchor.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(container.val());
    anchor.download = 'export.txt';
};
    })

    $("#content-like").click((e)=>{
      if($(this).html()=="Like"){
        $(this).html('Unlike');
      }else{
        $(this).html('Like');
      }
      return false
    });

  })

  
  

  
 

  










    

 