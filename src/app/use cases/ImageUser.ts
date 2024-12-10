import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ImageUserUseCase {
  constructor(private supabaseService: SupabaseService) {}

  async execute(userId: string, file: File): Promise<string | null> {
    try {
      const filePath = `profile-pictures/${userId}/${file.name}`;
      const { data, error } = await this.supabaseService.supabaseClient.storage
        .from('avatars') // Asegúrate de que el bucket 'avatars' exista
        .upload(filePath, file, { upsert: true });
      
      if (error) {
        console.error('Error uploading image:', error.message);
        return null;
      }

      // Obtener URL pública de la imagen
      const { data: publicUrlData } = this.supabaseService.supabaseClient.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrlData?.publicUrl || null;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }                         
  }

  // Método para obtener la foto de perfil actual
  async getProfileImage(userId: string): Promise<string | null> {
    try {
      const filePath = `profile-pictures/${userId}/`; // Ruta donde se almacena la imagen

      // Obtener todas las imágenes de la carpeta del usuario
      const { data, error } = await this.supabaseService.supabaseClient.storage
        .from('avatars')
        .list(filePath);

      if (error) {
        console.error('Error getting profile image:', error.message);
        return null;
      }

      // Verificar si hay imágenes en la carpeta del usuario
      if (data && data.length > 0) {
        // Obtener la URL pública de la primera imagen (puedes cambiar esto si deseas obtener alguna imagen específica)
        const imageName = data[0].name; // Aquí puedes ajustar si tienes varias imágenes o si deseas elegir una en particular
        const { data: publicUrlData } = this.supabaseService.supabaseClient.storage
          .from('avatars')
          .getPublicUrl(`${filePath}${imageName}`);

        return publicUrlData?.publicUrl || null;
      }

      console.log('No se encontró una foto de perfil para el usuario.');
      return null;
    } catch (error) {
      console.error('Unexpected error getting profile image:', error);
      return null;
    }
  }

}
