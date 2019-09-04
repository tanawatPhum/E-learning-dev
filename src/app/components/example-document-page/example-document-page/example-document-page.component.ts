import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { DocumentService } from '../../../services/document/document.service';
import { Constants } from '../../../global/constants';
import { HttpClientService } from '../../../services/common/httpClient.service';
declare var CKEDITOR:any;

import { AmplifyService } from 'aws-amplify-angular';
import Amplify, { Storage, Auth } from 'aws-amplify';
import { SocketIoService } from '../../../services/common/socket.service';
Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-2:b1d020f3-2250-4e5f-beed-0fd588b8a01c', //REQUIRED - Amazon Cognito Identity Pool ID
        region: 'us-east-2', // REQUIRED - Amazon Cognito Region
        userPoolId: 'us-east-2_qCW1BuFYV',
        userPoolWebClientId:'663n1uidmi0ao3lrsk7ldsvv3q'
    },
    Storage: {
        bucket: 'e-learning-dev', //REQUIRED -  Amazon S3 bucket
    }
});

@Component({
    selector: 'example-document-page',
    templateUrl: 'example-document-page.component.html',
    styleUrls: ['example-document-page.component.scss',],
    encapsulation: ViewEncapsulation.None
})
export class ExampleDocumentPageComponent implements OnInit,AfterViewInit {
    public rootTemplateDoc:JQuery<Element>
    public textSize =  Constants.common.style.fontSizeList[0];
    public textSizeList =  Constants.common.style.fontSizeList;

    public signedIn: boolean;
    public user: any;
    public greeting: string;
    constructor(
        public documentService:DocumentService,
        public http:HttpClientService,
        private amplifyService: AmplifyService,
        private socketIoService:SocketIoService
       
    ){

    }

    ngOnInit(){
        this.socketIoService.connectSocketIo();
        // $("#custom").spectrum({
        //     showPalette: true,
        //     palette: [ ],
        //     showSelectionPalette: true, // true by default
        //     selectionPalette: ["red", "green", "blue"]
        // });

        // let boxtest1 =  $('.boxtest1')

        // $('.boxtest2').append(boxtest1)
       
       
        // var elHeight = boxtest1.outerHeight();
        // var elWidth = boxtest1.outerWidth();
        

        // let scale = Math.min(
        //     $('.boxtest2').outerWidth() / elWidth,    
        //     $('.boxtest2').outerHeight() / elHeight
        //   );
          
        //   $('.boxtest1').css({
        //     transform: "scale(" + scale + ")"
        //   });
        // Auth.currentCredentials().then(credentials => {
        //     console.log(credentials)
        // })
        // Storage.put('test.txt', 'Hello')
        // .then (result => console.log(result))
        // .catch(err => console.log(err));
        // this.amplifyService.authStateChange$
        //     .subscribe(authState => {
        //         this.signedIn = authState.state === 'signedIn';
        //         if (!authState.user) {
        //             this.user = null;
        //         } else {
        //             this.user = authState.user;
        //             this.greeting = "Hello " + this.user.username;
        //         }
        // });


    //     let awsConfig =           { Auth: {
    //         identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab', //REQUIRED - Amazon Cognito Identity Pool ID
    //         region: 'XX-XXXX-X', // REQUIRED - Amazon Cognito Region
    //         userPoolId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito User Pool ID
    //         userPoolWebClientId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito Web Client ID
    //     },
    //     Storage: {
    //         bucket: '', //REQUIRED -  Amazon S3 bucket
    //         region: 'XX-XXXX-X', //OPTIONAL -  Amazon service region
    //     }
    // }

        // Amplify.configure(awsConfig);
    //     Amplify.configure(awsconfig);

    //     Storage.put('test.txt', 'Hello')
    // .then (result => console.log(result)) // {key: "test.txt"}
    // .catch(err => console.log(err));
    //     this.amplifyService.authStateChange$
    //     .subscribe(authState => {
    //         console.log(authState)
    //         this.signedIn = authState.state === 'signedIn';
    //         if (!authState.user) {
    //             this.user = null;
    //         } else {
    //             this.user = authState.user;
    //             this.greeting = "Hello " + this.user.username;
    //         }
     
    // });
//         let w = $('.container2').width() / $('.container1').width();
//         let h = $('.container2').height() / $('.container1').height();
//         $('.container2').append(' <div id="box2" class="box1">'+$('#box1').text() +'</div>')
//              $('#box2').css({
//             transform:"scale("+w+','+h+")"
//           });
// console.log('w',w)
// console.log('h',h)


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
    testSocket(){
   
        this.socketIoService.sendData('document','hello world')
    }
    downloadFile(){

       Storage.get('testx.docx',{download: true}).then((file:any)=>{
        let blob=new Blob([file.Body],{type: file.ContentType})
        $('#test').attr('href',window.URL.createObjectURL(blob))
        $('#test').attr('download','testx')
        console.log(blob)
       });

    }
    // uploadFile(event){
    //     let  file = event.target.files[0]; 
    //     console.log(file)
    //     Storage.put(file.name, file,{contentType: file.type})
    //     .then (result => console.log(result))
    //     .catch(err => console.log(err));
    //     // console.log(file);
    //     // this.http.uploadFileToDropBox(file)


    // }





}
