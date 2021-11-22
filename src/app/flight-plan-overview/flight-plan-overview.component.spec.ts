import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPlanOverviewComponent } from './flight-plan-overview.component';

describe('FlightPlanOverviewComponent', () => {
  let component: FlightPlanOverviewComponent;
  let fixture: ComponentFixture<FlightPlanOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightPlanOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPlanOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
