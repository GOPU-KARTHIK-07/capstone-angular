// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor(private router: Router) {}

//   // Handle regular user login
// // In AuthService
// login(email: string, token: string): void {
//   console.log(email)
//   console.log(token)
//   localStorage.setItem('email', email); // Store email
//   localStorage.setItem('authToken', token); // Store token
//   this.router.navigate(['/home']); // Redirect to home page
// }


//   // Handle admin login
//   adminLogin(email: string): void {
//     localStorage.setItem('adminToken', 'true'); // Simulate a successful admin login
//     localStorage.setItem('userEmail', email);  // Store user email
//     this.router.navigate(['/admin/products']); // Redirect to admin products page
//   }

//   // Handle regular user logout
//   logout(): void {

//     localStorage.removeItem('authToken'); // Clear user token
    
//     localStorage.removeItem('userEmail'); // Clear user email

//     this.router.navigate(['/login']); // Redirect to login page
//   }

//   // Handle admin logout
//   logoutAdmin(): void {
//     localStorage.removeItem('adminToken'); // Clear admin token
//     localStorage.removeItem('userEmail'); // Clear user email
//     this.router.navigate(['/login']); // Redirect to plain login page
//   }

//   // Check if a regular user is logged in
//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('authToken');
//   }

//   // Check if an admin is logged in
//   isAdminLoggedIn(): boolean {
//     return !!localStorage.getItem('adminToken');
//   }

//   // Retrieve email from localStorage
//   getUserEmail(): string | null {
//     return localStorage.getItem('email');
//   }

//   // Retrieve token from localStorage
//   getToken(): string | null {
//     return localStorage.getItem('authToken') || localStorage.getItem('adminToken');
//   }
// }

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly emailKey = 'userEmail'; // Consistent key for email

  constructor(private router: Router) {}

  // Handle regular user login
  login(email: string, token: string): void {
    console.log('Login Email:', this.emailKey);
    console.log('Login Token:', token);
    localStorage.setItem(this.emailKey, email); // Store email with consistent key
    localStorage.setItem('authToken', token); // Store token
    this.router.navigate(['/home']); // Redirect to home page
  }

  // Handle admin login
  adminLogin(email: string): void {
    localStorage.setItem('adminToken', 'true'); // Simulate a successful admin login
    localStorage.setItem(this.emailKey, email);  // Store user email with consistent key
    this.router.navigate(['/admin/products']); // Redirect to admin products page
  }

  // Handle regular user logout
  logout(): void {
    localStorage.removeItem('authToken'); // Clear user token
    localStorage.removeItem(this.emailKey); // Clear user email
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Handle admin logout
  logoutAdmin(): void {
    localStorage.removeItem('adminToken'); // Clear admin token
    localStorage.removeItem(this.emailKey); // Clear user email
    
    localStorage.removeItem('cart');//clear you cart
    console.log("clear cart done")
    this.router.navigate(['/login']); // Redirect to plain login page
  }

  // Check if a regular user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Check if an admin is logged in
  isAdminLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  // Retrieve email from localStorage
  getUserEmail(): string | null {
    const email = localStorage.getItem(this.emailKey);
    console.log('Retrieved User Email:', email); // Log retrieved email
    return email;
  }

  // Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('adminToken');
  }
}
