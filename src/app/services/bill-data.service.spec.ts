import { TestBed } from '@angular/core/testing';

import { BillDataService } from './bill-data.service';

describe('BillDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillDataService = TestBed.get(BillDataService);
    expect(service).toBeTruthy();
  });
});
