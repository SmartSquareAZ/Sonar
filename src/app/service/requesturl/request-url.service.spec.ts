import { TestBed } from '@angular/core/testing';

import { RequestUrlService } from './request-url.service';

describe('RequestUrlService', () => {
  let service: RequestUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
