import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AdminEditProductComponent } from './admin-edit-product.component';

describe('AdminEditProductComponent', () => {
  let component: AdminEditProductComponent;
  let fixture: ComponentFixture<AdminEditProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    
      imports: [FormsModule,AdminEditProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display products and enable editing mode', () => {
    component.products = [
      {
        _id: '1',
        name: 'Laptop',
        price: 1000,
        description: 'High-end laptop',
        category: 'laptop',
        imageUrl: 'http://example.com/laptop.jpg',
        editing: false
      }
    ];
    fixture.detectChanges();

    const productCard = fixture.nativeElement.querySelector('.product-card');
    expect(productCard).toBeTruthy();

    const editButton = productCard.querySelector('.btn');
    expect(editButton.textContent).toContain('Edit');

    // Simulate edit button click
    editButton.click();
    fixture.detectChanges();

    const inputElements = productCard.querySelectorAll('input, textarea, select');
    expect(inputElements.length).toBeGreaterThan(0);
  });

  it('should save product details when save button is clicked', () => {
    component.products = [
      {
        _id: '1',
        name: 'Laptop',
        price: 1000,
        description: 'High-end laptop',
        category: 'laptop',
        imageUrl: 'http://example.com/laptop.jpg',
        editing: true
      }
    ];
    fixture.detectChanges();

    component.products[0].name = 'Updated Laptop';
    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector('.btn:nth-of-type(2)');
    saveButton.click();

    expect(component.products[0].name).toBe('Updated Laptop');
  });


});
