import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FashionOneComponent } from './fashion/fashion-one/fashion-one.component';



const routes: Routes = [
  {
    path: '',
    component: FashionOneComponent
  },
  {
    path: 'fashion',
    component: FashionOneComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
