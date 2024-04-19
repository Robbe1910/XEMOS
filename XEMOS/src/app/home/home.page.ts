import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  chart: any;

  constructor() {}

  ngOnInit() {
    // Obtener la hora actual
    const currentTime = new Date();
    
    // Generar las etiquetas de tiempo para las últimas 24 horas
    const labels = [];
    for (let i = 23; i >= 0; i--) {
      const pastTime = new Date(currentTime);
      pastTime.setHours(currentTime.getHours() - i);
      const hour = pastTime.getHours();
      labels.push(hour.toString());
    }
    
    // Generar datos aleatorios de pulsaciones cardíacas
    const heartRateData = this.generateRandomHeartRateData(labels.length);
  
    // Crear el gráfico de líneas con las etiquetas generadas dinámicamente y los datos aleatorios de pulsaciones cardíacas
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Heart Rate',
          data: heartRateData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true // Añadimos la opción responsive
      }
    });
  }
  
  generateRandomHeartRateData(numPoints: number): number[] {
    const heartRateData = [];
    for (let i = 0; i < numPoints; i++) {
      const heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60; // Genera un número aleatorio entre 60 y 100
      heartRateData.push(heartRate);
    }
    return heartRateData;
  }
  
  

}
