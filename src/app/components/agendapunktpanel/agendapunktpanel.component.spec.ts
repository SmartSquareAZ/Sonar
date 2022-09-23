import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendapunktpanelComponent } from './agendapunktpanel.component';

describe('AgendapunktpanelComponent', () => {
  let component: AgendapunktpanelComponent;
  let fixture: ComponentFixture<AgendapunktpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendapunktpanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendapunktpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
