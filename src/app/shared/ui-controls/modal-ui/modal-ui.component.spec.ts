import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUiComponent } from './modal-ui.component';

describe('ModalUiComponent', () => {
  let component: ModalUiComponent;
  let fixture: ComponentFixture<ModalUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalUiComponent]
    });
    fixture = TestBed.createComponent(ModalUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
