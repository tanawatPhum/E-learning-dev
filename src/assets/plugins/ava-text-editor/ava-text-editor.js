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
        AVATEXTEDITOR.editors[id].element.appendChild($('<p><span element-name="container_line" class="container-line"><span style="color:yellow">12</span><span style="font-weight:bold">56</span> <span style="color:green">zaczf</span></span> </p>').get(0))
        handleEditorEvents(id);
        AVATEXTEDITOR.editors[id].compileStyles = function(attributes) {
            let targetContainers = [];
            let currentCursor = window.getSelection().getRangeAt(0)
            let paragraph = currentCursor.commonAncestorContainer;
            if ((paragraph.nodeName === '#text' || paragraph.nodeName === 'SPAN') && $(paragraph).attr('element-name') !== 'container_line') {
                paragraph = $(paragraph).parents('.container-line').get(0);
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
            for (let i = 0; i < paragraph.childNodes.length; i++) {
                if (paragraph.childNodes[i].isSameNode(startContainer)) {
                    isStartContainer = true;
                }
                if (isStartContainer && paragraph.childNodes[i].nodeName === 'SPAN') {
                    targetContainers.push(paragraph.childNodes[i])
                }
                if (paragraph.childNodes[i].isSameNode(endContainer)) {
                    break;
                }

            }
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

                        let targetString = c
                        urrentCursor.endContainer.textContent.substr(0, currentCursor.endOffset)
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

        function handleEditorEvents(id) {
            AVATEXTEDITOR.editors[id].element.addEventListener('DOMNodeInserted', (event) => {
                console.log(event)

                // if (event.target.tagName === 'P') {
                //     //  event.target.removeChild();
                //     //  event.target.appendChild($('<span></span>').get(0))
                // }


            })



            // // console.log("document.querySelectorAll('p')", document.querySelectorAll('p'))
            // AVATEXTEDITOR.editors[id].element.addEventListener('mousemove', (event) => {
            //     console.log("event==>", event)
            // })


            // .addEventListener("dragover", function(event) {
            //     // prevent default to allow drop
            //     console.log('event', event)
            //     event.preventDefault();
            // }, false);


            // AVATEXTEDITOR.editors[id].element.addEventListener("ondrop", (event) => {
            //     console.log('event', event)
            // });

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