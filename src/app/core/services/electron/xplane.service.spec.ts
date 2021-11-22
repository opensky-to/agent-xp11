import { TestBed } from '@angular/core/testing';

import { XplaneService } from './xplane.service';

describe('XplaneService', () => {
  let service: XplaneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XplaneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
