import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationPagePage } from './confirmation-page.page';

describe('ConfirmationPagePage', () => {
  let component: ConfirmationPagePage;
  let fixture: ComponentFixture<ConfirmationPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
