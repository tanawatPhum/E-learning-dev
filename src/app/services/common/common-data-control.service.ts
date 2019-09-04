import { Injectable } from '@angular/core';


@Injectable()
export class CommonDataControlService {
    private _userId: string;
    public get userId(): string {
        return this._userId;
    }
    public set userId(value: string) {
        this._userId = value;
    }

}