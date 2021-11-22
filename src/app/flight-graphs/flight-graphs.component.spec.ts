import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightGraphsComponent } from './flight-graphs.component';

describe('FlightGraphsComponent', () => {
  let component: FlightGraphsComponent;
  let fixture: ComponentFixture<FlightGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightGraphsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
