import { Component, OnInit } from '@angular/core';
import { CommonService } from './services/common/common.service';
import { DocumentDataControlService } from './services/document/document-data-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'E-learning';
  constructor(
    private commonService: CommonService, 
    private documentDataService:DocumentDataControlService
    ) { }
  ngOnInit() {
    this.initialPage();
  }
  private initialPage() {
    this.commonService.setPlatform();
    this.documentDataService.currentScreenSize.height = window.screen.height;
    this.documentDataService.currentScreenSize.width = window.screen.width;
  }
}
