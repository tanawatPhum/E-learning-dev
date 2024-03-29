import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ContentOptionInterFace } from '../../interface/content-option.interface';
import { ContentDataControlService } from 'src/app/services/content/content-data-control.service';
import { ProgressBoxListModel, ProgressBarContentObjectModel } from 'src/app/models/document/elements/progressBar-content-model';
import { DocumentDataControlService } from '../../../services/document/document-data-control.service';
import { Constants } from '../../../global/constants';
import { UpdateContentModel } from 'src/app/models/common/common.model';
import { ToolBarService } from '../../../services/document/toolbar.service';

@Component({
    selector: 'progress-bar-content-option',
    templateUrl: 'progress-bar-content-option.html',
    styleUrls: ['progress-bar-content-option.scss']
})
export class ProgressBarContentOptionComponent implements OnInit, ContentOptionInterFace ,AfterViewInit{
    @Input() parentBox: JQuery<Element>;
    public progressBoxList:ProgressBoxListModel[] = new Array<ProgressBoxListModel>();
    public rootElement:JQuery<Element>;
    public videoTypes = Constants.document.contents.constats.videoTypes;
    public targetProgressBar;
    public targetProgressBarIndex;
    constructor(
        private documentDCtrlService:DocumentDataControlService,
        private contentDCtrlService:ContentDataControlService,
        private element:ElementRef,
        private toolbarService:ToolBarService
    ){

    }
    ngOnInit(){
        this.rootElement = $(this.element.nativeElement); 
    }
    ngAfterViewInit(){
        this.targetProgressBarIndex  =  this.contentDCtrlService.poolContents.progressBar.findIndex(progressBar=>progressBar.parentId  === this.parentBox.attr('id'));
        this.targetProgressBar =  this.contentDCtrlService.poolContents.progressBar[this.targetProgressBarIndex]
        this.handleAddProgressBar()
    }
    handleAddProgressBar(){
        this.createProgressBoxList();
        let listBox = '';
        this.progressBoxList.forEach((box, index)=>{
            listBox += '<input  type="checkbox" value="' + box.id + '" id="compontentList-box-' + box.id + '" />';
            listBox += '<label class="list-group-item border-0" for="compontentList-box-' + box.id + '">' + box.name + '(' + box.boxTypeName + ')' + '</label>';
        })
        if (listBox) {
            this.rootElement.find('.option-progressBar').find('.progressBar-componentList').html(listBox);
        }
        this.rootElement.find('.option-progressBar').find('.progressBar-componentList').find('input[type="checkbox"]').each((index,element)=>{
            let targetProgressBarIndex  =  this.contentDCtrlService.poolContents.progressBar.findIndex(progressBar=>progressBar.parentId  === this.parentBox.attr('id'));         
            if(targetProgressBarIndex>=0){
               if(this.contentDCtrlService.poolContents.progressBar[targetProgressBarIndex].contentList.find(content=>content.parentId === $(element).val().toString())){
                     $(element).prop('checked',true);
               }
            }
        });  
        this.handleOptionProgressBar();
    }
    handleOptionProgressBar(){
        $('.option-progressBar').find('.progressBar-componentList').find('input[type="checkbox"]').unbind().bind('click', (element) => {
            let targetProgressBarIndex  =  this.contentDCtrlService.poolContents.progressBar.findIndex(progressBar=>progressBar.parentId  === this.parentBox.attr('id'));
            let targetdocumentTrack= this.documentDCtrlService.documentTrack.contents.find(content => content.parentId  === $(element.currentTarget).val().toString())

            // console.log(targetdocumentTrack)
            if(targetProgressBarIndex>=0){
                if($(element.currentTarget).prop('checked')){
                    if(!this.contentDCtrlService.poolContents.progressBar[targetProgressBarIndex].contentList.find(content=>content.parentId === $(element.currentTarget).val().toString())){
                        // this.documentTrack.contents[targetParentBoxSubformIndex].conditions.subformCondition.haveInProgressBar  =true;
                        // this.subForms[targetParentBoxSubformIndex].subformList.forEach((subform)=>{
                            // this.documentTrack.contents.forEach((content)=>{
                            //     if(content.boxType ===this.boxType.boxSubform){
                            //         content.conditions.subformCondition.haveInProgressBar = true;
                            //     }
                            // });
                        // })
                      let targetDocTrack =  this.documentDCtrlService.documentTrack.contents.find((content)=>content.parentId === $(element.currentTarget).val().toString())
                //    console.log("this.documentDCtrlService.documentTrack",this.documentDCtrlService.documentTrack)
                      //  console.log("targetDocTrack", $(element.currentTarget).val().toString())
                      let progressBarContentObj:ProgressBarContentObjectModel = {
                            id:targetDocTrack.id,
                            parentId:targetDocTrack.parentId,
                            boxType:targetdocumentTrack.contentType
                        }
                        this.contentDCtrlService.poolContents.progressBar[targetProgressBarIndex].contentList.push(progressBarContentObj)
                       }
                }else{
                    this.contentDCtrlService.poolContents.progressBar[targetProgressBarIndex].contentList =  this.contentDCtrlService.poolContents.progressBar[targetProgressBarIndex].contentList.filter((content)=>content.parentId !== $(element.currentTarget).val().toString())
                    // this.documentTrack.contents[targetParentBoxSubformIndex].conditions.subformCondition.haveInProgressBar  =false;
                }
            }
        });
        let targetContentProgressBar = this.parentBox.find('.progress-bar');
        this.toolbarService.getFontBackground('#option-background-color',targetContentProgressBar).then(()=>{
            this.contentDCtrlService.poolContents.progressBar[this.targetProgressBarIndex].styles  = targetContentProgressBar.attr('style').toString()
        });
    }
    createProgressBoxList(){
        this.progressBoxList = new Array<ProgressBoxListModel>();
            this.contentDCtrlService.poolContents.links.forEach((content)=>{
            this.progressBoxList.push({
                id: content.parentId,
                name: content.parentId,
                boxType:'link',
                boxTypeName:'link',
            });
        })
        // this.contentDCtrlService.poolContents.subFroms.forEach((content)=>{
        //     this.progressBoxList.push({
        //         id: content.parentId,
        //         name: content.parentId,
        //         boxType:'subform',
        //         boxTypeName:'Subform',
        //     });
        // })
        this.contentDCtrlService.poolContents.videos.forEach((content)=>{
            if( content.data.channelStream === this.videoTypes.wistia ){
                this.progressBoxList.push({
                    id: content.parentId,
                    name: content.parentId,
                    boxType:'video',
                    boxTypeName:'Video',
                });
            }
        })
        this.contentDCtrlService.poolContents.exams.forEach((content)=>{
            this.progressBoxList.push({
                id: content.parentId,
                name: content.parentId,
                boxType:'exam',
                boxTypeName:'Exam',
            });
        })
    }

    removeProgressBar(){
        this.contentDCtrlService.poolContents.progressBar = this.contentDCtrlService.poolContents.progressBar.filter((progressBar)=>progressBar.parentId !== this.parentBox.attr('id'));
        this.parentBox.remove();
        let updateContent = new UpdateContentModel();
        updateContent.actionCase = Constants.document.contents.lifeCycle.delete;
        this.contentDCtrlService.updateContent =  updateContent;
    }


}
