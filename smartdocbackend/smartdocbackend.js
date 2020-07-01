const redis = require('redis');
const express = require('express')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
let fs = require('fs');
let mime = require('mime');
let multer = require('multer');
let path = require('path')


let storage = multer.diskStorage({
    destination: 'storage/uploads/',
    filename: (req, file, cb) => {
        let extFile = path.extname(file.originalname)
        let fileName = file.originalname.replace(extFile, '') + Date.now() + extFile;
        cb(null, fileName);
    }
});


let upload = multer({ storage: storage });
const MongoClient = require('mongodb').MongoClient;
let request = require('request');

//const host = '192.168.0.195';

// let AWS = require('aws-sdk');
// const S3host = 'https://e-learning-dev2.s3-ap-southeast-1.amazonaws.com/public/';
// // let myConfig = new AWS.Config();
// // myConfig.update({
// //     region: 'eu-central-1',
// //     identityPoolId: 'eu-central-1:4c9f1222-30c0-4db9-b9ed-57938e9684be'
// // });
// AWS.config.update({
//     region: 'ap-southeast-1',
//     credentials: new AWS.CognitoIdentityCredentials({
//         IdentityPoolId: 'ap-southeast-1:d9aeac3b-d08f-4051-ac12-435e46b8162b'
//     })
// });
// AWS.config.getCredentials((err) => {
//     console.log(err)

// })
// var s3 = new AWS.S3({
//     params: {
//         Bucket: 'e-learning-dev'
//     }
// });


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))




//const redisHost = 'localhost';
// const redisHost = '192.168.0.195';
// const redisPort = 6379;
//const mongoHost = '127.0.0.1';
const mongoHost = process.env.SMARTDOC_DB || 'localhost:27017';

console.log(process.env.SMARTDOC_DB);
// console.log('process.env.BACKEND_SERVER', process.env.BACKEND_SERVER)
// const mongoPort = 27017;
// let client = redis.createClient(redisPort, redisHost);


const collectionName = {
    documents: 'documents',
    navigators: 'navigators',
    tracks: 'tracks'
}
const systemId = 'system'

const constantsVar = {
    request: {
        type: {
            documentSave: 'documentSave',
            documentRead: 'documentRead',
            documentReadMongoDBToCacheDB: 'documentReadMongoDBToCacheDB',
            documentNavSave: 'documentNavSave',
            documentNavRead: 'documentNavRead',
            documentTrackSave: 'documentTrackSave',
            documentTrackRead: 'documentTrackRead',
            documentDelete: 'documentDelete',
            commentSend: 'commentSend',
            commentUpdate: 'commentUpdate',
        },

        message: {
            text: {
                success: 'success',
                fail: 'fail'
            }
        }
    },
    response: {
        message: {
            text: {
                success: 'success',
                fail: 'fail'
            }
        }
    }
}

const listen = app.listen(3000, () => {
    //console.log('Start server at port 3000.')
    // deleteAllValue();
})

app.post('/api/uploadFile', upload.single('file'), (req, res) => {

        console.log('The filename is ' + res.req.file.filename);
        res.send(JSON.stringify({ url: 'storage/uploads/' + res.req.file.filename }));



        // var params = {
        //     Bucket: 'e-learning-dev2',
        //     Key: 'public/' + req.body.name,
        //     ContentType: req.file.mimetype,
        //     Body: req.file.buffer
        // };
        // s3.upload(params, (err, data) => {
        //     if (err) {
        //         res.send(JSON.stringify(err))
        //         throw err;
        //     }

        //     console.log(`File uploaded successfully. ${data.Location}`);
        //     res.send(JSON.stringify({ url: data.Location }))
        // })
    })
    // app.post('/', (req, res) => {
    //     res.status(201).json(req.body)
    // })
    // app.get('/', (req, res) => {
    //     res.send('Hello World')
    // })
    // app.get('/api/images/*', (req, res) => {
    //     let targetPic = S3host + req.url.replace('/api/images/', '')
    //     var options = {
    //         url: targetPic,
    //         method: "get",
    //         encoding: null
    //     };
    //     request(options, (error, response, body) => {
    //         console.log('request image success')
    //         res.set({ 'Content-Type': response && response.headers['content-type'] });
    //         res.send(response.body);
    //     })
    // })

