import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageUserUseCase } from '../use cases/ImageUser';
import { ProfileService } from 'src/app/service/profile.service';
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private ImageUserUseCase: ImageUserUseCase,
    private ProfileService: ProfileService
  ) {}

  async getImageFromCamera(userId: string): Promise<{ success: boolean; message: string; imageUrl?: string }> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (!image || !image.dataUrl) {
        return { success: false, message: 'No se pudo obtener la imagen de la cámara.' };
      }

      // Convertir dataUrl a File
      const file = this.dataUrlToFile(image.dataUrl, `camera-image-${Date.now()}.png`);
      return await this.uploadImage(userId, file);
    } catch (error) {
      console.error('Error al obtener la imagen de la cámara:', error);
      return { success: false, message: 'Error al obtener la imagen de la cámara.' };
    }
  }

  async getImageFromGallery(userId: string): Promise<{ success: boolean; message: string; imageUrl?: string }> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (!image || !image.dataUrl) {
        return { success: false, message: 'No se pudo obtener la imagen de la galería.' };
      }

      // Convertir dataUrl a File
      const file = this.dataUrlToFile(image.dataUrl, `gallery-image-${Date.now()}.png`);
      return await this.uploadImage(userId, file);
    } catch (error) {
      console.error('Error al obtener la imagen de la galería:', error);
      return { success: false, message: 'Error al obtener la imagen de la galería.' };
    }
  }

  private async uploadImage(userId: string, file: File): Promise<{ success: boolean; message: string; imageUrl?: string }> {
    try {
      const publicUrl = await this.ImageUserUseCase.execute(userId, file);

      if (publicUrl) {
        // Actualizar el perfil del usuario con la nueva URL
        const updateProfileResult = await this.ProfileService.updateProfile({
            id: userId,
            avatar_url: publicUrl, // Usa avatar_url en lugar de profileImageUrl
          });
        return { success: true, message: 'Imagen subida con éxito', imageUrl: publicUrl };
      } else {
        return { success: false, message: 'Error al subir la imagen.' };
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return { success: false, message: 'Error inesperado al subir la imagen.' };
    }
  }

  // Helper para convertir dataUrl a File
  private dataUrlToFile(dataUrl: string, fileName: string): File {
    const [mime, base64] = dataUrl.split(',');
    const byteString = atob(base64);
    const byteArray = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: mime.match(/:(.*?);/)?.[1] || 'image/png' });
    return new File([blob], fileName, { type: blob.type });
  }
}
