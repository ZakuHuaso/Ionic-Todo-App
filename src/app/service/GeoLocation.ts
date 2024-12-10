import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from './StorageService';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private storageService: StorageService) {}

  // 1. Función para obtener la ubicación actual
  async getLocation(): Promise<any> {
    try {
      const position = await Geolocation.getCurrentPosition();
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
      };
      
      
      return locationData;
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      return null; // Devuelve null en caso de error
    }
  }

  // Función para guardar la ubicación
  async saveLocationCasa(locationData: any): Promise<void> {
    try {
      await this.storageService.set('Ubicacion Casa', locationData);
      console.log('Ubicación guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la ubicación:', error);
    }
  }

  // Función para guardar la ubicación
  async saveLocationUni(locationData: any): Promise<void> {
    try {
      await this.storageService.set('Ubicacion Casa', locationData);
      console.log('Ubicación guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la ubicación:', error);
    }
  }
  
  

  // Función para recuperar la ubicación guardada
  async getSavedLocation() {
    try {
      const savedLocation = await this.storageService.get('savedLocation');
      if (savedLocation) {
        console.log('Ubicación recuperada:', savedLocation);
        return savedLocation;
      } else {
        console.log('No se encontró ubicación guardada');
        return null;
      }
    } catch (error) {
      console.error('Error al recuperar la ubicación:', error);
      return null;
    }
  }

  // Función para eliminar la ubicación guardada
  async removeSavedLocation() {
    try {
      await this.storageService.remove('savedLocation');
      console.log('Ubicación eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la ubicación:', error);
    }
  }
}