app.get('/api/getImage/', (req, res) => {
        let targetPic = req.query && req.query.originalPath
        console.log('targetPic', targetPic)
        fs.readFile(targetPic, (err, content) => {
            let contentType = mime.getType(targetPic);
            res.set({ 'Content-Type': contentType });
            res.send(content);
            // console.log(contentType);
        });

    })
    // app.get('/api/getImage/', (req, res) => {

//     let targetPic = req.query && req.query.originalPath

//     var options = {
//         url: targetPic,
//         method: "get",
//         encoding: null
//     };
//     request(options, (error, response, body) => {
//         console.log('request image success')
//         console.log(response.headers['content-type'])
//         res.set({ 'Content-Type': response && response.headers['content-type'] });
//         res.send(response.body);
//     })

//     // let targetPic = S3host + req.url.replace('/api/images/', '')
//     // var options = {
//     //     url: targetPic,
//     //     method: "get",
//     //     encoding: null
//     // };
//     // request(options, (error, response, body) => {
//     //     console.log('request image success')
//     //     res.set({ 'Content-Type': response && response.headers['content-type'] });
//     //     res.send(response.body);
//     // })
// })



app.get('/getDocNavigators', (req, res) => {
    getDocumentNavs(req.query.userId).then((result) => {
        //console.log(result)
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
})

// client.on('connect', () => {
//     //console.log('Redis client connected');
// });
// client.on('error', (err) => {
//     //console.log('Something went wrong ' + err);
// });

function uploadFile(fileData) {
    // return new Promise((resolve, reject) => {
    //     var params = {
    //         Key: n + '.pdf',
    //         ContentType: file.type,
    //         Body: file
    //     };

    //     s3.upload()
    //     resolve('xxxx')
    // })
}
//cacheDB
// function insertValueIntoCacheDB(table, key, value) {
//     value = JSON.stringify(value)
//     client.hset(table, key, value, redis.print);
//     // getAllValueFromCacheDB(table)
// }

// function getAllValueFromCacheDB(table) {
//     client.hkeys(table, function(err, replies) {
//         //console.log(replies.length + " replies:");
//         replies.forEach(function(reply, i) {
//             //console.log("    " + i + ": " + reply);
//         });
//     });
// }

// function getValueFromCacheDB(table, key) {
//     return new Promise((resolve, reject) => {
//         if (key) {
//             client.hget(table, key, (error, result) => {
//                 if (error) {
//                     reject(error)
//                     throw error;
//                 }
//                 if (!client.quit) {
//                     client.quit()
//                 }
//                 resolve(JSON.parse(result))
//             })
//         } else {
//             let arrayResult = []
//             client.hgetall(table, (error, result) => {
//                 //console.log("result", result)
//                 if (error) {

//                     reject(error)
//                     throw error;
//                 }
//                 for (key in result) {
//                     arrayResult.push(JSON.parse(result[key]))
//                 }
//                 if (!client.quit) {
//                     client.quit()
//                 }
//                 resolve(arrayResult)
//             })
//         }

//         // client.quit();
//     });
// }

// function deleteValue(targetkey) {
//     // return new Promise(async(resolve, reject) => {
//     //     await client.keys("*", function(err, keys) {
//     //         keys.forEach(function(key, pos) {
//     //             console.log('xcxcxc', key)
//     //             if (targetkey === key) {
//     //                 client.del(key)
//     //             }

//     //         });
//     //     });
//     //     resolve(constantsVar.response.message.text.success)
//     // })
// }

// function deleteAllValue() {
//     return new Promise(async(resolve, reject) => {
//         await client.keys("*", function(err, keys) {
//             keys.forEach(function(key, pos) {
//                 client.del(key)
//             });
//         });
//         resolve(constantsVar.response.message.text.success)
//     })

// }
//mongoDB
function connectMongoDB() {
    return new Promise((resolve, reject) => {
        MongoClient.connect('mongodb://' + mongoHost + '/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db) {
            if (err) throw reject(err);
            resolve(db)
        })
    })

}

function insertValueIntoMongoDB(collectionName, documentObj) {
    return new Promise((resolve, reject) => {
        connectMongoDB().then((db) => {
            let dbo = db.db("elearning");
            if (documentObj.data.id) {
                dbo.collection(collectionName).deleteOne({ 'data.id': documentObj.data.id, 'data.userId': documentObj.data.userId }, function(err, res) {
                    dbo.collection(collectionName).insertOne(documentObj, function(err, res) {
                        if (err) throw reject(err);
                        resolve(res)
                        console.log("1 document inserted");
                        db.close();
                    });
                });
            } else {
                reject('ID undefined');
            }
        })
    })
}

function findValueFromMongoDB(collectionName, condition) {
    return new Promise((resolve, reject) => {
        connectMongoDB().then((db) => {
            let dbo = db.db("elearning");
            dbo.collection(collectionName).find(condition).toArray((err, res) => {
                resolve(res);
            })

        })
    })
}

function updateValueFromMongoDB(collectionName, condition) {
    return new Promise((resolve) => {
        connectMongoDB().then((db) => {
            let dbo = db.db("elearning");
            dbo.collection(collectionName).updateMany(condition).toArray((err, res) => {
                console.log('err', err)
                console.log('complete', res)
                resolve(res);
            })
        })
    })
}

function removeDocumentFromMongoDB(documentNavObj) {
    return new Promise((resolve, reject) => {
        connectMongoDB().then((db) => {
            let dbo = db.db("elearning");
            dbo.collection(collectionName.documents).deleteOne({ 'data.id': documentNavObj.data.id, 'data.userId': documentNavObj.data.userId }, function(err, res) {
                if (err) throw reject(err);
                dbo.collection(collectionName.navigators).deleteOne({ 'data.id': documentNavObj.data.id, 'data.userId': documentNavObj.data.userId }, function(err, res) {
                    if (err) throw reject(err);
                    dbo.collection(collectionName.tracks).deleteOne({ 'data.id': documentNavObj.data.id, 'data.userId': documentNavObj.data.userId }, function(err, res) {
                        if (err) throw reject(err);
                        resolve(res)
                    });
                });
            });
        });
    });
}




const io = socketIO.listen(listen);
io.on('connection', client => {
    client.on('disconnect', () => {
        // client.disconnect();
        //console.log('user disconnected')
    })

    client.on('end', function() {
        console.log('end')
            // client.disconnect();
    });

    //save document
    client.on(constantsVar.request.type.documentSave, (documentObj) => {
        // let userId = documentObj.data.userId;
        //  let table = 'user:' + userId + ',table:' + collectionName.documents
        insertValueIntoMongoDB(collectionName.documents, documentObj).then(() => {
            // insertValueIntoCacheDB(table, documentObj.data.id, documentObj.data)
            // if (userId !== systemId) {
            //     updateValueFromMongoDB(collectionName.documents, { 'data.id': documentObj.data.id, 'data.userId': systemId, 'data.contents.comments': documentObj.data.contents.comments }).then((res) => {
            //         io.sockets.emit(constantsVar.request.type.documentSave, constantsVar.request.message.text.success)
            //     })
            // } else {
            //     io.sockets.emit(constantsVar.request.type.documentSave, constantsVar.request.message.text.success)
            // }
            io.sockets.emit(constantsVar.request.type.documentSave, constantsVar.request.message.text.success)
        }).catch(() => {
            io.sockets.emit(constantsVar.request.type.documentSave, constantsVar.request.message.text.fail)
        })

    })
    client.on(constantsVar.request.type.documentNavSave, (documentNavObj) => {
        //let userId = documentNavObj.data.userId;
        //let table = 'user:' + userId + ',table:' + collectionName.navigators;
        insertValueIntoMongoDB(collectionName.navigators, documentNavObj).then(() => {
            //insertValueIntoCacheDB(table, documentNavObj.data.id, documentNavObj.data)
            io.sockets.emit(constantsVar.request.type.documentNavSave, constantsVar.request.message.text.success)
        }).catch(() => {
            io.sockets.emit(constantsVar.request.type.documentSave, constantsVar.request.message.text.fail)
        })
    })

    client.on(constantsVar.request.type.documentTrackSave, (documentTrackObj) => {
            //let userId = documentTrackObj.data.userId;
            //let table = 'user:' + userId + ',table:' + collectionName.tracks;
            insertValueIntoMongoDB(collectionName.tracks, documentTrackObj).then(() => {
                // insertValueIntoCacheDB(table, documentTrackObj.data.id, documentTrackObj.data)
                io.sockets.emit(constantsVar.request.type.documentNavSave, constantsVar.request.message.text.success)
            }).catch(() => {
                io.sockets.emit(constantsVar.request.type.documentSave, constantsVar.request.message.text.fail)
            })
            io.sockets.emit(constantsVar.request.type.documentTrackSave, constantsVar.request.message.text.success)
        })
        //read document
    client.on(constantsVar.request.type.documentRead, (documentObj) => {
        //let documentId = documentObj.data.id;
        //let table = 'user:' + documentObj.data.userId + ',table:' + collectionName.documents;
        let condition;
        if (documentObj.data.id) {
            condition = { 'data.id': documentObj.data.id, 'data.userId': documentObj.data.userId }
        } else {
            condition = { 'data.userId': documentObj.data.userId }
        }

        findValueFromMongoDB(collectionName.documents, condition).then((result) => {
            let resultResponse = []
            result && result.forEach((detail) => {
                resultResponse.push(detail.data)
            })
            if (result && documentObj.data.userId !== systemId || documentObj.data.userId === systemId) {
                io.sockets.emit(constantsVar.request.type.documentRead, resultResponse)
            } else {
                createNewUser(documentObj).then((result) => {
                    io.sockets.emit(constantsVar.request.type.documentRead, result)
                }).catch((error) => {
                    io.sockets.emit(constantsVar.request.type.documentRead, error)
                })
            }
        }).catch((error) => {
            io.sockets.emit(constantsVar.request.type.documentRead, error)
        })

        // getValueFromCacheDB(table, documentId).then((result) => {
        //     if (result && documentObj.data.userId !== systemId || documentObj.data.userId === systemId) {
        //         io.sockets.emit(constantsVar.request.type.documentRead, result)
        //     } else {
        //         createNewUser(documentObj).then((result) => {
        //             io.sockets.emit(constantsVar.request.type.documentRead, result)
        //         }).catch((error) => {
        //             io.sockets.emit(constantsVar.request.type.documentRead, error)
        //         })
        //     }

        // }).catch((error) => {
        //     io.sockets.emit(constantsVar.request.type.documentRead, error)
        // })
    })
    client.on(constantsVar.request.type.documentNavRead, (documentNavObj) => {
        findValueFromMongoDB(collectionName.navigators, { 'data.userId': documentNavObj.data.userId }).then((result) => {
                let resultResponse = []
                result && result.forEach((detail) => {
                    resultResponse.push(detail.data)
                })
                io.sockets.emit(constantsVar.request.type.documentNavRead, resultResponse)
            }).catch((error) => {
                io.sockets.emit(constantsVar.request.type.documentNavRead, error)
            })
            // let table = 'user:' + documentNavObj.data.userId + ',table:' + collectionName.navigators;

        // getValueFromCacheDB(table, null).then((result) => {
        //     io.sockets.emit(constantsVar.request.type.documentNavRead, result)
        // }).catch((error) => {

        //     io.sockets.emit(constantsVar.request.type.documentNavRead, error)
        // })
    })
    client.on(constantsVar.request.type.documentTrackRead, (documentTrackObj) => {
        findValueFromMongoDB(collectionName.tracks, { 'data.userId': documentTrackObj.data.userId }).then((result) => {
                let resultResponse = []
                result && result.forEach((detail) => {
                    resultResponse.push(detail.data)
                })
                io.sockets.emit(constantsVar.request.type.documentTrackRead, resultResponse)
            }).catch(() => {
                io.sockets.emit(constantsVar.request.type.documentTrackRead, error)
            })
            // let table = 'user:' + documentTrackObj.data.userId + ',table:' + collectionName.tracks;
            // getValueFromCacheDB(table, null).then((result) => {

        //     io.sockets.emit(constantsVar.request.type.documentTrackRead, result)
        // }).catch((error) => {
        //     io.sockets.emit(constantsVar.request.type.documentTrackRead, error)
        // })
    })

    // client.on(constantsVar.request.type.documentReadMongoDBToCacheDB, () => {
    //         deleteAllValue().then(() => {
    //             findValueFromMongoDB(collectionName.documents, null).then((documentAllObj) => {
    //                 documentAllObj.forEach((documentObj) => {
    //                     let userId = documentObj.data.userId;
    //                     let table = 'user:' + userId + ',table:' + collectionName.documents
    //                     insertValueIntoCacheDB(table, documentObj.data.id, documentObj.data)
    //                 })
    //             });
    //             findValueFromMongoDB(collectionName.navigators, null).then((documentAllNavObj) => {
    //                 if (documentAllNavObj.length === 0) {
    //                     io.sockets.emit(constantsVar.request.type.documentReadMongoDBToCacheDB, constantsVar.response.message.text.success)
    //                 } else {
    //                     documentAllNavObj.forEach((documentNavObj, index) => {
    //                         let userId = documentNavObj.data.userId;
    //                         let table = 'user:' + userId + ',table:' + collectionName.navigators;
    //                         insertValueIntoCacheDB(table, documentNavObj.data.id, documentNavObj.data)
    //                         if (index === documentAllNavObj.length - 1) {
    //                             io.sockets.emit(constantsVar.request.type.documentReadMongoDBToCacheDB, constantsVar.response.message.text.success)
    //                         }
    //                     });
    //                 }
    //             });
    //             findValueFromMongoDB(collectionName.tracks, null).then((documentAllTrackObj) => {
    //                 documentAllTrackObj.forEach((documentTrackObj) => {
    //                     let userId = documentTrackObj.data.userId;
    //                     let table = 'user:' + userId + ',table:' + collectionName.tracks;
    //                     insertValueIntoCacheDB(table, documentTrackObj.data.id, documentTrackObj.data)
    //                 })
    //             });

    //         })

    //     })
    //delete document
    client.on(constantsVar.request.type.documentDelete, (documentNavObj) => {
        removeDocumentFromMongoDB(documentNavObj).then((res) => {
            io.sockets.emit(constantsVar.request.type.documentDelete, constantsVar.response.message.text.success)
                // deleteValue(documentNavObj.data.id)

            // deleteAllValue().then(() => {
            //     findValueFromMongoDB(collectionName.documents, null).then((documentAllObj) => {
            //         documentAllObj.forEach((documentObj) => {
            //             let userId = documentObj.data.userId;
            //             let table = 'user:' + userId + ',table:' + collectionName.documents
            //             insertValueIntoCacheDB(table, documentObj.data.id, documentObj.data)
            //         })
            //     });
            //     findValueFromMongoDB(collectionName.navigators, null).then((documentAllNavObj) => {
            //         if (documentAllNavObj.length > 0) {
            //             documentAllNavObj.forEach((documentNavObj, index) => {
            //                 let userId = documentNavObj.data.userId;
            //                 let table = 'user:' + userId + ',table:' + collectionName.navigators;
            //                 insertValueIntoCacheDB(table, documentNavObj.data.id, documentNavObj.data)
            //                 if (index === documentAllNavObj.length - 1) {
            //                     io.sockets.emit(constantsVar.request.type.documentDelete, constantsVar.response.message.text.success)
            //                 }
            //             });
            //         } else {
            //             io.sockets.emit(constantsVar.request.type.documentDelete, constantsVar.response.message.text.success)
            //         }

            //     });
            //     findValueFromMongoDB(collectionName.tracks, null).then((documentAllTrackObj) => {
            //         documentAllTrackObj.forEach((documentTrackObj) => {
            //             let userId = documentTrackObj.data.userId;
            //             let table = 'user:' + userId + ',table:' + collectionName.tracks;
            //             insertValueIntoCacheDB(table, documentTrackObj.data.id, documentTrackObj.data)
            //         })
            //     });

            // })


        }).catch((err) => {
            io.sockets.emit(constantsVar.request.type.documentDelete, constantsVar.response.message.text.fail)
        })
    })

    //update comment
    client.on(constantsVar.request.type.commentSend, (obj) => {
        io.sockets.emit(constantsVar.request.type.commentUpdate, obj)
            // client.broadcast.emit(constantsVar.request.type.commentUpdate, obj);
    })

})

function createNewUser(documentObj) {
    return new Promise((resolve, reject) => {
        cloneDocument(documentObj).then((document) => {
            cloneTrackDocument(documentObj).then((res) => {
                cloneNavDocument(documentObj).then((res) => {
                    resolve(document);
                }).catch(() => {
                    reject(constantsVar.response.message.text.fail)
                })
            }).catch(() => {
                reject(constantsVar.response.message.text.fail)
            })
        }).catch(() => {
            reject(constantsVar.response.message.text.fail)
        })
    })
}


//specify fuction

function initialDocument() {


}

function getDocumentNavs(userId) {
    return new Promise((resolve, reject) => {

        findValueFromMongoDB(collectionName.navigators, { 'data.userId': userId }).then((result) => {
            resolve(result)
        }).catch((error) => {
            reject(error)
        })

        // let table = 'user:' + userId + 'table:' + collectionName.navigators;
        // getValueFromCacheDB(table, null).then((result) => {
        //     resolve(result)
        // }).catch((error) => {
        //     reject(error)

        // })
    })

}

function cloneDocument(documentObj) {
    return new Promise((resolve, reject) => {
        findValueFromMongoDB(collectionName.documents, { 'data.id': documentObj.data.id, 'data.userId': systemId }).then((documentObjDraft) => {
            if (documentObjDraft.length > 0) {
                let userId = documentObjDraft[0].data.userId = documentObj.data.userId
                insertValueIntoMongoDB(collectionName.documents, { data: documentObjDraft[0].data }).then(() => {
                    //let table = 'user:' + userId + ',table:' + collectionName.documents
                    // insertValueIntoCacheDB(table, documentObjDraft[0].data.id, documentObjDraft[0].data)
                    resolve(documentObjDraft[0].data)
                }).catch((err) => {
                    reject(constantsVar.response.message.text.fail)
                })
            } else {
                reject(constantsVar.response.message.text.fail)
            }
        })
    }).catch(() => {

    })
}

function cloneNavDocument(documentObj) {
    return new Promise((resolve, reject) => {
        findValueFromMongoDB(collectionName.navigators, { 'data.id': documentObj.data.id, 'data.userId': systemId }).then((documentNavObjDraft) => {
            if (documentNavObjDraft.length > 0) {
                let userId = documentNavObjDraft[0].data.userId = documentObj.data.userId
                insertValueIntoMongoDB(collectionName.navigators, { data: documentNavObjDraft[0].data }).then(() => {
                    // let table = 'user:' + userId + ',table:' + collectionName.navigators
                    // insertValueIntoCacheDB(table, documentNavObjDraft[0].data.id, documentNavObjDraft[0].data)
                    resolve(constantsVar.response.message.text.success)
                }).catch((err) => {
                    reject(constantsVar.response.message.text.fail)
                })
            }
        })
    })
}

function cloneTrackDocument(documentObj) {
    return new Promise((resolve, reject) => {
        findValueFromMongoDB(collectionName.tracks, { 'data.userId': systemId }).then((documentTracksObjDraft) => {
            if (documentTracksObjDraft.length > 0) {
                documentTracksObjDraft.forEach(async(documentTrackObjDraft, index) => {
                    await insertValueIntoMongoDB(collectionName.tracks, { data: documentTrackObjDraft.data }).then(() => {
                        // let userId = documentTrackObjDraft.data.userId = documentObj.data.userId
                        // let table = 'user:' + userId + ',table:' + collectionName.tracks
                        // insertValueIntoCacheDB(table, documentTrackObjDraft.data.id, documentTrackObjDraft.data)
                        if (index === documentTracksObjDraft.length - 1) {
                            resolve(constantsVar.response.message.text.success)
                        }
                    }).catch((err) => {
                        reject(constantsVar.response.message.text.fail)
                    })
                })
            }
        })
    })
}