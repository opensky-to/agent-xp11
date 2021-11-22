import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainGridElementComponent } from './main-grid-element.component';

describe('MainGridElementComponent', () => {
  let component: MainGridElementComponent;
  let fixture: ComponentFixture<MainGridElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainGridElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainGridElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
