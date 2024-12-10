import { Component, OnInit } from '@angular/core';
import { GeolocationService } from 'src/app/service/GeoLocation';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/service/StorageService';
@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.page.html',
  styleUrls: ['./edit-tag.page.scss'],
})
export class EditTagPage implements OnInit {
  locationData: any = null;
  Tag: string;
  BotonMapa: any = null;
  constructor(
    private geolocationService: GeolocationService,
    private toastController: ToastController,
    private StorageService: StorageService
  ) {}

  async ngOnInit() {
    this.Tag = await this.StorageService.get('TAG');
  }

  async getAndSaveLocationCasa() {
    try {
      // Espera a que la promesa se resuelva y obtener los datos de la ubicación
      const locationData = await this.geolocationService.getLocation();
  
      if (locationData) {
        console.log('Ubicación obtenida:', locationData); // Verifica si la ubicación se obtiene correctamente
        this.locationData = locationData; // Asigna la ubicación obtenida
        await this.geolocationService.saveLocationCasa(locationData);
        await this.presentToast('Ubicación guardada correctamente');
      } else {
        await this.presentToast('No se pudo obtener la ubicación', 'danger');
      }
    } catch (error) {
      console.error('Error al obtener y guardar la ubicación:', error);
      await this.presentToast('Error al guardar la ubicación', 'danger');
    }
  }

  async removeLocation() {
    try {
      await this.geolocationService.removeSavedLocation();
      this.locationData = null;
      await this.presentToast('Ubicación eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la ubicación:', error);
      await this.presentToast('Error al eliminar la ubicación', 'danger');
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }

  openInGoogleMaps() {
    if (this.locationData) {
      const { latitude, longitude } = this.locationData;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else {
      this.presentToast('No hay ubicación guardada para mostrar', 'warning');
    }
  }

  getAndSave() {
    console.log('Tag seleccionado:', this.Tag);
    const TAGGET = this.Tag;

    if (TAGGET === 'Casa') {
      this.getAndSaveLocationCasa();
      
      
      console.log('Ubicacion de Casa guardada');
    } if (TAGGET === 'Estudio') {
      console.log('Ubicacion de estudio guardada');
    } if (TAGGET === 'Ocio') {
      console.log('Ubicacion de Ocio guardada');
    }
  }
}
