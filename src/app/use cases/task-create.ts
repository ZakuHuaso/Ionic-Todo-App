import { Injectable } from '@angular/core';
import { NotesServices, Note } from '../service/notes.service';

@Injectable({
  providedIn: 'root'
})
export class TaskCreateUseCase {
  constructor(private notesService: NotesServices) {}

  async createTask(task_name: string, task_desc: string | null, task_date?: string): Promise<Note | null> {
    try {
      const newNote = await this.notesService.addNote(task_name, task_desc);
      if (newNote) {
        console.log('Tarea creada exitosamente:', newNote);
        return newNote;
      } else {
        console.log('No se pudo crear la tarea');
        return null;
      }
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      return null;
    }
  }
}

