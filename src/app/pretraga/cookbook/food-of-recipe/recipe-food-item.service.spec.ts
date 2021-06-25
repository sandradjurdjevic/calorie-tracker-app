import { TestBed } from '@angular/core/testing';

import { RecipeFoodItemService } from './recipe-food-item.service';

describe('RecipeFoodItemService', () => {
  let service: RecipeFoodItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeFoodItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
