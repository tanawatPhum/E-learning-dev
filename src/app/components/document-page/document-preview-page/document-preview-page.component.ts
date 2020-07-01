import { Component, ViewChild, ElementRef, OnInit, OnDestroy, HostListener, Injector } from '@angular/core';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { DocumentService } from '../../../services/document/document.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentModel, PageModel } from '../../../models/document/content.model';
import { ScreenDetailModel, UpdateContentModel } from 'src/app/models/common/common.model';
import { CommonService } from '../../../services/common/common.service';
import { find } from 'rxjs/operators';
import { commentContentModel, commentDetailModel } from '../../../models/document/elements/comment-content.model';
import { BoxContentModel } from '../../../models/document/elements/box-content.model';
import { TextAreaContentModel } from '../../../models/document/elements/textarea-content.model';
import { ImgContentModel } from 'src/app/models/document/elements/img-content.model';
import { VideoContentModel } from '../../../models/document/elements/video-content.model';
import { SubFormContentModel } from '../../../models/document/elements/subForm-content.model';
import { Observable, Subscriber, interval } from 'rxjs';
import { async } from 'q';
import { ToDoListContentModel } from '../../../models/document/elements/todoList-content.model';
import { ProgressBarContentModel } from '../../../models/document/elements/progressBar-content-model';
import { DocumentTrackModel } from '../../../models/document/document.model';
import { runInThisContext } from 'vm';
import { FileContentModel } from '../../../models/document/elements/file-content.model';
import { LinkContentModel } from 'src/app/models/document/elements/link-content.model';
import { ExamContentModel } from 'src/app/models/document/elements/exam-content.model';
import { CommonDataControlService } from '../../../services/common/common-data-control.service';
import { NoteContentModel } from '../../../models/document/elements/note-content.model';
import { RulerDetailModel } from '../../../models/common/common.model';
import { Constants } from 'src/app/global/constants';
import { ContentDataControlService } from '../../../services/content/content-data-control.service';
import { ContentRouting } from '../../../app-content-routing';
import { createCustomElement, NgElement, WithProperties } from '@angular/elements';
import { AttachSession } from 'protractor/built/driverProviders';
import { ContentService } from '../../../services/content/content.service';

declare var CKEDITOR: any;

declare var electron: any;
declare var Wistia: any;
@Component({
    selector: 'document-preview-page',
    templateUrl: 'document-preview-page.component.html',
    styleUrls: ['../../document-page/document-page.component.scss']
})
export class DocumentPreviewPageComponent implements OnInit, OnDestroy {
    @ViewChild('documentPreviewContent', { static: true }) documentPreviewContent: ElementRef;
    @ViewChild('contentContainer', { static: true }) contentContainer: ElementRef;
    private rootElement: JQuery<Element>;
    private currentResult: DocumentModel = new DocumentModel();
    private contentTemplateSize: ScreenDetailModel = new ScreenDetailModel();
    // private currentScreenSize: ScreenDetailModel = new ScreenDetailModel();

    private documentTracks: DocumentTrackModel[] = new Array<DocumentTrackModel>();
    private currentDocumentTrack: DocumentTrackModel = new DocumentTrackModel();
    public boxType = Constants.document.boxes.types;
    // private currentCommentIsChild:boolean = false;
    // private currentMessage:string;
    private currentCommentDetail: commentDetailModel = new commentDetailModel();

    // private currentBrowseFile:any;
    public isUrlChannel: boolean = false;
    public actions = {
        element: {
            previewElement: 'previewElement',
            ratioElement: 'ratioElement',
            setResultElement: 'setResultElement'
        },
        handle: {
            handleExam: 'handleExam',
            handleDocumentTrack: 'handleDocumentTrack'
        },
        data: {
            createDataToSave:'createDataToSave',
            retrieveResultData: 'retrieveResultData',
            setDocumentTrack: 'setDocumentTrack'
        },
        template: {
            setDocument: 'setDocument',
            setDocumentTrack: 'setDocumentTrack',

        },
        style: {
            addStyleBoxContentNote: 'addStyleBoxContentNote',
        }
    }
    public boxes: BoxContentModel[] = new Array<BoxContentModel>();
    public textAreas: TextAreaContentModel[] = new Array<TextAreaContentModel>();
    public imgs: ImgContentModel[] = new Array<ImgContentModel>();
    public videos: VideoContentModel[] = new Array<VideoContentModel>();
    public subForms: SubFormContentModel[] = new Array<SubFormContentModel>();
    public comments: commentContentModel[] = new Array<commentContentModel>();
    public toDoLists: ToDoListContentModel[] = new Array<ToDoListContentModel>();
    public files: FileContentModel[] = new Array<FileContentModel>();
    public links: LinkContentModel[] = new Array<LinkContentModel>();
    public exams: ExamContentModel[] = new Array<ExamContentModel>();
    public progressBars: ProgressBarContentModel[] = new Array<ProgressBarContentModel>();
    public notes: NoteContentModel[] = new Array<NoteContentModel>();
    private documentTrackInterval: any;
    private currentUrlParam: any;
    private systemDocument: DocumentModel = new DocumentModel();
    private timeoutSaveDoc: any;

