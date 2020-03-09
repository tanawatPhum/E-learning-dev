import { TableLayoutComponent } from './layouts/table-layout/table-layout';
import { TableLayoutOptionComponent } from './layouts/table-layout/table-layout-option/table-layout-option';


export class LayoutRouting {
    public static routes  = [
        {component:TableLayoutComponent,layoutName:'table-layout',option:TableLayoutOptionComponent},
    ]
    public static exports = [
      TableLayoutComponent,
      TableLayoutOptionComponent
    ]


}