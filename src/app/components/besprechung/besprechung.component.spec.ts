import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BesprechungComponent } from './besprechung.component';

describe('BesprechungComponent', () => {
  let component: BesprechungComponent;
  let fixture: ComponentFixture<BesprechungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BesprechungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BesprechungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
