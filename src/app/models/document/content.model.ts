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
import { ExamContentModel } from './elements/exam-content.model';
import { ScreenDetailModel, RulerDetailModel } from '../common/common.model';
import { NoteContentModel } from './elements/note-content.model';


export class DocumentModel {
    public userId:string;
    public nameDocument:string;
    public previewImg:string;
    public status:string;
    public id: string;
    public html: string;
    public contents: ContentsModel; 
    public otherDetail:OtherDetailModel =  new OtherDetailModel();
}

export class ContentsModel {
    public boxes: BoxContentModel[] =  new Array<BoxContentModel>();
    public files:FileContentModel[] =  new Array<FileContentModel>();
    public textAreas: TextAreaContentModel[] =  new Array<TextAreaContentModel>();
    public imgs: ImgContentModel[] =  new Array<ImgContentModel>();
    public exams: ExamContentModel[] =  new Array<ExamContentModel>();
    public videos: VideoContentModel[] =  new Array<VideoContentModel>();
    public subFroms:SubFormContentModel[] =  new Array<SubFormContentModel>();
    public comments:commentContentModel[] =  new Array<commentContentModel>();
    public todoList:ToDoListContentModel[] =  new Array<ToDoListContentModel>();
    public progressBar:ProgressBarContentModel[] =  new Array<ProgressBarContentModel>();
    public links:LinkContentModel[] =  new Array<LinkContentModel>();
    public notes:NoteContentModel[] =  new Array<NoteContentModel>();
}

export class OtherDetailModel{
    public screenDevDetail:ScreenDetailModel = new ScreenDetailModel();
    public rulerDevDetail:RulerDetailModel = new RulerDetailModel();
}


