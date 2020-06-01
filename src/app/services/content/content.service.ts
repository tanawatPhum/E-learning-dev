import { Injectable } from '@angular/core';
import { RulerDetailModel } from '../../models/common/common.model';
import { DocumentDataControlService } from '../document/document-data-control.service';
import { element } from 'protractor';
import { ParagraphContentHTMLModel } from 'src/app/models/document/elements/paragraph-content.model';
import { ParagraphContentModel } from '../../models/document/elements/paragraph-content.model';
import { ContentDataControlService } from './content-data-control.service';
import { PageModel } from '../../models/document/content.model';
import { BoxContentModel } from '../../models/document/elements/box-content.model';

declare var CKEDITOR: any;

@Injectable()
export class ContentService {
    constructor(
        private documentDataService:DocumentDataControlService,
        private contentDataControlService:ContentDataControlService
    ){

    }
    public insertRulerOnParagraph(rulerDetail:RulerDetailModel) {
        let currentCaret = window.getSelection().getRangeAt(0);
        let targetText  =  $(currentCaret.startContainer)
        if(targetText.prop("tagName") !== 'P'){
            targetText =  targetText.parents('p')
        }
        if(targetText.length > 0 ){
            targetText.css('padding-left',rulerDetail.paddingLeft+'%')
            targetText.css('padding-right',100-rulerDetail.paddingRight+'%')   
        }
    }

    public calPositionImg(target:JQuery<Element>){
       let targetParagraphs =  this.contentDataControlService.poolContents.paragraphs
        .find((paragraph)=>(
            target.position().top >= paragraph.htmlDetail.positionTop
            &&
            target.position().top <= paragraph.htmlDetail.positionTop+paragraph.htmlDetail.height
        ))  
        if(targetParagraphs){
            console.log(targetParagraphs)


        }
 

    //     console.log(targetParagraphs)
        
        // let hasPaddingTop  = false;
        // let targetBox  = target;
        // let targetBoxPosition = target.offset().top + target.height();

        //target.position().top 
        // console.log(document.elementFromPoint(target.o , target.offset().top))
        // $('span').css('padding-top',0)
        // $('span').css('padding-left',0)
        // $('span').removeAttr('is-track')

        // $('span').each((index,element)=>{
        //     let targetElement = $(element);

        //     if(targetBox.offset().top-5 <= targetElement.offset().top && targetBoxPosition >= targetElement.offset().top){
        //         let targetMovePosition = targetBox.width()+targetBox.position().left +5;
        //         targetElement.attr('is-track','overlap')
        //         // .css('max-width','max-content')
        //         if(targetElement.offset().left+targetElement.width() >targetBox.offset().left){
        //             targetElement.css('padding-left',targetMovePosition)
        //         }
       
        //         if(targetMovePosition+targetElement.width() > $('#'+this.documentDataService.nameTemplate).width()){
        //             if(!hasPaddingTop && $('#'+this.documentDataService.nameTemplate).width()- (targetMovePosition+targetElement.width())<=0){
        //                 targetElement.css('padding-top',target.height()+5)
        //                 hasPaddingTop = true;
        //             }
        //             $('[is-track="overlap"]').css('padding-left',0)
        //         }else{
        //             targetElement.css('padding-top',0)
        //         }

        //     }else{
        //         targetElement.css('padding-left',0)
        //     }

   
        // })
   

        // $('#'+this.documentDataService.nameTemplate).unbind('keyup').bind('keyup',(event)=> {
        //     let caret =  window.getSelection().getRangeAt(0);

        // })


        //  $('#'+this.documentDataService.nameTemplate).click((event)=> {

        //  })
        // $('#'+this.documentDataService.nameTemplate).unbind('keydown').bind('keydown',(event)=> {
  
        //    let caret =  window.getSelection().getRangeAt(0);
        //    let caretPosTop  = $(caret.startContainer).offset().top;
        //     $('.content-box').each((index,element)=>{
        //         if(event.key === 'Enter'){
        //             $('.content-box').each((index,element)=>{
        //                 if(caretPosTop > $(element).offset().top + $(element).height()){
        //                     $(caret.startContainer).css('padding-left',0)
        //                 }
        //             })
        //             if($(element).offset().top >= caretPosTop){
        //                 $(element).css('top',$(element).position().top+$(caret.startContainer).height())
        //             }
        //         }
        //         else if(event.key ==='Backspace'){
            
        //             if($(element).offset().top >= caretPosTop && !$(caret.startContainer).text()){
        //                 $(element).css('top',$(element).position().top-$(caret.startContainer).height())
        //             }
        //         }

        //     })



        // })
     
    }
    public createParagraph(){
        // console.log(this.contentDataControlService.poolContents)

        let paragraphHtml = '';
        this.contentDataControlService.poolContents.paragraphs && this.contentDataControlService.poolContents.paragraphs.forEach((paragraph)=>{
          // paragraphHtml +=paragraph.htmlDetail.html
         //  $('#'+this.documentDataService.nameTemplate).append(paragraph.htmlDetail.html)
         $('#'+paragraph.pageId).append(
                `<p id="${paragraph.id}"><span>${paragraph.htmlDetail.html}</span></p>`
            ).ready(()=>{
                for(let i = 0 ; i < paragraph.htmlDetail.breakLine ;i++){
                    $('#'+paragraph.id).append('<br>')
                }
            })
        })
      //  CKEDITOR.instances[this.documentDataService.nameTemplate].insertHtml(paragraphHtml)
     //   $('#'+this.documentDataService.nameTemplate).html(paragraphHtml)
        //     // $(paragraph.htmlDetail.html).appendTo('#'+this.documentDataService.nameTemplate)
        //    //CKEDITOR.instances[this.documentDataService.nameTemplate].appendHtml(paragraph.htmlDetail.html)
        //    // $('#'+this.documentDataService.nameTemplate).append(paragraph.htmlDetail.html)
        // //    var p = new CKEDITOR.dom.element( 'p' );

        // //    p.append( '<span>' );
            

    
        // })
        // // //console.log(paragraphHtml)
        // // //$('#'+this.documentDataService.nameTemplate).innerHTML (paragraphHtml)
        // $('#'+this.documentDataService.nameTemplate).append(paragraphHtml)
    }
    public handleInsertParagraph(currentPage:JQuery<Element>){
        currentPage.unbind('DOMNodeInserted').bind('DOMNodeInserted',  (element)=> {
                    let targetElement =  $(element.target);
                    if(typeof targetElement.attr('id') === typeof undefined && targetElement.prop('tagName')==="P"){
                        targetElement.wrapInner('<span></span>');
                        let index = this.contentDataControlService.poolContents.paragraphs.length;
                        let id = 'p-'+index;
                        targetElement.attr('id',id)
                        let htmlDetail:ParagraphContentHTMLModel = new ParagraphContentHTMLModel();
                        htmlDetail.height = targetElement.height();
                        htmlDetail.width = targetElement.width();
                        htmlDetail.positionTop =  targetElement.position().top;
                        htmlDetail.positionLeft =  targetElement.position().left;
                        htmlDetail.offsetTop =  targetElement.offset().top;
                        htmlDetail.offsetLeft = targetElement.offset().left;

                      let cloneTarget  = targetElement.clone().find('.content-box').remove().end();
                        htmlDetail.html = cloneTarget.html();
                        htmlDetail.breakLine  = targetElement.find('br').length;
                        let paragraphObj:ParagraphContentModel =  {
                            id:id,
                            pageId:currentPage.attr('id'),
                            htmlDetail:htmlDetail
                        }
                        this.contentDataControlService.poolContents.paragraphs.push(paragraphObj)
                       
                    }
            })
            
    }
    public handleUpdateParagraph(currentPage:JQuery<Element>){
        currentPage.unbind('DOMSubtreeModified').bind('DOMSubtreeModified',  (element)=> {
            let targetElement =  $(element.target).parents('p');
            if(targetElement.prop('tagName')==="P"){
                let targetParagraphIndex  =this.contentDataControlService.poolContents.paragraphs.findIndex((paragraph)=>paragraph.id === targetElement.attr('id'))
                if(targetParagraphIndex >= 0){
                    // targetElement.prop('outerHTML')
                    let cloneTarget  = targetElement.clone().find('.content-box').remove().end();
                    this.contentDataControlService.poolContents.paragraphs[targetParagraphIndex].htmlDetail.html =  cloneTarget.html();
                }
              
            }
        })


    }
    public handleRemoveParagraph(){
        // $('#'+this.documentDataService.nameTemplate).unbind('DOMNodeRemoved').bind('DOMNodeRemoved',  (element)=> {
        //     let targetElement =  $(element.target);
        //     if(targetElement.prop('tagName')==="P"){
        //         this.contentDataControlService.poolContents.paragraphs = this.contentDataControlService.poolContents.paragraphs.filter((paragraph)=>paragraph.id !== element.target.id)
        //         this.contentDataControlService.poolContents.paragraphs.forEach((paragraph,index)=>{
        //             $('#'+paragraph.id).attr('id','p-'+index)
        //         })
        //         console.log(this.contentDataControlService.poolContents.paragraphs)
        //     }
        // })
    }

