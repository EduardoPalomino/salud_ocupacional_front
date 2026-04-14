import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartVerticalBarComponent } from './chart-vertical-bar.component';

describe('ChartVerticalBarComponent', () => {
  let component: ChartVerticalBarComponent;
  let fixture: ComponentFixture<ChartVerticalBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartVerticalBarComponent]
    });
    fixture = TestBed.createComponent(ChartVerticalBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
