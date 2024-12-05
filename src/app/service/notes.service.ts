import { Injectable } from '@angular/core';

import { SupabaseService } from '../shared/supabase.service';
import { AuthService } from './auth.service';

export interface Note {
  id: string;
  task_name: string;
  task_desc: string | null;
  task_status: number;
  task_date: Date;
  user_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotesServices {
  private basePath = 'task';

  constructor(
    private authService: AuthService,
    private supabase: SupabaseService
  ) {}

  // === Leer todas las tareas ===
  async getAllNotes() {
    const { data: session, error: sessionError } =
      await this.authService.session();

    if (sessionError) {
      console.error('Error obteniendo sesión:', sessionError);
      return null;
    }

    if (!session || !session.session) {
      console.error('No hay usuario en sesión.');
      return null;
    }

    const userId = session.session.user.id;

    console.log('Usuario:', userId);
    const { data, error } = await this.supabase.supabaseClient
      .from(this.basePath)
      .select('*')
      .eq('user_id', userId)
      .returns<Note[]>();

    if (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }

    return data || [];
  }

  // === Crear nueva tarea ===

  async addNote(
    task_name: string,
    task_desc: string | null,
    task_date: string
  ): Promise<Note | null> {
    try {
      const { data: session, error: sessionError } =
        await this.authService.session();

      if (sessionError) {
        throw new Error('Error obteniendo sesión: ' + sessionError.message);
      }

      if (!session || !session.session) {
        throw new Error('No hay usuario en sesión.');
      }

      const userId = session.session.user.id;

      const newNote = {
        task_date,
        task_name,
        task_desc,
        user_id: userId,
      };

      const { data, error } = await this.supabase.supabaseClient
        .from(this.basePath)
        .insert([newNote])
        .select(); // Solicitar datos insertados
      console.log('=== Intentando insertar nueva tarea ===');
      console.log('Datos a insertar:', newNote);
      console.log('Usuario en sesión:', userId);
      console.log('Tabla objetivo:', this.basePath);
      console.log('Resultado de la inserción:');
      console.log(' - Datos:', data);
      console.log(' - Error:', error);
      console.log(' - Status:', status);
      

      if (error) {
        throw new Error('Error al agregar la nota: ' + error.message);
      }

      return data && data.length > 0 ? (data[0] as Note) : null; // Retorna el primer elemento como Note
    } catch (error) {
      console.error('Ocurrió un error:', error.message);
      return null;
    }
  }

  // === Eliminar tarea ===

  async deleteNote(noteId: string): Promise<boolean> {
    try {
      const { data: session, error: sessionError } =
        await this.authService.session();

      if (sessionError) {
        throw new Error('Error obteniendo sesión: ' + sessionError.message);
      }

      if (!session || !session.session) {
        throw new Error('No hay usuario en sesión.');
      }

      const userId = session.session.user.id;
      console.log('Usuario:', userId);

      // Elimina la nota si user_id de la nota coincide con el user_id del usuario autenticado
      const { data, error } = await this.supabase.supabaseClient
        .from(this.basePath)
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) {
        throw new Error('Error al eliminar la nota: ' + error.message);
      }

      console.log('Nota eliminada exitosamente:', data);
      return true;
    } catch (error) {
      console.error('Ocurrió un error:', error.message);
      return false;
    }
  }

  // === Actualizar una tarea ===
  async updateNote(
    noteId: string,
    updatedFields: Partial<Note>
  ): Promise<Note | null> {
    try {
      // Obtener la sesión del usuario autenticado
      const { data: session, error: sessionError } =
        await this.authService.session();

      if (sessionError) {
        throw new Error('Error obteniendo sesión: ' + sessionError.message);
      }

      if (!session || !session.session) {
        throw new Error('No hay usuario en sesión.');
      }

      const userId = session.session.user.id;
      console.log('Usuario autenticado:', userId);

      // Actualizar la nota solo si pertenece al usuario autenticado
      const { data, error } = await this.supabase.supabaseClient
        .from(this.basePath)
        .update(updatedFields)
        .eq('id', noteId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error('Error al actualizar la nota: ' + error.message);
      }

      console.log('Nota actualizada exitosamente:', data);
      return data; // Devuelve la nota actualizada
    } catch (error) {
      console.error('Ocurrió un error:', error.message);
      return null;
    }
  }
}
