import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminproductsComponent } from './adminproducts.component';

describe('AdminproductsComponent', () => {
  let component: AdminproductsComponent;
  let fixture: ComponentFixture<AdminproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminproductsComponent,RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
