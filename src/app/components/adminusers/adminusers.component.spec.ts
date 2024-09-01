import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminusersComponent } from './adminusers.component';

describe('AdminusersComponent', () => {
  let component: AdminusersComponent;
  let fixture: ComponentFixture<AdminusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [AdminusersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display registered users table when users are present', () => {
    component.users = [
      { username: 'user1', email: 'user1@example.com' },
      { username: 'user2', email: 'user2@example.com' }
    ];
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('.user-table');
    const rows = table.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('user1');
    expect(rows[0].textContent).toContain('user1@example.com');
    expect(rows[1].textContent).toContain('user2');
    expect(rows[1].textContent).toContain('user2@example.com');
  });

  it('should display no users message when users array is empty', () => {
    component.users = [];
    fixture.detectChanges();
    const message = fixture.nativeElement.querySelector('.no-users-message');
    expect(message).toBeTruthy();
    expect(message.textContent).toContain('No registered users found.');
  });
});
