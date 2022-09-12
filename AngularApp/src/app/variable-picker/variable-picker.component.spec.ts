import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablePickerComponent } from './variable-picker.component';

describe('VariablePickerComponent', () => {
  let component: VariablePickerComponent;
  let fixture: ComponentFixture<VariablePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariablePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
