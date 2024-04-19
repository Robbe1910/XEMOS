import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.page.html',
  styleUrls: ['./loading-screen.page.scss'],
})
export class LoadingScreenPage {

  constructor(private router: Router,) {}

  ionViewDidEnter() {
    setTimeout(() => {
      this.router.navigateByUrl('/register');
    }, 200000);
  }
}
