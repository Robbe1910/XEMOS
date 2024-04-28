import { Component, OnChanges, OnInit } from '@angular/core';
import {fadeInAnimation} from "angular-animations";
import { DeviceDetectorService } from "ngx-device-detector";
import { HttpClient  } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  pages: number [] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
  actualPage: number = 16;
  deviceInfo: any;

  constructor(private deviceService: DeviceDetectorService) {
  }

  ngOnInit() {

    if( this.deviceService.isMobile() )
    {
      let unssuported = document.querySelector(".unssuported") as HTMLElement;
      unssuported.style.display = "flex";
    }

    this.deviceInfo = this.deviceService.getDeviceInfo();
    //console.log(this.deviceInfo);

    let container = document.getElementById("containerPrincipal") as HTMLElement
    container.classList.add("fade0")
    setTimeout(() => {
      container.classList.remove("fade0")
      container.classList.add("fade100")
    }, 1200);
    container.classList.remove("fade100")
  }

  changePageBackward()
  {
    let content = document.getElementById("content") as HTMLElement;
    content.classList.add("fade0")
    setTimeout(() => {
      content.classList.remove("fade0")
      if(this.actualPage != 0)
      {
        this.actualPage --;
        //console.log(this.actualPage)
      }
      content.classList.add("fade100")
    }, 1200);
    content.classList.remove("fade100")

  }
  changePageForward()
  {
    let content = document.getElementById("content") as HTMLElement;
    content.classList.add("fade0")
    setTimeout(() => {
      content.classList.remove("fade0")
      if(this.actualPage < this.pages.length-  1)
      {
        this.actualPage ++;
        //console.log(this.actualPage)
      }
      content.classList.add("fade100")
    }, 1200);
    content.classList.remove("fade100")

  }

  protected readonly fadeInAnimation = fadeInAnimation;
}
