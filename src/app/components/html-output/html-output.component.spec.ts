import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlOutputComponent } from './html-output.component';

describe('HtmlOutputComponent', () => {
  let component: HtmlOutputComponent;
  let fixture: ComponentFixture<HtmlOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlOutputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
