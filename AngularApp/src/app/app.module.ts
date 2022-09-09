import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Ng2CompleterModule } from "ng2-completer";
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
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AngularMarkdownEditorModule } from 'angular-markdown-editor';
import { MarkdownModule } from 'ngx-markdown';
import { KustoService } from 'src/services/KustoService';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DetectorNodeComponent } from './detector-node/detector-node.component';
import { KustoNodeComponent } from './kusto-node/kusto-node.component';
import { MarkdownNodeComponent } from './markdown-node/markdown-node.component';
import { NodeActionsComponent } from './node-actions/node-actions.component';
import { ConfigureVariablesComponent } from './configure-variables/configure-variables.component';
import { CommonNodePropertiesComponent } from './common-node-properties/common-node-properties.component';
import { NodeTitleComponent } from './node-title/node-title.component';

@NgModule({
  declarations: [
    AppComponent,
    ConditionStepComponent,
    ConditionIftrueStepComponent,
    ConditionIffalseStepComponent,
    SwitchStepComponent,
    SwitchCaseStepComponent,
    SwitchCaseDefaultStepComponent,
    KustoQueryDialogComponent,
    DetectorNodeComponent,
    KustoNodeComponent,
    MarkdownNodeComponent,
    NodeActionsComponent,
    ConfigureVariablesComponent,
    CommonNodePropertiesComponent,
    NodeTitleComponent
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
    MatButtonToggleModule,
    MatTableModule,
    MatProgressSpinnerModule,
    AngularMarkdownEditorModule.forRoot({
      // add any Global Options/Config you might want
      // to avoid passing the same options over and over in each components of your App
      iconlibrary: 'glyph'
    }),
    MarkdownModule.forRoot(),
    MonacoEditorModule.forRoot() // use forRoot() in main app module only.
  ],
  providers: [
    FlowHelperService,
    KustoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
