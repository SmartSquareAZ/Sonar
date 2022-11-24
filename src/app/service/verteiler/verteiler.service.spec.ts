import { TestBed } from '@angular/core/testing';

import { VerteilerService } from './verteiler.service';

describe('VerteilerService', () => {
  let service: VerteilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerteilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
