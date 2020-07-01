import { Component, OnInit, AfterViewInit } from '@angular/core';
import { reduce } from 'rxjs/operators';
declare var AVATEXTEDITOR;
@Component({
    moduleId: module.id,
    selector: 'demo-page',
    templateUrl: 'demo-page.component.html',
    styleUrls: ['demo-page.component.scss']
})
export class DemoPageComponent implements OnInit ,AfterViewInit {
    private targetEditor = 'editor1';
    ngOnInit(){
        $('.content-box').draggable({
                     
        });
    }
    ngAfterViewInit(){
        AVATEXTEDITOR.initial(this.targetEditor)
        
     

    }
    changeColor1(){
        // AVATEXTEDITOR.editors[this.targetEditor]
        // //console.log(AVATEXTEDITOR.editors[this.targetEditor])
        AVATEXTEDITOR.editors[this.targetEditor].compileStyles({
            styles:{
                color:'red'
            }
        })
    }
    changeColor2(){
        // AVATEXTEDITOR.editors[this.targetEditor]
        // //console.log(AVATEXTEDITOR.editors[this.targetEditor])
        AVATEXTEDITOR.editors[this.targetEditor].compileStyles({
            styles:{
                color:'blue'
            }
        })
    }
    changeBold(){
        AVATEXTEDITOR.editors[this.targetEditor].compileStyles({
            styles:{
                'font-weight': 'bold'
            }
        })
    }

    changeFontStyle(){
        AVATEXTEDITOR.editors[this.targetEditor].compileStyles({
            styles:{
                'font-style': 'italic'
            }
        })
    }
}
