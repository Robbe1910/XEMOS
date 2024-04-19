import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  chart: any;
  heartRate: number = 0; // Variable para almacenar el último valor de ritmo cardíaco
  bpmGradient: string = 'linear-gradient(to right, green, yellow, orange, red, blue)'; // Gradiente de colores de la barra de BPM
  indicatorPosition: string = '0%'; // Posición del indicador de BPM en porcentaje

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
  
    // Obtener el último valor de ritmo cardíaco
    this.heartRate = heartRateData[heartRateData.length - 1];

    // Actualizar el gradiente de colores y la posición del indicador de BPM
    this.updateBpmGradient();
  
    // Crear el gráfico de líneas con las etiquetas generadas dinámicamente y los datos aleatorios de pulsaciones cardíacas
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Heart Rate',
          data: heartRateData,
          borderColor: 'red', // Cambiar el color de la línea a rojo
          backgroundColor: 'rgba(255, 0, 0, 0.2)', // Cambiar el color de fondo del área bajo la línea a rojo semi-transparente
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
      const heartRate = Math.floor(Math.random() * (150 - 60 + 1)) + 60; // Genera un número aleatorio entre 60 y 150
      heartRateData.push(heartRate);
    }
    return heartRateData;
  }

  updateBpmGradient() {
    // Calcula la posición del indicador de BPM en porcentaje
    const positionPercentage = (this.heartRate - 60) / (150 - 60) * 100;
    this.indicatorPosition = `${positionPercentage}%`;

    // Actualiza el gradiente de colores de la barra de BPM
    this.bpmGradient = 'linear-gradient(to right, ' +
      this.getBpmColor(60) + ' 0%, ' +
      this.getBpmColor(81) + ' 25%, ' +
      this.getBpmColor(101) + ' 50%, ' +
      this.getBpmColor(121) + ' 75%, ' +
      this.getBpmColor(150) + ' 100%)';
  }


  getBpmColor(heartRate: number): string {
    // Definir los rangos de BPM para cada estado
    const restingHeartRateRange = { min: 60, max: 80 };
    const warmUpHeartRateRange = { min: 81, max: 100 };
    const fatBurningHeartRateRange = { min: 101, max: 120 };
    const aerobicHeartRateRange = { min: 121, max: 150 };
    // Puedes agregar más rangos según tus necesidades
    
    // Determinar en qué rango se encuentra el valor actual de ritmo cardíaco
    if (heartRate >= restingHeartRateRange.min && heartRate <= restingHeartRateRange.max) {
      return 'green'; // Color para el estado de reposo (por ejemplo, verde)
    } else if (heartRate >= warmUpHeartRateRange.min && heartRate <= warmUpHeartRateRange.max) {
      return 'orange'; // Color para el estado de calentamiento (por ejemplo, naranja)
    } else if (heartRate >= fatBurningHeartRateRange.min && heartRate <= fatBurningHeartRateRange.max) {
      return 'yellow'; // Color para el estado de quema de grasa (por ejemplo, amarillo)
    } else if (heartRate >= aerobicHeartRateRange.min && heartRate <= aerobicHeartRateRange.max) {
      return 'blue'; // Color para el estado aeróbico (por ejemplo, azul)
    } else {
      return 'red'; // Color predeterminado para otros estados (por ejemplo, rojo)
    }
  }
  
  getHeartRateStatus(heartRate: number): string {
    // Definir los rangos de BPM para cada estado
    const restingHeartRateRange = { min: 60, max: 80 };
    const warmUpHeartRateRange = { min: 81, max: 100 };
    const fatBurningHeartRateRange = { min: 101, max: 120 };
    const aerobicHeartRateRange = { min: 121, max: 150 };
    // Puedes agregar más rangos según tus necesidades
    
    // Determinar en qué rango se encuentra el valor actual de ritmo cardíaco
    if (heartRate >= restingHeartRateRange.min && heartRate <= restingHeartRateRange.max) {
      return 'Resting'; // Estado de reposo
    } else if (heartRate >= warmUpHeartRateRange.min && heartRate <= warmUpHeartRateRange.max) {
      return 'Warm Up'; // Estado de calentamiento
    } else if (heartRate >= fatBurningHeartRateRange.min && heartRate <= fatBurningHeartRateRange.max) {
      return 'Fat Burning'; // Estado de quema de grasa
    } else if (heartRate >= aerobicHeartRateRange.min && heartRate <= aerobicHeartRateRange.max) {
      return 'Aerobic'; // Estado aeróbico
    } else {
      return 'Unknown'; // Estado desconocido
    }
  }
  

}
