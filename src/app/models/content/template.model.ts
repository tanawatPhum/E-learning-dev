import { BoxContentModel } from './elements/box-content.model';
import { TextAreaContentModel } from './elements/textarea-content.model';


export class TemplateModel {
    public id: string;
    public html: string;
    public elements: ElementsModel;
}

export class ElementsModel {
    public boxes: BoxContentModel[];
    public textAreas: TextAreaContentModel[];
}

