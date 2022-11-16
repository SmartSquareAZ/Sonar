import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutwrapperComponent } from './components/layoutwrapper/layoutwrapper.component';
import { ProtokollabschlussComponent } from './components/protokollabschluss/protokollabschluss.component';

const routes: Routes = [
  {
    path:"", component:LayoutwrapperComponent
  },
  {
    path:"done", component: ProtokollabschlussComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
