import { Component,OnInit,AfterViewInit,ViewChild, ElementRef,ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document/document.service';
import { DocumentNavigatorModel } from '../../models/document/document.model';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { DocumentModel } from '../../models/document/content.model';
import { async } from '@angular/core/testing';
import { CommonService } from '../../services/common/common.service';
import { ScreenDetailModel } from '../../models/general/general.model';


declare var electron: any;
@Component({
    selector: 'app-home-page',
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomePageComponent implements OnInit , AfterViewInit{
    @ViewChild('homeDocumentList', { static: true }) contentTemplate: ElementRef;
    private documentNavList:DocumentNavigatorModel[]  =new Array<DocumentNavigatorModel>();
    private documentList:DocumentModel[]  =  new Array<DocumentModel>();
    private homeDocumentList:JQuery<Element>;
    private menuBarList =[
        {name:'Home',icon:'home.svg'},
        {name:'New',icon:'new.svg'}
    ]
    private loading:boolean =false;
    private currentMenu = {name:'Home',index:0};
    public contents = {
        event: {
            triggerDoc: 'triggerDoc'
        }
    }
    constructor(
        private documentService: DocumentService,
        private documentDataService:DocumentDataControlService,
        private commonService:CommonService,
        private router: Router,
    ) { }
    ngOnInit(){
        this.loadDocumentNavigator();
    }
    ngAfterViewInit(){
        this.homeDocumentList = $(this.contentTemplate.nativeElement);
    }
    public loadDocumentNavigator() {
        this.loading =true;
            this.documentService.loadDocumentNavigatorFromDB().subscribe((result) => {
                this.documentNavList = this.documentDataService.documentNavList = result;
                this.documentDataService.documentList =  new Array<DocumentModel>();
                this.getDocumentList()
            });
    }
    public  getDocumentList(){
        this.documentList = new  Array<DocumentModel>();
        this.documentNavList.forEach(async (documentNav)=>{
            this.documentService.loadDocFromDB(documentNav.id).subscribe((documentObj)=>{
                this.createHTMLDocList(documentObj)
                // this.homeDocumentList.append(
                //     '<div class="home-document" id="document-' + document.id+'" ></div>'
                // )
                // this.homeDocumentList.append($('<iframe id="iframe-'+document.id+'"/>').attr({'srcdoc':document.html}));
                // this.homeDocumentList.append(
                //     '<div class="home-document" id="document-' + document.id+'" ></div>'
                // )
                // this.homeDocumentList.find('#document-'+document.id).append(document.html)
                // this.documentList.push(document);
            //     this.homeDocumentList.append('<iframe class="home-document" id="iframe-'+documentObj.id+'"/>')
            //     this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find("body").append(documentObj.html)
            //     let oldScreen: ScreenDetailModel = JSON.parse(localStorage.getItem('contentSize'))
            // // console.log('xcx',this.homeDocumentList.find('#iframe-'+document.id).contents().find("body").find('.content-box'))
            // this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find("body").find('.content-box').each((index, contentBox) => {
            //     let node = document.getElementById($(contentBox).attr('id'));
            //     console.log(node);
            //     // console.log(contentBox)
            //         // this.commonService.calPositionForNewScreen(contentBox,oldScreen).subscribe((elementDetail)=>{
            //         //     console.log("elementDetail",contentBox)
            //         //     $(contentBox).css('height',elementDetail.screenDetail.height + "%");
            //         //     $(contentBox).css('width',elementDetail.screenDetail.width + "%");
            //         //     $(contentBox).css('left',elementDetail.postitionDetail.left + "%");
            //         //     $(contentBox).css('top',elementDetail.postitionDetail.top + "%" );
            //         // })
            //     })

            });
        });
    }
    public createHTMLDocList(documentObj:DocumentModel){
        this.homeDocumentList.append('<div class="document-container" document-data="'+documentObj.nameDocument+'"  id="document-container-'+documentObj.id+'"><iframe class="document-paper" scrolling="no" id="iframe-'+documentObj.id+'"/><span class="document-text">'+ documentObj.nameDocument+'</span></div>')
        this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find('body').append(documentObj.html)
        let oldScreen: ScreenDetailModel = JSON.parse(localStorage.getItem('contentSize'))
        this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find('head').append($("<link/>", {
            rel: 'stylesheet',
            href: 'app/global/styles.scss',
            type: 'text/css'
        }));
        this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find('body').css('cursor','pointer')
        this.homeDocumentList.find('#iframe-'+documentObj.id).contents().find('body').find('.content-box').each((index, contentBox) => {
                    this.commonService.calPositionForNewScreen(contentBox,oldScreen).subscribe((elementDetail)=>{
                        console.log("elementDetail",contentBox)
                        $(contentBox).css('height',elementDetail.screenDetail.height + "%");
                        $(contentBox).css('width',elementDetail.screenDetail.width + "%");
                        $(contentBox).css('left',elementDetail.postitionDetail.left + "%");
                        $(contentBox).css('top',elementDetail.postitionDetail.top + "%" );
                    })
        })
        this.triggerElements(this.contents.event.triggerDoc,$('#document-container-'+documentObj.id));
        setTimeout(() => {
            this.loading =false;
        }, 500);
    }
    public changeCurrentMenu(menuObj,index){
        this.currentMenu = {name:menuObj.name,index:index}
        this.homeDocumentList.html(null);
        if(menuObj.name === 'Home'){
            this.loadDocumentNavigator();
        }
        else if(menuObj.name === 'New'){
            this.homeDocumentList.append('<div class="document-container" document-data="Blank document"  id="document-container-blank-document"><div class="document-paper"></div><span class="document-text">Blank document</span></div>')
        }
        this.triggerElements(this.contents.event.triggerDoc,$('#document-container-blank-document'));
    }
    public triggerElements(action: string, element?: JQuery<Element>) {
        if (action === this.contents.event.triggerDoc) {
            element.click((event)=>{      
                if($(event.currentTarget).attr('document-data') == 'Blank document'){
                    this.documentDataService.currentDocumentName = 'New Document'
                    let countDuplicateDocName = 0;
                    let regexForCheckDuplicateDocName = RegExp(this.documentDataService.currentDocumentName);
                    this.documentNavList.forEach((docNav) => {
                        if (regexForCheckDuplicateDocName.test(docNav.nameDocument)) {
                            countDuplicateDocName = countDuplicateDocName + 1;
                        }
                    })
                    if(countDuplicateDocName > 0){
                        this.documentDataService.currentDocumentName = this.documentDataService.currentDocumentName + "(" + countDuplicateDocName + ")";
                    }
                    this.documentNavList.find((docNav)=>docNav.nameDocument === this.documentDataService.currentDocumentName)
                }else{
                    this.documentDataService.currentDocumentName  =  $(event.currentTarget).attr('document-data');
                }
                this.router.navigate(['documentHome'])
            })
        }

    }


}
