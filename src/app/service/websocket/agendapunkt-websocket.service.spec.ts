import { TestBed } from '@angular/core/testing';

import { AgendapunktWebsocketService } from './agendapunkt-websocket.service';

describe('AgendapunktWebsocketService', () => {
  let service: AgendapunktWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendapunktWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
