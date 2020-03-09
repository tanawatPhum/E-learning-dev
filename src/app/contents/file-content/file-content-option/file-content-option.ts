import { Component, Input, OnInit, ElementRef, AfterContentInit, AfterViewInit } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from '../../../services/content/content-data-control.service';
import { UpdateContentModel } from 'src/app/models/common/common.model';
import { Constants } from 'src/app/global/constants';
import { ToolBarService } from '../../../services/document/toolbar.service';

@Component({
    moduleId: module.id,
    selector: 'file-content-option',
    templateUrl: 'file-content-option.html',
    styleUrls: ['file-content-option.scss']
})
export class FileContentOptionComponent implements ContentOptionInterFace,OnInit,AfterViewInit {
    constructor(
        private contentDCtrlService: ContentDataControlService,
        private element: ElementRef,
        private toolbarService:ToolBarService
    ){

    }
    public rootElement: JQuery<Element>;
    public fontSizeList = Constants.common.style.fontSizeList
    public targetFile;
    public targetFileIndex;
    public actionCase = {
        browseFile: 'browseFile',
        showFile: 'showFile'
    }
    public currentCase = this.actionCase.browseFile;
    @Input() parentBox: JQuery<Element>;

    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.contentDCtrlService.getUpdateContent().subscribe((detail) => {
            this.handleSection();
        })
    }
    ngAfterViewInit(){
        this.handleOptionFile();
    }

    public handleSection(){
        this.currentCase =   this.parentBox.find('[action-case]:visible').attr('action-case')
        this.targetFileIndex =  this.contentDCtrlService.poolContents.files.findIndex(file=>file.parentId === this.parentBox.attr('id'))
        this.targetFile = this.contentDCtrlService.poolContents.files[this.targetFileIndex]
        this.rootElement.find('.option-file').find('#file-input-filname').val(this.targetFile.fileName)
    }
    public handleOptionFile(){
        this.rootElement.find('.option-file').find('#file-input-filname').unbind().bind('input', (element) => {
            let targetFileIndex = this.contentDCtrlService.poolContents.files.findIndex(file=>file.parentId === this.parentBox.attr('id'))
            if(targetFileIndex>=0){
                this.contentDCtrlService.poolContents.files[targetFileIndex].fileName =  $(element.currentTarget).val().toString();
                this.parentBox.find('.content-file').text($(element.currentTarget).val().toString());
            }
            
        })
        let targetContentFile = this.parentBox.find('.content-file');
        this.toolbarService.getFontFamily('#option-font-family',targetContentFile).then(()=>{
            this.contentDCtrlService.poolContents.files[this.targetFileIndex].styles  = targetContentFile.attr('style').toString()
        });
        this.toolbarService.getFontStyle('[data-font-group="font-style"]',targetContentFile).then(()=>{
            this.contentDCtrlService.poolContents.files[this.targetFileIndex].styles  = targetContentFile.attr('style').toString()
        });
        this.toolbarService.getFontColor('#option-font-color',targetContentFile).then(()=>{
            this.contentDCtrlService.poolContents.files[this.targetFileIndex].styles  = targetContentFile.attr('style').toString()
        });;
        this.toolbarService.getFontSize('#option-font-size',targetContentFile).then(()=>{
            this.contentDCtrlService.poolContents.files[this.targetFileIndex].styles  = targetContentFile.attr('style').toString()
        });
        this.toolbarService.getFontBackground('#option-background-color',this.parentBox).then(()=>{
            this.contentDCtrlService.poolContents.files[this.targetFileIndex].styles  = targetContentFile.attr('style').toString()
        });
    }
    public removeFile(){
        this.contentDCtrlService.poolContents.files = this.contentDCtrlService.poolContents.files.filter((file)=>file.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
        let updateContent = new UpdateContentModel();
        updateContent.actionCase = Constants.document.contents.lifeCycle.delete;
        this.contentDCtrlService.updateContent =  updateContent;
    }
    
}
