import { TestBed } from '@angular/core/testing';

import { ProtokollService } from './protokoll.service';

describe('ProtokollService', () => {
  let service: ProtokollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtokollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
