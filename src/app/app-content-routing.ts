import { ImgContentComponent } from './contents/img-content/img-content';
import { ImgContentOptionComponent } from './contents/img-content/img-content-option/img-content-option';
import { VideoContentComponent } from './contents/video-content/video-content';
import { VideoContentOptionComponent } from './contents/video-content/video-content-option/video-content-option';
import { FileContentComponent } from './contents/file-content/file-content';
import { FileContentOptionComponent } from './contents/file-content/file-content-option/file-content-option';
import { SubformContentComponent } from './contents/subform-content/subform-content';
import { SubformContentOptionComponent } from './contents/subform-content/subform-content-option/subform-content-option';
import { LinkContentComponent } from './contents/link-content/link-content';
import { LinkContentOptionComponent } from './contents/link-content/link-content-option/link-content-option';
import { ProgressBarContentComponent } from './contents/progress-bar-content/progress-bar-content';
import { ProgressBarContentOptionComponent } from './contents/progress-bar-content/progress-bar-content-option/progress-bar-content-option.component';
import { CommentContentComponent } from './contents/comment-content/comment-content';
import { CommetContentOptionComponent } from './contents/comment-content/commet-content-option/commet-content-option';
import { TodoListContentComponent } from './contents/todo-list-content/todo-list-content';
import { TodoListOptionContentComponent } from './contents/todo-list-content/todo-list-option-content/todo-list-option-content';
import { NoteContentComponent } from './contents/note-content/note-content';
import { NoteContentOptionComponent } from './contents/note-content/note-content-option/note-content-option';
import { TextareaContentComponent } from './contents/textarea-content/textarea-content';
import { TextareaContentOptionComponent } from './contents/textarea-content/textarea-content-option/textarea-content-option';

export class ContentRouting {
    public static routes  = [
        {component:TextareaContentComponent,contentName:'text-area-content',option:TextareaContentOptionComponent},
        {component:ImgContentComponent,contentName:'img-content',option:ImgContentOptionComponent},
        {component:VideoContentComponent,contentName:'video-content',option:VideoContentOptionComponent},
        {component:FileContentComponent,contentName:'file-content',option:FileContentOptionComponent},
        {component:SubformContentComponent,contentName:'subform-content',option:SubformContentOptionComponent},
        {component:LinkContentComponent,contentName:'link-content',option:LinkContentOptionComponent},
        {component:ProgressBarContentComponent,contentName:'progress-bar-content',option:ProgressBarContentOptionComponent},
        {component:CommentContentComponent,contentName:'comment-content',option:CommetContentOptionComponent},
        {component:TodoListContentComponent,contentName:'todo-list-content',option:TodoListOptionContentComponent},
        {component:NoteContentComponent,contentName:'note-content',option:NoteContentOptionComponent}
    ]
    public static exports = [
        ImgContentComponent,
        ImgContentOptionComponent,
        VideoContentComponent,
        VideoContentOptionComponent,
        FileContentComponent,
        FileContentOptionComponent,
        SubformContentComponent,
        SubformContentOptionComponent,
        LinkContentComponent,
        LinkContentOptionComponent,
        ProgressBarContentComponent,
        ProgressBarContentOptionComponent,
        CommentContentComponent,
        CommetContentOptionComponent,
        TodoListContentComponent,
        TodoListOptionContentComponent,
        NoteContentComponent,
        NoteContentOptionComponent,
        TextareaContentComponent,
        TextareaContentOptionComponent
    ]


}