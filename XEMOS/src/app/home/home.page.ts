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
export class HomePage implements OnInit, OnDestroy {

  chart: any;
  heartRate: number = 0; // Variable para almacenar el último valor de ritmo cardíaco
  bpmGradient: string = ''; // Gradiente de colores de la barra de BPM
  indicatorPosition: string = '0%'; // Posición del indicador de BPM en porcentaje
  dataSubscription: Subscription;
  heartRateChart: any;
  airQualityChart: any;
  humidityChart: any;
  isStabilizing: boolean = false;

  sensorData: any;
  tyhData: any = {
    temperature: [],
    humidity: []
  };
  airQualityData: any = {
    TVOC: [],
    eCO2: []
  };
  heartRateData: number[] = [];

  actualData = {
    temperatura: 0,
    humedad: 0,
    airquality: {
      TVOC: 0,
      eCO2: 0
    },
    heart: 0,
    date: "0"
  };

  currentDate: any;
  counter: any;

  constructor(private dataService: DataService) {
    for (let i = 0; i < 24; i++) {
      this.heartRateData.push(0);
    }

    this.tyhData.temperature = Array(12).fill(0);
    this.tyhData.humidity = Array(12).fill(0);

    for (let i = 0; i < 24; i++) {
      this.airQualityData.TVOC.push(0); // You can initialize it with any default value you want
      this.airQualityData.eCO2.push(0); // You can initialize it with any default value you want
    }
    this.dataSubscription = new Subscription();
  }

  ngOnInit() {
    this.initializeHeartRateChart();
    this.initializeAirQualityChart();
    this.initializeHumidityTemperatureChart();

    // Obtener datos aleatorios cada 5 segundos

    const heartRateData = this.generateHeartRateData();
    const airQualityData = this.generateAirQualityData();
    const humidityTemperatureData = this.generateHumidityTemperatureData();

    this.updateCharts({
      heartRateData,
      airQualityData,
      humidityTemperatureData
    });

    // Obtener datos aleatorios cada 1 segundo
    this.dataSubscription = this.getSensorData()
  }

