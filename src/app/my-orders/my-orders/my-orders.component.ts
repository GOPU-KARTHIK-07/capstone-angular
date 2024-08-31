import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth.service'; // Adjust path as needed
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const email = localStorage.getItem('email');
    console.log(email)
    const token = this.authService.getToken();
    
    if (email && token) {
      const url = `http://localhost:3000/api/orders?email=${encodeURIComponent(email)}`;
      console.log('Request URL:', url); // Debugging line

      this.http.get<any[]>(url, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        response => {
          this.orders = response;
        },
        error => {
          this.errorMessage = 'Failed to load orders. Please try again later.';
          console.error('Error loading orders:', error);
        }
      );
    } else {
      this.errorMessage = 'User not authenticated or email not found.';
    }
  }
}
