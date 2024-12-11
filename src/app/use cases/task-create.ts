import { Injectable } from '@angular/core';
import { NotesServices, Note } from '../service/notes.service';

@Injectable({
  providedIn: 'root'
})
export class TaskCreateUseCase {
  constructor(private notesService: NotesServices) {}

  async createTask(task_name: string, task_desc: string | null, task_date?: string, task_location?: string): Promise<Note | null> {
    try {
      // Verifica si se tiene una fecha, si no, utiliza la fecha actual.
      const date = task_date ? task_date : new Date().toISOString();

      // Ahora pasamos la fecha al servicio junto con el nombre y la descripción
      const newNote = await this.notesService.addNote(task_name, task_desc, date, task_location);

      if (newNote) {
        console.log('Tarea creada exitosamente:', newNote);
        return newNote;
      } else {
        console.log('No se pudo crear la tarea');
        return null;
      }
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      return null;
    }
  }
}
