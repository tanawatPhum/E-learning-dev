import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subscriber, observable } from 'rxjs';
import { CommonResponseModel } from '../../models/common/common.model';
import { Constants } from '../../global/constants';


@Injectable()
export class SocketIoService {
    private socket: SocketIOClient.Socket;

    constructor() {
        // this.socket = io.connect('http://localhost:8000');
    }

    public connectSocketIo(){
        this.socket = io.connect('http://localhost:3000');
        
        // this.socket = io(Constants.common.host.serverSite, {
        //     path: '/socket',
        //   });

     // this.socket = io.connect(Constants.common.host.serverSite);
        // this.socket = io.connect();
    }
    public sendData(nameSocket,data?):Observable<any>{
        return new Observable((subscriber)=>{
                this.socket.emit(nameSocket, {
                    data: data
                });
                this.socket.on(nameSocket,(data)=>{
                    subscriber.next(data);
                    subscriber.complete();
                })
            

        })

    }
    public sendComment(data){
   
        this.socket.emit('commentSend',data, {
            data: data
        });

    }
    public updateComment():Observable<any>{
        return new Observable(subscriber=>{
            this.socket.on('commentUpdate',(data)=>{
                subscriber.next(data);
            });
        })

    }
}