import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-full-schema',
  templateUrl: './full-schema.component.html',
  styleUrls: ['./full-schema.component.scss']
})
export class FullSchemaComponent {

  counter = 0;
  destroyed : any = false;

  ngOnDestroy()
  {
    this.destroyed = true;
  }

  ngOnInit()
  {
    setTimeout(() => {
    this.schemaAnimation(this.counter)
    }, 3000)
  }

  schemaAnimation(counter: any)
  {

      if(this.counter > 32)
      {
        setTimeout( () => {
          for (let i = 0; i < 33; i++) {

            if(this.destroyed)
            {
              break;
            }

            let elements: NodeListOf<Element> = document.querySelectorAll("."+this.getClassName(i))

            elements.forEach((element) => {
              element.classList.remove("fadeIn");
              element.classList.remove("fadeIn75")
            });
          }
          this.counter = 0;
          setTimeout(() => {
            this.schemaAnimation(this.counter)
          }, 2000)
        }, 5000)

      }
      else {
        setTimeout(() => {
          let elements: NodeListOf<Element> = document.querySelectorAll("."+this.getClassName(this.counter))

          elements.forEach((element) => {

            if(this.destroyed)
            {
              return;
            }

            switch (this.counter)
            {
              case 9:
                element.classList.add("fadeIn25")
                break;
              case 15:
                element.classList.remove("fadeIn25")
                element.classList.add("fadeIn50")
                break;
              case 24:
                element.classList.remove("fadeIn50")
                element.classList.add("fadeIn75")
                break;
              default:
                element.classList.add("fadeIn")
                break;
            }

          });

          this.counter++;
          this.schemaAnimation(this.counter)
          //console.log(this.counter)
        }, 800)
      }

  }

  getClassName(int : any) {
    var className;

    switch (int) {
      case 0:
        className = "zero";
        break;
      case 1:
        className = "one";
        break;
      case 2:
        className = "two";
        break;
      case 3:
        className = "three";
        break;
      case 4:
        className = "four";
        break;
      case 5:
        className = "five";
        break;
      case 6:
        className = "six";
        break;
      case 7:
        className = "seven";
        break;
      case 8:
        className = "eight";
        break;
      case 9:
        className = "nine";
        break;
      case 10:
        className = "ten";
        break;
      case 11:
        className = "eleven";
        break;
      case 12:
        className = "twelve";
        break;
      case 13:
        className = "thirteen";
        break;
      case 14:
        className = "fourteen";
        break;
      case 15:
        className = "fifteen";
        break;
      case 16:
        className = "sixteen";
        break;
      case 17:
        className = "seventeen";
        break;
      case 18:
        className = "eighteen";
        break;
      case 19:
        className = "nineteen";
        break;
      case 20:
        className = "twenty";
        break;
      case 21:
        className = "twenty-one";
        break;
      case 22:
        className = "twenty-two";
        break;
      case 23:
        className = "twenty-three";
        break;
      case 24:
        className = "twenty-four";
        break;
      case 25:
        className = "twenty-five";
        break;
      case 26:
        className = "twenty-six";
        break;
      case 27:
        className = "twenty-seven";
        break;
      case 28:
        className = "twenty-eight";
        break;
      case 29:
        className = "twenty-nine";
        break;
      case 30:
        className = "thirty";
        break;
      case 31:
        className = "thirty-one";
        break;
      case 32:
        className = "thirty-two";
        break;
      default:
        className = "Número no válido";
        break;
    }

    return className;
  }

}
