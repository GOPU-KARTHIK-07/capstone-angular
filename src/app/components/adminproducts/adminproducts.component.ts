import { Component } from '@angular/core';
import { AdminSubNavbarComponent } from '../admin-sub-navbar/admin-sub-navbar.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-adminproducts',
  standalone: true,
  imports: [AdminSubNavbarComponent,RouterOutlet,RouterModule],
  templateUrl: './adminproducts.component.html',
  styleUrl: './adminproducts.component.css'
})
export class AdminproductsComponent {
  constructor(private router: Router){}

}
// import { Component } from '@angular/core';
// import { AdminSubNavbarComponent } from '../admin-sub-navbar/admin-sub-navbar.component';
// import { Router, RouterModule, RouterOutlet } from '@angular/router';
// import { TieredMenuModule } from 'primeng/tieredmenu';
// import { ButtonModule } from 'primeng/button';
// import { CommonModule } from '@angular/common';
// import { BadgeModule } from 'primeng/badge';

// @Component({
//   selector: 'app-adminproducts',
//   standalone: true,
//   imports: [AdminSubNavbarComponent,RouterOutlet,RouterModule,TieredMenuModule,ButtonModule,CommonModule,BadgeModule],
//   templateUrl: './adminproducts.component.html',
//   styleUrl: './adminproducts.component.css'
// })
// export class AdminproductsComponent {
//   constructor(private router: Router){}
//   adminItems = [
//     {
//       label: 'Add Product',
//       icon: 'pi pi-plus', // PrimeIcons
//       routerLink: 'add'
//     },
//     {
//       label: 'Edit Product',
//       icon: 'pi pi-pencil', // PrimeIcons
//       routerLink: 'edit'
//     }
//   ];

// }
