import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ViewEncapsulation, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { UploadFileModel } from '../../models/common/common.model';
import { DocumentService } from '../../services/document/document.service';
import { ImgContentModel } from 'src/app/models/document/elements/img-content.model';
import { Constants } from '../../global/constants';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ContentInterFace } from '../interface/content.interface';


@Component({
    moduleId: module.id,
    selector: 'img-content',
    templateUrl: 'img-content.html',
    styleUrls: ['img-content.scss'],
})
export class ImgContentComponent implements OnInit,ContentInterFace  {
    private targetFile;
    @Input() parentBox: JQuery<Element>;


    private actionCase = {
        browseImg:'browseImg',
        loadingImg:'loadingImg',
        showImg:'showImg'
    }
    private currentCase = this.actionCase.browseImg;
    private rootElement:JQuery<Element>;

    // private parentBox:JQuery<Element>;
    constructor(
        private commonService :CommonService,
        private documentService:DocumentService,
        private contentDCtrlService:ContentDataControlService,
        private element: ElementRef
        
        ){}
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement); 
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.common.event.load.component){
                this.parentBox  = this.rootElement.parents('.content-box');
                let targetimg =  this.contentDCtrlService.poolContents.imgs.find((img)=>img.parentId === this.parentBox.attr('id'))
                this.loadImg(targetimg.path)

            }
        })
    }
 
    ngAfterViewInit(){
        // this.parentBox  =  this.rootElement.parents('.content-box');
        this.handleBrowseImg()   
    }
    
    private handleBrowseImg() {
        this.rootElement.find('#btn-file').click((event) => {     
            this.rootElement.find('.content-browse-img').trigger('click');
            this.rootElement.find('.content-browse-img').change((event) => {
                const target = event.target as HTMLInputElement;
                this.targetFile = target.files;
                console.log(' ❏ File :', this.targetFile);
                this.addImg() 
            });
        });
        this.rootElement.find('.toolbar-browse-img').on('dragover', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        this.rootElement.find('.toolbar-browse-img').on('dragleave', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        this.rootElement.find('.toolbar-browse-img').on('drop', (event:any) => {
            event.preventDefault();
            event.stopPropagation();
            this.targetFile = event.originalEvent.dataTransfer.files;
            console.log(' ❏ File :', this.targetFile);
            this.addImg()
        });

        this.rootElement.find('.toolbar-browse-img').find('#img-input-url').click(() => {
            this.rootElement.find('.toolbar-browse-img').find('#img-input-url').focus();
            this.rootElement.find('.toolbar-browse-img').find('#img-input-url').on('input', this.commonService.debounce((event) => {
                if (event.target.value) {
                    this.targetFile = event.target.value;
                    console.log(' ❏ File :', this.targetFile);
                    this.addImg()
                }
            }, 2000));
        });
        this.rootElement.find('.toolbar-browse-img').find('#img-input-url').bind("paste", (event:any)=>{
            event.preventDefault();
            event.stopPropagation();
            let pastedData = event.originalEvent.clipboardData.getData('text');
            this.targetFile = pastedData;
            console.log(' ❏ File :', this.targetFile);
            this.addImg()
        })

    }
    private addImg(){
        this.currentCase = this.actionCase.loadingImg;
        let  awsFileName =  this.commonService.getPatternAWSName(this.targetFile[0].name)|| 'fileName';
        let uploadFile:UploadFileModel = {
            data:this.targetFile[0],
            awsFileName:awsFileName
        }
        this.documentService.uploadFile([uploadFile]).subscribe(()=>{
            let imgPath =  Constants.common.host.storage +awsFileName;
            this.currentCase = this.actionCase.showImg;
            let img:ImgContentModel = {
                parentId:this.parentBox.attr('id'),
                id: this.parentBox.attr('id') + '-img',
                path:imgPath
            }
            this.rootElement.find('img').attr('src',imgPath)
            .attr('id',this.parentBox.attr('id') + '-img')
            this.contentDCtrlService.poolContents.imgs.push(img)
            this.contentDCtrlService.setLastContent(this.parentBox);
            // this.parentBox.find('[content-name]').attr('content-last','true')
        })
    }
    private loadImg(imgPath){
        this.currentCase = this.actionCase.showImg;
        this.rootElement.find('img').attr('src',imgPath)
        .attr('id',this.parentBox.attr('id') + '-img')
    }

}
