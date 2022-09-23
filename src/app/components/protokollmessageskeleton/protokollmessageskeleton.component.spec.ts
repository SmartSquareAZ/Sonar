import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtokollmessageskeletonComponent } from './protokollmessageskeleton.component';

describe('ProtokollmessageskeletonComponent', () => {
  let component: ProtokollmessageskeletonComponent;
  let fixture: ComponentFixture<ProtokollmessageskeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtokollmessageskeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtokollmessageskeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
