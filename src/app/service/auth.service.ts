import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../shared/supabase.service';
import { StorageService } from './StorageService';
import { User } from '@supabase/supabase-js';


export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private supabase = inject(SupabaseService).supabaseClient;
  
  constructor(
    private storageService: StorageService
  ) {
    this.supabase.auth.onAuthStateChange((session) => {
      console.log(session);
    });
  }

  async session() {
    const storedSession = await this.storageService.get('user_session');
    if (storedSession) {
      return { data: { session: storedSession }, error: null }; // Asegura la misma estructura
    }
    
    const { data, error } = await this.supabase.auth.getSession();
    if (!error && data.session) {
      // Almacena la sesión obtenida en StorageService
      await this.storageService.set('user_session', data.session);
    }
    return { data, error };
  }

  async getCurrentUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error('Error obteniendo el usuario:', error.message);
      return { data: null, error };
    }
    return { data: data.user, error: null };  // Regresar el usuario directamente
  }

  // == Registro ===
  signUp(email: string, password: string){
    return this.supabase.auth.signUp({email,password});
    
  }

  // == Login ===
  signIn(email: string, password: string){
    return this.supabase.auth.signInWithPassword({email,password});
  }


  // === Login con Google ===
  signInGoogle(){

  }


  // === Cerrar Sesion ===
  signOut(){
    return this.supabase.auth.signOut();
  }

  // === Perfil de usuario ===
  getProfile(){
    return this.supabase.auth.getUser();
  }

}
