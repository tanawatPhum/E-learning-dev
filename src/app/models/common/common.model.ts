export class ScreenDetailModel {
    public height: number;
    public width: number;
}
export class RulerDetailModel {
    public pointerLeft: string;
    public pointerRight: string;
    public paddingLeft: number;
    public paddingRight: number;
}

export class PostitionDetailModel {
    public top: number;
    public left: number;
}
export class ElementDetailModel {
    public screenDetail = new ScreenDetailModel();
    public postitionDetail = new PostitionDetailModel();
}

export class CommonResponseModel {
    public action: string;
    public data: any;
    public status: string;
}

export class UploadFileModel {
    public data: any;
    public awsFileName: string;
}


export class UpdateContentModel {
    public data: any;
    public actionCase: string;
}


