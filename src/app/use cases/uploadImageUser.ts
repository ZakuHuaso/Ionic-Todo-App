import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class UploadImageUserUseCase {
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
}
