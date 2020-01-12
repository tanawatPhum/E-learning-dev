import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from './services/common/common.service';
import { DocumentDataControlService } from './services/document/document-data-control.service';
import { SocketIoService } from './services/common/socket.service';
import { CommonDataControlService } from './services/common/common-data-control.service';
import { Constants } from './global/constants';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
//   @HostListener('window:click', ['$event']) onClick(event) {
//     console.log(event)
//     event.preventDefault();
//     event.stopPropagation();

// }
  title = 'E-learning';
  constructor(
    private commonService: CommonService, 
    private documentDataService:DocumentDataControlService,
    private socketIoService:SocketIoService,
    private commonDataService:CommonDataControlService,
    private router: Router,
    private route: ActivatedRoute,
    ) { }
  ngOnInit() {
    
    this.initialPage();
  }
  private initialPage() {
    this.commonService.setPlatform();
    this.socketIoService.connectSocketIo();
    this.commonDataService.userId = Constants.common.user.id;
    this.documentDataService.currentScreenSize.height = window.screen.height;
    this.documentDataService.currentScreenSize.width = window.screen.width;
 
    
  }
}
