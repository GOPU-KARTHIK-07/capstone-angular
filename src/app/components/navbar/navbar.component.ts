import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth.service'; // Import AuthService
import { CommonModule } from '@angular/common';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BadgeModule } from 'primeng/badge';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterModule,TieredMenuModule,BadgeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userItems: any[] = [];

  constructor(public authService: AuthService ,private router: Router) {}
  // ngOnInit() {
  //   this.setMenuItems();
  // }
  // setMenuItems() {
  //   // Check if admin is logged in
  //   if (this.authService.isAdminLoggedIn()) {
  //     this.userItems = [
  //       {
  //         label: 'Admin Products',
  //         icon: 'pi pi-fw pi-list', // Example icon
  //         routerLink: '/admin/products'
  //       },
  //       {
  //         label: 'Admin Users',
  //         icon: 'pi pi-fw pi-user', // Example icon
  //         routerLink: '/admin/users'
  //       },
  //       {
  //         label: 'Admin Logout',
  //         icon: 'pi pi-fw pi-sign-out', // Example icon
  //         command: () => this.adminLogout()
  //       }
  //     ];
  //   } else {
  //     this.userItems = []; // If not logged in, keep it empty or add other public menu items
  //   }
  // }

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      localStorage.removeItem('cart');

       // Perform logout and redirect to login page
      
    }
  }
  adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logoutAdmin(); // Clear admin session and redirect to admin login
      this.router.navigate(['/login']);
    }
  }

  
}
