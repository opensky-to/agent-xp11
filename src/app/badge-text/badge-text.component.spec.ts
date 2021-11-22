import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeTextComponent } from './badge-text.component';

describe('BadgeTextComponent', () => {
  let component: BadgeTextComponent;
  let fixture: ComponentFixture<BadgeTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgeTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
