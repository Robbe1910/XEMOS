import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-page-secondary-desc',
  templateUrl: './page-secondary-desc.component.html',
  styleUrls: ['./page-secondary-desc.component.scss']
})
export class PageSecondaryDescComponent {
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

    let schema = document.querySelector(".schema") as HTMLElement;
    let miniSchemaDivs: NodeListOf<Element> = schema.querySelectorAll("div");

    setTimeout(() => {
      miniSchemaDivs[0].classList.add("fadeIn")
      setTimeout(() => {
        miniSchemaDivs[0].classList.remove("fadeIn")
        miniSchemaDivs[1].classList.add("fadeIn")
          setTimeout(() => {
            miniSchemaDivs[1].classList.remove("fadeIn")
            miniSchemaDivs[2].classList.add("fadeIn")
            setTimeout( () => {
              miniSchemaDivs[2].classList.remove("fadeIn")
              setTimeout(() => {
                this.showAnimation();
              }, 1000)
            }, 1000)
        }, 1000)
      }, 1000)
    }, 100)

  }
}
