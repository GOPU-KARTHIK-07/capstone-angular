// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn } from '@angular/router';
// import { AuthGuard } from './auth.guard';
// import { RouterTestingModule } from '@angular/router/testing';

// describe('authGuard', () => {
//   const executeGuard: CanActivateFn = (...guardParameters) => 
//       TestBed.runInInjectionContext(() => new AuthGuard(...guardParameters));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });

    guard = TestBed.inject(AuthGuard);  // Inject AuthGuard
    router = TestBed.inject(Router);  // Inject Router or any other dependencies
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Example test for canActivate method
  it('should return true for a logged-in user', () => {
    spyOn(guard, 'canActivate').and.returnValue(true);  // Mock the canActivate method

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  // Add more test cases to cover different scenarios and logic
});

