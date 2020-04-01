import { TestBed } from '@angular/core/testing';

import { PayfastService } from './payfast.service';

describe('PayfastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayfastService = TestBed.get(PayfastService);
    expect(service).toBeTruthy();
  });
});
