import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Constants } from 'src/app/global/constants';

@Component({
    templateUrl: 'main-content-page.component.html',
    styleUrls: ['main-content-page.component.scss']
})
export class MainContentPageComponent {
    private triggerElement: Subject<string> = new Subject<string>();
    private addElement() {
        this.triggerElement.next(Constants.event.click.add);
    }
    private savePage() {
        this.triggerElement.next(Constants.event.click.save);
    }
}
