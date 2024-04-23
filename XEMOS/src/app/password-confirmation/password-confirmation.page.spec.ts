import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailCOnfirmationPage } from './password-confirmation.page';

describe('EmailCOnfirmationPage', () => {
  let component: EmailCOnfirmationPage;
  let fixture: ComponentFixture<EmailCOnfirmationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCOnfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
