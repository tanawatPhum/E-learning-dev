// (function($) {
//     $.fn.avatexteditor = function(option) {
//         console.log(option)
//         this
//         // this.



//         // option.change('test')
//         //$.extend({}, defaultOpts, o);
//         // this.change()
//         // this.css('background', 'red')

//         // console.log('hello world', $, this)


//     }
// }(jQuery));

// export var a = 5;
(function() {

    if (window.AVATEXTEDITOR) return;
    (window.AVATEXTEDITOR = function() {
        return this;
    }());
    AVATEXTEDITOR.editors = {}
    AVATEXTEDITOR.initial = function(id) {


        AVATEXTEDITOR.editors[id] = {}
        AVATEXTEDITOR.editors[id].element = document.getElementById(id)
        AVATEXTEDITOR.editors[id].element.setAttribute('avatexteditor', '')

        // AVATEXTEDITOR.editors[id].element.appendChild($(`
        // <div class="ava-container-paragraph" element-name="container_paragraph">
        //     <div class="ava-container-line" element-name="container_line"> 
        //         <div element-name="container_wrap_text" class="ava-container-wrap-text">
        //             <span element-name="container_text" class="ava-container-text" style="color:yellow">12</span>
        //             <span class="ava-container-text" element-name="container_text" style="font-weight:bold">56</span>
        //             <span class="ava-container-text" element-name="container_text" style="color:green">        
        //                 12 56 zaczfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccsdczxasdsdasd+v
        //             </span>    
        //         </div>
        //     </div> 
        //     <div class="ava-container-line" element-name="container_line"> 
        //         <div element-name="container_wrap_text" class="ava-container-wrap-text">
        //             <span element-name="container_text" class="ava-container-text" style="color:yellow">12</span>
        //             <span class="ava-container-text" element-name="container_text" style="font-weight:bold">56</span>
        //             <span class="ava-container-text" element-name="container_text" style="color:green">        
        //                 12 56 zaczfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccsdczxasdsdasd+v
        //             </span>    
        //         </div>
        //     </div> 
        // </div>
        // `).get(0))
        // AVATEXTEDITOR.editors[id].element.appendChild($(`
        // <div class="ava-container-paragraph" element-name="container_paragraph">
        //     <div class="ava-container-line" element-name="container_line"> 
        //         <div element-name="container_wrap_text" class="ava-container-wrap-text">
        //             <span element-name="container_text" class="ava-container-text" style="color:yellow">12</span>
        //             <span class="ava-container-text" element-name="container_text" style="font-weight:bold">56</span>
        //             <span class="ava-container-text" element-name="container_text" style="color:green">        
        //                 12 56 zaczfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccsdczxasdsdasd+v
        //             </span>    
        //         </div>
        //     </div> 
        //     <div class="ava-container-line" element-name="container_line"> 
        //         <div element-name="container_wrap_text" class="ava-container-wrap-text">
        //             <span element-name="container_text" class="ava-container-text" style="color:yellow">12</span>
        //             <span class="ava-container-text" element-name="container_text" style="font-weight:bold">56</span>
        //             <span class="ava-container-text" element-name="container_text" style="color:green">        
        //                 12 56 zaczfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccsdczxasdsdasd+v
        //             </span>    
        //         </div>
        //     </div> 
        // </div>
        // `).get(0))
        AVATEXTEDITOR.editors[id].element.appendChild($(`
                <div class="ava-container-wrap-paragraph" element-name="container_wrap_paragraph">
                    <div class="ava-container-paragraph" element-name="container_paragraph">
                        <div class="ava-container-wrap-line" element-name="container_wrap_line"> 
                            <div class="ava-container-line" element-name="container_line"> 
                                <div element-name="container_wrap_text" class="ava-container-wrap-text">
                                    <span element-name="container_text" class="ava-container-text" style="color:yellow">12</span>
                                    <span class="ava-container-text" element-name="container_text" style="font-weight:bold">56</span>
                                    <span class="ava-container-text" element-name="container_text" style="color:green">        
                                        12 56 zaczfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccsdczxasdsdasd+v
                                    </span>    
                                </div>
                            </div> 
                            <div class="ava-container-line" element-name="container_line"> 
                                <div element-name="container_wrap_text" class="ava-container-wrap-text">
                                    <span element-name="container_text" class="ava-container-text" style="color:yellow">78</span>
                                    <span class="ava-container-text" element-name="container_text" style="font-weight:bold">910</span>
                                    <span class="ava-container-text" element-name="container_text" style="color:green">        
                                       ascsdcvzcvcbsfvdscdapkcojkcov,c;[z]xcxz
                                    </span>    
                                </div>
                            </div> 
                        </div> 
                    </div>
                </div>
                `).get(0))
            // AVATEXTEDITOR.editors[id].element.appendChild($(`
            //         <div class="ava-container-wrap-paragraph" element-name="container_wrap_paragraph">
            //             <div class="ava-container-paragraph" element-name="container_paragraph">
            //                 <div class="ava-container-wrap-line" element-name="container_wrap_line"> 
            //                     <div class="ava-container-line" element-name="container_line"> 
            //                         <div element-name="container_wrap_text" class="ava-container-wrap-text">
            //                             <span element-name="container_text" class="ava-container-text" style="color:yellow">12</span>
            //                             <span class="ava-container-text" element-name="container_text" style="font-weight:bold">56</span>
            //                             <span class="ava-container-text" element-name="container_text" style="color:green">        
            //                                 12 56 zaczfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccsdczxasdsdasd+v
            //                             </span>    
            //                         </div>
            //                     </div> 
            //                     <div class="ava-container-line" element-name="container_line"> 
            //                         <div element-name="container_wrap_text" class="ava-container-wrap-text">
            //                             <span element-name="container_text" class="ava-container-text" style="color:yellow">12</span>
            //                             <span class="ava-container-text" element-name="container_text" style="font-weight:bold">56</span>
            //                             <span class="ava-container-text" element-name="container_text" style="color:green">        
            //                                 12 56 zaczfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccsdczxasdsdasd+v
            //                             </span>    
            //                         </div>
            //                     </div> 
            //                 </div> 
            //             </div>
            //         </div>
            //         `).get(0))

        // AVATEXTEDITOR.editors[id].element.appendChild($(`
        //     <div class="ava-container-paragraph" element-name="container_paragraph">
        //         <div class="ava-container-line" element-name="container_line"> 
        //             <div element-name="container_wrap_text" class="ava-container-wrap-text">
        //                 <span element-name="container_text" class="ava-container-text" style="color:yellow">12</span>
        //                 <span class="ava-container-text" element-name="container_text" style="font-weight:bold">56</span>
        //                 <span class="ava-container-text" element-name="container_text" style="color:green">        
        //                     12 56 zaczfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccsdczxasdsdasd+v
        //                 </span>    
        //             </div>
        //         </div> 
        //         <div class="ava-container-line" element-name="container_line"> 
        //             <div element-name="container_wrap_text" class="ava-container-wrap-text">
        //                 <span element-name="container_text" class="ava-container-text" style="color:yellow">12</span>
        //                 <span class="ava-container-text" element-name="container_text" style="font-weight:bold">56</span>
        //                 <span class="ava-container-text" element-name="container_text" style="color:green">        
        //                     12 56 zaczfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccsdczxasdsdasd+v
        //                 </span>    
        //             </div>
        //         </div> 
        //     </div>
        //     `).get(0))


        $(('[element-name="container_text"]')).text(function(_, t) { return $.trim(t) })
        handleEditorEvents(id);


        AVATEXTEDITOR.editors[id].compileStyles = function(attributes) {
            let targetContainers = [];
            let currentCursor = window.getSelection().getRangeAt(0)
            let wrapText = currentCursor.commonAncestorContainer;
            if ((wrapText.nodeName === '#text' || wrapText.nodeName === 'SPAN') && $(wrapText).attr('element-name') !== 'container_wrap_text') {
                wrapText = $(wrapText).parents('[element-name="container_wrap_text"]').get(0);
            }

            if (attributes.styles.hasOwnProperty('text-align')) {
                let paragraph = $(wrapText).parents('[element-name="container_paragraph"]');
                paragraph.css('text-align', attributes.styles['text-align'])
                delete attributes.styles['text-align'];
            }

            let isStartContainer = false;
            let startContainer = currentCursor.startContainer
            if (startContainer.parentNode.nodeName === 'SPAN') {
                startContainer = startContainer.parentNode;
            }
            let endContainer = currentCursor.endContainer
            if (endContainer.parentNode.nodeName === 'SPAN') {
                endContainer = endContainer.parentNode;
            }
            for (let i = 0; i < wrapText.childNodes.length; i++) {
                if (wrapText.childNodes[i].isSameNode(startContainer)) {
                    isStartContainer = true;
                }
                if (isStartContainer && wrapText.childNodes[i].nodeName === 'SPAN') {
                    targetContainers.push(wrapText.childNodes[i])
                }
                if (wrapText.childNodes[i].isSameNode(endContainer)) {
                    break;
                }
            }
            console.log('targetContainers', targetContainers)
            targetContainers.forEach((container, index) => {
                if (targetContainers.length === 1) {
                    if (currentCursor.startOffset === 0 && currentCursor.endOffset === container.textContent.length) {
                        complieStyles(container, attributes)
                    } else {
                        let startString = currentCursor.startContainer.textContent.substr(0, currentCursor.startOffset)
                        let targetString = currentCursor.startContainer.textContent.substr(currentCursor.startOffset, currentCursor.endOffset - currentCursor.startOffset)
                        let endString = currentCursor.startContainer.textContent.substr(currentCursor.endOffset, currentCursor.startContainer.textContent.length - (startString.length + targetString.length))
                        container.textContent = startString;
                        let targetContainer = container.cloneNode()
                        targetContainer.textContent = targetString;
                        let endContainer = container.cloneNode()
                        endContainer.textContent = endString;
                        complieStyles(targetContainer, attributes)
                        $(container).after(targetContainer)
                        if (endString) {
                            $(targetContainer).after(endContainer)
                        }
                        currentCursor.setStart(targetContainer, 0)
                    }

                } else if (index === targetContainers.length - 1) {
                    if (currentCursor.endOffset === container.textContent.length) {
                        complieStyles(container, attributes)
                    } else {

                        let targetString = currentCursor.endContainer.textContent.substr(0, currentCursor.endOffset)
                        let endString = currentCursor.endContainer.textContent.substr(currentCursor.endOffset, currentCursor.endContainer.textContent.length - currentCursor.endOffset)
                        container.textContent = endString;
                        let targetContainer = container.cloneNode()
                        targetContainer.textContent = targetString;
                        complieStyles(targetContainer, attributes)
                        $(container).before(targetContainer)
                    }
                } else if (index < targetContainers.length) {
                    if (!container.isSameNode(currentCursor.startContainer) && !container.isSameNode(currentCursor.startContainer.parentNode)) {
                        complieStyles(container, attributes)
                    } else {
                        if (currentCursor.startOffset === 0) {
                            complieStyles(container, attributes)

                        } else {
                            let startString = currentCursor.startContainer.textContent.substr(0, currentCursor.startOffset)
                            let targetString = currentCursor.startContainer.textContent.substr(currentCursor.startOffset, currentCursor.startContainer.textContent.length)
                            container.textContent = startString;
                            let targetContainer = container.cloneNode()
                            targetContainer.textContent = targetString;
                            complieStyles(targetContainer, attributes)
                            $(container).after(targetContainer)
                            currentCursor.setStart(targetContainer, 0)

                        }
                    }
                }
            })
        }
        AVATEXTEDITOR.editors[id].insertImage = function(element, type) {
            let targetEl = $(element)
            let targetParagraph;
            $('[element-name="container_paragraph"]').each((index, element) => {
                let paragraphEl = $(element);
                let paragraphOffset = paragraphEl.offset();
                if (paragraphOffset.top <= targetEl.offset().top &&
                    paragraphOffset.top + paragraphEl.height() >= targetEl.offset().top) {
                    targetParagraph = paragraphEl;
                    return
                }
            }).ready(() => {
                if (targetParagraph && targetParagraph.length > 0) {
                    let targetContainerParagraph = targetParagraph;
                    let targetContainerWrapParagraph = targetContainerParagraph.parents('[element-name="container_wrap_paragraph"]')
                    let targetOldContainerLine = $(element).parents('[element-name="container_line"]')
                    targetEl.attr('element-format', type)
                    targetEl.attr('element-name', 'container_other')


                    targetContainerParagraph.find('[element-name="container_line"]').each((index, line) => {
                        let targetContainerLine = $(line)
                        if (
                            targetContainerLine.offset().top <= targetEl.offset().top && targetContainerLine.offset().top + targetContainerLine.outerHeight() >= targetEl.offset().top
                        ) {

                            if (!targetEl.parent().is(targetContainerWrapParagraph)) {
                                targetEl.appendTo(targetContainerLine)
                                targetContainerLine.attr('has-content', true)
                                targetContainerLine.css('padding-top', targetEl.outerHeight())
                                targetEl.css('top', 0)
                                if (targetOldContainerLine.length > 0) {
                                    if (targetOldContainerLine.children().length === 1) {
                                        targetOldContainerLine.css('padding', '0')
                                        targetOldContainerLine.removeAttr('has-content')
                                    }
                                }
                            }
                        }
                        return;
                    })
                } else {
                    let targetContainerWrapParagraph = targetEl.parents('[element-name="container_wrap_paragraph"]');
                    if (targetContainerWrapParagraph.attr('paragraph-type') === 'inLine') {
                        let prevContainerParagraph = targetEl.prev();
                        let nextContainerParagraph = targetEl.next();
                        if (prevContainerParagraph.attr('element-name') === 'container_paragraph' && nextContainerParagraph.attr('element-name') === 'container_paragraph') {
                            prevContainerParagraph.css('width', prevContainerParagraph.outerWidth() + nextContainerParagraph.outerWidth())
                            console.log('nextContainerParagraph.children()', nextContainerParagraph.children())
                            prevContainerParagraph.append(nextContainerParagraph.children())
                            nextContainerParagraph.remove();
                        }
                        targetEl.appendTo(AVATEXTEDITOR.editors[id].element)
                        if (targetContainerWrapParagraph.find('[element-name="container_other"]').length == 0) {
                            targetContainerWrapParagraph.removeAttr('paragraph-type')
                            targetContainerWrapParagraph.css('min-height', 'auto')
                        }
                        mergeContainerLine(prevContainerParagraph)
                    } else {
                        let targetCurrentLine = $(element).parents('[element-name="container_line"]')
                        if (targetCurrentLine.length > 0) {
                            targetEl.appendTo(AVATEXTEDITOR.editors[id].element)
                            if (targetCurrentLine.children().length === 1) {
                                targetCurrentLine.css('padding', '0')
                                targetCurrentLine.removeAttr('has-content')
                            }
                        }
                    }

                }



            })



        }



        function handleEditorEvents(id) {
            // AVATEXTEDITOR.editors[id].element.addEventListener('keyup', (event) => {
            //     console.log('keyup', event.which)
            //     if (event.which != 8)
            //         return true;
            //     event.preventDefault();
            // })
            AVATEXTEDITOR.editors[id].element.addEventListener('keydown', (event) => {
                if (event.which !== 13)
                    return true;
                let currentCursor = window.getSelection().getRangeAt(0);
                let startOffset = currentCursor.startOffset;
                let targetContainerText = $(currentCursor.commonAncestorContainer).parents('[element-name="container_text"]');
                let targetContainerWrapText = targetContainerText.parents('[element-name="container_wrap_text"]');
                let targetContainerLine = targetContainerWrapText.parents('[element-name="container_line"]')
                let targetContainerParagraph = targetContainerLine.parents('[element-name="container_paragraph"]')
                let targetContainerWrapParagraph = targetContainerParagraph.parents('[element-name="container_wrap_paragraph"]')
                if (event.which === 13) {
                    let nexttargetContainerWrapParagraph
                    let nextContainerParagraph;
                    if (targetContainerWrapParagraph.attr('paragraph-type') === 'inLine' && targetContainerWrapParagraph.find('[element-data="isLastContainer"]').length == 0) {
                        nexttargetContainerWrapParagraph = targetContainerWrapParagraph;
                        nextContainerParagraph = $(createNewParagraph(createNewLine(createNewWrapText())))
                        nextContainerParagraph.appendTo(nexttargetContainerWrapParagraph)
                        nextContainerParagraph.attr('index', nexttargetContainerWrapParagraph.children('[element-name="container_paragraph"]').length)
                        formatParagraphInLine(targetContainerWrapParagraph)
                    } else {
                        nexttargetContainerWrapParagraph = $(createNewWrapParagraph(createNewParagraph(createNewLine(createNewWrapText()))));
                        nexttargetContainerWrapParagraph.insertAfter(targetContainerWrapParagraph)
                        nextContainerParagraph = nexttargetContainerWrapParagraph.find('[element-name="container_paragraph"]');
                        nextContainerParagraph.attr('index', nexttargetContainerWrapParagraph.children('[element-name="container_paragraph"]').length)
                    }

                    let nextContainerWrapText = nextContainerParagraph.find('[element-name="container_wrap_text"]');
                    let nextContainerLine = nextContainerParagraph.find('[element-name="container_line"]');
                    let cloneContainerText = targetContainerText.clone();
                    cloneContainerText.text(cloneContainerText.text().substr(startOffset))
                    targetContainerText.text(targetContainerText.text().substr(0, startOffset))
                    cloneContainerText.appendTo(nextContainerWrapText)
                    targetContainerText.nextAll().appendTo(nextContainerWrapText)
                    if (!cloneContainerText.text()) {
                        cloneContainerText.text('\u00a0')
                    }

                    let targetElementsInLine = targetContainerLine.next().children('[element-format="inLine"]');
                    if (targetElementsInLine.length > 0) {
                        targetElementsInLine.appendTo(nexttargetContainerWrapParagraph)
                        nexttargetContainerWrapParagraph.css('min-height', targetElementsInLine.outerHeight())
                        nexttargetContainerWrapParagraph.attr('paragraph-type', 'inLine')
                        let nextTargetContainerLine = targetContainerLine.next()
                        if (nextTargetContainerLine.children().length === 1) {
                            nextTargetContainerLine.css('padding', '0')
                            nextTargetContainerLine.removeAttr('has-content')
                        }
                        if (nexttargetContainerWrapParagraph.attr('paragraph-type') === 'inLine') {
                            formatParagraphInLine(nexttargetContainerWrapParagraph);
                        }
                        let nexttargetContainerWrapParagraph2 = $(createNewWrapParagraph(createNewParagraph(createNewLine(createNewWrapText()))));
                        nexttargetContainerWrapParagraph2.insertAfter(nexttargetContainerWrapParagraph)
                        nexttargetContainerWrapParagraph = nexttargetContainerWrapParagraph2;
                        nextContainerParagraph = nexttargetContainerWrapParagraph.find('[element-name="container_paragraph"]');
                        nextContainerWrapText = nextContainerParagraph.find('[element-name="container_wrap_text"]');
                        nextContainerLine = nextContainerParagraph.find('[element-name="container_line"]');
                    }

                    let nextContainersLine = targetContainerLine.nextAll();
                    nextContainersLine.appendTo(nextContainerParagraph)
                        // let targetContainersText = nextContainersLine.find('[element-name="container_text"]')

                    mergeContainerLine(nextContainerParagraph)

                    // targetContainersText.each((index, containerText) => {
                    //     $(containerText).appendTo(nextContainerWrapText)
                    //     if (nextContainerWrapText.outerWidth() >= nextContainerLine.outerWidth()) {
                    //         let newContainerLine = $(createNewLine(createNewWrapText()))
                    //         newContainerLine.insertAfter(nextContainerLine)
                    //         let newContainerWrapText = newContainerLine.find('[element-name="container_wrap_text"]')
                    //         nextContainerLine = newContainerLine;
                    //         nextContainerWrapText = newContainerWrapText;
                    //         $(containerText).appendTo(nextContainerWrapText)
                    //     }
                    // })
                    setCursor(getText(cloneContainerText), 1)
                }
                // else if (event.which === 8) {
                //     let prevContainerParagraph = targetContainerParagraph.prev();
                //     if (targetContainerText.is(targetContainerLine.find('[element-name="container_text"]').first()) &&
                //         currentCursor.startOffset === 0
                //     ) {
                //         console.log(prevContainerParagraph.find('[element-name="container_text"]').text().charCodeAt(0))
                //         if (prevContainerParagraph.find('[element-name="container_text"]').text().length === 1 &&
                //             prevContainerParagraph.find('[element-name="container_text"]').text().charCodeAt(0) === 160
                //         ) {
                //             prevContainerParagraph.remove()
                //         }
                //     }
                // }
                event.preventDefault();
            })

            AVATEXTEDITOR.editors[id].element.addEventListener('DOMSubtreeModified', async(event) => {
                let targetContainerText = $(event.target).parents('[element-name="container_text"]');
                let targetContainerWrapText = targetContainerText.parents('[element-name="container_wrap_text"]');
                let targetContainerLine = targetContainerWrapText.parents('[element-name="container_line"]')
                if (targetContainerWrapText.outerWidth() > targetContainerLine.outerWidth()) {
                    let currentCursor = window.getSelection() && window.getSelection().getRangeAt(0);
                    let startOffset = currentCursor.startOffset;
                    let nextContainerLine;
                    let isMustNewContainerText;
                    let targetLastContainerText = targetContainerWrapText.find('[element-name="container_text"]').last()
                    if (!targetLastContainerText.text()) {
                        targetLastContainerText.remove();
                        targetLastContainerText = targetContainerWrapText.find('[element-name="container_text"]').last();
                        isMustNewContainerText = true;
                    }

                    let newText = targetLastContainerText.text().substr(targetLastContainerText.text().length - 1);
                    targetLastContainerText.text(targetLastContainerText.text().substr(0, targetLastContainerText.text().length - 1))
                    if (targetContainerLine.next().length === 0) {
                        nextContainerLine = $(createNewLine(createNewWrapText()));
                        nextContainerLine.insertAfter(targetContainerLine)
                        let cloneContainerText = targetLastContainerText.clone();
                        cloneContainerText.text(newText)
                        cloneContainerText.appendTo(nextContainerLine.find('[element-name="container_wrap_text"]'))
                    } else {
                        nextContainerLine = targetContainerLine.next()
                        let targetFirstContainerText = nextContainerLine.find('[element-name="container_text"]').first();
                        if (isMustNewContainerText) {
                            let cloneContainerText = targetLastContainerText.clone();
                            cloneContainerText.text('')
                            cloneContainerText.prependTo(nextContainerLine.find('[element-name="container_wrap_text"]'))
                            targetFirstContainerText = nextContainerLine.find('[element-name="container_text"]').first();
                        }
                        targetFirstContainerText.text(newText + targetFirstContainerText.text())
                    }
                    if (startOffset - 1 === targetContainerText.text().length && targetContainerText.is(targetLastContainerText)) {
                        setCursor(targetContainerLine.next().find('[element-name="container_text"]').first().get(0).childNodes[0], 0)
                    } else {
                        setCursor(targetContainerText.get(0).childNodes[0], startOffset)
                    }
                }
            })
        }

        async function formatParagraphInLine(containerWrapParagraph) {
            let containersOther = containerWrapParagraph.children('[element-name="container_other"]')
            containersOther = ascendingSortElement([...containersOther])
            containersOther.forEach((containerOther) => {
                $(containerOther).appendTo(containerWrapParagraph)
            })

            let containersParagraph = containerWrapParagraph.children('[element-name="container_paragraph"]')

            containersParagraph = [...containersParagraph]



            containerWrapParagraph.children('[element-name="container_other"]').each((index, element) => {
                let targetEl = $(element)
                let nextEl = targetEl.next('[element-name="container_other"]');
                let prevEl = targetEl.prev('[element-name="container_other"]');
                // let startContainer = window.getSelection().getRangeAt(0).startContainer;
                // console.log('prevEl', prevEl, prevEl.length > 0 && prevEl.position().left)
                // console.log('targetEl', targetEl, targetEl.length > 0 && targetEl.position().left)
                // console.log('nextEl', nextEl, nextEl.length > 0 && nextEl.position().left)

                let spaceParagraph = targetEl.length > 0 && targetEl.position().left - (prevEl.length > 0 && (prevEl.position().left + prevEl.outerWidth()));
                let targetContainerParagraph = containersParagraph.length > 0 && containersParagraph[0]
                console.log('spaceParagraph', spaceParagraph)

                //  console.log(prevEl.nextUntil(targetEl))
                targetContainerParagraph = $(targetContainerParagraph)
                targetContainerParagraph.css('width', spaceParagraph)
                targetContainerParagraph.css('margin-left', prevEl.outerWidth())
                targetContainerParagraph.addClass('ava-container-paragraph-inLine')
                targetContainerParagraph.insertBefore(targetEl)
                if (containersParagraph.length > 0) {
                    containersParagraph.splice(0, 1)
                }


                if (index === containerWrapParagraph.children('[element-name="container_other"]').length - 1 &&
                    containersParagraph.length > 0
                ) {
                    targetContainerParagraph = containersParagraph.length > 0 && containersParagraph[0]
                    targetContainerParagraph = $(targetContainerParagraph)
                    targetContainerParagraph.css('width', containerWrapParagraph.outerWidth() - (targetEl.position().left + targetEl.outerWidth()))
                    targetContainerParagraph.css('margin-left', targetEl.outerWidth())
                    targetContainerParagraph.insertAfter(targetEl)
                    targetContainerParagraph.attr('element-data', 'isLastContainer')
                    containersParagraph.splice(0, 1)
                }
                // console.log(startContainer)
                // setCursor(startContainer, 0)
                // setCursor(getText($(currentCursor.startContainer)), 0)
                // console.log('nextEl', nextEl)
                // console.log('prevEl', prevEl)

            })



            // ascendingSortOrder(wrapContainerParagraph.children('[element-name="container_other"]'))
            // wrapContainerParagraph.find('[element-name="container_paragraph"]').each((index, element) => {
            //     let targetEl = $(element)
            //     targetEl.addClass('ava-container-paragraph-inLine')
            //     let nextEl = targetEl.next();
            //     let prevEl = targetEl.prev();
            //     console.log('prevEl', prevEl)
            //     console.log('nextEl', nextEl)
            //     targetEl.css('padding-left', prevEl.length > 0 && prevEl.position().left + prevEl.outerWidth())
            //     targetEl.css('padding-right', nextEl.length > 0 && wrapContainerParagraph.outerWidth() - nextEl.position().left)

            // })
        }

        function mergeContainerLine(containerParagraph) {
            let targetContainerParagraph = $(containerParagraph)
            let targetContainerLine = targetContainerParagraph.find('[element-name="container_line"]').first();
            let taragetContainerWrapText = targetContainerLine.find('[element-name="container_wrap_text"]');
            let targetContainersText = targetContainerParagraph.find('[element-name="container_text"]').clone();
            targetContainerParagraph.find('[element-name="container_text"]').remove();

            targetContainersText.each((index, containerText) => {
                    let targetContainerText = $(containerText)
                    targetContainerText.appendTo(taragetContainerWrapText)
                    if (taragetContainerWrapText.outerWidth() >= targetContainerLine.outerWidth()) {
                        let positionTargetText = taragetContainerWrapText.outerWidth() - targetContainerLine.outerWidth()
                        if (targetContainerLine.next().length === 0) {
                            targetContainerLine = $(createNewLine(createNewWrapText()))
                            taragetContainerWrapText = targetContainerLine.find('[element-name="container_wrap_paragraph"]')
                        }
                        let cloneContainerText = targetContainerText.clone();
                        cloneContainerText.text(cloneContainerText.text().substr(positionTargetText))
                        targetContainerText.text(targetContainerText.text().substr(0, positionTargetText))
                        cloneContainerText.appendTo(taragetContainerWrapText)
                    }
                })
                // targetContainerParagraph.find('[element-name="container_line"]').each((index, element) => {
                //     let targetContainerLine = $(element)
                //     if (targetContainerLine.find('[element-name="container_wrap_paragraph"]').children().length == 0 &&
                //         targetContainerLine.children().length === 1
                //     ) {
                //         targetContainerLine.remove();
                //     }
                // })
        }

        function ascendingSortElement(wrapContainersParagraph) {
            return wrapContainersParagraph.sort((el1, el2) => {
                if ($(el1).position().left < $(el2).position().left) {
                    { return -1; }
                }
                if ($(el1).position().left > $(el2).position().left) {
                    { return 1; }
                }
                return 0;
            })
        }



        function createNewWrapParagraph(containerParagraph) {
            return `<div class="ava-container-wrap-paragraph" element-name="container_wrap_paragraph">${containerParagraph||''}</div>`
        }

        function createNewParagraph(containerLine) {
            return `<div class="ava-container-paragraph" element-name="container_paragraph">${containerLine||''}</div>`
        }

        function createNewLine(containerWrapText) {
            return `<div class="ava-container-line" element-name="container_line">${containerWrapText||''}</div>`
        }

        function createNewWrapText(containerText) {
            return `<div  element-name="container_wrap_text" class="ava-container-wrap-text">${containerText||''}</div>`
        }

        function createNewText(text) {
            return `<div  element-name="container_text" class="ava-container-text">${text||''}</div>`
        }

        function getText(containerText) {
            return containerText.get(0).childNodes[0]
        }



        function setCursor(node, offset) {
            let range = document.createRange();
            let sel = window.getSelection();
            range.setStart(node, offset);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }


        function complieStyles(container, attributes) {
            Object.keys(attributes.styles).forEach((key) => {
                if (container.style[key] !== 'color') {
                    if (container.style[key] === attributes.styles[key]) {
                        container.style[key] = null
                    } else {
                        container.style[key] = attributes.styles[key]
                    }
                } else {
                    container.style[key] = attributes.styles[key]
                }

            })
        }



    };
    // AVATEXTEDITOR.compileStyles()



}())