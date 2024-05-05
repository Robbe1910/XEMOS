import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private http: HttpClient) {}

  sendNotificationToDevice(token: string, sensorData: any): void {
    const notification = {
      to: token,
      notification: {
        title: 'New Sensor Data',
        body: `Temperature: ${sensorData.temperature}°C, Humidity: ${sensorData.humidity}%, TVOC: ${sensorData.tvoc} ppb, eCO2: ${sensorData.eco2} ppm, Heart Rate: ${sensorData.bpm}`
      },
      data: {
        temperature: sensorData.temperature,
        humidity: sensorData.humidity,
        tvoc: sensorData.tvoc,
        eco2: sensorData.eco2,
        bpm: sensorData.bpm
      }
    };

    // Send notification using HTTP request to Firebase Cloud Messaging (FCM) API
    this.http.post('https://fcm.googleapis.com/fcm/send', notification, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAAPJsmQv0:APA91bHgOm6kp7kYhoAan3VogEpskvTH_Lot0M-bI1R18K6WumXwLTkByOQ1NGSG7TFz5HHjdDZyXESggQyhg4Ic9IOy008N9VZl6igU6jbYVUA23HVolko88AqKsJAWhyzGXAZqvjZ4' 
      }
    }).subscribe(
      (response) => {
        console.log('Notification sent successfully:', response);
      },
      (error) => {
        console.error('Error sending notification:', error);
      }
    );
  }

  showNotification(message: string) {
    // Show notification using the Web Notifications API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message);
    }
  }
}
