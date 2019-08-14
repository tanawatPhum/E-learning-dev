import { BoxContentModel } from './elements/box-content.model';
import { TextAreaContentModel } from './elements/textarea-content.model';
import { ImgContentModel } from './elements/img-content.model';
import { VideoContentModel } from './elements/video-content.model';
import { SubFormContentModel } from './elements/subForm-content.model';
import { commentContentModel } from './elements/comment-content.model';


export class DocumentModel {
    public nameDocument:string;
    public previewImg:string;
    public status:string;
    public id: string;
    public html: string;
    public elements: ElementsModel; 
}

export class ElementsModel {
    public boxes: BoxContentModel[];
    public textAreas: TextAreaContentModel[];
    public imgs: ImgContentModel[];
    public videos: VideoContentModel[];
    public subFroms:SubFormContentModel[];
    public comments:commentContentModel[]
}

