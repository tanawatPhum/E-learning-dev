
export class Constants {
    public static readonly platform = {
        device: 'device',
        browser: 'browser'
    };
    public static readonly general = {
        key:{
            encode: {
                elearning: 'dreamza002'
            }
        },
        event:{
            click: {
                add: 'add',
                save: 'save',
                new:'new'
            },
            load:{
                success:'success',
                html:'html'
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
                    height:"40%",
                    width:"40%"
                },
                navBar:{
                    height:55
                }

            }
        },
        style:{
            fontSizeList:[8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72]
        },
        message:{
            status:{
                success:{id:1,text:'success'},
                fail:{id:2,text:'fail'},
                notFound: {id:3,text:'notFound'},
                created:{id:4,text:'created'}
            }
  
        }
    }
    public static readonly document = {
        contents: {
            types: {
                oneLayout: {name : 'oneLayout', id: 1 },
                twoLayout: {name : 'twoLayout', id: 2 },
                threeLayout:  {name : 'threeLayout', id: 4 },
                fourLayout: {name : 'fourLayout', id: 5 },
                freedomLayout:  {name : 'freedomLayout', id: 6 }
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
                fileBrowse: {name : 'file-browse', id: 5 },
                progressBar: {name : 'progress-bar', id: 6 },
                comment: {name : 'comment', id: 7 },
                toDoList: {name : 'todo-list', id: 8 },
            }
        }
    };

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
