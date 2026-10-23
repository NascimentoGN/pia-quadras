import { TestBed } from '@angular/core/testing';

import { Court } from './court.service';

describe('Court', () => {
  let service: Court;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Court);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
