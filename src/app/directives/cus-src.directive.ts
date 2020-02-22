import { Directive, ViewContainerRef, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[cus-src]',
})
export class CusSrc {
    @Input() targetPathImg: any;
  constructor(
      public viewContainerRef: ViewContainerRef,
      public el: ElementRef
      ) {
        console.log(el)
   }

}