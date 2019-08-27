import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class HttpClientService {
  constructor(private http: HttpClient) { 

  }
  public uploadFileToDropBox(file){
    var xhr = new XMLHttpRequest();
 
    xhr.upload.onprogress = (evt)=> {
      var percentComplete = parseInt((100.0 * evt.loaded / evt.total).toString());
      // Upload in progress. Do something here with the percent complete.
    };
     
    xhr.onload = function() {
      if (xhr.status === 200) {
        var fileInfo = JSON.parse(xhr.response);
        // Upload succeeded. Do something here with the file info.
      }
      else {
        var errorMessage = xhr.response || 'Unable to upload file';
        // Upload failed. Do something here with the error.
      }
    };
     
    xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
    xhr.setRequestHeader('Authorization', 'Bearer ' + '8bUSMXwI8CAAAAAAAAAADnM7DIn6j6qB2cVQCuugyXcd5RDI4qYDN9bi7sHstVWd');
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
      path: '/doc/' +  file.name,
      mode: 'add',
      autorename: true,
      mute: false
    }));
     
    xhr.send(file);
    // let body ={
    //     "path": "/Homework/math/Matrices.txt",
    //     "mode": "add",
    //     "autorename": true,
    //     "mute": false,
    //     "strict_conflict": false
    // }
    // const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Content-Type':  'application/json',
    //       'Authorization': 'Bearer 8bUSMXwI8CAAAAAAAAAADnM7DIn6j6qB2cVQCuugyXcd5RDI4qYDN9bi7sHstVWd'
    //     })
    //   };
    //   return this.http.post<any>('https://api.dropboxapi.com/2/files/upload', body, httpOptions)
  }
}