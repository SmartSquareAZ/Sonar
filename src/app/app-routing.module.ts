import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutwrapperComponent } from './components/layoutwrapper/layoutwrapper.component';

const routes: Routes = [
  {
    path:"", component:LayoutwrapperComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
