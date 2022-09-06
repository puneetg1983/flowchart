import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleNodeStepComponent } from './single-node-step.component';

describe('SingleNodeStepComponent', () => {
  let component: SingleNodeStepComponent;
  let fixture: ComponentFixture<SingleNodeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleNodeStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleNodeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
