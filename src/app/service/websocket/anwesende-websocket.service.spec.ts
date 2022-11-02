import { TestBed } from '@angular/core/testing';

import { AnwesendeWebsocketService } from './anwesende-websocket.service';

describe('AnwesendeWebsocketService', () => {
  let service: AnwesendeWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnwesendeWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
