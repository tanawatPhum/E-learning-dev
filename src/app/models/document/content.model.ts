import { BoxContentModel } from './elements/box-content.model';
import { TextAreaContentModel } from './elements/textarea-content.model';
import { ImgContentModel } from './elements/img-content.model';
import { VideoContentModel } from './elements/video-content.model';
import { SubFormContentModel } from './elements/subForm-content.model';
import { commentContentModel } from './elements/comment-content.model';
import { ToDoListContentModel } from './elements/todoList-content.model';
import { ProgressBarContentModel } from './elements/progressBar-content-model';
import { FileContentModel } from './elements/file-content.model';
import { LinkContentModel } from './elements/link-content.model';


export class DocumentModel {
    public nameDocument:string;
    public previewImg:string;
    public status:string;
    public id: string;
    public html: string;
    public contents: ContentsModel; 
}

export class ContentsModel {
    public boxes: BoxContentModel[];
    public files:FileContentModel[];
    public textAreas: TextAreaContentModel[];
    public imgs: ImgContentModel[];
    public videos: VideoContentModel[];
    public subFroms:SubFormContentModel[];
    public comments:commentContentModel[];
    public todoList:ToDoListContentModel[];
    public progressBar:ProgressBarContentModel[];
    public links:LinkContentModel[];
}

