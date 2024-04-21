import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api-service.service';
import { ConfirmationResponse } from '../model';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.page.html',
  styleUrls: ['./confirmation-page.page.scss'],
})
export class ConfirmationPagePage implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.confirmEmail();
  }

  confirmEmail() {
    const token = this.route.snapshot.params["token"];
    this.apiService.confirmEmail(token).subscribe(
      (response: ConfirmationResponse) => {
        console.log('Email confirmed successfully');
        if (response.message === 'Token confirmado correctamente.') {
          this.router.navigateByUrl('/confirmation-page');
        } else {
          this.router.navigateByUrl('/login');
        }
      },
      (error) => {
        console.error('Error confirming email:', error);
      }
    );
  }
  
  
  
  }

