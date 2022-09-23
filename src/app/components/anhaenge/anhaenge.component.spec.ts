import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnhaengeComponent } from './anhaenge.component';

describe('AnhaengeComponent', () => {
  let component: AnhaengeComponent;
  let fixture: ComponentFixture<AnhaengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnhaengeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnhaengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
