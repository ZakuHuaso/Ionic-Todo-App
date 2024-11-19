import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../shared/supabase.service';

export interface Profile {
  username: string
  email: string
  avatar_url: string
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private supabase = inject(SupabaseService).supabaseClient;

  constructor() {
    this.supabase.auth.onAuthStateChange((session) => {
      console.log(session);
    });
  }

  session(){
    return this.supabase.auth.getSession();
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

}









  /*
  


} */