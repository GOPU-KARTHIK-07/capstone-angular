import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display product details', () => {
    component.products = [
      { name: 'Product 1', price: 100, description: 'Description 1', category: 'Category 1', imageUrl: 'http://example.com/image1.jpg', editing: false },
      { name: 'Product 2', price: 200, description: 'Description 2', category: 'Category 2', imageUrl: 'http://example.com/image2.jpg', editing: false }
    ];
    fixture.detectChanges();

    const productTitles = fixture.nativeElement.querySelectorAll('.product-title');
    const productPrices = fixture.nativeElement.querySelectorAll('.product-price');
    const productDescriptions = fixture.nativeElement.querySelectorAll('.product-description');
    const productCategories = fixture.nativeElement.querySelectorAll('.product-category');

    expect(productTitles.length).toBe(2);
    expect(productPrices.length).toBe(2);
    expect(productDescriptions.length).toBe(2);
    expect(productCategories.length).toBe(2);
  });

  it('should display product images', () => {
    component.products = [
      { name: 'Product 1', price: 100, description: 'Description 1', category: 'Category 1', imageUrl: 'http://example.com/image1.jpg', editing: false }
    ];
    fixture.detectChanges();

    const productImages = fixture.nativeElement.querySelectorAll('.product-image');
    expect(productImages.length).toBe(1);
    expect(productImages[0].src).toContain('http://example.com/image1.jpg');
  });

  it('should display success alert message', () => {
    component.alertMessage = 'Operation successful!';
    component.alertType = 'success';
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('.alert');
    expect(alert).toBeTruthy();
    expect(alert.classList).toContain('alert-success');
    expect(alert.textContent).toContain('Operation successful!');
  });

  it('should display error alert message', () => {
    component.alertMessage = 'Operation failed!';
    component.alertType = 'error';
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('.alert');
    expect(alert).toBeTruthy();
    expect(alert.classList).toContain('alert-error');
    expect(alert.textContent).toContain('Operation failed!');
  });

  it('should call addToCart method on button click', () => {
    spyOn(component, 'addToCart');

    component.products = [
      { name: 'Product 1', price: 100, description: 'Description 1', category: 'Category 1', imageUrl: 'http://example.com/image1.jpg', editing: false }
    ];
    fixture.detectChanges();

    const addToCartButton = fixture.nativeElement.querySelector('.add-to-cart-btn');
    addToCartButton.click();

    expect(component.addToCart).toHaveBeenCalled();
  });
});
