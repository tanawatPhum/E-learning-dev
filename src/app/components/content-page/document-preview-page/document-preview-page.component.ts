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
                 $('.content-textarea').click(function() {
                  
                  // $('id="' + element.attr('id') + '_textarea').val('id="' + element.attr('id') + '_textarea')
                  // let listA = []
                  // listA.forEach((obj,idx)=>{
                  //   console.log(obj)
                  // })
                   console.log($(this).prop('value'))
                  });
                  
                
                
        });
        
    }


    
}
$(document).ready(function(){
  
  // var app = angular.module('application', []);
  //   app.controller('demoController', function ($scope) {
  //       $scope.datas =[];       // เก็บข้อมูลทั้งหมดที่ถูกส่งจากฟอร์ม
  //       $scope.data ={};  
  //       $scope.addData = function (datas) { 
  //         datas.push($scope.data);
  //         $scope.data = {};
  //     };
  // });

    $("button").click(()=>{
      $("#content-go-back-create").attr("href", "/document");
      
    });
    $('#button-question').click(()=>{
      $('#comment-area').val('question icon')
    })
    







  //   function handleFiles(fileInput) {
  //     var files = fileInput.files;
  //     for (var i = 0; i < files.length; i++) {
  //         var file = files[i];
  //         var imageType = /image.*/;
   
  //         if (!file.type.match(imageType)) {
  //             continue;
  //         }
   
  //         var img = document.createElement("img");
  //         img.classList.add("obj");
  //         // img.file = file;
  //         $(fileInput).after(img);
   
  //         var reader = new FileReader();
  //         reader.onload = (function(aImg) { 
  //             return function(e) { 
  //                 aImg.src = e.target.result; 
  //             }; 
  //         })(img);
  //         reader.readAsDataURL(file);
  //     }    
  // }
    

  });