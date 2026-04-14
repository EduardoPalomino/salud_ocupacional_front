import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedInput2Component } from './selected-input2.component';

describe('SelectedInput2Component', () => {
  let component: SelectedInput2Component;
  let fixture: ComponentFixture<SelectedInput2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedInput2Component]
    });
    fixture = TestBed.createComponent(SelectedInput2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
