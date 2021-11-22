import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightAndBalancesComponent } from './weight-and-balances.component';

describe('WeightAndBalancesComponent', () => {
  let component: WeightAndBalancesComponent;
  let fixture: ComponentFixture<WeightAndBalancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightAndBalancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightAndBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
