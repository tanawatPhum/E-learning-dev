export class VideoContentModel {
    public id: string;
    public data:VideoConetentDataModel =  new VideoConetentDataModel();
    public path:string
}

export class VideoConetentDataModel{
    public channelStream:string;
    public streamId:string;
    public duration:number;
    public currentWatchingTime:number = 0;
}
