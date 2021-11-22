import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightAndBalanceElementComponent } from './weight-and-balance-element.component';

describe('WeightAndBalanceElementComponent', () => {
  let component: WeightAndBalanceElementComponent;
  let fixture: ComponentFixture<WeightAndBalanceElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightAndBalanceElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightAndBalanceElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
