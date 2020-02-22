import { OneLayoutComponent } from './layouts/one-layout/one-layout';
import { OneLayoutOptionComponent } from './layouts/one-layout/one-layout-option/one-layout-option';


export class LayoutRouting {
    public static routes  = [
        {component:OneLayoutComponent,layoutName:'grid-layout',option:OneLayoutOptionComponent},
    ]
    public static exports = [
      OneLayoutComponent,
      OneLayoutOptionComponent
    ]


}