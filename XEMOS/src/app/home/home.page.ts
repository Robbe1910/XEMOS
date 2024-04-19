import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Store } from '@ngrx/store';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataService } from '../services/data.service';

const currentTime = new Date();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  chart: any;
  heartRate: number = 0; // Variable para almacenar el último valor de ritmo cardíaco
  bpmGradient: string = ''; // Gradiente de colores de la barra de BPM
  indicatorPosition: string = '0%'; // Posición del indicador de BPM en porcentaje

  constructor() { }

  ngOnInit() {
    this.initializeHeartRateChart();
    this.initializeAirQualityChart();
    this.initializeHumidityTemperatureChart();
  }

  initializeHeartRateChart() {
    // Crear gráfico BPM
    const labels = [];
    const currentTime = new Date();
    for (let i = 0; i < 24; i += 2) {
      const pastTime = new Date(currentTime.getTime() - (i * 60 * 60 * 1000));
      const hour = pastTime.getHours();
      labels.unshift(hour.toString());
    }

    const heartRateData = [];
    for (let i = 0; i < 24 * 6; i++) { // 24 horas * 6 intervalos por hora
      heartRateData.push(Math.floor(Math.random() * (150 - 60 + 1)) + 60); // Genera un dato aleatorio entre 60 y 150
    }

    // Obtener el último valor de ritmo cardíaco
    this.heartRate = heartRateData[heartRateData.length - 1];

    // Actualizar el gradiente de colores y la posición del indicador de BPM
    this.updateBpmGradient();

    // Crear el gráfico de líneas con los datos generados
    this.chart = new Chart('heart-rate', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'BPM',
          data: heartRateData,
          borderColor: '#DE1835 ',
          backgroundColor: '#EE3E0B',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 180,
            title: {
              display: true,
              text: 'bpm'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Horas'
            }
          }
        }
      }
    });
  }

  initializeAirQualityChart() {
    // Crear gráfico calidad del aire
    const DATA_COUNT_AIR_QUALITY = 12; // Cantidad de datos
    const dataAirQuality = {
      labels: this.generateLabels(DATA_COUNT_AIR_QUALITY), // Genera etiquetas para los datos
      datasets: [{
        data: this.generateData(DATA_COUNT_AIR_QUALITY) // Genera datos aleatorios para la calidad del aire del aire
      }]
    };

    const configAirQuality: ChartConfiguration<'line'> = {
      type: 'line', // Tipo de gráfico: línea
      data: dataAirQuality, // Datos del gráfico
      options: {
        plugins: {
          legend: {
            display: false // Oculta la leyenda
          },
          tooltip: {
            enabled: true // Activa el tooltip
          },
        },
        elements: {
          line: {
            fill: false, // No rellena el área bajo la línea
            backgroundColor: this.getLineColor.bind(this), // Color de fondo de la línea
            borderColor: this.getLineColor.bind(this) // Color de borde de la línea
          },
          point: {
            backgroundColor: this.getLineColor.bind(this), // Color de fondo del punto
            hoverBackgroundColor: this.makeHalfAsOpaque.bind(this), // Color de fondo del punto al pasar el mouse
            radius: this.adjustRadiusBasedOnData.bind(this), // Ajusta el radio del punto basado en los datos
            pointStyle: this.alternatePointStyles.bind(this), // Alterna los estilos de los puntos
            hoverRadius: 15, // Radio del punto al pasar el mouse
          }
        },
        scales: {
          y: {
            min: 0,
            max: 150,
            title: {
              display: true,
              text: 'µg/m³'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Horas'
            }
          }
        }
      }
    };

    this.chart = new Chart('air-quality', configAirQuality);
  }

  initializeHumidityTemperatureChart() {
    // Código para el nuevo gráfico de línea de humedad
    const DATA_COUNT_HUMIDITY = 12;
    const NUMBER_CFG = { count: DATA_COUNT_HUMIDITY, min: 0, max: 100 };

    const labelsHumidity = []; // Genera etiquetas para los datos de humedad
    for (let i = 0; i < 24; i += 2) {
      const pastTime = new Date(currentTime.getTime() - (i * 60 * 60 * 1000));
      const hour = pastTime.getHours();
      labelsHumidity.unshift(hour.toString());
    }

    const dataHumidity = {
      labels: labelsHumidity,
      datasets: [
        {
          label: 'Temperature',
          data: this.generateTemperature(DATA_COUNT_HUMIDITY),
          borderColor: 'red',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Humidity',
          data: this.generateData(DATA_COUNT_HUMIDITY),
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
          yAxisID: 'y1',
        }
      ]
    };

    const configHumidity: ChartConfiguration<'line'> = {
      type: 'line',
      data: dataHumidity,
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: false,
            text: 'Humidity & temperature'
          }
        },
        scales: {
          y: {
            min: -10,
            max: 45,
            title: {
              display: true,
              text: '°C'
            },
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            min: 0,
            max: 100,
            title: {
              display: true,
              text: '%'
            },
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
          x: {
            title: {
              display: true,
              text: 'Horas'
            }
          }
        }
      }
    };

    this.chart = new Chart('humidity', configHumidity);
  }
  

  generateLabels(count: number): string[] {
    const labels = [];
    const currentTime = new Date();
    for (let i = 0; i < 24; i += 2) {
      const pastTime = new Date(currentTime.getTime() - (i * 60 * 60 * 1000));
      const hour = pastTime.getHours();
      labels.unshift(hour.toString());
    }
    return labels;
  }

  generateData(count: number): number[] {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(Math.floor(Math.random() * 60) + 20
    ); // Genera números aleatorios entre 0 y 100 para la calidad del aire
    }
    return data;
  }

  generateTemperature(count: number): number[] {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(Math.floor(Math.random() * 35) + 5
    ); // Genera números aleatorios entre 5 y 40 para la temperatura
    }
    return data;
  }

  getLineColor(ctx: any) {
    // Verifica si ctx.parsed está definido y tiene una propiedad 'y'
    if (ctx.parsed && ctx.parsed.y !== undefined) {
      // Devuelve un color basado en el valor de la calidad del aire
      const air_quality = ctx.parsed.y;
      if (air_quality < 30) {
        return 'rgba(75, 192, 192, 1)'; // Azul para baja calidad del aire
      } else if (air_quality < 60) {
        return 'rgba(255, 193, 7, 1)'; // Amarillo para calidad del aire media
      } else {
        return 'rgba(255, 105, 97, 1)'; // Rojo para alta calidad del aire
      }
    } else {
      // Manejo del caso en que ctx.parsed o ctx.parsed.y es undefined
      // Devuelve un color predeterminado en este caso
      return 'rgba(169, 169, 169, 1)'; // Gris
    }
  }


  makeHalfAsOpaque(ctx: any) {
    const color = this.getLineColor(ctx);
    // Hace el color semi-opaco dividiendo su valor alfa por la mitad
    const alpha = color.replace(/[^,]+(?=\))/, '0.5');
    return alpha;
  }

  adjustRadiusBasedOnData(ctx: any) {
    // Ajusta el radio del punto basado en los datos
    return 7; // Radio fijo de 7 para todos los puntos
  }

  alternatePointStyles(ctx: any) {
    const index = ctx.dataIndex;
    return index % 2 === 0 ? 'circle' : 'rect'; // Alterna los estilos de los puntos
  }



  getBpmColor(heartRate: number): string {
    // Definir los rangos de BPM para cada estado
    const lowHeartRateRange = { min: 0, max: 60 };
    const restingHeartRateRange = { min: 61, max: 80 };
    const warmUpHeartRateRange = { min: 81, max: 100 };
    const fatBurningHeartRateRange = { min: 101, max: 120 };
    const aerobicHeartRateRange = { min: 121, max: 150 };
    const highHeartRateRange = { min: 151, max: 200 };

    // Determinar en qué rango se encuentra el valor actual de ritmo cardíaco
    if (heartRate >= lowHeartRateRange.min && heartRate <= lowHeartRateRange.max) {
      return '#CBCBCB'; // Color para el estado de bajo ritmo cardíaco
    } else if (heartRate >= restingHeartRateRange.min && heartRate <= restingHeartRateRange.max) {
      return '#3EEE08'; // Color para el estado de reposo (por ejemplo, verde)
    } if (heartRate >= warmUpHeartRateRange.min && heartRate <= warmUpHeartRateRange.max) {
      return '#E7DC1C '; // Color para el estado de calentamiento (por ejemplo, naranja)
    } else if (heartRate >= fatBurningHeartRateRange.min && heartRate <= fatBurningHeartRateRange.max) {
      return 'orange'; // Color para el estado de quema de grasa (por ejemplo, amarillo)
    } else if (heartRate >= aerobicHeartRateRange.min && heartRate <= aerobicHeartRateRange.max) {
      return ''; // Color para el estado aeróbico (por ejemplo, azul claro)
    } else if (heartRate >= highHeartRateRange.min && heartRate <= highHeartRateRange.max) {
      return 'red'; // Color para el estado de alto ritmo cardíaco
    } else {
      return 'purple'; // Color predeterminado para otros estados (por ejemplo, morado)
    }
  }

  getHeartRateStatus(heartRate: number): string {
    // Definir los rangos de BPM para cada estado
    const lowHeartRateRange = { min: 0, max: 60 };
    const restingHeartRateRange = { min: 61, max: 80 };
    const warmUpHeartRateRange = { min: 81, max: 100 };
    const fatBurningHeartRateRange = { min: 101, max: 120 };
    const aerobicHeartRateRange = { min: 121, max: 150 };
    const highHeartRateRange = { min: 151, max: 200 };

    // Determinar en qué rango se encuentra el valor actual de ritmo cardíaco
    if (heartRate >= lowHeartRateRange.min && heartRate <= lowHeartRateRange.max) {
      return 'Low'; // Estado de bajo ritmo cardíaco
    } else if (heartRate >= restingHeartRateRange.min && heartRate <= restingHeartRateRange.max) {
      return 'Resting'; // Estado de reposo
    } else if (heartRate >= warmUpHeartRateRange.min && heartRate <= warmUpHeartRateRange.max) {
      return 'Warm Up'; // Estado de calentamiento
    } else if (heartRate >= fatBurningHeartRateRange.min && heartRate <= fatBurningHeartRateRange.max) {
      return 'Fat Burning'; // Estado de quema de grasa
    } else if (heartRate >= aerobicHeartRateRange.min && heartRate <= aerobicHeartRateRange.max) {
      return 'Aerobic'; // Estado aeróbico
    } else if (heartRate >= highHeartRateRange.min && heartRate <= highHeartRateRange.max) {
      return 'High'; // Estado de alto ritmo cardíaco
    } else {
      return 'Unknown'; // Estado desconocido
    }
  }

  updateBpmGradient() {
    // Calcula la posición del indicador de BPM en porcentaje
    const positionPercentage = (this.heartRate - 0) / (200 - 0) * 100;
    this.indicatorPosition = `${positionPercentage}%`;

    // Actualiza el gradiente de colores de la barra de BPM
    this.bpmGradient = 'linear-gradient(to right, ' +
      this.getBpmColor(0) + ' 0%, ' +
      this.getBpmColor(60) + ' 10%, ' +
      this.getBpmColor(80) + ' 30%, ' +
      this.getBpmColor(100) + ' 50%, ' +
      this.getBpmColor(120) + ' 65%, ' +
      this.getBpmColor(150) + ' 85%, ' +
      this.getBpmColor(200) + ' 100%)';
  }


}
