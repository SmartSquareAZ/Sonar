import { TestBed } from '@angular/core/testing';

import { AnhangService } from './anhang.service';

describe('AnhangService', () => {
  let service: AnhangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnhangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