    public setContainmentContent(targetBox:JQuery<Element>){
        let currentPage = targetBox.parents('[element-name="content-page"]');
        let boxPosition = targetBox.position();

        console.log(boxPosition)
        console.log(targetBox)
        if(boxPosition.top < 0){
            targetBox.css('top',0)
        }
        if(boxPosition.left < 0){
            targetBox.css('left',0)
        }
        if(boxPosition.left < 0){
            targetBox.css('left',0)
        }
        if((boxPosition.top+targetBox.height()) > currentPage.height()){
            targetBox.css('top',currentPage.height() - targetBox.height())
        }
        if((boxPosition.left+targetBox.width()) > currentPage.width()){
            targetBox.css('left',currentPage.width() - targetBox.width())
        }

    }

    public setPositionBoxForMutiPage(targetBox:JQuery<Element>,currentPage:JQuery<Element>,targetPage:JQuery<Element>,pages:PageModel[],boxes:BoxContentModel[]){
        if(targetPage.attr('element-name')!=="content-page"){
            let newTargetPage =   targetPage.parents('[element-name="content-page"]')
            targetPage =  newTargetPage;
        }
        let currentPageObj =  pages.find((page)=>page.id === currentPage.attr('id'))
        let targetPageObj  = pages.find((page)=>page.id === targetPage.attr('id'))
        if(currentPage.attr('id')!== targetPage.attr('id')){
            console.log(currentPageObj)
            console.log(targetPageObj)

            if((currentPageObj && targetPageObj) && (currentPageObj.order > targetPageObj.order)){
                targetBox.appendTo(targetPage.get(0)).css('bottom',0)
                targetBox.appendTo(targetPage.get(0)).css('top','initial')
            }else{
                targetBox.appendTo(targetPage.get(0)).css('top',0)
            }
    
        }
        let targetBoxIndex =  boxes.findIndex((box)=>box.id === targetBox.attr('id'))
        if(targetBoxIndex >= 0 ){
            boxes[targetBoxIndex].pageId = targetPage.attr('id')

        }
        return boxes;
    }
  
    
     
     
    
}