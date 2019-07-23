
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
                success:'success'
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
            },
            events:{
                saveNewDocument:{name:'saveNewDocument',id:1},
                saveOldDocument:{name:'saveOldDocument',id:2},
                cancelSaveDocument:{name:'cancelSaveDocument',id:3}
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
