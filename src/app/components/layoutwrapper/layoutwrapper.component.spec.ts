import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutwrapperComponent } from './layoutwrapper.component';

describe('LayoutwrapperComponent', () => {
  let component: LayoutwrapperComponent;
  let fixture: ComponentFixture<LayoutwrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutwrapperComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LayoutwrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
