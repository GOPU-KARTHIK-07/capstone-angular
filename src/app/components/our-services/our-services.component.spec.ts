import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { OurServicesComponent } from './our-services.component';

describe('OurServicesComponent', () => {
  let component: OurServicesComponent;
  let fixture: ComponentFixture<OurServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [FormsModule,OurServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the background image', () => {
    const image = fixture.nativeElement.querySelector('.background-image');
    expect(image).toBeTruthy();
    expect(image.src).toContain('assets/images/service.png');
  });

  it('should display the form title and description', () => {
    const title = fixture.nativeElement.querySelector('h2');
    const description = fixture.nativeElement.querySelector('p');

    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Service Booking');
    expect(description).toBeTruthy();
    expect(description.textContent).toContain('Make an appointment for Royal Enfield service from the safety and comfort of your home.');
  });

  it('should have form fields with correct placeholders', () => {
    const fullNameInput = fixture.nativeElement.querySelector('#fullName');
    const emailInput = fixture.nativeElement.querySelector('#email');
    const stateInput = fixture.nativeElement.querySelector('#state');
    const cityInput = fixture.nativeElement.querySelector('#city');

    expect(fullNameInput).toBeTruthy();
    expect(fullNameInput.placeholder).toBe('Full name*');
    expect(emailInput).toBeTruthy();
    expect(emailInput.placeholder).toBe('Email address*');
    expect(stateInput).toBeTruthy();
    expect(stateInput.placeholder).toBe('State*');
    expect(cityInput).toBeTruthy();
    expect(cityInput.placeholder).toBe('City*');
  });

  it('should call onSubmit method when form is submitted', () => {
    spyOn(component, 'onSubmit');

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should have radio buttons for service type', () => {
    const selfDropRadio = fixture.nativeElement.querySelector('#selfDrop');
    const doorstepServiceRadio = fixture.nativeElement.querySelector('#doorstepService');

    expect(selfDropRadio).toBeTruthy();
    expect(doorstepServiceRadio).toBeTruthy();
  });

  it('should display the "Book Service" button', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Book Service');
  });
});
