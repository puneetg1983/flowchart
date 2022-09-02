import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Ng2CompleterModule } from "ng2-completer";
import { SingleNodeStepComponent } from './single-node-step/single-node-step.component';
import { ConditionStepComponent } from './condition-step/condition-step.component';
import { ConditionIftrueStepComponent } from './condition-iftrue-step/condition-iftrue-step.component';
import { ConditionIffalseStepComponent } from './condition-iffalse-step/condition-iffalse-step.component';
import { SwitchStepComponent } from './switch-step/switch-step.component';
import { SwitchCaseStepComponent } from './switch-case-step/switch-case-step.component';
import { SwitchCaseDefaultStepComponent } from './switch-case-default-step/switch-case-default-step.component';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { KustoQueryDialogComponent } from './kusto-query-dialog/kusto-query-dialog.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    SingleNodeStepComponent,
    ConditionStepComponent,
    ConditionIftrueStepComponent,
    ConditionIffalseStepComponent,
    SwitchStepComponent,
    SwitchCaseStepComponent,
    SwitchCaseDefaultStepComponent,
    KustoQueryDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgFlowchartModule,
    FormsModule,
    Ng2CompleterModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatMenuModule,
    MonacoEditorModule.forRoot() // use forRoot() in main app module only.
  ],
  providers: [
    FlowHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
