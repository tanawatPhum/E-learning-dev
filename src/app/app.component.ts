import { Component, OnInit } from '@angular/core';
import { CommonService } from './services/common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'E-learning';
  constructor(private commonService: CommonService) { }
  ngOnInit() {
    this.initialPage();
  }
  private initialPage() {
    this.commonService.setPlatform();
  }
}
