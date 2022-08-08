import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlowchartComponent } from './flowchart/flowchart.component';


const routes: Routes = [
  { path: 'flowchart', component: FlowchartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
