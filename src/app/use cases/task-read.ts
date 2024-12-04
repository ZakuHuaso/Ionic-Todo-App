import { Injectable } from '@angular/core';
import { NotesServices, Note } from '../service/notes.service';

@Injectable({
  providedIn: 'root'
})
export class TaskReadUseCase {
  constructor(private notesService: NotesServices) {}

  async getAllActiveTasks(): Promise<Note[]> {
    try {
      const allNotes = await this.notesService.getAllNotes();
      if (allNotes) {
        return allNotes
          .filter(note => note.task_status !== 2)
          .slice(0, 5);
      }
      return [];
    } catch (error) {
      console.error("Error fetching active tasks:", error);
      return [];
    }
  }

  async updateTaskStatus(noteId: string, newStatus: number): Promise<boolean> {
    try {
      const updatedNote = await this.notesService.updateNote(noteId, { task_status: newStatus });
      return !!updatedNote;
    } catch (error) {
      console.error("Error updating task status:", error);
      return false;
    }
  }
}

