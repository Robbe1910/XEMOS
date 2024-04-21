import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  resendConfirmationEmail(): void {
    const token = this.authService.getToken();
    console.log(token)
    if (token) {
      this.authService.resendConfirmationEmail(token).subscribe(
        () => {
          console.log('Confirmation email resent successfully');
        },
        error => {
          console.error('Error resending confirmation email:', error);
        }
      );
    }
  }
}
