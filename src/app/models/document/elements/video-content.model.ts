export class VideoContentModel {
    public id: string;
    public parentId:string;
    public data:VideoConetentDataModel =  new VideoConetentDataModel();
    public path:string
}

export class VideoConetentDataModel{
    public channelStream:string;
    public streamId:string;
    public duration:number;
    public progress:number = 0;
    public currentWatchingTime:number = 0;
}
