import { TestBed } from '@angular/core/testing';

import { AnhangKategorieWebsocketService } from './anhang-kategorie-websocket.service';

describe('AnhangKategorieWebsocketService', () => {
  let service: AnhangKategorieWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnhangKategorieWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
