import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber, observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentService } from '../services/document/document.service';
import { DomSanitizer } from '@angular/platform-browser';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'loadImg' })
export class LoadImagePipe implements PipeTransform {
    constructor(
        private http: HttpClient,
        private documentService:DocumentService,
        private domSanitizer: DomSanitizer
    ) {
    }
    transform(url: string,originalPath:string) {
        return new Observable((subscriber)=>{
            this.documentService.loadImage(url,originalPath).subscribe((res)=>{

                subscriber.next(this.domSanitizer.bypassSecurityTrustResourceUrl(res))
            });
        });
    }
}