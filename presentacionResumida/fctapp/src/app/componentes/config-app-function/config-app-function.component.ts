import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-config-app-function',
  templateUrl: './config-app-function.component.html',
  styleUrls: ['./config-app-function.component.scss']
})
export class ConfigAppFunctionComponent {

  destroyed: any = false;

  ngOnInit() {
    this.showAnimation();
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  showAnimation() {
    if (this.destroyed) {
      return;
    }
  
    const elements = [
      document.querySelector(".function1") as HTMLElement,
      document.querySelector(".function2") as HTMLElement,
      document.querySelector(".function3") as HTMLElement,
      document.querySelector(".function4") as HTMLElement,
      document.querySelector(".function5") as HTMLElement
    ];
  
    const fadeInIndex = (index: any) => {
      if (index >= elements.length) {
        // Reset index if it exceeds the length of the elements array
        index = 0;
      }
  
      // Add fadeIn class to the current element
      elements[index].classList.add("fadeIn");
  
      // Wait for 3 seconds and remove fadeIn class from the current element
      setTimeout(() => {
        elements[index].classList.remove("fadeIn");
  
        // Recursively call fadeInIndex with the next index
        fadeInIndex(index + 1);
      }, 1000);
    };
  
    // Start the animation
    fadeInIndex(0);
  }
}
