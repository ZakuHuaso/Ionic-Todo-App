import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ProfileService, Profile } from '../service/profile.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class UserRegisterUseCase {
  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  async execute(email: string, password: string, username: string): Promise<{ user: User; profile: Profile }> {
    try {
      const { data, error } = await this.authService.signUp(email, password);
      if (error) throw error;
      if (!data.user) throw new Error('El registro de usuario falló');

      let profile = await this.profileService.getProfile(data.user.id);

      if (!profile) {
        profile = await this.profileService.createProfile({
          id: data.user.id,
          username,
          email
        });
      } else {
        profile = await this.profileService.updateProfile({
          id: data.user.id,
          username
        });
      }

      return { user: data.user, profile };
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }
}

/* 
1. Registrar el usuario
2. Verificar si ya existe un perfil
3. Si no existe un perfil, crearlo
4. Si ya existe un perfil, actualizarlo con el nombre de usuario
*/