import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionStepComponent } from './condition-step.component';

describe('ConditionStepComponent', () => {
  let component: ConditionStepComponent;
  let fixture: ComponentFixture<ConditionStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
