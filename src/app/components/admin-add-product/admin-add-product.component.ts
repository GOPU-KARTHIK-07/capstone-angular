import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent {
  product = {
    name: '',
    price: 0,
    description: '',
    category: ''
  };
  selectedFile:File | null = null;
  message: string | null = null;

  constructor(private http: HttpClient) {}
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  
  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('description', this.product.description);
    formData.append('category', this.product.category);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.http.post('http://localhost:3000/api/products', formData)
      .subscribe(
        (response) => {
          this.message = 'Product added successfully!';
          this.resetForm();
        },
        (error) => {
          this.message = 'Failed to add product. Please try again.';
          console.error(error);
        }
      );
  }

  resetForm() {
    this.product = {
      name: '',
      price: 0,
      description: '',
      category: ''
    };
    this.selectedFile = null;
  }
}
