import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';

@NgModule({
  declarations: [
    AppComponent,
    FlowchartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgFlowchartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
