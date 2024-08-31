import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule],
  templateUrl: './our-services.component.html',
  styleUrl: './our-services.component.css'
})
export class OurServicesComponent {
  constructor(private http: HttpClient) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const bookingData = form.value;
      this.http.post('http://localhost:3000/api/service-booking', bookingData)
        .subscribe(
          response => {
            console.log('Booking successful', response);
            alert('Service booked successfully. We will get in touch with you soon.');
          },
          error => {
            console.error('Error booking service', error);
            alert('Error booking service. Please try again later.');
          }
        );
    }
  }
}
