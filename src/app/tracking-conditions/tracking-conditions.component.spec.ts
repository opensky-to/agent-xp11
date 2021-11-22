import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingConditionsComponent } from './tracking-conditions.component';

describe('TrackingConditionsComponent', () => {
  let component: TrackingConditionsComponent;
  let fixture: ComponentFixture<TrackingConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
