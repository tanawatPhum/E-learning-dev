import { Component, OnInit, AfterViewInit, AfterContentInit, Input, ElementRef, HostListener } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from '../../services/content/content-data-control.service';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { CommonService } from '../../services/common/common.service';
import { FileContentModel } from 'src/app/models/document/elements/file-content.model';
import { Constants } from '../../global/constants';
import { ContentsModel } from 'src/app/models/document/content.model';

@Component({
    moduleId: module.id,
    selector: 'file-content',
    templateUrl: 'file-content.html',
    styleUrls: ['file-content.scss']
})
export class FileContentComponent implements OnInit, ContentInterFace, AfterViewInit  {

    @Input() parentBox: JQuery<Element>;
    @HostListener('click', ['$event']) onClick(event) {
        event.preventDefault();
        event.stopPropagation();

    }
    public rootElement: JQuery<Element>;
    public targetFileUpload;
    public targetFile:FileContentModel  = new FileContentModel();
    public actionCase = {
        browseFile: 'browseFile',
        loadingFile:'loadingFile',
        showFile:'showFile'
    }    

    public currentCase = this.actionCase.browseFile;
    constructor(
        private documentService: DocumentService,
        private commonService:CommonService,
        private contentDCtrlService: ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef

    ) { }
    ngOnInit(){
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');
        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm){
                let targetDocumentContent:ContentsModel = detail.data;
                this.targetFile = targetDocumentContent.files.find((file) => file.parentId === this.parentBox.attr('id'))
                this.initialFile();
            } 
        })

    }
    ngAfterViewInit(){
        this.targetFile = this.contentDCtrlService.poolContents.files.find((file) => file.parentId === this.parentBox.attr('id'))
        this.initialFile();
    }
    public initialFile(){
        if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.createContent){
            this.handleBrowseFile(); 
        }
        else if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview){
            if( this.targetFile){
                this.showFile(this.targetFile);
                if(this.documentDCtrlService.lifeCycle===Constants.document.lifeCycle.loadPreview){
                    this.handleLoadFile();
                }
            }

        } 
    }
    handleBrowseFile(){
        this.rootElement.find('#btn-file').click((event) => {
            this.rootElement.find('.content-browse-file').click((event) => {
                event.stopPropagation();
            })      
            this.rootElement.find('.content-browse-file').trigger('click');
            this.rootElement.find('.content-browse-file').change((event) => {
                const target = event.target as HTMLInputElement;
                this.targetFileUpload = target.files;
                console.log(' ❏ File :', this.targetFileUpload);
                this.addFile();
            });
        });
        this.rootElement.find('.toolbar-browse-file').on('dragover', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        this.rootElement.find('.toolbar-browse-file').on('dragleave', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        this.rootElement.find('.toolbar-browse-file').on('drop', (event:any) => {
            event.preventDefault();
            event.stopPropagation();
            this.targetFileUpload = event.originalEvent.dataTransfer.files;
            console.log(' ❏ File :', this.targetFileUpload);
            this.addFile();
        });
    }
    public addFile(){
        this.currentCase = this.actionCase.loadingFile;
        let  awsFileName =  this.commonService.getPatternAWSName(this.targetFileUpload[0].name)|| 'fileName';
        let fileName = this.commonService.fileNameAndExt(this.targetFileUpload[0].name)[0] || 'fileName';
        let file:FileContentModel = {
            parentId:this.parentBox.attr('id'),
            id:this.parentBox.attr('id') + '-file',
            fileName:this.commonService.fileNameAndExt(this.targetFileUpload[0].name)[0],
            awsFileName:awsFileName,
            data:this.targetFileUpload[0]
        };
        this.documentService.uploadFile([file]).subscribe((status)=>{
            this.currentCase = this.actionCase.showFile;
            file.data = null;
            this.contentDCtrlService.poolContents.files.push(file);
            this.rootElement.find('.content-file').attr('download',fileName)
            .attr('data-awsname',awsFileName)
            .attr('id',this.parentBox.attr('id') + '-file')
            .text(fileName)
            this.contentDCtrlService.setLastContent(this.parentBox);
        })

        
    }

    public showFile(targetFile:FileContentModel) {
        this.currentCase = this.actionCase.showFile;
        this.rootElement.find('.content-file').attr('download',targetFile.fileName)
        .attr('data-awsname',targetFile.awsFileName)
        .attr('id',this.parentBox.attr('id') + '-file')
        .text(targetFile.fileName)
    }
    public handleLoadFile(){
        this.rootElement.find('.content-file').bind('click',(element)=>{
            let targetFile = this.contentDCtrlService.poolContents.files.find((file)=>file.awsFileName === $(element.currentTarget).attr('data-awsname'))
            this.documentService.downloadFile(targetFile.awsFileName).subscribe((blobFile)=>{
                let url = window.URL.createObjectURL(blobFile);
                let link = document.createElement('a');
                link.download = targetFile.awsFileName;
                link.href = url;
                link.click();
            })
        })
    }



}
