import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Note, NotesServices } from 'src/app/service/notes.service';
import { IonDatetime } from '@ionic/angular';
import { TaskCreateUseCase } from 'src/app/use cases/task-create';

interface NoteForm {
  task_name: FormControl<string | null>;
  task_desc: FormControl<string | null>;
  task_date: FormControl<string | null>;
}

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.page.html',
  styleUrls: ['./new-task.page.scss'],
})

export class NewTaskPage implements OnInit {
  noteForm: FormGroup;
  dateExample = new Date().toISOString();

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private noteServices: NotesServices,
    private taskCreate: TaskCreateUseCase
  ) { }

  ngOnInit() {
    this.initForm();
  }

  selectedDate: string = '';
  selectedTime: string = '';

  initForm() {
    this.noteForm = this.fb.group<NoteForm>({
      task_name: this.fb.control(null, Validators.required),
      task_desc: this.fb.control(null),
      task_date: this.fb.control(null)
    });
  }

  async addNote() {
    if (this.noteForm.valid) {
      const { task_name, task_desc, task_date } = this.noteForm.value;
      const newNote = await this.taskCreate.createTask(task_name!, task_desc!, task_date!);
      
      if (newNote) {
        console.log('Tarea creada exitosamente:', newNote);
        this.router.navigate(['/home']);
      } else {
        console.error('Error al crear la tarea');
        // Here you might want to show an error message to the user
      }
    } else {
      console.log('Formulario inválido');
      // Here you might want to show validation errors to the user
    }
  }


}
