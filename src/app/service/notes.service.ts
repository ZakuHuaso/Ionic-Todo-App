import { Injectable } from '@angular/core';

import { SupabaseService } from '../shared/supabase.service';
import { AuthService } from './auth.service';

export interface Note {
    id: string;
    task_name: string;
    task_desc: string | null;
    user_id: string;
  }


@Injectable({
  providedIn: 'root',
})
export class NotesServices {

  private basePath = 'notes';

  constructor(
    private authService: AuthService,
    private supabase : SupabaseService
  ){}
  
  
  // === Leer todas las notas ===
  async getAllNotes(){
    const { data: session, error: sessionError } = await this.authService.session();
    
    if (sessionError) {
        console.error("Error obteniendo sesión:", sessionError);
        return null;
      }

    if (!session || !session.session) {
        console.error("No hay usuario en sesión.");
        return null;
    }

    const userId = session.session.user.id;

    console.log('Usuario:',userId);
    const { data, error } = await this.supabase.supabaseClient
      .from(this.basePath) // Cambia 'items' por la tabla que necesitas
      .select('*')
      .eq('user_id', userId) // Suponiendo que la tabla 'items' tiene un campo 'user_id'
      .returns<Note[]>();

    if (error) {
        console.error("Error obteniendo datos del usuario:", error);
        return null;
    }

    return data || [];
  }

  // === Crear nueva nota === 

  async addNote(task_name: string, task_desc: string | null) {
    try {
      // Obtener la sesión del usuario autenticado
      const { data: session, error: sessionError } = await this.authService.session();
  
      if (sessionError) {
        throw new Error("Error obteniendo sesión: " + sessionError.message);
      }
  
      if (!session || !session.session) {
        throw new Error("No hay usuario en sesión.");
      }
  
      const userId = session.session.user.id;
      console.log('Usuario:', userId);
  
      // Crear el objeto de la nueva nota
      const newNote = {
        task_name,
        task_desc,
        user_id: userId,
      };
  
      // Insertar la nueva nota en la tabla 'notes'
      const { data, error } = await this.supabase.supabaseClient
        .from('notes')
        .insert([newNote]);
  
      if (error) {
        throw new Error("Error al agregar la nota: " + error.message);
      }
  
      console.log('Nota agregada exitosamente:', data);
      return data; // Devuelve la nota agregada, si necesitas hacer algo con ella.
  
    } catch (error) {
      console.error("Ocurrió un error:", error.message);
      return null;
    }
  }
  
  // === Eliminar nota ===

  async deleteNote(noteId: string): Promise<boolean> {
    try {
      const { data: session, error: sessionError } = await this.authService.session();
  
      if (sessionError) {
        throw new Error("Error obteniendo sesión: " + sessionError.message);
      }
  
      if (!session || !session.session) {
        throw new Error("No hay usuario en sesión.");
      }
  
      const userId = session.session.user.id;
      console.log('Usuario:', userId);
  
      // Eliminar la nota solo si el user_id de la nota coincide con el user_id del usuario autenticado
      const { data, error } = await this.supabase.supabaseClient
        .from('notes')
        .delete()
        .eq('id', noteId) 
        .eq('user_id', userId); 
  
      if (error) {
        throw new Error("Error al eliminar la nota: " + error.message);
      }
  
      console.log('Nota eliminada exitosamente:', data);
      return true; 
  
    } catch (error) {
      console.error("Ocurrió un error:", error.message);
      return false; 
    }
  }
  

  // === Actualizar una nota ===
  async updateNote(noteId: string, updatedFields: Partial<Note>): Promise<Note | null> {
    try {
      // Obtener la sesión del usuario autenticado
      const { data: session, error: sessionError } = await this.authService.session();
  
      if (sessionError) {
        throw new Error("Error obteniendo sesión: " + sessionError.message);
      }
  
      if (!session || !session.session) {
        throw new Error("No hay usuario en sesión.");
      }
  
      const userId = session.session.user.id;
      console.log('Usuario autenticado:', userId);
  
      // Actualizar la nota solo si pertenece al usuario autenticado
      const { data, error } = await this.supabase.supabaseClient
        .from('notes')
        .update(updatedFields) // Actualizamos solo los campos especificados
        .eq('id', noteId) // Aseguramos que el id de la nota coincide
        .eq('user_id', userId) // Aseguramos que la nota pertenece al usuario autenticado
        .select()
        .single(); // Retornamos el objeto actualizado como un solo registro
  
      if (error) {
        throw new Error("Error al actualizar la nota: " + error.message);
      }
  
      console.log('Nota actualizada exitosamente:', data);
      return data; // Devuelve la nota actualizada
  
    } catch (error) {
      console.error("Ocurrió un error:", error.message);
      return null; 
    }
  }  

}
