import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      imports: [FormsModule,LoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display alert message when message is set', () => {
    component.message = 'Test alert message';
    component.messageType = 'success';
    fixture.detectChanges();

    const alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeTruthy();
    expect(alertDiv.textContent).toContain('Test alert message');
    expect(alertDiv.classList).toContain('success');
  });

  it('should hide alert message when fadeOut is true', () => {
    component.message = 'Test alert message';
    component.messageType = 'success';
    component.fadeOut = true;
    fixture.detectChanges();

    const alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeTruthy();
    expect(alertDiv.classList).toContain('fade-out');
  });

  it('should call onSubmit method when form is submitted', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const emailInput = fixture.nativeElement.querySelector('#email');
    const passwordInput = fixture.nativeElement.querySelector('#password');
    const form = fixture.nativeElement.querySelector('form');

    emailInput.value = 'test@example.com';
    passwordInput.value = 'password123';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });


});
