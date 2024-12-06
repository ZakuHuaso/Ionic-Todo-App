import { Component, OnInit } from '@angular/core';
import { GeolocationService } from 'src/app/service/GeoLocation';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.page.html',
  styleUrls: ['./edit-tag.page.scss'],
})
export class EditTagPage implements OnInit {
  locationData: any = null;

  constructor(
    private geolocationService: GeolocationService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadSavedLocation();
  }

  async loadSavedLocation() {
    this.locationData = await this.geolocationService.getSavedLocation();
  }

  async getAndSaveLocation() {
    try {
      const locationData = await this.geolocationService.getLocation();
      if (locationData) {
        this.locationData = locationData;
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
      color: color
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
}
