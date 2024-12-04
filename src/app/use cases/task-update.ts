import { Injectable } from '@angular/core';
import { NotesServices, Note } from '../service/notes.service';

@Injectable({
  providedIn: 'root'
})
export class TaskUpdateUseCase {
  constructor(private notesService: NotesServices) {}

  async updateTaskStatus(noteId: string, newStatus: number): Promise<Note | null> {
    try {
      const updatedNote = await this.notesService.updateNote(noteId, { task_status: newStatus });
      if (updatedNote) {
        console.log('Tarea actualizada exitosamente:', updatedNote);
        return updatedNote;
      } else {
        console.log('No se pudo actualizar la tarea');
        return null;
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error);
      return null;
    }
  }
}

