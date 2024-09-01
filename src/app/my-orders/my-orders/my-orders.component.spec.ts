import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyOrdersComponent } from './my-orders.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

describe('MyOrdersComponent', () => {
  let component: MyOrdersComponent;
  let fixture: ComponentFixture<MyOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MyOrdersComponent], // Import CommonModule for Angular directives
      providers: [CurrencyPipe], // Provide CurrencyPipe if used in the template
    }).compileComponents();

    fixture = TestBed.createComponent(MyOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error message when errorMessage is set', () => {
    component.errorMessage = 'Error fetching orders';
    fixture.detectChanges();

    const errorMessageEl: DebugElement = fixture.debugElement.query(
      By.css('.error-message')
    );
    expect(errorMessageEl).toBeTruthy();
    expect(errorMessageEl.nativeElement.textContent).toContain('Error fetching orders');
  });

  it('should display "No orders found." when orders list is empty and no errorMessage', () => {
    component.orders = [];
    component.errorMessage = '';
    fixture.detectChanges();

    const noOrdersEl: DebugElement = fixture.debugElement.query(
      By.css('.no-orders')
    );
    expect(noOrdersEl).toBeTruthy();
    expect(noOrdersEl.nativeElement.textContent).toContain('No orders found.');
  });

  it('should display order details correctly', () => {
    component.orders = [
      {
        _id: '1',
        totalAmount: 100,
        address: '123 Street, City',
        paymentMethod: 'Credit Card',
        cartProducts: [
          {
            productId: { 
              name: 'Product 1', 
              imageUrl: 'https://via.placeholder.com/150', 
              description: 'Description 1',
              rating: 4.5, 
              price: 50 
            },
            quantity: 2,
          },
        ],
      },
    ];
    component.errorMessage = '';
    fixture.detectChanges();

    const orderElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.order-card')
    );
    expect(orderElements.length).toBe(1);

    const totalAmountEl = orderElements[0].query(By.css('.total-amount'));
    expect(totalAmountEl.nativeElement.textContent).toContain('100');

    const addressEl = orderElements[0].query(By.css('.address'));
    expect(addressEl.nativeElement.textContent).toContain('123 Street, City');

    const paymentMethodEl = orderElements[0].query(By.css('.payment-method'));
    expect(paymentMethodEl.nativeElement.textContent).toContain('Credit Card');

    const productNameEl = orderElements[0].query(By.css('.product-name'));
    expect(productNameEl.nativeElement.textContent).toContain('Product 1');

    const productPriceEl = orderElements[0].query(By.css('.price'));
    expect(productPriceEl.nativeElement.textContent).toContain('50');
  });

  it('should display product details correctly for each item', () => {
    component.orders = [
      {
        _id: '1',
        totalAmount: 150,
        address: '123 Street, City',
        paymentMethod: 'Credit Card',
        cartProducts: [
          {
            productId: {
              name: 'Product 1',
              imageUrl: 'https://via.placeholder.com/150',
              description: 'Description 1',
              rating: 4.5,
              price: 50,
            },
            quantity: 2,
          },
          {
            productId: {
              name: 'Product 2',
              imageUrl: 'https://via.placeholder.com/150',
              description: 'Description 2',
              rating: 4.0,
              price: 25,
            },
            quantity: 4,
          },
        ],
      },
    ];
    component.errorMessage = '';
    fixture.detectChanges();

    const itemElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.item-card')
    );
    expect(itemElements.length).toBe(2);

    const firstProductNameEl = itemElements[0].query(By.css('.product-name'));
    expect(firstProductNameEl.nativeElement.textContent).toContain('Product 1');

    const secondProductNameEl = itemElements[1].query(By.css('.product-name'));
    expect(secondProductNameEl.nativeElement.textContent).toContain('Product 2');
  });
});
