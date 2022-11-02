import { TestBed } from '@angular/core/testing';

import { AnhangWebsocketService } from './anhang-websocket.service';

describe('AnhangWebsocketService', () => {
  let service: AnhangWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnhangWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
