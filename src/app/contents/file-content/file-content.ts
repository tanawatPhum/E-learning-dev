import { Component, OnInit, AfterViewInit, AfterContentInit, Input, ElementRef } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from '../../services/content/content-data-control.service';
import { DocumentDataControlService } from '../../services/document/document-data-control.service';
import { CommonService } from '../../services/common/common.service';
import { FileContentModel } from 'src/app/models/document/elements/file-content.model';

@Component({
    moduleId: module.id,
    selector: 'file-content',
    templateUrl: 'file-content.html',
    styleUrls: ['file-content.scss']
})
export class FileContentComponent implements OnInit, ContentInterFace, AfterViewInit  {

    @Input() parentBox: JQuery<Element>;
    private rootElement: JQuery<Element>;
    private targetFile;
    private actionCase = {
        browseFile: 'browseFile',
        showFile:'showFile'
    }    

    private currentCase = this.actionCase.browseFile;
    constructor(
        private documentService: DocumentService,
        private commonService:CommonService,
        private contentDCtrlService: ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef

    ) { }
    ngOnInit(){
        this.rootElement = $(this.element.nativeElement);
    }
    ngAfterViewInit(){
        this.handleBrowseFile();
    }
    handleBrowseFile(){
        this.rootElement.find('#btn-file').click((event) => {
            this.rootElement.find('.content-browse-file').trigger('click');
            this.rootElement.find('.content-browse-file').change((event) => {
                const target = event.target as HTMLInputElement;
                this.targetFile = target.files;
                console.log(' ❏ File :', this.targetFile);
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
            this.targetFile = event.originalEvent.dataTransfer.files;
            console.log(' ❏ File :', this.targetFile);
            this.addFile();
        });
    }
    private addFile(){
        this.currentCase = this.actionCase.showFile;
        let  awsFileName =  this.commonService.getPatternAWSName(this.targetFile[0].name)|| 'fileName';
        let fileName = this.commonService.fileNameAndExt(this.targetFile[0].name)[0] || 'fileName';
        let file:FileContentModel = {
            parentId:this.parentBox.attr('id'),
            id:this.parentBox.attr('id') + '-file',
            fileName:this.commonService.fileNameAndExt(this.targetFile[0].name)[0],
            awsFileName:awsFileName,
            data:this.targetFile[0]
        };
        this.contentDCtrlService.poolContents.files.push(file);
        this.rootElement.find('.content-file').attr('download',fileName)
        .attr('data-awsname',awsFileName)
        .attr('id',this.parentBox.attr('id') + '-file')
        .text(fileName)
    }



}
