import { TestBed } from '@angular/core/testing';

import { DnevniUnosService } from './dnevni-unos.service';

describe('DnevniUnosService', () => {
  let service: DnevniUnosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DnevniUnosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