  ngOnDestroy() {
    // Cancelar la suscripción al salir del componente para evitar pérdida de memoria
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // Método para obtener datos del sensor y suscribirse a ellos
  getSensorData(): Subscription {
    return this.dataService.getData().subscribe(
      (data) => {

        // Aquí puedes manejar los datos recibidos, como almacenarlos en una variable o enviarlos a otro lugar
        console.log("--------");
        console.log("🟩", data[0].data)
        console.log("🟦 PETITION DATE: ", data[0].date)
        console.log("🟦 CURRENT DATE: ", this.currentDate)

        // Por ejemplo, si necesitas almacenar los datos en el almacenamiento de tu aplicación (ngrx en este caso), puedes hacerlo así:
        // this.store.dispatch(loadSensorData({ data }));
        this.formatSensorData(data)
      },
      (error) => {
        console.error('Error fetching sensor data:', error);
      }
    );
  }

  formatSensorData(data: any) {
    const dataArray = data[0].data.split('//');

    this.actualData = {
      temperatura: parseInt(dataArray[0]),
      humedad: parseInt(dataArray[1]),
      airquality: {
        TVOC: parseInt(dataArray[2]),
        eCO2: parseInt(dataArray[3])
      },
      heart: parseInt(dataArray[4]),
      date: data[0].date
    };

    // Inicializar una variable de contador para llevar el registro de ocurrencias consecutivas
    if (!this.counter) {
      this.counter = 0;
    }

    if (this.actualData.date == this.currentDate || this.currentDate == undefined) {

        this.actualData = {
          temperatura: 0,
          humedad: 0,
          airquality: {
            TVOC: 0,
            eCO2: 0
          },
          heart: 0,
          date: this.actualData.date
        };
        console.log("❌ Not receiving data");
        this.currentDate = this.actualData.date;
    } else {
      console.log("➡️ Receiving data");
      this.currentDate = this.actualData.date;
    }

    // Calcular la diferencia entre el valor actual y el último valor de heartRateData
    const difference = Math.abs(this.actualData.heart - this.heartRateData[this.heartRateData.length - 1]);

    if ( difference >=10) {
      this.isStabilizing = true;
    } else {
      this.isStabilizing = false;
    }


    console.log("⬛ TEMP: ", this.actualData.temperatura)
    console.log("⬛ HUMY: ", this.actualData.humedad)
    console.log("⬛ AIR TVOC: ", this.actualData.airquality.TVOC)
    console.log("⬛ AIR ECO2: ", this.actualData.airquality.eCO2)
    console.log("⬛ HEART: ", this.actualData.heart)
    console.log("⬛ DATE: ", this.actualData.date)

    this.setSensorChartData(this.actualData);
  };

  setSensorChartData(actualData: any) {
    const heartRateData = this.generateHeartRateData();
    const airQualityData = this.generateAirQualityData();
    const humidityTemperatureData = this.generateHumidityTemperatureData();

    this.updateCharts({
      heartRateData,
      airQualityData,
      humidityTemperatureData
    });
  };

  generateHeartRateData(): any {
    console.log("heart rate data", this.heartRateData)
    console.log("heart rate data actual", this.actualData.heart)
    // Desplazar los valores existentes hacia la derecha
    for (let i = this.heartRateData.length - 1; i >= 0; i--) {
      if (i === 0) {
        // Sobrescribir el primer elemento con el nuevo valor de calidad del aire
        this.heartRateData[i] = this.actualData.heart;
      } else if (this.actualData.heart > 160) {
        this.heartRateData[i] = 160;
      }
      else {
        // Mover el valor del índice anterior al índice actual
        this.heartRateData[i] = this.heartRateData[i - 1];
      }
    }

    // Eliminar el último elemento si la longitud del array excede el número deseado de elementos
    if (this.heartRateData.length > 12) {
      this.heartRateData.pop(); // elimina el último item
    }

    return this.heartRateData;
  }



  generateAirQualityData(): any {
    // Shift existing values to the right
    for (let i = this.airQualityData.TVOC.length - 1; i >= 0; i--) {
      if (i === 0) {
        // Overwrite the first element with the new air quality value
        this.airQualityData.TVOC[i] = this.actualData.airquality.TVOC;
      } else {
        // Move the value from the previous index to the current index
        this.airQualityData.TVOC[i] = this.airQualityData.TVOC[i - 1];
      }
    }

    for (let i = this.airQualityData.eCO2.length - 1; i >= 0; i--) {
      if (i === 0) {
        // Overwrite the first element with the new air quality value
        this.airQualityData.eCO2[i] = this.actualData.airquality.eCO2;
      } else {
        // Move the value from the previous index to the current index
        this.airQualityData.eCO2[i] = this.airQualityData.eCO2[i - 1];
      }
    }

    // Remove the last item if the array length exceeds the desired number of items
    if (this.airQualityData.TVOC.length > 24) {
      this.airQualityData.TVOC.pop(); // Remove the last item
    }
    if (this.airQualityData.eCO2.length > 24) {
      this.airQualityData.eCO2.pop(); // Remove the last item
    }

    console.log(this.airQualityData)
    return this.airQualityData;
  }

  generateHumidityTemperatureData(): any {
    // Shift existing values to the right
    for (let i = this.tyhData.temperature.length - 1; i >= 0; i--) {
      if (i === 0) {
        // Overwrite the first element with the new air quality value
        this.tyhData.temperature[i] = this.actualData.temperatura;
      } else {
        // Move the value from the previous index to the current index
        this.tyhData.temperature[i] = this.tyhData.temperature[i - 1];
      }
    }

    for (let i = this.tyhData.humidity.length - 1; i >= 0; i--) {
      if (i === 0) {
        // Overwrite the first element with the new air quality value
        this.tyhData.humidity[i] = this.actualData.humedad;
      } else {
        // Move the value from the previous index to the current index
        this.tyhData.humidity[i] = this.tyhData.humidity[i - 1];
      }
    }

    // Remove the last item if the array length exceeds the desired number of items
    if (this.tyhData.temperature.length > 24) {
      this.tyhData.temperature.pop(); // Remove the last item
    }
    if (this.tyhData.humidity.length > 24) {
      this.tyhData.humidity.pop(); // Remove the last item
    }

    return this.tyhData;
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
              display: false,
              text: 'Horas'
            }
          }
        }
      }
    });
  }

  initializeAirQualityChart() {
    const DATA_COUNT_AIR_QUALITY = 24;
    const labelsAirQuality = this.generateLabels(DATA_COUNT_AIR_QUALITY);
    const airQualityData = this.generateAirQualityData();

    const dataAirQuality = {
        labels: labelsAirQuality,
        datasets: [
            {
                label: 'TVOC',
                data: airQualityData.TVOC,
                borderColor: 'purple',
                backgroundColor: 'rgba(166, 0, 166, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'eCO2',
                data: airQualityData.eCO2,
                borderColor: 'grey',
                backgroundColor: 'rgba(166, 166, 166, 0.5)',
                yAxisID: 'y1',
            }
        ]
    };

    const configAirQuality: ChartConfiguration<'line'> = {
        type: 'line',
        data: dataAirQuality,
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: false,
                    text: 'Air Quality'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'ppb'
                    },
                    min: 0,
                    max: 1000
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
                        text: 'ppm'
                    },
                    min: 0,
                    max: 100
                },
                x: {
                    title: {
                        display: false,
                        text: 'Hours'
                    }
                }
            }
        }
    };

    this.airQualityChart = new Chart('air-quality', configAirQuality);
}



  initializeHumidityTemperatureChart() {
    const DATA_COUNT_HUMIDITY = 24;
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
            },
            min: 0,
            max: 45
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
            },
            min: 0,
            max: 100
          },
          x: {
            title: {
              display: false,
              text: 'Horas'
            }
          }
        }
      }
    };

    this.humidityChart = new Chart('humidity', configHumidity);
  }



  updateCharts(data: any) {
    this.updateHeartRateChart(data.heartRateData);
    this.updateAirQualityChart(data.airQualityData);
    this.updateHumidityTemperatureChart(data.humidityTemperatureData);
  }

  updateHeartRateChart(heartRateData: number[]) {
    this.heartRate = heartRateData[heartRateData.length - 1];
    this.updateBpmGradient();
    this.heartRateChart.data.labels = this.generateLabels(24); // Actualizar las etiquetas
    this.heartRateChart.data.datasets[0].data = heartRateData;
    this.heartRateChart.update();
    this.updateBpmIndicatorPosition(this.heartRate);
  }

  updateAirQualityChart(airQualityData: any) {
    const temperatureData = airQualityData.TVOC;
    const humidityData = airQualityData.eCO2;
    const labelsHumidity = this.generateLabels(temperatureData.length); // Utilizar la misma longitud que los datos de temperatura

    this.airQualityChart.data.labels = labelsHumidity; // Actualizar las etiquetas
    this.airQualityChart.data.datasets[0].data = temperatureData;
    this.airQualityChart.data.datasets[1].data = humidityData;
    this.airQualityChart.update();
  }

  updateHumidityTemperatureChart(humidityTemperatureData: any) {
    const temperatureData = humidityTemperatureData.temperature;
    const humidityData = humidityTemperatureData.humidity;
    const labelsHumidity = this.generateLabels(temperatureData.length); // Utilizar la misma longitud que los datos de temperatura

    this.humidityChart.data.labels = labelsHumidity; // Actualizar las etiquetas
    this.humidityChart.data.datasets[0].data = temperatureData;
    this.humidityChart.data.datasets[1].data = humidityData;
    this.humidityChart.update();
  }

  generateLabels(count: number): string[] {
    const labels = [];
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentSecond = currentTime.getSeconds();

    // Calcular el tiempo de inicio del último minuto
    const lastMinuteStart = new Date(currentTime);
    lastMinuteStart.setSeconds(currentSecond);
    lastMinuteStart.setMilliseconds(0);
    lastMinuteStart.setMinutes(currentMinute);
    lastMinuteStart.setHours(currentHour);


    // Agregar las etiquetas de los 60 intervalos de un segundo
    for (let i = 11; i >= 0; i--) {
      const time = new Date(lastMinuteStart.getTime() - i * 60 * 1000);
      const hour = time.getHours();
      const minute = time.getMinutes();
      const second = time.getSeconds();
      const formattedHour = hour < 10 ? '0' + hour : hour.toString();
      const formattedMinute = minute < 10 ? '0' + minute : minute.toString();
      const formattedSecond = second < 10 ? '0' + second : second.toString();
      labels.push(`${""} ${""} ${""}`);
    }

    return labels;
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
            title: {
              display: true,
              text: 'µg/m³'
            }
          },
          x: {
            title: {
              display: false,
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
