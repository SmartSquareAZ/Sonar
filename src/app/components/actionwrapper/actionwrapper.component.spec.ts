import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionwrapperComponent } from './actionwrapper.component';

describe('ActionwrapperComponent', () => {
  let component: ActionwrapperComponent;
  let fixture: ComponentFixture<ActionwrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionwrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionwrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
