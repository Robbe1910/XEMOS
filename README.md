# Proyecto XEMOS

## Índice
- [Proyecto XEMOS](#proyecto-xemos)
  - [Índice](#índice)
  - [Descripción del proyecto y objetivos](#descripción-del-proyecto-y-objetivos)
  - [Justificación](#justificación)
  - [Descripción técnica y medios a utilizar](#descripción-técnica-y-medios-a-utilizar)
  - [Guía de instalación](#guía-de-instalación)
  - [Comandos de construcción](#comandos-de-construcción)
  - [Cambiar icono de la app](#cambiar-icono-de-la-app)

## Descripción del proyecto y objetivos

La idea principal del proyecto es desarrollar un cubo que integre diversos sensores, como temperatura y humedad, mostrando los datos recopilados en cada una de sus caras. Además, se planea desarrollar una aplicación complementaria que se conecte al cubo a través de WiFi, proporcionando funcionalidades adicionales.

## Justificación

La motivación principal para este proyecto es participar en las Olimpiadas de Telecomunicaciones, cuyo enfoque está en la salud este año. La intención es que el cubo pueda utilizarse en entornos como hospitales o residencias para monitorizar el ambiente de las habitaciones. Los responsables podrán acceder a los datos recopilados a través de la aplicación y ajustar las condiciones del entorno según sea necesario.

## Descripción técnica y medios a utilizar

El proyecto utilizará una variedad de hardware, incluyendo sensores, pantallas y baterías. A continuación se detallan los componentes:
- LilyGO T7-S3 ESP32-S3
- ENS160 + AHT21
- Batería de litio
- Pantalla OLED
- Sensor de pulso
- TCA9548A (Multiplexor I2C)
- TTP223

En cuanto al software, se utilizará inicialmente Ionic Angular para desarrollar la aplicación.

## Guía de instalación

Antes de comenzar, es necesario tener instalado Cordova (npm install -g @ionic/cli cordova
) y Android Studio para configurar el SDK. A continuación se detallan los pasos necesarios:

1. **Configuración del SDK de Android**:
   - Instala Android Studio.
   - Configura la variable de entorno `ANDROID_HOME` para que apunte al directorio raíz del SDK de Android.(Normalmente en tu carpeta AppData en tu carpeta de usuaria, es una carpeta oculta, algo así C:\Users\rober\AppData\Local\Android\Sdk)
   - Verifica que la variable `PATH` incluya la ruta al directorio `platform-tools` dentro del SDK de Android.(C:\Users\rober\AppData\Local\Android\Sdk\platform-tools)

2. **Instalación del JDK 11**:
   - Descarga e instala el JDK 11 desde [el sitio web oficial de Oracle](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html).
   - Configura la variable de entorno `JAVA_HOME` para que apunte al directorio de instalación del JDK.(C:\Program Files\Java\jdk-11)

3. **Instalación de Gradle**:
   - Descarga Gradle desde [el sitio web oficial](https://gradle.org/releases/?_gl=1*1so3t6a*_ga*MTA5MDEwODQyMS4xNzEzNDg1OTcx*_ga_7W7NC6YNPT*MTcxMzQ4NTk3Mi4xLjEuMTcxMzQ4NTk4NS40Ny4wLjA).
   - Descomprime el archivo descargado en una ubicación de tu elección y configura la variable de entorno `GRADLE_HOME`.(C:\Program Files\gradle-8.7)
   - Agrega la ruta al directorio bin de Gradle a la variable de entorno `PATH`.(C:\Program Files\gradle-8.7\bin)

4. **Instalación de las herramientas de compilación de Android**:
   - Abre Android Studio y ve a "Tools" > "SDK Manager".
   - En la pestaña "SDK Tools", busca e instala las "Android SDK Build-Tools" versión 33.0.2.(Marca la opción Show package details)
   - Asegúrate de que la ruta al directorio que contiene estas herramientas esté incluida en la variable de entorno `PATH`.(C:\Program Files\Java\jdk-11\bin)

5. **Reiniciar el ordenador**:
   - Reinicia el ordenador para que se actualicen todas las variables de entorno

## Comandos de construcción

Para construir la aplicación, sigue estos pasos:

1. Desde la carpeta XEMOS del proyecto, ejecuta el siguiente comando para construir la aplicación de Android:
   ionic cordova build android --prod --release
2. Ejecuta los siguientes comandos desde la carpeta raíz para crear el archivo de paquete (APK):
    java -jar bundletool-all-1.15.6.jar build-apks \
    --bundle=XEMOS/platforms/android/app/build/outputs/bundle/release/app-release.aab \
    --output=XEMOS/platforms/android/app/build/outputs/bundle/release/apk/xemos.apks \
    --ks=my-release-key.jks \
    --ks-pass=pass:admin1234 \
    --ks-key-alias=xemos \
    --key-pass=pass:admin1234 \
    --mode=universal
3. Finalmente, extrae los archivos APK del paquete generado:
    java -jar bundletool-all-1.15.6.jar extract-apks \
    --apks=XEMOS/platforms/android/app/build/outputs/bundle/release/apk/xemos.apks \
    --output-dir=XEMOS/platforms/android/app/build/outputs/bundle/release/apk \
    --device-spec=device-spec.json

## Cambiar icono de la app

1. En la carpeta resources pones el icon.png de 1024x1024
2. Ejecutas ionic cordova resources --icon para que se actualicen todos los iconos
