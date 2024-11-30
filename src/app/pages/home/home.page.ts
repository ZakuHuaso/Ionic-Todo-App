import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Note, NotesServices } from 'src/app/service/notes.service';


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
    private noteServices: NotesServices
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
    const allNotes = await this.noteServices.getAllNotes();
    if (allNotes) {
      this.notes = allNotes
        .filter(note => note.task_status !== 2)
        .slice(0, 5);
    }
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

  modifyTaskStatus(note: any) {
    /* 
    Primero, cambiar el task_status de la tabla task para evitar que aparezca en la vista Home. 
    Luego llamar al metodo Update del CRUD en note.service.ts
    */
    const newStatus = 2; 

    this.noteServices.updateNote(note.id, { task_status: newStatus }).then(() => {
      this.notes = this.notes.filter(n => n.id !== note.id);

    }).catch(error => {
      console.error('Error al completar la tarea:', error);
    });
  }

}
