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
  dataSubscription: Subscription;
  heartRateChart: any;
  airQualityChart: any;
  humidityChart: any;

  constructor(private dataService: DataService) {
    this.dataSubscription = new Subscription();
  }

  ngOnInit() {
    this.initializeHeartRateChart();
    this.initializeAirQualityChart();
    this.initializeHumidityTemperatureChart();

    // // Obtener datos cada 5 segundos
    // this.dataSubscription = interval(5000).pipe(
    //   switchMap(() => this.dataService.getData())
    // ).subscribe((data: any) => {
    //   this.updateCharts(data);
    // });

    // Obtener datos aleatorios cada 5 segundos
    this.dataSubscription = interval(5000).subscribe(() => {
      const heartRateData = this.generateHeartRateData();
      const airQualityData = this.generateAirQualityData();
      const humidityTemperatureData = this.generateHumidityTemperatureData();

      this.updateCharts({
        heartRateData,
        airQualityData,
        humidityTemperatureData
      });
    });
  }

  ngOnDestroy() {
    // Cancelar la suscripción al salir del componente para evitar pérdida de memoria
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  initializeHeartRateChart() {
    const labels = this.generateLabels(24);
    const heartRateData = this.generateHeartRateData();

    this.heartRate = heartRateData[heartRateData.length - 1];

    this.updateBpmGradient();
    this.updateBpmIndicatorPosition(this.heartRate);

    this.heartRateChart = new Chart('heart-rate', {
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
    const DATA_COUNT_AIR_QUALITY = 12;
    const airQualityData = this.generateAirQualityData();
    const configAirQuality = this.getAirQualityChartConfig(DATA_COUNT_AIR_QUALITY, airQualityData);

    this.airQualityChart = new Chart('air-quality', configAirQuality);
  }

  initializeHumidityTemperatureChart() {
    const DATA_COUNT_HUMIDITY = 12;
    const labelsHumidity = this.generateLabels(DATA_COUNT_HUMIDITY);
    const humidityTemperatureData = this.generateHumidityTemperatureData();

    const dataHumidity = {
      labels: labelsHumidity,
      datasets: [
        {
          label: 'Temperature',
          data: humidityTemperatureData.temperature,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Humidity',
          data: humidityTemperatureData.humidity,
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
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: '°C'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: '%'
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

    this.humidityChart = new Chart('humidity', configHumidity);
  }

  generateHeartRateData(): number[] {
    const heartRateData = [];
    for (let i = 0; i < 24 * 6; i++) {
      heartRateData.push(Math.floor(Math.random() * (150 - 60 + 1)) + 60);
    }
    this.heartRate = heartRateData[heartRateData.length - 1];
    return heartRateData;
  }

  generateAirQualityData(): number[] {
    const airQualityData = [];
    for (let i = 0; i < 12; i++) {
      airQualityData.push(Math.floor(Math.random() * 100));
    }
    return airQualityData;
  }

  generateHumidityTemperatureData(): any {
    const humidityTemperatureData: { temperature: number[], humidity: number[] } = {
      temperature: [],
      humidity: []
    };
    for (let i = 0; i < 12; i++) {
      humidityTemperatureData.temperature.push(Math.floor(Math.random() * 50));
      humidityTemperatureData.humidity.push(Math.floor(Math.random() * 100));
    }
    return humidityTemperatureData;
  }

  updateCharts(data: any) {
    this.updateHeartRateChart(data.heartRateData);
    this.updateAirQualityChart(data.airQualityData);
    this.updateHumidityTemperatureChart(data.humidityTemperatureData);
  }

  updateHeartRateChart(heartRateData: number[]) {
    this.heartRate = heartRateData[heartRateData.length - 1];
    this.updateBpmGradient();
    this.heartRateChart.data.datasets[0].data = heartRateData;
    this.heartRateChart.update();
    this.updateBpmIndicatorPosition(this.heartRate);
  }

  updateAirQualityChart(airQualityData: number[]) {
    this.airQualityChart.data.labels = this.generateLabels(airQualityData.length);
    this.airQualityChart.data.datasets[0].data = airQualityData;
    this.airQualityChart.update();
  }

  updateHumidityTemperatureChart(humidityTemperatureData: any) {
    const temperatureData = humidityTemperatureData.temperature;
    const humidityData = humidityTemperatureData.humidity;

    this.humidityChart.data.datasets[0].data = temperatureData;
    this.humidityChart.data.datasets[1].data = humidityData;
    this.humidityChart.update();
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

  generateTemperature(count: number): number[] {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(Math.floor(Math.random() * 50)); // Genera números aleatorios entre 0 y 50 para la temperatura
    }
    return data;
  }

  getAirQualityChartConfig(dataCount: number, airQualityData: number[]): ChartConfiguration<'line'> {
    const labels = this.generateLabels(dataCount);
    const dataAirQuality = {
      labels: labels,
      datasets: [{
        data: airQualityData
      }]
    };

    return {
      type: 'line',
      data: dataAirQuality,
      options: {
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          },
        },
        elements: {
          line: {
            fill: false,
            backgroundColor: this.getLineColor.bind(this),
            borderColor: this.getLineColor.bind(this)
          },
          point: {
            backgroundColor: this.getLineColor.bind(this),
            hoverBackgroundColor: this.makeHalfAsOpaque.bind(this),
            radius: this.adjustRadiusBasedOnData.bind(this),
            pointStyle: this.alternatePointStyles.bind(this),
            hoverRadius: 15,
          }
        },
        scales: {
          y: {
            min: 0,
            max: 200,
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

  updateBpmIndicatorPosition(heartRate: number) {
    const positionPercentage = (heartRate - 0) / (200 - 0) * 100;
    this.indicatorPosition = `${positionPercentage}%`;
  }
  

}
