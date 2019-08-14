import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { DocumentService } from '../../../services/document/document.service';
import { Constants } from '../../../global/constants';
declare var CKEDITOR:any;


@Component({
    selector: 'example-document-page',
    templateUrl: 'example-document-page.component.html',
    styleUrls: ['example-document-page.component.scss',],
    encapsulation: ViewEncapsulation.None
})
export class ExampleDocumentPageComponent implements OnInit,AfterViewInit {
    public rootTemplateDoc:JQuery<Element>
    public textSize =  Constants.general.style.fontSizeList[0];
    public textSizeList =  Constants.general.style.fontSizeList;
    constructor(
        public documentService:DocumentService
       
    ){

    }

    ngOnInit(){
        let w = $('.container2').width() / $('.container1').width();
        let h = $('.container2').height() / $('.container1').height();
        $('.container2').append(' <div id="box2" class="box1">'+$('#box1').text() +'</div>')
             $('#box2').css({
            transform:"scale("+w+','+h+")"
          });
console.log('w',w)
console.log('h',h)


        // console.log($('#box1').width());
        // console.log($('#box1').height());
        // let scale = Math.min(
        //     $('.container1').width()/$('#box1').width(),
        //     $('.container1').height()/$('#box1').height()
        // );
        // $('.container2').append(' <div id="box2" class="box1">'+$('#box1').text() +'</div>')
        // $('#box2').css({
        //     transform:"scale(" + scale + ")"
        //   });


        // let maxWidth  = $('.container1').width();
        // let maxHeight = $('.container1').height()

        // //   let $window = $(window);
        //   let width = $('.container2').width();
        //   let height =$('.container2').height();
        //   let scale;
      
        //   // early exit
        //   if(width >= maxWidth && height >= maxHeight) {
        //       $('#outer').css({'-webkit-transform': ''});
        //       $('#wrap').css({ width: '', height: '' });
        //       return;
        //   }
      
        //   scale = Math.min(width/maxWidth, height/maxHeight);
      
        //   $('.container2').css({'-webkit-transform': 'scale(' + scale + ')'});
        //   $('#box2').css({ width: maxWidth * scale, height: maxHeight * scale });
   

    }
    ngAfterViewInit(){

      
    }

 





}
