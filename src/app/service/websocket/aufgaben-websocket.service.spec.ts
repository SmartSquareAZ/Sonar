import { TestBed } from '@angular/core/testing';

import { AufgabenWebsocketService } from './aufgaben-websocket.service';

describe('AufgabenWebsocketService', () => {
  let service: AufgabenWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AufgabenWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
