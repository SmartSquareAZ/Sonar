import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendapunktheaderComponent } from './agendapunktheader.component';

describe('AgendapunktheaderComponent', () => {
  let component: AgendapunktheaderComponent;
  let fixture: ComponentFixture<AgendapunktheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendapunktheaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendapunktheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
