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

export class ContentRouting {
    public static routes  = [
        {component:ImgContentComponent,contentName:'img-content',option:ImgContentOptionComponent},
        {component:VideoContentComponent,contentName:'video-content',option:VideoContentOptionComponent},
        {component:FileContentComponent,contentName:'file-content',option:FileContentOptionComponent},
        {component:SubformContentComponent,contentName:'subform-content',option:SubformContentOptionComponent},
        {component:LinkContentComponent,contentName:'link-content',option:LinkContentOptionComponent},
        {component:ProgressBarContentComponent,contentName:'progress-bar-content',option:ProgressBarContentOptionComponent},
        {component:CommentContentComponent,contentName:'comment-content',option:CommetContentOptionComponent}
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
        CommetContentOptionComponent
    ]


}