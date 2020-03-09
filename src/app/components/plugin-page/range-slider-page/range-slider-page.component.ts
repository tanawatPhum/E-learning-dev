import { Component, OnInit, ViewEncapsulation,Output,EventEmitter, Input } from '@angular/core';
import { TriggerEventModel } from '../../../models/document/document.model';
import { Constants } from '../../../global/constants';
import { RulerDetailModel } from '../../../models/common/common.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'range-slider-page',
    templateUrl: 'range-slider-page.component.html',
    styleUrls: ['range-slider-page.component.scss'],
    // styleUrls: ['../../../../assets/plugins/jquery-mobile/jquery.mobile-1.4.5.css'],
    // encapsulation: ViewEncapsulation.None
})
export class RangeSliderPageComponent  implements OnInit {
    @Output() eventToParent = new EventEmitter<TriggerEventModel>();
    @Input() rulerDetailSubject: Subject<RulerDetailModel>;
    ngOnInit() {

        $('.range-slider').jRange({
            from: 0,
            to: 100,
            step: 1,
            scale: [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
            format: '%s',
            width: $('.container-input').width(),
            showLabels: true,
            isRange : true,
            onstatechange:(event)=>{
       

                // $('.slider-container').find('.pointer.low').css('left',plow)
                // $('.slider-container').find('.pointer.high').css('left',phigh)



                // this.eventToParent.emit({ action: 'range-slider-event', data:  })
            },
            ondrag:(event)=>{

            },
            ondragstart:(event)=>{
                $(event.currentTarget).html(`<div style="position: absolute;
                z-index: -1;
                top: 0;
                bottom: 0;
                left: 45%;
                height: 100vh;
                margin-top:14px;
                border-left: 2px dotted lightgrey;"></div>`)
            },
            ondragend:(event)=>{
                $('.slider-container').find('.pointer.low').html(null)
                $('.slider-container').find('.pointer.high').html(null)
                this.changePositionToPercent().then((res:RulerDetailModel)=>{
                    this.eventToParent.emit({ action: 'range-slider-event', data:res  })
                })
            },
            onbarclicked:(event)=>{
                this.changePositionToPercent()
            }
        });
        
        $('.range-slider').jRange('setValue', '0,100');
    // setTimeout(() => {
        // console.log($('.pointer.low'))
        // $('.pointer.low').css('left','0%')
    // }, 500);

       // $('.range-slider').find('.pointer .low').css('left','0%')
        this.rulerDetailSubject.subscribe((rulerDetail)=>{
            if(rulerDetail&&rulerDetail.pointerLeft && rulerDetail.pointerRight){
                if($('.range-slider').val() !== (rulerDetail.pointerLeft+','+rulerDetail.pointerRight)){
                    $('.range-slider').jRange('setValue',rulerDetail.pointerLeft+','+rulerDetail.pointerRight);
                }
                this.changePositionToPercent().then((res:RulerDetailModel)=>{
                    this.eventToParent.emit({ action: 'range-slider-event', data:res  })
                })
            }

        })
    }
    changePositionToPercent(){
        return new Promise((resovle,reject)=>{
            setTimeout(() => {
                let plow = (100 * parseFloat(($('.slider-container').find('.pointer.low').position().left / $('.container-input').width()).toString()));
                let phigh = (100 * parseFloat(($('.slider-container').find('.pointer.high').position().left / $('.container-input').width()).toString()));
                
                let plowForShow = plow
                if(plow < 0){
                    plow = 0;
                }
         
         
                let pointers  = $('.range-slider').val().toString().split(',')
                

                $('.slider-container').find('.pointer.low').css('left',plowForShow + "%")
                $('.slider-container').find('.pointer.high').css('left',phigh + "%") 
                let rulerDetail:RulerDetailModel = new RulerDetailModel();
                rulerDetail.paddingLeft  = plow;
                rulerDetail.paddingRight  = phigh;
                rulerDetail.pointerLeft  =  pointers[0];
                rulerDetail.pointerRight = pointers[1];

                resovle(rulerDetail) 
            }, 50);
        })

    }
}
