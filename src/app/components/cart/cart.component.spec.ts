import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule,CartComponent], // Import FormsModule if needed for ngModel

    })
    .compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Your cart is empty" when cartProducts is empty', () => {
    component.cartProducts = [];
    fixture.detectChanges();
    const emptyCartMessage = fixture.nativeElement.querySelector('.emptyCart');
    expect(emptyCartMessage.textContent).toContain('Your cart is empty.');
  });

  it('should display cart items when cartProducts has items', () => {
    component.cartProducts = [
      { _id: '1', name: 'Product 1', description: 'Description 1', price: 100, quantity: 1, imageUrl: 'http://example.com/image1.jpg' },
      { _id: '2', name: 'Product 2', description: 'Description 2', price: 200, quantity: 2, imageUrl: 'http://example.com/image2.jpg' }
    ];
    component.totalQuantity = 3; // Update this if necessary
    component.totalAmount = 500; // Update this if necessary
    fixture.detectChanges();

    const cartItems = fixture.nativeElement.querySelectorAll('.cart-item');
    expect(cartItems.length).toBe(2);
    expect(cartItems[0].textContent).toContain('Product 1');
    expect(cartItems[1].textContent).toContain('Product 2');
  });

  it('should call decreaseQuantity() when "-" button is clicked', () => {
    spyOn(component, 'decreaseQuantity');
    component.cartProducts = [{ _id: '1', name: 'Product 1', description: 'Description 1', price: 100, quantity: 1, imageUrl: 'http://example.com/image1.jpg' }];
    fixture.detectChanges();
    const decreaseButton = fixture.nativeElement.querySelector('.cart-item button:first-of-type');
    decreaseButton.click();
    expect(component.decreaseQuantity).toHaveBeenCalled();
  });

  it('should call increaseQuantity() when "+" button is clicked', () => {
    spyOn(component, 'increaseQuantity');
    component.cartProducts = [{ _id: '1', name: 'Product 1', description: 'Description 1', price: 100, quantity: 1, imageUrl: 'http://example.com/image1.jpg' }];
    fixture.detectChanges();
    const increaseButton = fixture.nativeElement.querySelector('.cart-item button:last-of-type');
    increaseButton.click();
    expect(component.increaseQuantity).toHaveBeenCalled();
  });

  it('should call removeFromCart() when Remove button is clicked', () => {
    spyOn(component, 'removeFromCart');
    component.cartProducts = [{ _id: '1', name: 'Product 1', description: 'Description 1', price: 100, quantity: 1, imageUrl: 'http://example.com/image1.jpg' }];
    fixture.detectChanges();
    const removeButton = fixture.nativeElement.querySelector('.item-actions button');
    removeButton.click();
    expect(component.removeFromCart).toHaveBeenCalledWith('1');
  });

  it('should call checkout() when Checkout button is clicked', () => {
    spyOn(component, 'checkout');
    component.totalQuantity = 3; // Update this if necessary
    component.totalAmount = 500; // Update this if necessary
    fixture.detectChanges();
    const checkoutButton = fixture.nativeElement.querySelector('.checkout-summary button');
    checkoutButton.click();
    expect(component.checkout).toHaveBeenCalled();
  });

  it('should display alert with success message when alertType is success', () => {
    component.alertVisible = true;
    component.alertType = 'success';
    component.alertMessage = 'Operation successful!';
    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('.alert-success');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('Operation successful!');
  });

  it('should display alert with error message when alertType is error', () => {
    component.alertVisible = true;
    component.alertType = 'error';
    component.alertMessage = 'An error occurred!';
    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('.alert-error');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('An error occurred!');
  });
});
