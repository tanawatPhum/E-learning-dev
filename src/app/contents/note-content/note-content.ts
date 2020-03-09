import { Component, OnInit, AfterViewInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { ContentInterFace } from '../interface/content.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { DocumentDataControlService } from 'src/app/services/document/document-data-control.service';
import { NoteContentModel } from 'src/app/models/document/elements/note-content.model';
import { Constants } from '../../global/constants';
import { UpdateContentModel } from '../../models/common/common.model';
import { DocumentModel, ContentsModel } from 'src/app/models/document/content.model';
import { CommonDataControlService } from '../../services/common/common-data-control.service';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { NoteContentPositionModel } from '../../models/document/elements/note-content.model';
declare var CKEDITOR;

@Component({
    moduleId: module.id,
    selector: 'note-content',
    templateUrl: 'note-content.html',
    styleUrls: ['note-content.scss']
})
export class NoteContentComponent implements OnInit, ContentInterFace, AfterViewInit {
    @Input() parentBox: JQuery<Element>;
    @Input() lifeCycle:string;
    public targetNote:NoteContentModel = new NoteContentModel();
    public targetIndexNote:number;
    public rootElement: JQuery<Element>;
    public updateAction:UpdateContentModel = new UpdateContentModel();
    public currentColorCode:string;
    public fontSizeList:Number[] =  Constants.common.style.fontSizeList;4
    public targetTimeout;
    constructor(
        private commonService: CommonService,
        private commonDCtrlService:CommonDataControlService,
        private documentService: DocumentService,
        private contentDCtrlService: ContentDataControlService,
        private documentDCtrlService:DocumentDataControlService,
        private element: ElementRef,
        private renderer:Renderer2

    ) { }
    ngOnInit() {
        this.rootElement = $(this.element.nativeElement);
        this.parentBox = this.rootElement.parents('.content-box');


        this.contentDCtrlService.getUpdateContent().subscribe((detail)=>{
            if(detail.actionCase === Constants.document.contents.lifeCycle.loadsubForm && detail.for === this.parentBox.attr('id')){
                let targetDocumentContent:ContentsModel = detail.data;
                this.targetIndexNote =  targetDocumentContent.notes.findIndex((note) => note.parentId === this.parentBox.attr('id'));
                this.targetNote =  targetDocumentContent.notes[this.targetIndexNote]
                this.initialNote()
            }
            if(detail.actionCase === Constants.document.contents.events.stopDrag && detail.for === this.parentBox.attr('id')
            && this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor
            ){
                this.targetIndexNote =  this.contentDCtrlService.poolContents.notes.findIndex((note) => note.parentId === this.parentBox.attr('id'));
                this.targetNote =  this.contentDCtrlService.poolContents.notes[this.targetIndexNote]
                this.contentDCtrlService.poolContents.notes[this.targetIndexNote].position.originalTop  = this.parentBox.position().top;
                this.contentDCtrlService.poolContents.notes[this.targetIndexNote].position.originalLeft  = this.parentBox.position().left;
                this.contentDCtrlService.poolContents.notes[this.targetIndexNote].position.originalIconTop  = this.parentBox.find('.note-icon').offset().top;
                this.contentDCtrlService.poolContents.notes[this.targetIndexNote].position.originalIconLeft  = this.parentBox.find('.note-icon').offset().left;
            }
        })
    }
    ngAfterViewInit() {
        this.targetIndexNote =  this.contentDCtrlService.poolContents.notes.findIndex((note) => note.parentId === this.parentBox.attr('id'));
        this.targetNote =  this.contentDCtrlService.poolContents.notes[this.targetIndexNote]
        this.parentBox.css('height','auto')
        this.parentBox.css('width','auto') 
        this.parentBox.resizable({ disabled: true })            
     

        // this.parentBox.addClass('note-parent-box')
        // setTimeout(() => {
        //     this.parentBox.css('height','auto')
        //     this.parentBox.css('width','auto')           
        // }, 2000);

        // this.parentBox.addClass('note-parent-box')
        this.initialNote();
    }
    private initialNote(){
        
        if (this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.createContent) {
            this.addNote();
        }else if(this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadEditor || this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview){
            this.loadNote();
            if(this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview){
                this.handleNote();
            }

          
        }
    }
    private addNote(){
        let note: NoteContentModel = {
            id: this.parentBox.attr('id') + '-note',
            parentId:this.parentBox.attr('id'),
            text:null,
            html:null,
            status:'hide',
            position:new NoteContentPositionModel()
        }
        note.position.originalLeft = this.parentBox.position().left;
        note.position.originalTop = this.parentBox.position().top;
        note.position.originalIconLeft = this.parentBox.find('.note-icon').offset().left;
        note.position.originalIconTop = this.parentBox.find('.note-icon').offset().top; 
        this.contentDCtrlService.poolContents.notes.push(note);
        this.rootElement.find('.note-container').hide();
        this.rootElement.find('note-icon.moving').show();
        this.contentDCtrlService.setLastContent(this.parentBox);

        // this.rootElement.find("#note-font-color").spectrum({
        //     showPalette: true,
        //     palette: [ ],
        //     showSelectionPalette: true, // true by default
        //     selectionPalette: ["red", "green", "blue"],
        //     change:(color)=> {
        //         let style = 'color:' + color.toHexString();
        //         this.currentColorCode =  color.toHexString();
        //         this.addStyles(style)
        //     }
        // });
        // this.customStyleInput();
    }
    private loadNote(){
        this.rootElement.find('.note-container').hide();
        this.rootElement.find('note-icon.moving').show();

        // $('.note-icon-only').remove();
      

        // // if(this.targetNote.position.originalLeft &&  this.targetNote.position.originalTop &&  this.targetNote.position.originalIconLeft && this.targetNote.position.originalIconTop){
        // //     this.targetNote.position.originalLeft = this.parentBox.position().left;
        // //     this.targetNote.position.originalTop = this.parentBox.position().top;
        // //     this.targetNote.position.originalIconLeft = this.parentBox.find('.note-icon').offset().left;
        // //     this.targetNote.position.originalIconTop = this.parentBox.find('.note-icon').offset().top;
        // //     this.contentDCtrlService.poolContents.notes[this.targetIndexNote].position  =  this.targetNote.position;
        // //     this.saveDocument();

        // // }
      


        // this.parentBox.css('left',this.targetNote.position.originalLeft)
        // this.parentBox.css('top',this.targetNote.position.originalTop)
        // if(this.documentDCtrlService.lifeCycle === Constants.document.lifeCycle.loadPreview){
        //     this.rootElement.find('input, select').removeAttr('disabled')
        //     if(this.targetNote.status === "show"){
        //         this.parentBox.addClass('show')
        //         this.parentBox.removeClass('hide')
        //     }else{
        //         this.parentBox.addClass('hide')
        //         this.parentBox.removeClass('show')
        //         this.cloneIconNote(this.parentBox.find('.note-icon'))
        //     }
        //     this.rootElement.find('input, select').removeAttr('disabled')
        //     this.rootElement.find('.note-editable').html(this.targetNote.html);
        // }else{
        //     console.log(this.rootElement.find('.note-editable'))
        //     setTimeout(()=>{
        //         this.rootElement.find('.note-editable').html(null);
        //     })
            
        // }
       
        // this.rootElement.find('.note-content').attr('id',this.targetNote.id)
        // this.rootElement.find('.note-area').show();

    }
    private handleNote(){
        this.rootElement.find('#'+this.parentBox.attr('id')+'-note-area').bind('input',this.commonService.debounce((element) => {
            if(this.targetIndexNote >=0){
                this.contentDCtrlService.poolContents.notes[this.targetIndexNote].text  = $(element.currentTarget).text();
                this.contentDCtrlService.poolContents.notes[this.targetIndexNote].html = $(element.currentTarget).html();
                this.saveDocument();
            }
        },1000))

        this.rootElement.find('#note-font-family').fontselect(
            {
                searchable: false,
            }
        ).on('change', (ev) => {
            let font: any = $(ev.currentTarget).val().toString();
            font = font.replace(/\+/g, ' ');
            font = font.split(':');
            let fontFamily = font[0];
            let fontWeight = font[1] || 400;
            let style = 'font-family:"' + fontFamily + '";font-weight:' + fontWeight;
            this.addStyles(style)
        });
        this.rootElement.find("#note-font-color").spectrum({
            showPalette: true,
            palette: [ ],
            showSelectionPalette: true, // true by default
            selectionPalette: ["red", "green", "blue"],
            change:(color)=> {
                let style = 'color:' + color.toHexString();
                this.currentColorCode =  color.toHexString();
                this.addStyles(style)
            }
        });
        this.rootElement.find('#note-font-size').change((element) => {
            let style = 'font-size:' + $(element.currentTarget).val() + 'px';
            this.addStyles(style)
        });
        this.rootElement.find('.note-font-style').click((element) => {
            let style;
            let dataStyle = $(element.currentTarget).attr('data-font-style');
            let editor = CKEDITOR.instances[this.targetNote.parentId+'-note-area'];
            let selectedElement = $(editor.getSelection().getStartElement().$);
            let allwrapElement = $('span:contains("' + selectedElement.text() + '")');
            if (dataStyle === 'bold') {
                if (allwrapElement.css('font-weight') === '700') {
                    style = 'font-weight:400';
                } else {
                    style = 'font-weight:' + $(element.currentTarget).attr('data-font-style');
                }
            }
            else if (dataStyle === 'italic') {
                if (allwrapElement.css('font-style') === 'italic') {
                    style = 'font-style:normal';
                } else {
                    style = 'font-style:' + $(element.currentTarget).attr('data-font-style');
                }
            }
            else if (dataStyle === 'underline') {
                if (/none/.test(allwrapElement.css('text-decoration'))) {
                    style = 'text-decoration:' + $(element.currentTarget).attr('data-font-style');
                } else {
                    style = 'text-decoration:none'
                }
            }
            this.addStyles(style);
        });



        this.rootElement.find('.note-icon.moving').css('position','absolute')
        this.rootElement.find('.note-icon.moving').unbind('dblclick').bind('dblclick',(element) => {
            let targetElement = $(element.currentTarget)
            this.parentBox.css('left',targetElement.offset().left - (this.rootElement.find('.note-container').width()))
            this.rootElement.find('.note-container').show();

            
            $(element.currentTarget).hide();
        })
        this.rootElement.find('.note-icon.writing').unbind('dblclick').bind('dblclick',(element) => {
            let targetElement = $(element.currentTarget)
            this.rootElement.find('.note-icon.moving').css('left', this.rootElement.find('.note-icon.moving').offset().left + this.rootElement.find('.note-container').width())
            this.rootElement.find('.note-icon.moving').show();
            this.rootElement.find('.note-container').hide();
        })
        // this.rootElement.find('.note-icon').click('click',(element) => {
        //     let targetIcon  = $(element.currentTarget);
        //     if(this.parentBox.hasClass('show')){
        //         this.parentBox.removeClass('show')
        //         this.parentBox.addClass('hide')
        //         this.contentDCtrlService.poolContents.notes[this.targetIndexNote].status = 'hide';
        //         this.saveDocument();
        //         this.cloneIconNote(targetIcon)

        //     }else{
        //         this.parentBox.addClass('show')
        //         this.parentBox.removeClass('hide')
        //         $('.template-doc').find('note-icon').remove().ready(()=>{
        //             this.parentBox.show();
        //             this.contentDCtrlService.poolContents.notes[this.targetIndexNote].status = 'show';
        //             this.saveDocument();
        //         })
        //     }


        // })

        CKEDITOR.inline(this.targetNote.parentId+'-note-area');
        CKEDITOR.disableAutoInline = true;
        CKEDITOR.on('instanceReady', (ev) => {
            $('.cke_top').css('display','none')
            $('#'+this.parentBox.attr('id')+'-note-area').html(this.targetNote.html)
        })
        $(window).resize(() => {
            this.documentDCtrlService.currentScreenSize.height = $('.document-preview-content').height();
            this.documentDCtrlService.currentScreenSize.width = $('.document-preview-content').width();
            this.handleMovingNote()
        })
        this.handleMovingNote()
   
        this.customStyleInput();

    }
    handleMovingNote(){
        let parentTemplate  = $('#contentTemplate');
        let zoom;
        if (this.documentDCtrlService.currentScreenSize.width > this.documentDCtrlService.currentDocument.otherDetail.screenDevDetail.width) {
            zoom = this.documentDCtrlService.currentScreenSize.width / (this.documentDCtrlService.currentDocument.otherDetail.screenDevDetail.width);
        } else {
            zoom = this.documentDCtrlService.currentDocument.otherDetail.screenDevDetail.width / this.documentDCtrlService.currentScreenSize.width;
        }
        let pointerX;
        let pointerY;
        this.parentBox.draggable({
            start : (event, ui)=> {
                pointerY = (event.pageY - parentTemplate.offset().top) / zoom - parseInt($(event.target).css('top'));
                pointerX = (event.pageX - parentTemplate.offset().left) / zoom - parseInt($(event.target).css('left'));
            },
            handle: this.parentBox.find('.note-icon'),
            drag:((event,ui)=>{
                var canvasTop = parentTemplate.offset().top;
                var canvasLeft = parentTemplate.offset().left;
      
                // Fix for zoom
                ui.position.top = Math.round((event.pageY - canvasTop) / zoom - pointerY); 
                ui.position.left = Math.round((event.pageX - canvasLeft) / zoom - pointerX); 
            
                // Check if element is outside canvas
                // if (ui.position.left < 0) ui.position.left = 0;
                // if (ui.position.left + $(event.currentTarget).width() > canvasWidth) ui.position.left = canvasWidth - $(event.currentTarget).width();  
                // if (ui.position.top < 0) ui.position.top = 0;
                // if (ui.position.top + $(event.currentTarget).height() > canvasHeight) ui.position.top = canvasHeight - $(event.currentTarget).height();  
            
                // Finally, make sure offset aligns with position
                ui.offset.top = Math.round(ui.position.top + canvasTop);
                ui.offset.left = Math.round(ui.position.left + canvasLeft);
            }),

        //     start:((event)=>
        // {
        //      var factor = (1 / zoom) -1);

        //      ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor);
        //      ui.position.left += Math.round((ui.position.left- ui.originalPosition.left) * factor);    
        // }), 

            stop: ((event) => {
   
            }),
        })
    }
    private addStyles(styles,element?){
        this.documentService.compileStyles(styles, element,this.targetNote.parentId+'-note-area');
        let targetIndexNote =  this.contentDCtrlService.poolContents.notes.findIndex((note) => note.parentId === this.parentBox.attr('id'));
        if(!this.targetTimeout){
            this.targetTimeout = setTimeout(() => {
                if(targetIndexNote >=0){
                    this.contentDCtrlService.poolContents.notes[targetIndexNote].html =  $('#'+this.parentBox.attr('id')+'-note-area').html();
                    this.saveDocument();
                    this.targetTimeout = null
                }          
            }, 2000);
        }  
      
    }
    // private cloneIconNote(targetIcon:JQuery<Element>){
    //     let targetTempIcon = this.parentBox.attr('id')+'-note-icon';
    //     $('.template-doc').append(
    //         targetIcon.clone().attr('id',targetTempIcon) 
    //         .addClass('note-icon-only')
    //         .css('top',targetIcon.offset().top || this.targetNote.position.originalIconTop)
    //         .css('left',targetIcon.offset().left  || this.targetNote.position.originalIconLeft)
    //     ).ready((element)=>{
    //         this.parentBox.hide();
    //         $('#'+targetTempIcon).draggable({
    //             stop: ((event) => {
    //                 // this.contentDCtrlService.poolContents.notes[this.targetIndexNote].position.changeLeft = $(event.target).position().left;
    //                 // this.contentDCtrlService.poolContents.notes[this.targetIndexNote].position.changeTop = $(event.target).position().top;
    //                 // this.saveDocument();
    //             }),
    //         })
    //         $('#'+targetTempIcon).unbind('click').bind('click',(element) => {
    //             this.parentBox.show();
    //             this.parentBox.addClass('show')
    //             this.parentBox.removeClass('hide')
    //             this.parentBox.css('top', $(element.currentTarget).offset().top-8)
    //             this.parentBox.css('left', $(element.currentTarget).offset().left - this.parentBox.width()+36)
    //             $(element.currentTarget).remove();
    //             this.contentDCtrlService.poolContents.notes[this.targetIndexNote].status = 'show';
    //             this.saveDocument();
    //         })
    //     })
    // }
   

    private customStyleInput(){
        this.rootElement.find('.sp-replacer').removeClass('mt-2')
        .css('height','26px')
        .css('padding','0.3rem 0 0 0.3rem')
        this.rootElement.find('.sp-preview')
        .css('width','20px')
        .css('height','15px')
        this.rootElement.find('.sp-dd')
        .css('padding','0')
        this.rootElement.find('.font-select > span')
        .css('height','26px')
        .css('padding','0.4rem 0 0 0.3rem')
        .css('font-size','12px')
        .css('line-height','1')
        this.rootElement.find('.font-select .fs-results li')
        .css('font-size','12px')
        this.rootElement.find('.font-select')
        .css('width','100%')
    }

    private saveDocument() {
        this.updateAction.actionCase = Constants.document.contents.lifeCycle.saveDocument;
        // let saveobjectTemplate: DocumentModel = {
        //     nameDocument: this.documentDCtrlService.currentDocumentName,
        //     previewImg: this.documentDCtrlService.currentResult.previewImg,
        //     userId:this.commonDCtrlService.userId,
        //     id: this.documentDCtrlService.currentResult.id, 
        //     html: null,
        //     status: this.documentDCtrlService.currentResult.status,
        //     otherDetail: this.documentDCtrlService.currentResult.otherDetail,
        //     contents:this.contentDCtrlService.poolContents
        // }
        // this.updateAction.data = saveobjectTemplate;
        this.contentDCtrlService.updateContent = this.updateAction
    }
}
