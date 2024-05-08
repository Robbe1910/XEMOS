import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-page-main-desc',
  templateUrl: './page-main-desc.component.html',
  styleUrls: ['./page-main-desc.component.scss']
})
export class PageMainDescComponent {
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

  showAnimation() {

    if(this.destroyed)
    {
      return
    }

    let miniSchema = document.querySelector(".miniSchema") as HTMLElement;
    let miniSchemaDivs: NodeListOf<Element> = miniSchema.querySelectorAll("div");

    setTimeout(() => {
      miniSchemaDivs[3].classList.remove("fadeIn")
      miniSchemaDivs[0].classList.add("fadeIn")
      setTimeout(() => {
        miniSchemaDivs[0].classList.remove("fadeIn")
        miniSchemaDivs[1].classList.add("fadeIn")
        setTimeout(() => {
          miniSchemaDivs[1].classList.remove("fadeIn")
          miniSchemaDivs[2].classList.add("fadeIn")
          setTimeout(() => {
            miniSchemaDivs[2].classList.remove("fadeIn")
            miniSchemaDivs[3].classList.add("fadeIn")
            setTimeout(() => {
              this.showAnimation();
            }, 1000)
          }, 1000)
        }, 1000)
      }, 1000)
    }, 100)

  }
}
