import { TestBed } from '@angular/core/testing';

import { ProgressStoreService } from './progress-store.service';

describe('ProgressStoreService', () => {
  let service: ProgressStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
