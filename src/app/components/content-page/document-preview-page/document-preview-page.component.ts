import { Component, OnInit, NgModule, ViewEncapsulation } from '@angular/core';
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
    styleUrls: ['document-preview-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentPreviewPageComponent implements OnInit   {
    constructor(private contentService:ContentService){

    }
    private contentElement: Subject<ContentModel> = new Subject<ContentModel>();
    private toggleQuestionIcon:boolean = false;

    // ngAfterViewInit(){
    //   // $('#summernote').summernote({
    //   //   placeholder: 'Hello bootstrap 4',
    //   //   tabsize: 2,
    //   //   height: 100
    //   // });
    // }
    ngOnInit(){
  const form = $("#comment-form")
  const commentList = $(".collection")
  const commentInput = $("#comment_area")
  // this.loadEventListeners();
  // this.getComment();
 
        this.contentService.loadHTMLFromDB().subscribe((result) => {
            this.contentElement.next(result);
           $('#content-preview').html(result.html)
                 console.log(result)

                let textAreas = result.elements.textAreas;
                textAreas.forEach((obj, idx)=>{
                  $('#'+ obj.id).val(obj.value);
                })
        });
        $("button").click(()=>{
          $("#content-go-back-create").attr("href", "/document");
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
        // anchor.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(container.val());
        anchor.download = 'export.txt';
            };
        })
this.getComment();
this.listeningEvent();
        
    }
   
    getComment() {
    const form = $("#comment-form")
    const commentList = $(".collection")
    const replybox = $('.storage-reply')
    const commentInput = $("#comment_area")
    let listOfComment;
    if (localStorage.getItem('listOfComment') === null) {
        listOfComment = [];
    } else {
        listOfComment = JSON.parse(localStorage.getItem('listOfComment'));
    }
    listOfComment.forEach((commentVal,repl)=> {

        commentList.append(this.replyParent(commentVal));
      //  replybox.append(this.replyParent(repl))
        console.log(commentVal)
    });
    $('.content-reply').css('padding-left','10px');
    this.listeningEvent();
}


  addComment() {
  const form = $("#comment-form")
  const commentList = $(".collection")
  const commentInput = $("#comment_area")
  const replyInput = $('#reply_area')
  if (commentInput.val() === '') {
      alert('Add a comment');
      return false;
  }
 
  commentList.append(this.replyParent(commentInput.val()));
this.storeTaskInLocalStorage(commentInput.val()); 

$('.content-reply').css('padding-left','10px');

this.toggleQuestionIcon =  false;
this.listeningEvent();

}


 storeTaskInLocalStorage(comment) {
  let listOfComment;
  if (localStorage.getItem('listOfComment') === null) {
      listOfComment = [];
  } else {
      listOfComment = JSON.parse(localStorage.getItem('listOfComment')); 
  }
  listOfComment.push(comment);
  localStorage.setItem('listOfComment', JSON.stringify(listOfComment));
}

 addQuestionFlag(){
        this.toggleQuestionIcon  = !this.toggleQuestionIcon;
    }

