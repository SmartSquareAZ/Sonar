import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtokollmessageoutputComponent } from './protokollmessageoutput.component';

describe('ProtokollmessageoutputComponent', () => {
  let component: ProtokollmessageoutputComponent;
  let fixture: ComponentFixture<ProtokollmessageoutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtokollmessageoutputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtokollmessageoutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