    public pages:PageModel[] = new Array<PageModel>();

    constructor(
        private documentDataService: DocumentDataControlService,
        private documentDCtrlService: DocumentDataControlService,
        private contentDCtrlService: ContentDataControlService,
        private contentService:ContentService,
        private documentService: DocumentService,
        private commonDataService: CommonDataControlService,
        private commonService: CommonService,
        private router: Router,
        private route: ActivatedRoute,
        private injector: Injector
    ) { }
    // @HostListener('window:beforeunload', [ '$event' ])
    // beforeUnloadHander(event) {

    //     // this.saveDocument();
    //     // this.handles(this.actions.handle.handleDocumentTrack);
    // }
    ngOnInit() {
        this.contentDCtrlService.getUpdateContent().subscribe((detail) => {
            if (detail.actionCase === Constants.document.contents.lifeCycle.saveDocument) {
                if (!this.timeoutSaveDoc) {
                    this.timeoutSaveDoc = setTimeout(() => {
                        this.saveDocument(detail.data);
                        clearTimeout(this.timeoutSaveDoc)
                        this.timeoutSaveDoc = null;
                    }, 2000);
                }


            }
        })
        this.route.queryParams.subscribe((params) => {
            this.currentUrlParam = params
            this.isUrlChannel = true;
            this.documentDataService.currentDocument.id = this.currentUrlParam['documentId'];
            if (this.currentUrlParam['userId']) {
                this.commonDataService.userId = this.currentUrlParam['userId'];
            }
            // console.log(this.documentDataService.currentDocumentName);

            this.loadDocFromDB();
        })

    }
    ngOnDestroy() {
        $(document).find('body').css('overflow-x', 'auto');
        $(document).find('body').css('overflow-y', 'hidden');
        this.documentDataService.previousPage = DocumentPreviewPageComponent.name
    }
    ngAfterContentInit() {
        this.documentDCtrlService.lifeCycle = Constants.document.lifeCycle.loadPreview;
        
        // $(window).resize((event)=>{
        //     this.contentTemplateSize.width = $(document).width();
        //     this.contentTemplateSize.height = $(document).height();
        //     console.log(this.contentTemplateSize)
        //     this.setElements(this.actions.element.ratioElement);
        // })

        // $(window).resize((event)=>{
        //     $('.document-preview-content').css('height',event.currentTarget.innerHeight - Constants.general.element.css.navBar.height) 
        //     this.currentScreenSize.height = event.currentTarget.innerHeight -Constants.general.element.css.navBar.height;
        //     this.currentScreenSize.width = event.currentTarget.innerWidth;
        //     this.rootElement.html(this.currentResult.html)
        //     this.setElements(this.actions.element.previewElement);
        // });
        this.setTemplate(this.actions.template.setDocument);
  


    }
    public loadDocFromDB() {
        this.documentService.loadDocFromDB().subscribe((documentList: any) => {
            console.log(this.documentDCtrlService.documentList)
            this.documentDCtrlService.documentList = documentList;
            this.documentDataService.currentDocument =  this.documentDCtrlService.documentList.find((document)=>document.id === this.documentDataService.currentDocument.id)
            this.loadHtml();
        })
    }
    public loadHtml() {
        if (electron) {
            // electron.ipcRenderer.send('request-read-document', documentName)
            // electron.ipcRenderer.once('reponse-read-document', (event, result) => {
            //     console.log(' ❏ Object Document :', result);
            //     if (result) {
            //         this.setElements(this.actions.element.setResultElement, null, result);
            //         this.setTemplate(this.actions.template.setDocumentTrack);
            //     }
            //     this.currentResult = this.documentDataService.currentResult = result;
            // });
        } else {
         //  console.log(this.documentDCtrlService.currentDocument)
            this.documentService.loadDocFromDB(this.documentDCtrlService.currentDocument.id).subscribe((result) => {
                console.log(' ❏ Object Document :', result)
                this.documentService.loadDocFromDB(this.documentDCtrlService.currentDocument.id, Constants.common.user.id).subscribe((systemResult) => {
                    console.log(' ❏ Object Document system :', systemResult)
                    this.documentDataService.systemReult = systemResult && systemResult[0];
                    // this.setElements(this.actions.element.setResultElement, null, result);
                    // this.setTemplate(this.actions.template.setDocumentTrack);
                    // this.comments = systemResult.contents.comments || new Array<commentContentModel>();
                    // setTimeout(() => {
                    //     this.setElements(this.actions.element.setCommentElement);
                    //     this.handles(this.actions.handle.handleComment);
                    // }, 1000);
                    result.html  = this.documentDataService.systemReult.html;
                    this.currentResult = this.documentDataService.currentResult = result &&result[0] ;
                    this.pages = this.documentDataService.currentResult.pages;

                    
                    this.setTemplate(this.actions.template.setDocumentTrack);
                    // this.defineComponent()

                });

            });

        };
    }
    public setTemplate(action) {
        if (action === this.actions.template.setDocument) {
            // this.contentTemplateSize = JSON.parse(localStorage.getItem('contentTemplateSize'))|| new ScreenDetailModel();
            this.rootElement = $(this.contentContainer.nativeElement);
            // - Constants.general.element.css.navBar.height
            //  this.rootElement.css('height', $(window).height())


            // this.currentScreenSize.height = $(this.rootElement).outerHeight();
            // this.currentScreenSize.width = $(this.rootElement).outerWidth();
            // $(window).resize((event) => {
            //     // this.currentScreenSize.height = $(this.rootElement).outerHeight();
            //     // this.currentScreenSize.width = $(this.rootElement).outerWidth();
            //     this.setElements(this.actions.element.ratioElement);
            // });

        }
        else if (action === this.actions.template.setDocumentTrack) {
            this.documentService.loadDocTrackFromDB().subscribe((result) => {
                this.documentTracks = this.documentDCtrlService.documentTracks = result;
                console.log('❏ DocumentTracks :',this.documentTracks)
                if (this.documentTracks.length > 0) {
                    this.currentDocumentTrack = this.documentDCtrlService.documentTrack = this.documentDataService.currentDocumentTrack = result.find((documentTrack) => documentTrack.id === this.documentDataService.currentDocument.id);
                    this.setElements(this.actions.element.setResultElement, null, this.currentResult);
                    
                    
                   // let currentDocumentName =  JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocumentName))
                    let documentTrack = JSON.parse(JSON.stringify(this.documentDCtrlService.currentDocumentTrack))
                    let contents = JSON.parse(JSON.stringify(this.contentDCtrlService.poolContents))
                    
                    // this.documentService.handleDocumentTrack(currentDocumentName,documentTrack,contents).subscribe(() => {

                    // });

                    // this.handles(this.actions.handle.handleDocumentTrack);
                    // this.handles(this.actions.handle.handleToDoList);
                    // this.handles(this.actions.handle.handleProgressBar);
                    //    this.documentTrackInterval = setInterval(()=>{
                    //         this.handles(this.actions.handle.handleDocumentTrack);
                    //     },2000)
                };
            })

        }
        // else if(action === this.actions.template.updateDocumentTrack){
        //     // this.documentTracks.forEach(()=>{

        //     // })
        // }
    }
    public setElements(action, elment?: JQuery<Element>, data?: any) {
        if (action === this.actions.element.setResultElement) {
               
            this.currentResult = data;
            try {
                this.contentTemplateSize = this.currentResult.otherDetail.screenDevDetail;
            } catch (e) {

            }

            //   console.log("contentTemplateSize",this.contentTemplateSize)
            // if(!this.contentTemplateSize.width){
            //     this.contentTemplateSize.width = this.currentResult.otherDetail.screenDevDetail.width;
            // }
            // if(!this.contentTemplateSize.height){
            //     this.contentTemplateSize.height = this.currentResult.otherDetail.screenDevDetail.height;
            // }
            
            let rulerDetail: RulerDetailModel = this.currentResult.otherDetail &&this.currentResult.otherDetail.rulerDevDetail || new RulerDetailModel();
            if (rulerDetail && rulerDetail.paddingLeft < 0) {
                rulerDetail.paddingLeft = 0;
            }

            console.log('this.currentResult',this.currentResult)
            this.contentDCtrlService.poolContents =  this.currentResult.contents;


            this.pages.forEach((page)=>{
                this.createNewPage(page.id)
            })


            this.contentService.createParagraph()



            // this.rootElement.find('[element-name="content-page"]').css({
            //     zoom: ratioW
            // })

            // .content-container


            // this.rootElement.find('.content-container').html(this.currentResult.html);
            // this.rootElement.find('.content-container').attr('style',this.currentResult.styles)

            // // this.rootElement.find('.content-container').append(this.currentResult.html);
            this.currentResult.contents.boxes.forEach((box)=>{
                let targetPage = $('#'+box.pageId)

                if(targetPage.find('#'+box.id).length ===0){
                    targetPage.append(this.documentService.getBoxContentPreview(box));
                }else{
                    targetPage.find('#'+box.id).append(this.documentService.createContentPreview(box))
                }
            })
            this.retrieveData(this.actions.data.retrieveResultData, data);
            this.defineComponent()                
            this.setElements(this.actions.element.previewElement);
        }
        else if (action === this.actions.element.previewElement) {
            this.rootElement.find('.content-box').css('border','none')
            this.documentDataService.currentScreenSize.height = $('.document-preview-content').height();
            this.documentDataService.currentScreenSize.width = $('.document-preview-content').width();
            $(window).resize(() => {
                this.documentService.responsiveCore();
                // this.documentDataService.currentScreenSize.height = $('.document-preview-content').height();
                // this.documentDataService.currentScreenSize.width = $('.document-preview-content').width();
                // this.setElements(this.actions.element.ratioElement)
            })

            this.setElements(this.actions.element.ratioElement)
        }
        if (action === this.actions.element.ratioElement) {


            let ratioW;
            // ratioW = this.rootElement.width() / Constants.document.layouts.size.a4.width;
            // ratioW = (this.documentDataService.currentScreenSize.width-Constants.document.layouts.size.a4.width)/this.documentDataService.currentScreenSize.width;
            // console.log(ratioW)
            if (this.rootElement.width()  > Constants.document.layouts.size.a4.width) {
                ratioW = this.rootElement.width()  / Constants.document.layouts.size.a4.width;
            } else {
                ratioW = Constants.document.layouts.size.a4.width / this.rootElement.width() ;
            }
            this.rootElement.css({
                zoom: ratioW
            })


            // console.log("currentH",this.documentDataService.currentScreenSize.height)
            // console.log("currentW",this.documentDataService.currentScreenSize.width)
            // console.log("templateH",this.contentTemplateSize.height)
            // console.log("templateW",this.contentTemplateSize.width)
            // let diffH =  (this.documentDataService.currentScreenSize.height-this.contentTemplateSize.height )/this.documentDataService.currentScreenSize.height  * 100;
            //let diffW  =  (this.documentDataService.currentScreenSize.width - this.contentTemplateSize.width )/this.documentDataService.currentScreenSize.width;

            // this.rootElement.find('#template-doc').css('min-height', this.rootElement.find('#template-doc').height() + (( this.rootElement.find('#template-doc').height()* diffH) /100))

            // console.log("diffW",diffW)
            // console.log("diffH",diffH)

            // let ratioW = this.documentDataService.currentScreenSize.width / this.contentTemplateSize.width;
            // //let ratioH = this.documentDataService.currentScreenSize.height / (this.contentTemplateSize.height)
            // //console.log("ratioH",ratioH)
            //let ratioH = this.documentDataService.currentScreenSize.height / this.contentTemplateSize.height;
            // let ratioW;
            // if (this.documentDataService.currentScreenSize.width > this.contentTemplateSize.width) {
            //     ratioW = this.documentDataService.currentScreenSize.width / (this.contentTemplateSize.width);
            // } else {
            //     ratioW = this.contentTemplateSize.width / this.documentDataService.currentScreenSize.width;
            // }
            // this.rootElement.find('.content-container').css({
            //     width: this.contentTemplateSize.width + 'px',
            //     height: '100%',
            //     zoom: ratioW
            // })

            // $(this.rootElement).resize(()=>{
            //     // this.documentDataService.currentScreenSize.height =  $('.document-preview-content').height();
            //     // this.documentDataService.currentScreenSize.width =  $('.document-preview-content').width();
            //     // ratioW = this.documentDataService.currentScreenSize.width / (this.contentTemplateSize.width );
            //     // this.rootElement.find('.content-container').css({
            //     //     zoom:ratioW
            //     // })
            // })



          

            // let updateAction:UpdateContentModel = new UpdateContentModel()
            // updateAction.actionCase  = Constants.document.contents.lifeCycle.setRatio;
            // this.contentDCtrlService.updateContent = updateAction


        }

    }
    public backToDocumentHome() {
        this.router.navigate(['documentHome'])
    }
    private async addElements(action: string, element?: JQuery<Element>, subaction?: string, subElement?: any, data?: any) {
 
    

    }
    private handles(action: string, element?: JQuery<Element>, subaction?: string, data?: any) {

        if (action === this.actions.handle.handleDocumentTrack) {
            let numberOfCondition = this.currentDocumentTrack.contents.length;
            let numberOfProgress = 0;
            // console.log(this.currentDocumentTrack.contents[targetVideoTrackIndex])
            this.currentDocumentTrack.contents.forEach((content) => {
                if (content.contentType === this.boxType.boxVideo) {
                    if (content.conditions.videoCondition.isMustWatchingEnd) {
                        numberOfProgress += content.progress
                    } else if (content.conditions.videoCondition.isClickPlay) {
                        numberOfProgress += 100
                    }
                }
                else if (content.contentType === this.boxType.boxSubform) {
                    let numberOfLinks = content.conditions.subformCondition.isClickLinks.length;
                    let numberOfProgressLink = 0;
                    content.conditions.subformCondition.isClickLinks.forEach((link) => {
                        if (link.isClicked) {
                            let documentTrackTarget = this.documentTracks.find((documentTrack) => documentTrack.id === link.linkId);
                            link.progress = documentTrackTarget.progress;
                            numberOfProgressLink += link.progress;
                        }
                        else if (!content.conditions.subformCondition.haveInDoList) {
                            numberOfProgressLink += 100;
                        }
                    });
                    content.progress = numberOfProgressLink / numberOfLinks;
                    numberOfProgress += numberOfProgressLink / numberOfLinks;
                }
            });
            if (this.currentUrlParam['typeUrl'] === 'survey' && this.currentUrlParam['status'] === Constants.common.message.status.submitted.text) {
                let targetExamIndex = this.currentDocumentTrack.contents.findIndex((content) => content.id === this.currentUrlParam['examId'])
                if (targetExamIndex >= 0) {
                    this.currentDocumentTrack.contents[targetExamIndex].conditions.examCondition.isSubmitted = true;
                    this.currentDocumentTrack.contents[targetExamIndex].progress = 100;
                    numberOfProgress += 100
                }
            }
            // this.currentDocumentTrack.contents.forEach((content) => {
            //     if()
            // })

            this.currentDocumentTrack.progress = numberOfProgress / numberOfCondition;
            this.saveDocumentTrack(this.documentDataService.currentDocument.id).subscribe((status) => {
                // console.log(" this.currentDocumentTrack", this.currentDocumentTrack)          
            });
            // let numberOfCondition = 0;
            // let numberOfProgress =0;

            // this.documentTracks.forEach((docTrack)=>{
            //     this.currentDocumentTrack.contents.forEach((content) => {
            //         content.conditions.subformCondition.isClickLinks.forEach((link)=>{
            //             if(link.isClicked){

            //             }
            //         });
            //     });
            // });
            // this.currentDocumentTrack.contents.forEach((content)=>{
            //     if(content.conditions.subformCondition.haveInDoList){
            //         numberOfCondition +=1;
            //         numberOfProgress += content.progress;
            //     }
            //     else if(content.boxType === this.boxType.boxVideo){
            //         numberOfCondition +=1;
            //         numberOfProgress += content.progress;
            //     }

            // });
            // this.currentDocumentTrack.progress =   numberOfProgress/numberOfCondition;
            // this.saveDocumentTrack(this.documentDataService.currentDocumentName).subscribe((status)=>{
            //    // console.log(" this.currentDocumentTrack", this.currentDocumentTrack)          
            // });

        }
        else if (action === this.actions.handle.handleExam) {
            this.rootElement.find('.content-exam').each((index, element) => {
                if (this.currentUrlParam['typeUrl'] === 'survey' && this.currentUrlParam['status'] === Constants.common.message.status.submitted.text) {
                    let targetExamIndex = this.exams.findIndex((exam) => exam.id === $(element).attr('id'))
                    if (targetExamIndex >= 0) {
                        this.exams[targetExamIndex].score = this.currentUrlParam['score']
                    }
                }
                let targetExam = this.exams.find((exam) => exam.id === $(element).attr('id'))
                if (targetExam) {
                    $(element).find('#text-exam-score').text('Score:' + (targetExam.score || '0'))
                }
            })
            this.rootElement.find('.content-exam').find('#exam-input-url').unbind().bind('click', (element) => {
                let targetExam = this.exams.find((exam) => exam.id === $(element.currentTarget).parents('.content-exam').attr('id'))
                if (targetExam) {
                    let param = '?forward_url=' + Constants.common.host.smartDoc + '/documentPreview?'
                    param += 'documentName=' + this.documentDataService.currentDocument.nameDocument + '&'
                    param += 'userId=' + this.commonDataService.userId + '&'
                    param += 'examId=' + targetExam.id + '&'
                    param += 'status=' + Constants.common.message.status.submitted.text + '&'
                    param += 'typeUrl=' + 'survey'
                    console.log(targetExam.path + param)
                    location.assign(targetExam.path + param)
                }

            })
        }


    }
    private saveDocument(userId?,contents?) {
        // this.createData(this.actions.data.createDataToSave).then((result:DocumentModel) => {
        //     let contents = result.contents;

        // })
        // let html;
        // if(userId === Constants.common.user.id){
        //     html = this.documentDataService.systemReult.html;
        // }
        let saveobjectTemplate: DocumentModel = {
            nameDocument: this.currentResult.nameDocument,
            previewImg: this.currentResult.previewImg,
            userId: userId || this.commonDataService.userId,
            id: this.currentResult.id,
            html: this.currentResult.html,
            status: this.currentResult.status,
            styles:this.currentResult.styles,
            pages:this.currentResult.pages,
            layoutType:this.currentResult.layoutType,
            otherDetail: this.currentResult.otherDetail,
            contents:contents || this.contentDCtrlService.poolContents
        }
        console.log('saveobjectTemplate', saveobjectTemplate)
        this.documentService.saveDocument(this.currentResult.nameDocument, saveobjectTemplate).subscribe((status) => {
        })
    }
    private saveDocumentTrack(documentId): Observable<string> {
        let saveObjectTrackTemplate: DocumentTrackModel = {
            id: documentId,
            nameDocument:  this.documentDataService.currentDocument.nameDocument,
            userId: this.commonDataService.userId,
            status: Constants.common.message.status.created.text,
            isTrackProgress: this.currentDocumentTrack.contents.length > 0 ? true : false,
            progress: this.currentDocumentTrack.contents.length === 0 ? 100 : this.currentDocumentTrack.progress,
            rawProgress: this.currentDocumentTrack.rawProgress,
            contents: this.currentDocumentTrack.contents
        }

        return this.documentService.saveDocumentTrack(saveObjectTrackTemplate)
    }
    // private customSaveDocument(saveobjectTemplate:DocumentModel) {
    //     console.log(saveobjectTemplate)
    //     this.documentService.saveDocument(saveobjectTemplate.nameDocument, saveobjectTemplate).subscribe((status) => {

