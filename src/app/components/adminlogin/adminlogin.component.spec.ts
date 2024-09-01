import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AdminloginComponent } from './adminlogin.component';

describe('AdminloginComponent', () => {
  let component: AdminloginComponent;
  let fixture: ComponentFixture<AdminloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [FormsModule,AdminloginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display error messages when the form is submitted with empty fields', () => {
    // Trigger form submission
    component.admin.username = '';
    component.admin.password = '';
    fixture.detectChanges();
    
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    
    const usernameError = fixture.nativeElement.querySelector('.error-message');
    const passwordError = fixture.nativeElement.querySelectorAll('.error-message')[1];
    
    expect(usernameError).toBeTruthy();
    expect(usernameError.textContent).toContain('Username is required');
    expect(passwordError).toBeTruthy();
    expect(passwordError.textContent).toContain('Password is required');
  });

  it('should enable the submit button when the form is valid', () => {
    // Set valid form values
    component.admin.username = 'adminUser';
    component.admin.password = 'adminPass123';
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeFalse();
  });
});
