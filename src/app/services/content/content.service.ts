import { Injectable } from '@angular/core';
import { RulerDetailModel } from '../../models/common/common.model';
import { DocumentDataControlService } from '../document/document-data-control.service';
import { element, promise } from 'protractor';
import { ParagraphContentHTMLModel } from 'src/app/models/document/elements/paragraph-content.model';
import { ParagraphContentModel } from '../../models/document/elements/paragraph-content.model';
import { ContentDataControlService } from './content-data-control.service';
import { PageModel } from '../../models/document/content.model';
import { BoxContentModel } from '../../models/document/elements/box-content.model';
import { Constants } from '../../global/constants';
import { Observable, Subscriber } from 'rxjs';
import { DocumentService } from '../document/document.service';

declare var CKEDITOR: any;

@Injectable()
export class ContentService {
    constructor(
        private documentDataService:DocumentDataControlService,
        private documentService:DocumentService,
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
    

        let paragraphHtml = '';
        this.contentDataControlService.poolContents.paragraphs && this.contentDataControlService.poolContents.paragraphs.forEach((paragraph)=>{
          // paragraphHtml +=paragraph.htmlDetail.html
         //  $('#'+this.documentDataService.nameTemplate).append(paragraph.htmlDetail.html)
         $('#'+paragraph.pageId).append(
                `<p id="${paragraph.id}">${paragraph.htmlDetail.html}</p>`
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
    // public handleInsertParagraph2(targetPage:JQuery<Element>){
    //     targetPage.get(0).childNodes.forEach((node)=>{
    //         console.log(node)
    //         if(node.nodeName === '#text'){
    //          let newDiv  =  document.createElement('div')
    //          newDiv.classList.add('paragraph-line')
    //          newDiv.appendChild(node.cloneNode())
    //          $( node ).replaceWith(newDiv);
    //         }
    //     })
        
    // }
    
    public handleInsertParagraph(targetPage:JQuery<Element>){

        // targetPage.get(0).childNodes.forEach((node)=>{
        //     console.log(node)
        //     if(node.nodeName === '#text'){

        //             $(node).wrapInner('<div class="xxx"></div>')
        //     }
        // })


       // targetElement.wrapInner('<div class="paragraph-line"><span class="paragraph-text"></span></div>');
        // targetPage.on('keyup',(event)=> {
        //     console.log(event.target.childNodes)
        //     event.stopPropagation();
        //     setTimeout(() => {
        //         if (event.which == 13) {
        //             event.target.childNodes.forEach((node)=>{
        //                 console.log(node.nodeName)
        //                 // if(node.nodeName === '#text'){
        //                 //     console.log('<===isNode===>')
        //                 //     let newDiv  =  document.createElement('div')
        //                 //     newDiv.appendChild(node.cloneNode())
    
        //                 //     $( node ).replaceWith(newDiv);
    
        //                 //     targetPage.append(newDiv)
        //                 //     targetPage.remove('br')
    
    
    
    
        //                 //     // $(node).wrapInner('<div element-name="content-paragraph" class="content-paragraph"></div>')
        //                 // }
    
        //             })
        //         }               
        //     }, 1500);
 
        // });


        


        targetPage.unbind('DOMNodeInserted').bind('DOMNodeInserted',  (element)=> {
                    let targetElement =  $(element.target);
         
                    if(typeof targetElement.attr('id') === typeof undefined && targetElement.prop('tagName')==="DIV"
                    && targetElement.parent('[element-name="content-page"]').length > 0
                    ){
                        console.log('DOMNodeInserted')
                        //console.log('targetElement',targetElement)

                    targetElement.wrapInner('<span class="paragraph-text"></span>');

                    //    targetElement.find('.paragraph-text').wrapInner('<div class="paragraph-line">') 
                        

                        let index = this.contentDataControlService.poolContents.paragraphs.length;
                        let id = 'p-'+index;
                        targetElement.attr('id',id)
                        targetElement.addClass('content-paragraph')
                        targetElement.attr('element-name','content-paragraph')
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
                            pageId:targetPage.attr('id'),
                            level:this.contentDataControlService.poolContents.paragraphs.length,
                            htmlDetail:htmlDetail
                        }
                        this.contentDataControlService.poolContents.paragraphs.push(paragraphObj)  

                        targetElement.on('dragover',(event)=>{
                            console.log(event.currentTarget)

                        })

                        // targetElement.droppable({
                        //     greedy: true,
                        //     activeClass: "ui-state-default",
                        //     hoverClass: "ui-state-hover",
                        //     drop: ( event, ui )=> {
                          
                        //     },
                        //     over:(event, ui)=> {
                        //         console.log(event.target)      
                        //     }
                        //   });
              
                    }


            })
 
            
    }
    public handleUpdateParagraph(targetPage:JQuery<Element>){

        // targetPage.unbind('input').bind('input',  (event)=> {
        //         let currentCursor  = window.getSelection().getRangeAt(0);
        //         let spanText = $(currentCursor.startContainer.parentNode)
        //         let textInSpan = spanText.text();
        //         if(spanText.width() > spanText.parent('div[id^="p"]').width()){
        //             let  adaptText =   spanText.text().slice(0,textInSpan.length-1)
        //             let newLineText =   spanText.text().slice(textInSpan.length-1)
        //             let nextSpanText  = spanText.clone().next('span');
        //             if(nextSpanText.length > 0){
        //                 nextSpanText.text(newLineText+nextSpanText.text())
        //             }else{
        //                 spanText.parent().append(`<span class="span-text">${newLineText}</span>`) 
        //             }
        //             if(currentCursor.endOffset=== textInSpan.length){
        //                 this.setCursor(spanText.parent().attr('id'),spanText.next().get(0).firstChild,0)
        //                 spanText.text(adaptText)
        //             }else{
        //                 let lastOffsetCursor = currentCursor.endOffset
        //                 spanText.text(adaptText)                    
        //                 this.setCursor(spanText.parent().attr('id'),spanText.get(0).firstChild,lastOffsetCursor)
        //             }
        //         }

        // })

   
        // targetPage.on("dragover", (event)=> {
        //     console.log("Dropped!",event.target);
        // });
        //document.execCommand('insertHTML',false,'<br>');
            // targetPage.unbind('DOMSubtreeModified').bind('DOMSubtreeModified',  (element)=> {
            //     let currentCursor  = window.getSelection().getRangeAt(0);
            //     let spanText = $(currentCursor.startContainer.parentNode);
            //     let textInSpan = spanText.text();
            //     if(spanText.width() > spanText.parent('div[id^="p"]').width()){
            //         let  adaptText =   spanText.text().slice(0,textInSpan.length-1)
            //         let newLineText =   spanText.text().slice(textInSpan.length-1)
            //         let nextSpanText  = spanText.next('span');
            //         if(nextSpanText.length > 0){
            //             nextSpanText.text(newLineText+nextSpanText.text())
            //         }else{
            //             spanText.parent().append(`<span class="span-text">${newLineText}</span>`)
            //         }
            //         // spanText.get(0).firstChild.dataadaptText)
            //         // console.log('xxxxxxxxxxxxxxx')
            //         // element.can
            //        // console.log(currentCursor.endOffset,spanText.length)
            //         // if(currentCursor.endOffset=== spanText.length){
            //         //     console.log('xxxxxxxxxxx')
            //         //     //this.setCursor(spanText.parent().attr('id'))
            //         // }
           
            //     }

            //     //console.log(parent.text().length)
            //    //console.log(parent.text().split("\n")) 

            //    // console.log(parent.position().left + parent.width())
            //     //console.log(parent.text())
            //     // let targetElement =  $(element.target).parents('div');
            //     // if(targetElement.prop('tagName')==="DIV"){
            //     //     let targetParagraphIndex  =this.contentDataControlService.poolContents.paragraphs.findIndex((paragraph)=>paragraph.id === targetElement.attr('id'))
            //     //     if(targetParagraphIndex >= 0){
            //     //         // targetElement.prop('outerHTML')
            //     //         let cloneTarget  = targetElement.clone().find('.content-box').remove().end();
            //     //         this.contentDataControlService.poolContents.paragraphs[targetParagraphIndex].htmlDetail.html =  cloneTarget.html();
            //     //     }
                  
            //     // }
            // })
   
    


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

    public setCursor(id,node?,offset?){
        let el = document.getElementById(id);
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(node || el.childNodes[el.childNodes.length-1], offset||1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    public setContainmentContent(targetBox:JQuery<Element>){
        let currentPage = targetBox.parents('[element-name="content-page"]');
        let boxPosition = targetBox.position();
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


    setPositionBoxToParagraph(targetBox:JQuery<Element>){
        let positionBox = targetBox.offset()
        let isBoxPushInParagraph = false
       // console.log("this.contentDataControlService.poolContents",this.contentDataControlService.poolContents)

        for (let i = 0; i < this.contentDataControlService.poolContents.paragraphs.length; i++){
             let paragraph =  this.contentDataControlService.poolContents.paragraphs[i];
             let targetParagraph  = $('#'+paragraph.id);
            //  if(positionBox.top >= paragraph.htmlDetail.positionTop  &&  positionBox.top< paragraph.htmlDetail.positionTop+targetParagraph.height()){
            //     console.log('targetParagraph',targetParagraph.attr('id'))
            //     console.log(targetParagraph.find('.paragraph-text'))
            //     targetBox.prependTo(targetParagraph.find('.paragraph-text'))
            //  }

             if( positionBox.top >= paragraph.htmlDetail.offsetTop && positionBox.top <= paragraph.htmlDetail.offsetTop+targetParagraph.height()

             ){
                // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',targetParagraph,targetBox)
                 targetBox.appendTo(targetParagraph)
                 //console.log(targetParagraph,targetParagraph.children())
                isBoxPushInParagraph  = true;
                //  let positionSpanText = targetParagraph.children().first().position().top+targetParagraph.children().height();
                //  if(positionSpanText-5 >= positionBox.top
                //  && positionBox.top + targetBox.height() >  positionSpanText
                 
                //  ){
                //      targetBox.prependTo(targetParagraph)
                //  }
                //  else{
                //      targetBox.appendTo(targetParagraph)
                //  }
                // targetBox.appendTo(targetParagraph)
                // targetBox.css('position','relative')
                 targetBox.css('top','unset')
             }

          
            //  if( positionBox.top >= paragraph.htmlDetail.positionTop && positionBox.top <= paragraph.htmlDetail.positionTop+targetParagraph.height()

            //  ){
            //      //console.log(targetParagraph,targetParagraph.children())
            //      isBoxPushInParagraph  = true;
            //      let positionSpanText = targetParagraph.children().first().position().top+targetParagraph.children().height();
            //      if(positionSpanText-5 >= positionBox.top
            //      && positionBox.top + targetBox.height() >  positionSpanText
                 
            //      ){
            //          targetBox.prependTo(targetParagraph)
            //      }
            //      else{
            //          targetBox.appendTo(targetParagraph)
            //      }
            //      targetBox.css('top','unset')
            //  }
        }

        // this.contentDataControlService.poolContents.paragraphs.forEach((paragraph)=>{
        //     let targetParagraph  = $('#'+paragraph.id);

        //     if( positionBox.top+targetBox.height() >= paragraph.htmlDetail.positionTop && positionBox.top <= (paragraph.htmlDetail.positionTop+targetParagraph.height())){
        //         console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx')


        //         //console.log(targetParagraph,targetParagraph.children())
        //         isBoxPushInParagraph  = true;
        //         let positionSpanText = targetParagraph.children().first().position().top+targetParagraph.children().height();
        //         if(positionSpanText >= positionBox.top
        //         && positionBox.top + targetBox.height() >  positionSpanText
                
        //         ){
        //             targetBox.prependTo(targetParagraph)
        //         }
        //         else{
        //             targetBox.appendTo(targetParagraph)
        //         }
        //         targetBox.css('top','unset')
        //         return;
        //     }

        //     // if( positionBox.top+targetBox.height() >= paragraph.htmlDetail.positionTop && positionBox.top <= (paragraph.htmlDetail.positionTop+targetParagraph.height())){
        //     //     //console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx',targetParagraph.first())

        //     //     //console.log(targetParagraph,targetParagraph.children())
        //     //     isBoxPushInParagraph  = true;
        //     //     if(targetParagraph.children().first().position().top > positionBox.top-1 && positionBox.top+targetBox.height() < targetParagraph.children().first().position().top){
        //     //         console.log('xxxxxxxxxxxxxxxxxxxx')
        //     //         targetBox.prependTo(targetParagraph)
        //     //     }else{
        //     //         console.log('yyyyyyyyyyyyyy')
        //     //         targetBox.appendTo(targetParagraph)
        //     //     }
        //     //     targetBox.css('top','unset')
                
        //     // }

        // })
        if(!isBoxPushInParagraph){
            targetBox.appendTo(targetBox.parents('[element-name="content-page"]').get(0));
        }

    }
  

   
     
     
    
}