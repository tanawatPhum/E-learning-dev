import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';
import { CommonResponseModel } from '../../models/common/common.model';

@Injectable()
export class SocketIoService {
    private socket: SocketIOClient.Socket;
    constructor() {
        // this.socket = io.connect('http://localhost:8000');
    }

    public connectSocketIo(){
        //this.socket = io.connect('http://localhost:3000');
        this.socket = io.connect('https://smartdoc.alworks.io');
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
}