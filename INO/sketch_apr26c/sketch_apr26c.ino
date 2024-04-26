
#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Arduino_JSON.h>

#include <Adafruit_AHTX0.h>
#include "ScioSense_ENS160.h"
#define USE_ARDUINO_INTERRUPTS true // Definir la variable antes de incluir el archivo de cabecera
#include <PulseSensorPlayground.h>
PulseSensorPlayground pulseSensor;
JSONVar pulseData;

#define SENSOR_BUS 2  // Define the bus number for the sensors

Adafruit_AHTX0 aht;
ScioSense_ENS160 ens160(ENS160_I2CADDR_1);  // Use the second bus (0x53)


int tempC;     // Temperature in Celsius
int tempF;     // Temperature in Fahrenheit
int humidity;  // Humidity
int TVOC;
int eCO2;
int heartRate;

const int PULSE_INPUT = A0;
const int PULSE_BLINK = 13;    
const int PULSE_FADE = 5;
const int THRESHOLD = 685;   

/*  Replace with your network credentials  */
const char* ssid = "moi";
const char* password = "MOI21052000";

void TCA9548A(uint8_t bus) {
  Wire.beginTransmission(0x70);  // TCA9548A address
  Wire.write(1 << bus);          // send byte to select bus
  Wire.endTransmission();
}

AsyncWebServer server(80);
AsyncEventSource events("/events");

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="data:,">
      <style>
    </style>
  </head>
  <body>
      <h2>PulseSensor Server</h2>
      <p 
        <span class="reading"> Heart Rate</span>
        <span id="bpm"></span>
        <span class="dataType">bpm</span>
      </p> 
  </body>
<script>
window.addEventListener('load', getData);

function getData(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var Jobj = JSON.parse(this.responseText);
      console.log(Jobj);
      document.getElementById("bpm").innerHTML = Jobj.heartrate;
    }
  }; 
  xhr.open("GET", "/data", true);
  xhr.send();
}

if (!!window.EventSource) {
  var source = new EventSource('/events');

  source.addEventListener('open', function(e) {
    console.log("Events Connection");
  }, false);

  source.addEventListener('error', function(e) {
    if (e.target.readyState != EventSource.OPEN) {
      console.log("Events Disconnection");
    }
  }, false);

  source.addEventListener('new_data', function(e) {
    var Jobj = JSON.parse(e.data);
    putData(Jobj);
  }, false);
}


      function putData(C) {
        var currentDate = new Date();
        var formattedDate = currentDate.toISOString();
        var updateData = {
          data: Jobj,
          date: formattedDate
        };

        // Make PUT request
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', 'http://34.175.187.252:3000/sensor-data', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(updateData));
      }

</script>
</html>)rawliteral";

/*  Package the BPM in a JSON object  */
String updatePulseDataJson(){
  String formattedData = "";
  formattedData += String(tempC);
  formattedData += "//";
  formattedData += String(humidity);
  formattedData += "//";
  formattedData += String(TVOC);
  formattedData += "//";
  formattedData += String(eCO2);
  formattedData += "//";
  formattedData += String(pulseSensor.getBeatsPerMinute());
  String jsonString = JSON.stringify(pulseData);
  return jsonString;
}


/* 
    Begin the WiFi and print the server url
    to the serial port on connection
*/
void beginWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Attempting to connect to ");
  Serial.print(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(" ~");
    delay(1000);
  }
  Serial.println("\nConnected");
}

boolean sendPulseSignal = false;

void setup() {

  Serial.begin(115200);
  delay(1500); 
  beginWiFi();

  analogReadResolution(10);
  
  pulseSensor.analogInput(PULSE_INPUT);
  pulseSensor.blinkOnPulse(PULSE_BLINK);
  pulseSensor.fadeOnPulse(PULSE_FADE);
  pulseSensor.setSerial(Serial);
  pulseSensor.setThreshold(THRESHOLD);

  if (!pulseSensor.begin()) {
    while(1) {
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

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/html", index_html); 
  });

  server.on("/data", HTTP_GET, [](AsyncWebServerRequest *request) {
    String json = updatePulseDataJson();
    request->send(200, "application/json", json);
    json = String();
  });

  events.onConnect([](AsyncEventSourceClient *client) {
    if(!sendPulseSignal){
      if(client->lastId()){
        Serial.println("Client Reconnected");
      } else {
        Serial.println("New Client Connected");
      }
    }
    client->send("hello", NULL, millis(), 20000);
  });
  
  server.addHandler(&events);
  server.begin();
  printControlInfo();
  
}

void loop() {

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
    TVOC = ens160.getTVOC();
    Serial.print(ens160.getTVOC());
    Serial.print("ppb\t");
    Serial.print("eCO2: ");
    eCO2 = ens160.geteCO2();
    Serial.print(ens160.geteCO2());
    Serial.println("ppm\t");
  }

  if(sendPulseSignal){
    delay(1000);
    Serial.println(pulseSensor.getLatestSample());
  }

  if (pulseSensor.sawStartOfBeat()) {
    events.send(updatePulseDataJson().c_str(),"new_data" ,millis());
    if(!sendPulseSignal){
      Serial.print(pulseSensor.getBeatsPerMinute());
      Serial.println(" bpm");
    }
  }
  else
  {
    Serial.print("Heart Rate: ");
    heartRate = 100;
    Serial.println(heartRate);
  }

  serialCheck();
}

/*
    This function checks to see if there are any commands available
    on the Serial port. When you send keyboard characters 'b' or 'x'
    you can turn on and off the signal data stream.
*/
void serialCheck(){
  if(Serial.available() > 0){
    char inChar = Serial.read();
    switch(inChar){
      case 'b':
        sendPulseSignal = true;
        break;
      case 'x':
        sendPulseSignal = false;
        break;
      case '?':
        if(!printControlInfo){
          printControlInfo();
        }
        break;
      default:
        break;
    }
  }
}

/*
    This function prints the control information to the serial monitor
*/
void printControlInfo(){
  Serial.println("PulseSensor ESP32 Example");
  Serial.print("\nPulseSensor Server url: ");
  Serial.println(WiFi.localIP());
  Serial.println("Send 'b' to begin sending PulseSensor signal data");
  Serial.println("Send 'x' to stop sendin PulseSensor signal data");
  Serial.println("Send '?' to print this message");
}


