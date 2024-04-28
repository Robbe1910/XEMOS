import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-page-function-desc',
  templateUrl: './page-function-desc.component.html',
  styleUrls: ['./page-function-desc.component.scss']
})
export class PageFunctionDescComponent {
  destroyed : any = false;

  ngOnInit()
  {
    setTimeout(() => {
      this.showAnimation();
    }, 2000)
  }

  ngOnDestroy()
  {
    this.destroyed = true;
  }

  showAnimation()
  {

    if(this.destroyed)
    {
      return
    }

    let pacienteUCRESP32 = document.querySelector(".human") as HTMLElement;
    let terminalConnection = document.querySelector(".xemos") as HTMLElement;

    setTimeout(() => {
      pacienteUCRESP32.classList.add("fadeIn")
      terminalConnection.classList.add("fadeIn")
      setTimeout(() => {
        pacienteUCRESP32.classList.remove("fadeIn")
        terminalConnection.classList.remove("fadeIn")
        setTimeout(() => {
          this.showAnimation();
        }, 1000)
      }, 1000)
    })

  }

}
