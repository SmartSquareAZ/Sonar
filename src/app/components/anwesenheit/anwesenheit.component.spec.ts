import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnwesenheitComponent } from './anwesenheit.component';

describe('AnwesenheitComponent', () => {
  let component: AnwesenheitComponent;
  let fixture: ComponentFixture<AnwesenheitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnwesenheitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnwesenheitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
