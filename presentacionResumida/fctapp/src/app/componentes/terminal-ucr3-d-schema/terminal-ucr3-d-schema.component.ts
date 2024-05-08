import { Component, OnInit, OnDestroy } from '@angular/core';
import {bool} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

@Component({
  selector: 'app-terminal-ucr3-d-schema',
  templateUrl: './terminal-ucr3-d-schema.component.html',
  styleUrls: ['./terminal-ucr3-d-schema.component.scss']
})
export class TerminalUcr3DSchemaComponent {

  destroyed : any = false;

  ngOnInit() {
    this.schemaAnimation()
  }

  ngOnDestroy()
  {
    this.destroyed = true;
  }

  schemaAnimation()
  {

    if(this.destroyed)
    {
      return;
    }

    let battery = document.querySelector(".battery") as HTMLElement;
    let arrowEspBattery = document.querySelector(".arrowEspBattery") as HTMLElement;
    let esp32 = document.querySelector(".esp32") as HTMLElement;
    let alertButton = document.querySelector(".alertButton") as HTMLElement;
    let arrowEspButton = document.querySelector(".arrowEspButton") as HTMLElement;
    let esp32connection = document.querySelector(".esp32Connection") as HTMLElement;



    setTimeout(() => {

      battery.classList.add("fadeIn");

      setTimeout(() => {

        arrowEspBattery.classList.add("fadeIn");

        setTimeout(() => {

          esp32.classList.add("fadeIn");

          setTimeout(() => {

            alertButton.classList.add("fadeIn");

            setTimeout(() => {

              arrowEspButton.classList.add("fadeIn");

              setTimeout(() => {

                esp32connection.classList.add("fadeIn");

                setTimeout(() => {

                  battery.classList.remove("fadeIn")
                  arrowEspBattery.classList.remove("fadeIn")
                  esp32.classList.remove("fadeIn")
                  alertButton.classList.remove("fadeIn")
                  arrowEspButton.classList.remove("fadeIn")
                  esp32connection.classList.remove("fadeIn")

                  this.schemaAnimation();

                }, 3000)

              }, 1500)

            }, 1500)

          }, 1500)

        }, 1500)

      }, 1500)

    }, 3000)

  }

}
