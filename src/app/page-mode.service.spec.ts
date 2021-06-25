import { TestBed } from '@angular/core/testing';

import { PageModeService } from './page-mode.service';

describe('PageModeService', () => {
  let service: PageModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
