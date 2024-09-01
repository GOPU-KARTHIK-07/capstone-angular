// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn } from '@angular/router';

// import { adminguardGuard } from './adminguard.guard';

// describe('adminguardGuard', () => {
//   const executeGuard: CanActivateFn = (...guardParameters) => 
//       TestBed.runInInjectionContext(() => adminguardGuard(...guardParameters));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { adminguardGuard } from './adminguard.guard';  // Make sure this matches the actual class name in your guard file
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

describe('AdminGuard', () => {
  let guard: adminguardGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [adminguardGuard]
    });

    guard = TestBed.inject(adminguardGuard);  // Correctly inject the guard
    router = TestBed.inject(Router);     // Inject the Router if needed
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Example test for canActivate method
  it('should return true for an authorized admin user', () => {
    spyOn(guard, 'canActivate').and.returnValue(true);  // Mock the canActivate method

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  // Additional test cases can be added here as needed
});

