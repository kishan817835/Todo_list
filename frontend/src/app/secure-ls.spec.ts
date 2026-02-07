import { TestBed } from '@angular/core/testing';

import { SecureLs } from './secure-ls';

describe('SecureLs', () => {
  let service: SecureLs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecureLs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
