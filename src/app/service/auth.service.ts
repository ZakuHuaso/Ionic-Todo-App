import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../shared/supabase.service';
import { StorageService } from './StorageService';


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
      return { data: { session: storedSession }, error: null };
    }
    return this.supabase.auth.getSession();
  }

  getCurrentUser(){
    return this.supabase.auth.getUserIdentities;
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
