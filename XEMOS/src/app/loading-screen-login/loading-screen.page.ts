import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-screen-login',
  templateUrl: './loading-screen.page.html',
  styleUrls: ['./loading-screen.page.scss'],
})
export class LoadingScreenPageLogin {

  constructor(private router: Router,) {}

  ionViewDidEnter() {
    setTimeout(() => {
      this.router.navigateByUrl('/app');
    }, 2800);
  }
}
