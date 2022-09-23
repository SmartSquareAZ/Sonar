import { TestBed } from '@angular/core/testing';

import { AufgabenService } from './aufgaben.service';

describe('AufgabenService', () => {
  let service: AufgabenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AufgabenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
