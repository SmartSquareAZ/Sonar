import { TestBed } from '@angular/core/testing';

import { ProtokollmessageWebsocketService } from './protokollmessage-websocket.service';

describe('ProtokollmessageWebsocketService', () => {
  let service: ProtokollmessageWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtokollmessageWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
