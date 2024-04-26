#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include "ScioSense_ENS160.h"
#include <PulseSensorPlayground.h>

#define SENSOR_BUS 2  // Define the bus number for the sensor

Adafruit_AHTX0 aht;
ScioSense_ENS160 ens160(ENS160_I2CADDR_1);  // Use the second bus (0x53)
PulseSensorPlayground pulseSensor;

int tempC;     // Temperature in Celsius
int tempF;     // Temperature in Fahrenheit
int humidity;  // Humidity
int heartRate;

const int PULSE_INPUT = A0;
const int PULSE_BLINK = 13;    
const int PULSE_FADE = 5;
const int THRESHOLD = 685;

void TCA9548A(uint8_t bus) {
  Wire.beginTransmission(0x70);  // TCA9548A address
  Wire.write(1 << bus);          // send byte to select bus
  Wire.endTransmission();
}

void setup() {
  Serial.begin(115200);

  analogReadResolution(10);

  pulseSensor.analogInput(PULSE_INPUT);
  pulseSensor.blinkOnPulse(PULSE_BLINK);
  pulseSensor.fadeOnPulse(PULSE_FADE);
  pulseSensor.setSerial(Serial);
  pulseSensor.setThreshold(THRESHOLD);

  if (!pulseSensor.begin()) {
    while(1) {
/*  If the pulseSensor object fails, flash the led  */
      digitalWrite(PULSE_BLINK, LOW);
      delay(50);
      digitalWrite(PULSE_BLINK, HIGH);
      delay(50);
    }
  }

  Wire.begin();
  while (!Serial) {}

  Serial.println("------------------------------------------------------------");
  Serial.println("ENS160 - Digital air quality sensor");
  Serial.println();
  Serial.println("Sensor readout in standard mode");
  Serial.println("------------------------------------------------------------");
  delay(1000);


  TCA9548A(SENSOR_BUS);  // Select bus 2

  Serial.print("ENS160...");
  ens160.begin();
  Serial.println(ens160.available() ? "done." : "failed!");

  if (ens160.available()) {
    Serial.print("\tRev: ");
    Serial.print(ens160.getMajorRev());
    Serial.print(".");
    Serial.print(ens160.getMinorRev());
    Serial.print(".");
    Serial.println(ens160.getBuild());

    Serial.print("\tStandard mode ");
    Serial.println(ens160.setMode(ENS160_OPMODE_STD) ? "done." : "failed!");
  }

  Serial.println("Adafruit AHT10/AHT20 demo!");
  if (!aht.begin()) {
    Serial.println("Could not find AHT? Check wiring");
    while (1) delay(10);
  }
  Serial.println("AHT10 or AHT20 found");
}

void loop() {
  Serial.println("-------------------------");

  TCA9548A(SENSOR_BUS);  // Select bus 2

  // Read temperature and humidity from AHT21 sensor
  sensors_event_t humidity1, temp;
  aht.getEvent(&humidity1, &temp);
  tempC = temp.temperature;
  tempF = temp.temperature * 1.8 + 32;
  humidity = humidity1.relative_humidity;

  Serial.print("Temperature: ");
  Serial.print(tempC);
  Serial.println(" degrees C");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println("% rH");

  // If ENS160 sensor is available, read air quality values
  if (ens160.available()) {
    ens160.set_envdata(tempC, humidity);
    ens160.measure(true);
    ens160.measureRaw(true);

    Serial.print("AQI: ");
    Serial.print(ens160.getAQI());
    Serial.print("\t");
    Serial.print("TVOC: ");
    Serial.print(ens160.getTVOC());
    Serial.print("ppb\t");
    Serial.print("eCO2: ");
    Serial.print(ens160.geteCO2());
    Serial.println("ppm\t");
  }

  if (pulseSensor.sawStartOfBeat()) {
    heartRate = pulseSensor.getBeatsPerMinute();
    Serial.print("Heart Rate: ");
    Serial.println(heartRate);
  }
  else
  {
    Serial.print("Heart Rate: ");
    heartRate = 0;
    Serial.println(heartRate);
  }

  delay(1000);
}
