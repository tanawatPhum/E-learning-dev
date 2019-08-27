export class VideoContentModel {
    public id: string;
    public parentId:string;
    public data:VideoConetentDataModel =  new VideoConetentDataModel();
    public path:string
    public condition:VideoConetentConditionModel = new VideoConetentConditionModel;
}

export class VideoConetentDataModel{
    public channelStream:string;
    public wistiaId:string;
    public streamId:string;
    public duration:number;
    public progress:number = 0;
    public currentWatchingTime:number = 0;
}
export class VideoConetentConditionModel{
    public isMustWatchingEnd:boolean;
    public isClickPlay:boolean;
}