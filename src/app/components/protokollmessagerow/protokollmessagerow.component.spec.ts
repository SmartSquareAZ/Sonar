import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtokollmessagerowComponent } from './protokollmessagerow.component';

describe('ProtokollmessagerowComponent', () => {
  let component: ProtokollmessagerowComponent;
  let fixture: ComponentFixture<ProtokollmessagerowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtokollmessagerowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtokollmessagerowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
