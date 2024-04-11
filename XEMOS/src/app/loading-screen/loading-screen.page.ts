import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.page.html',
  styleUrls: ['./loading-screen.page.scss'],
})
export class LoadingScreenPage {

  constructor(private loadingController: LoadingController) { }

  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    // Simular una carga de datos
    setTimeout(() => {
      loading.dismiss();
      // Aquí se puede agregar la lógica para procesar los datos después de la carga
    }, 2000);
  }
}
