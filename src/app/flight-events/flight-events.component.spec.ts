import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightEventsComponent } from './flight-events.component';

describe('FlightEventsComponent', () => {
  let component: FlightEventsComponent;
  let fixture: ComponentFixture<FlightEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
