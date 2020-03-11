import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ViewEncapsulation, ElementRef, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { UploadFileModel, UpdateContentModel } from '../../models/common/common.model';
import { DocumentService } from '../../services/document/document.service';
import { ImgContentModel } from 'src/app/models/document/elements/img-content.model';
import { Constants } from '../../global/constants';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ContentInterFace } from '../interface/content.interface';
import { ContentsModel } from 'src/app/models/document/content.model';


@Component({
    moduleId: module.id,
    selector: 'img-content',
    templateUrl: 'img-content.html',
    styleUrls: ['img-content.scss'],
})
export class ImgContentComponent implements OnInit, ContentInterFace {
    public targetFile;
    public targetimg:ImgContentModel = new ImgContentModel();
    @Input() parentBox: JQuery<Element>;
    @Input() data :any;
    @ViewChild('inputFile', { static: true }) inputFile: ElementRef<HTMLElement>;
    @HostListener('click', ['$event']) onClick(event) {
        event.preventDefault();
        event.stopPropagation();

    }
    public actionCase = {
        browseImg: 'browseImg',
        loadingImg: 'loadingImg',
        showImg: 'showImg'
    }
    public currentCase = this.actionCase.browseImg;
    public rootElement: JQuery<Element>;
    public targetPathImg:string = null;
    public targetOriginalPath:string = null;

    // private parentBox:JQuery<Element>;
    constructor(
        private commonService: CommonService,
        private documentService: DocumentService,
        private documentDCtrlService: DocumentDataControlService,
        private contentDCtrlService: ContentDataControlService,
        private element: ElementRef,
        private cdRef: ChangeDetectorRef

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm
                && detail.for === this.parentBox.attr('id')
                ){
                let targetDocumentContent:ContentsModel = detail.data;
                this.targetimg = targetDocumentContent.imgs.find((img) => img.parentId === this.parentBox.attr('id'))
                this.loadImg(this.targetimg.path)
            } 
        })
    }

    ngAfterViewInit() {
        console.log(this.contentDCtrlService.poolContents)
        this.targetimg = this.contentDCtrlService.poolContents.imgs.find((img) => img.parentId === this.parentBox.attr('id'))
        this.initialImg();

    }

    public initialImg(){
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.createContent) {
            if(this.data){
                this.targetFile = this.data;
                this.addImg('attach')
            }else{
                this.handleBrowseImg()
            }

        }
        else if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview) {
            if(this.targetimg){
          
                this.loadImg(this.targetimg.path)
            }
        }
    }
    public handleBrowseImg() {
        // setTimeout(() => {
        //     this.inputFile.nativeElement.click();       
        // }, 500);

        this.rootElement.find('#btn-file').click((event) => {
            this.rootElement.find('.content-browse-img').click((event) => {
                event.stopPropagation();
            })      
            this.rootElement.find('.content-browse-img').trigger('click');
            this.rootElement.find('.content-browse-img').change((event) => {
                const target = event.target as HTMLInputElement;
                this.targetFile = target.files;
                console.log(' ❏ File :', this.targetFile);
                this.addImg('attach')
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
        this.rootElement.find('.toolbar-browse-img').on('drop', (event: any) => {
            event.preventDefault();
            event.stopPropagation();
            this.targetFile = event.originalEvent.dataTransfer.files;
            console.log(' ❏ File :', this.targetFile);
            this.addImg('attach')
        });

        this.rootElement.find('.toolbar-browse-img').find('#img-input-url').click(() => {
            event.preventDefault();
            event.stopPropagation();
            this.rootElement.find('.toolbar-browse-img').find('#img-input-url').focus();
            this.rootElement.find('.toolbar-browse-img').find('#img-input-url').on('input', this.commonService.debounce((event) => {
                if (event.target.value) {
                    this.targetFile = event.target.value;
                    console.log(' ❏ File :', this.targetFile);
                    this.addImg('url')
                }
            }, 2000));
        });
        this.rootElement.find('.toolbar-browse-img').find('#img-input-url').bind("paste", (event: any) => {
            event.preventDefault();
            event.stopPropagation();
            console.log(event.originalEvent.clipboardData)
            let pastedData = event.originalEvent.clipboardData.getData('text');
            this.targetFile = pastedData;
            console.log(' ❏ File :', this.targetFile);
            this.addImg('url')
        })

    }
    public addImg(sourceType) {
        this.currentCase = this.actionCase.loadingImg;
        let img: ImgContentModel = {
            parentId: this.parentBox.attr('id'),
            id: this.parentBox.attr('id') + '-img',
            path: null
        }
        if (sourceType === 'attach') {
            let awsFileName = this.commonService.getPatternAWSName(this.targetFile[0].name) || 'fileName';
            let uploadFile: UploadFileModel = {
                data: this.targetFile[0],
                awsFileName: awsFileName
            }
            this.documentService.uploadFile([uploadFile]).subscribe((url) => {
                if(url!==Constants.common.message.status.fail.text){
                let imgPath = url
                // let imgPath = Constants.common.host.storage + awsFileName;
              //  let imgPath =   Constants.common.host.serverSite +'/api/getImage/?originalPath='+url
                this.currentCase = this.actionCase.showImg;
                img.path = imgPath;
                this.rootElement.find('img').attr('id', this.parentBox.attr('id') + '-img')
                this.targetPathImg  = imgPath;
                this.cdRef.detectChanges();
                this.contentDCtrlService.poolContents.imgs.push(img)
                this.contentDCtrlService.setLastContent(this.parentBox);
                }

                // this.parentBox.find('[content-name]').attr('content-last','true')
            })
        }
        else if (sourceType === 'url') {
            let imgPath =   Constants.common.host.serverSite + Constants.common.host.getImage+this.targetFile
            img.path = imgPath;
            this.currentCase = this.actionCase.showImg;
            this.rootElement.find('img').attr('src', imgPath)
                .attr('id', this.parentBox.attr('id') + '-img')
            this.contentDCtrlService.poolContents.imgs.push(img)
        }
        
    }
    public loadImg(imgPath) {
  
        this.currentCase = this.actionCase.showImg;
        this.targetPathImg  = imgPath;
        this.rootElement.find('img').attr('id', this.parentBox.attr('id') + '-img')
    }

}
