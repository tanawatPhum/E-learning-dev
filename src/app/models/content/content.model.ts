import { BoxContentModel } from './elements/box-content.model';
import { TextAreaContentModel } from './elements/textarea-content.model';
import { ImgContentModel } from './elements/img-content.model';
import { VideoContentModel } from './elements/video-content.model';
import { SubFormContentModel } from './elements/subForm-content.model';


export class ContentModel {
    public id: string;
    public html: string;
    public elements: ElementsModel;
}

export class ElementsModel {
    public subForms: SubFormContentModel[];
    public boxes: BoxContentModel[];
    public textAreas: TextAreaContentModel[];
    public imgs: ImgContentModel[];
    public videos: VideoContentModel[];
}

