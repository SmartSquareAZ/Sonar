import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendatableentryComponent } from './agendatableentry.component';

describe('AgendatableentryComponent', () => {
  let component: AgendatableentryComponent;
  let fixture: ComponentFixture<AgendatableentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendatableentryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendatableentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
