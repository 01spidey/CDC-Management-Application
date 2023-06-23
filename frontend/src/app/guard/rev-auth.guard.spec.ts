import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { revAuthGuard } from './rev-auth.guard';

describe('revAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => revAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
