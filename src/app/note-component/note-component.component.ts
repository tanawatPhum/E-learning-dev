import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-component',
  templateUrl: './note-component.component.html',
  styleUrls: ['./note-component.component.scss']
})
export class NoteComponentComponent implements OnInit {

  constructor() { }
  // ngAfterOnInit(){
  //   $('#summernote').summernote({
  //     placeholder: 'Hello bootstrap 4',
  //     tabsize: 2,
  //     height: 100
  //   });
    
  // }

  ngOnInit() {
  }

}
$(document).ready(function(){


  $("button").click(()=>{
    $("#content-go-back-preview").attr("href", "/documentPreview");
  });
  $("#bold").click(()=>{
    $("#text").css("font-weight","Bold")
  })
  $("#italic").click(()=>{
    $("#text").css("font-style","italic")
  })
  $("#underline").click(()=>{
    $("#text").css("text-decoration", "underline")
  })
})
