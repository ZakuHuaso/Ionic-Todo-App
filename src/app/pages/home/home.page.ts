import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Note, NotesServices } from 'src/app/service/notes.service';
import { TaskReadUseCase } from 'src/app/use cases/task-read';
import { TaskUpdateUseCase } from 'src/app/use cases/task-update';


interface NoteForm {
  task_name: FormControl<string | null>;
  task_desc: FormControl<string | null>;
  task_date: FormControl<Date | null>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  date: string = '';
  progress: number | 0;
  total: number = 5;

  noteForm: FormGroup;
  notes: Note[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private taskRead: TaskReadUseCase,
    private taskUpdate: TaskUpdateUseCase
  ) {

  }

  noteSelected: Note | null = null;


  form = this.fb.group<NoteForm>({
    task_name: this.fb.control(null, Validators.required),
    task_desc: this.fb.control(null),
    task_date: this.fb.control(null)
  })


  ngOnInit() {
    this.date = this.getFormattedDate();
    this.loadNotes();
  }

  getFormattedDate(): string {
    const today = new Date();
    return today.toLocaleDateString('es-ES', {

      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }


  async loadNotes() {
    this.isLoading = true;
    this.notes = await this.taskRead.getAllActiveTasks();
    this.isLoading = false;
  }

  async refreshNotes(event: any) {
    await this.loadNotes();
    event.target.complete();
  }

  editTask(note: Note) {
    this.noteSelected = note;
    this.router.navigate(['/edit-task'], { state: { note } });
  }

  async modifyTaskStatus(note: any) {
    /* 
    Primero, cambiar el task_status de la tabla task para evitar que aparezca en la vista Home. 
    Luego llamar al metodo Update del CRUD en note.service.ts
    */
    const newStatus = 2; 
    const updatedNote = await this.taskUpdate.updateTaskStatus(note.id, newStatus);
    if (updatedNote) {
      this.notes = this.notes.filter(n => n.id !== note.id);
    } else {
      console.error('Error al completar la tarea');
    }
  }

}
