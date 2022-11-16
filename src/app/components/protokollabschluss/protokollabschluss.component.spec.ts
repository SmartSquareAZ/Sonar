import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtokollabschlussComponent } from './protokollabschluss.component';

describe('ProtokollabschlussComponent', () => {
  let component: ProtokollabschlussComponent;
  let fixture: ComponentFixture<ProtokollabschlussComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtokollabschlussComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtokollabschlussComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
