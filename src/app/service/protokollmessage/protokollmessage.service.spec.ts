import { TestBed } from '@angular/core/testing';

import { ProtokollmessageService } from './protokollmessage.service';

describe('ProtokollmessageService', () => {
  let service: ProtokollmessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtokollmessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
