import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  cart: any[] = [];
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;
  fadeOut = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCart();
  }

  loadProducts(): void {
    this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  addToCart(product: any): void {
    const existingProduct = this.cart.find(p => p._id === product._id);
    if (existingProduct) {
      this.showAlert('Product already in cart', 'error');
    } else {
      this.cart.push(product);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.showAlert('Product added to cart', 'success');
    }
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.fadeOut = false;

    const alertElement = document.querySelector('.alert') as HTMLElement;
    if (alertElement) {
      void alertElement.offsetWidth;

      setTimeout(() => {
        this.fadeOut = true;
      }, 3000);
    }
  }

  
  
}