    //     })
    // }

    private async createData(action: string, element?: JQuery<Element>) {
        if (action === this.actions.data.createDataToSave) {
            return new Promise(async (resolve, reject) => {
                let updateAction: UpdateContentModel = new UpdateContentModel()
                updateAction.actionCase = Constants.common.event.save.document;
                this.contentDCtrlService.updateContent = updateAction

                await this.rootElement.find('.content-box ').find('[content-name = "textarea-content"]').each((index, event) => {
                    let targetIndexTextArea = this.contentDCtrlService.poolContents.textAreas.findIndex((textarea) => textarea.parentId === $(event).parents('.content-box').attr('id'));
                    if (targetIndexTextArea >= 0) {
                        this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].value = $(event).text().toString();
                        this.contentDCtrlService.poolContents.textAreas[targetIndexTextArea].html = $(event).html();
                    }
                })
                let createDataBoxes =  ()=>{
                    return new Promise((resolve,reject)=>{
                        let boxes = new Array<BoxContentModel>();
                        if(this.rootElement.find('.content-box').length > 0){
                            this.rootElement.find('.content-box').each((index, element) => {
                                let targetElment = $(element);
                                if (targetElment.find('[content-name]').attr('content-last')) {
                                    let newBox = new BoxContentModel()
                                    newBox.id = targetElment.attr('id');
                                    newBox.boxType = null;
                                    newBox.contentType = targetElment.find('[content-name]').attr('content-name')
                                    newBox.htmlDetail.height = targetElment.height();
                                    newBox.htmlDetail.width = targetElment.width();
                                    newBox.htmlDetail.top = targetElment.position().top;
                                    newBox.htmlDetail.left = targetElment.position().left;
                                    newBox.htmlDetail.selector = targetElment.find('[content-name]').attr('content-name');
                                    newBox.htmlDetail.level  = targetElment.css("z-index");
                                    if (!boxes.find((box) => box.id === newBox.id)) {
                                        boxes.push(newBox)
                                    }
                                    if(index === this.rootElement.find('.content-box').length-1){
                                        this.rootElement.find('.content-box').remove();
                                        this.contentDCtrlService.poolContents.boxes = boxes;
                                        resolve(Constants.common.message.status.success)
                                    }
                                }
                            })
                        }else{
                            resolve(Constants.common.message.status.success)
                        }
        
                    })
                }
                createDataBoxes().then(()=>{
                    let documentObj = new DocumentModel();
                    documentObj.html  =  CKEDITOR.instances[this.documentDataService.nameTemplate].getData()
                    documentObj.contents = this.contentDCtrlService.poolContents
                    $('#'+this.documentDataService.nameTemplate).remove();
                    resolve(documentObj)
                })
            })
        }
    }
    private retrieveData(action: string, results: DocumentModel, element?: JQuery<Element>) {
        if (action === this.actions.data.retrieveResultData) {
            this.contentDCtrlService.poolContents = results.contents;
            this.contentDCtrlService.poolContents.comments = this.documentDataService.systemReult.contents.comments;

            // this.boxes = results.contents.boxes || new Array<BoxContentModel>();
            // this.subForms = results.contents.subFroms || new Array<SubFormContentModel>();
            // this.imgs = results.contents.imgs||  new Array<ImgContentModel>();
            // //this.comments = results.contents.comments ||  new Array<commentContentModel>();
            // this.toDoLists = results.contents.todoList ||  new Array<ToDoListContentModel>();
            // this.exams =  results.contents.exams ||  new Array<ExamContentModel>()
            // this.videos = results.contents.videos ||  new Array<VideoContentModel>();
            // this.progressBars = results.contents.progressBar ||  new Array<ProgressBarContentModel>();
            // this.files =   results.contents.files ||  new Array<FileContentModel>();
            // this.links =   results.contents.links ||  new Array<LinkContentModel>();
            // this.textAreas = results.contents.textAreas ||  new Array<TextAreaContentModel>();
            // this.notes  = results.contents.notes||  new Array<NoteContentModel>();
        }

    }
    private defineComponent() {
        ContentRouting.routes.forEach((route) => {
            const customElement = createCustomElement(route.component, { injector: this.injector });
            customElements.get(route.contentName) || customElements.define(route.contentName, customElement)
            // let divElement =  this.render.createElement(route.contentName) as NgElement & WithProperties<{data:any}>;
            // divElement.data =  'ccccc';

        })
        // let updateAction:UpdateContentModel = new UpdateContentModel()
        // updateAction.actionCase  = Constants.common.event.load.preview;
        // this.contentDCtrlService.updateContent = updateAction


    }
    private addStyleElements(action: string, element?: JQuery<Element>, styles?: string, subaction?: string) {
        if (action === this.actions.style.addStyleBoxContentNote && element) {
            let parentId = element.attr('data-parentid')
            $('#cke_' + parentId + '-note-area').css('z-index', 10)
            $('#cke_' + parentId + '-note-area').css('width', document.getElementById(parentId).getBoundingClientRect().width)
        }
    }

    public createNewPage(id?) {
        this.rootElement.append(`<div element-name="content-page" class="content-page" id="${id}"></div>`)
    }



}
