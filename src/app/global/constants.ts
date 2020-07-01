import { environment } from '../../environments/environment';

export class Constants {
    public static readonly platform = {
        device: 'device',
        browser: 'browser'
    };
    public static readonly common = {
        user:{
            id:'system'
        },
        key:{
            encode: {
                elearning: 'dreamza002'
            }
        },
        event:{
            click: {
                add: 'add',
                save: 'save',
                new:'new',
                update:'update'
            },
            load:{
                success:'success',
                html:'html',
                component:'component',
                preview:'preview'
            },
            save:{
                document:'document'
            }
        },
        element :{
            // limit: {
            //     resize: {
            //         height: 80,
            //         width: 300
            //     }
            // },
            css: {
                box:{
                    bgNoneColor: 'transparent',
                    bgWhiteColor: '#fff',
                    height:300,
                    width:300
                },
                navBar:{
                    height:55
                }

            }
        },
        style:{
            fontSizeList:[8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72],
            indent:{
                left:5,
                right:0
            }
        },
        message:{
            status:{
                success:{id:1,text:'success'},
                fail:{id:2,text:'fail'},
                notFound: {id:3,text:'notFound'},
                created:{id:4,text:'created'},
                submitted:{id:5,text:'submitted'}
            }
  
        },
        host:{
         
            // smartDoc:'https://smartdoc.alworks.io',
            // serverSite:'https://smartdoc.alworks.io',
        
            serverSite:environment.SERVER_SITE,
            smartDoc:environment.FRONTEND_SITE,
            //storage:'https://e-learning-dev2.s3-ap-southeast-1.amazonaws.com/public/',
            getImage:environment.GET_IMAGE
        }
    }
    public static readonly document = {
        lifeCycle:{
            initialEditor:'initialEditor',
            loadEditor:"loadEditor",
            createContent:"createContent",
            loadPreview:"loadPreview",
            updateDocumentNav:'updateDocumentNav',
        },
        layouts:{
            size:{
                a4:{width:1123,height:791}
            },
            types: {
                tableLayout:'table-layout',
                twoLayout: 'two-layout',
                threeLayout:'three-layout',
                fourLayout: 'four-layout',
                freedomLayout:'freedom-layout',
                websiteLayout:'website-layout',
                documentLayout:'document-layout'
            }
        },
        events:{
            initialContent:'initialContent',
            loadContent:'loadContent',
            setLayout:'setLayout'
        },
        contents: {
            lifeCycle:{
                loadsubForm:'loadsubForm',
                playVideo:'playVideo',
                addTaskList:'addTaskList',
                saveDocument:'saveComment',
                clickSubForm:'clickSubForm',
                clickLink:'clickLink',
                setRatio:'setRatio',
                delete:'delete',
                updateHandleContentBox:'updateHandleContentBox'
            },
            events:{
                startDrag:'startDrag',
                stopDrag:'stopDrag',
                startResize:'startResize',
                stopResize:'stopResize'
            },
            types: {
                img:'img-content',
                video:'video-content',
                link:'link-content',
                file:'file-content',
                progressBar:'progressBar-content',
                subform:'subform-content',
                textarea:'textarea-content',
                todoList:'todoList-content',
                comment:'comment-content',
                note:'note-content',
                exam:'exam-content'

                // oneLayout: {name : 'oneLayout', id: 1 },
                // twoLayout: {name : 'twoLayout', id: 2 },
                // threeLayout:  {name : 'threeLayout', id: 4 },
                // fourLayout: {name : 'fourLayout', id: 5 },
                // freedomLayout:  {name : 'freedomLayout', id: 6 }
            },
            constats:{
                linkTypes:{
                    url: 'url',
                    document: 'document',
                    content:'content'
                },
                videoTypes:{
                    browseFile:'browseFile',
                    youtube:'youtube',
                    wistia:'wistia'
                }
            }
        },
        modals:{
            types:{
                saveDocument:{name:'saveDocument',id:1},
                newDocument:{name:'newDocument',id:2},
                deleteDocument:{name:'deleteDocument',id:3},
            },
            events:{
                saveNewDocument:{name:'saveNewDocument',id:1},
                saveOldDocument:{name:'saveOldDocument',id:2},
                deleteDocument:{name:'deleteDocument',id:3},
                cancelSaveDocument:{name:'cancelSaveDocument',id:3}
            }
        },
        tools:{
            types:{
                trash: {name : 'trash', id: 1 },
                textArea: {name : 'text-area', id: 2 },
                videoBrowse: {name : 'video-browse', id: 3 },
                subform: {name : 'subform', id: 4 },
                imgBrowse: {name : 'img-browse', id: 5 },
                progressBar: {name : 'progress-bar', id: 6 },
                comment: {name : 'comment', id: 7 },
                toDoList: {name : 'todo-list', id: 8 },
                fileBrowse: {name : 'file-browse', id: 9 },
                linkBrowse: {name : 'link-browse', id: 10},
                exam: {name : 'exam', id: 11},
                note : {name : 'note', id: 12},
            }
        },
        boxes:{
            
            types:{
                boxInitial: 'box-intial',
                boxTextarea: 'box-textarea',
                boxBrowseImg: 'box-browse-img',
                boxBrowseLink: 'box-browse-link',
                boxBrowseExam:'boxBrowseExam',
                boxBrowseFile: 'box-browse-file',
                boxImg: 'box-img',
                boxVideo: 'box-video',
                boxFile: 'box-file',
                boxLink: 'box-link',
                boxBrowseVideo: 'box-browse-video',
                boxSubform: 'box-subform',
                boxAddSubform: 'box-add-subform',
                boxProgressBar: 'box-progress-bar',
                boxComment: 'box-comment',
                boxToDoList: 'box-toDoList',
                boxExam:'box-exam',
                boxNote:'box-note',
                boxAsText:'box-as-text'

            }
        },
        connect:{
                type:{
                    documentSave:'documentSave',
                    documentRead:'documentRead',
                    documentNavSave:'documentNavSave',
                    documentNavRead:'documentNavRead',
                    documentTrackSave:'documentTrackSave',
                    documentTrackRead:'documentTrackRead',
                    documentReadMongoDBToCacheDB: 'documentReadMongoDBToCacheDB',
                    documentDelete:'documentDelete'
                }
        },
        object:{
            type:{
                document:'document',
                documentNav:'documentNav',
                documentTrack:'documentTrack'
            }
        }
    }

    // public static readonly key = {
    //     encode: {
    //         elearning: 'dreamza002'
    //     }
    // };
    // public static readonly event = {
    //     click: {
    //         add: 'add',
    //         save: 'save'
    //     }
    // };
    // public static readonly element = {
    //     limit: {
    //         resize: {
    //             height: 80,
    //             width: 280
    //         }
    //     },
    //     css: {
    //         bgNoneColor: 'transparent',
    //         bgWhiteColor: '#fff'
    //     }
    // };
}
