import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
    selector: 'example-document-page',
    templateUrl: 'example-document-page.component.html',
    styleUrls: ['example-document-page.component.scss']
})
export class ExampleDocumentPageComponent implements OnInit,AfterViewInit {
    constructor(){

    }
    ngOnInit(){
        //this.setCarret();

        $('#test').click((event)=>{
            console.log('xxxcxc',event)
            console.log(this.getMouseEventCaretRange(event));
        })
    }
    ngAfterViewInit(){

    }
    setCarret(){
        var el = document.getElementsByTagName('div')[0];
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el.childNodes[0], 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        el.focus();
    }
    public getMouseEventCaretRange(evt) {
        var range, x = evt.clientX, y = evt.clientY;
        console.log(x);

        if (typeof document.createRange != "undefined") {
            // Try Mozilla's rangeOffset and rangeParent properties,
            // which are exactly what we want
            // if (typeof evt.rangeParent != "undefined") {
            //     range = document.createRange();
            //     range.setStart(evt.rangeParent, evt.rangeOffset);
            //     range.collapse(true);
            // }
    
            // Try the standards-based way next
            // if (document.caretPositionFromPoint) {
            //     var pos = document.caretPositionFromPoint(x, y);
            //     range = document.createRange();
            //     range.setStart(pos.offsetNode, pos.offset);
            //     range.collapse(true);
            //     console.log('xxxcxxc')
            // }
    
            // Next, the WebKit way
            // else if (document.caretRangeFromPoint) {
            //     range = document.caretRangeFromPoint(x, y);
            // }
            
        }
    
        return range;
    }

}
