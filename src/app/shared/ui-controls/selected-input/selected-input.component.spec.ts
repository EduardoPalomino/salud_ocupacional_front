import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedInputComponent } from './selected-input.component';

describe('SelectedInputComponent', () => {
  let component: SelectedInputComponent;
  let fixture: ComponentFixture<SelectedInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedInputComponent]
    });
    fixture = TestBed.createComponent(SelectedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