replyParent(cmt){
 
  return '<br/>' +'<div class="storage-reply" style="font-size: 16px;">'+
              '<div class="row">'+
                  '<div class="col-md-1" style="padding: 13px">'+
                       '<img src="https://image.ibb.co/jw55Ex/def_face.jpg" class="img img-rounded img-fluid" style="max-width: 90%;    margin-top: 0px;" />'+
                    '</div>'+
                  '<div class="col-md-10">'+
                      '<p><a class="float-left"><strong>Name</strong></a></p>'+
                      '<div class="clearfix"></div>'+             
                      '<p class="comment" style="margin-top: 10px">'+cmt+'</p>'+
                      '<p><span><a class="float-left text-info content-like ">Like</a></span>'+
                      '<a class="float-left text-info content-reply " style=" padding-left: 10px;">Reply </a>'+
                      '</p>'+
                    '</div>'+
               '</div>'+
          '</div>'+'<hr>'
          // '<br/>'

}
replyChild(rep){
  return '<div class="storage-child" style="font-size: 13px">'+
  '<div class="row">'+
      '<div class="col-md-1" style="padding: 13px">'+
           '<img src="https://image.ibb.co/jw55Ex/def_face.jpg" class="img img-rounded img-fluid" style="max-width: 90%;    margin-top: 0px;" />'+
        '</div>'+
      '<div class="col-md-10">'+
          '<p><a class="float-left"><strong>Name</strong></a></p>'+
          '<div class="clearfix"></div>'+             
          '<p class="comment" style="margin-top: 10px">'+rep+'</p>'+
          '<p><span><a class="float-left text-info reply-like ">Like</a></span>'+
          '<a class="float-left text-info reply-content " style=" padding-left: 10px;">Reply</a>'+
          '</p>'+
        '</div>'+
   '</div>'+
'</div>'+
'<br/>'
}

addTextBox(id){
return '<div id="comment_box_'+id+'" class="container container-comment">'+
   '<div class="text-box">'+
      '<div class="row">'+
          '<div class="col-md-1" style="padding: 13px">'+
              '<img src="https://image.ibb.co/jw55Ex/def_face.jpg" id="user_img" class="img img-rounded img-fluid" />'+
          '</div>'+
          '<div class="col-md-10">'+
              '<div id="comment-form">'+
                  '<div class="content-form-group">'+
                      '<textarea  class="form-control" name="comment" id="reply_area" placeholder="leave your comment here..." class="form-control "></textarea>'+
                 '</div>'+
             '</div>'+
             '<div style="margin-top: 15px;">'+
             '<div class="image-upload">'+
             '<label for="file">'+
             '<img src="assets/imgs/previewPage/clip.svg" style="width: 10px;"/>'+
             '</label>'+
             '<label class="question-icon" style="margin-left: 10px">'+
             '<img class="button-question" src="assets/imgs/previewPage/@.svg" >'+
             '</label>'+
             '<input type="file" id="file" style=" margin-left: 10px;">'+
             '<button type="submit" class="btn btn-primary submit-reply" id="'+id+'" >Post Comment</button>'
             +
             '</div>'+
             '</div>'+
             '</div>'+
             '</div>'+
             '</div>'+
             '</div>'
}
listeningEvent(){
  const commentInput = $("#comment_area")
  const replyInpt = $('#reply_area')
  $('.content-reply').unbind();
  $('.content-like').unbind();
  $('.reply-content').unbind();
  $('.button-question').click(()=>{
    console.log("question")
    $('.comment').last().prepend('<img class="button-question" style="width:15px" src="assets/imgs/previewPage/@.svg" >')
  });
  
  $('.content-reply').click((repl)=>{
    if(!$(repl.target).next().hasClass('container-comment')){
      $('.container-comment').remove() 
      const commentBoxId =  $('.storage-reply').length + 1;
      $(repl.target).after(this.addTextBox(commentBoxId))
      $('.submit-reply').unbind();
      $('.submit-reply').click((event)=>{
  
        if($('#reply_area').val()=== ''){
          alert('Add Reply');
          return false
        }
        this.storeTaskInLocalStorage($('#reply_area').val())
        event.stopPropagation();
        
        $("#comment_box_"+event.target.id).removeClass('container-comment')
       $("#comment_box_"+event.target.id).html(this.replyParent($('#reply_area').val())).css('margin-left','5rem'); 
       
        this.listeningEvent();   
        console.log(event)
      })
    }else{
      console.log('yyyyyyyyyyyyy');
      $(repl.target).next().remove()
    }
    });
   
    $(".content-like").click((event)=>{
      if(event.target.innerHTML === 'Like' ){
        $(event.target).html('Liked')
      }else{
        $(event.target).html('Like')
      }
    });
  
//   $(".content-like").click((event)=>{
//     $(event.target).html('Liked')
// });
}


}




  
 

  










    

 