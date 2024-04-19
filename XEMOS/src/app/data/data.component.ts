import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit, OnDestroy {
  data: any;
  private updateInterval: any;
  private subscription: Subscription = new Subscription();;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getData(); // Obtenemos los datos al iniciar el componente

    // Configuramos un temporizador para actualizar los datos cada 5 segundos
    this.updateInterval = setInterval(() => {
      this.getData();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.updateInterval); // Limpiamos el temporizador cuando el componente se destruye
    this.subscription.unsubscribe(); // Cancelamos la suscripción al servicio
  }

  getData(): void {
    this.subscription = this.dataService.getData().subscribe(data => {
      this.data = data;
    });
  }
}
