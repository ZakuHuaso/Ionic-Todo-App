import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { Note, NotesServices } from 'src/app/service/notes.service';

interface NoteForm {
  task_name: FormControl<string | null>;
  task_desc: FormControl<string | null>;
}

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.page.html',
  styleUrls: ['./edit-task.page.scss'],
})
export class EditTaskPage implements OnInit {
  noteForm: FormGroup;
  dateExample = new Date().toISOString();
  noteSelected: Note | undefined;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private noteServices: NotesServices
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.noteSelected = navigation.extras.state['note'];
      console.log('Nota seleccionada:', this.noteSelected);
    }
  }

  form = this.fb.group<NoteForm>({
    task_name: this.fb.control(null, Validators.required),
    task_desc: this.fb.control(null),
  })

  selectedDate: string = '';
  selectedTime: string = '';

  async updateTask(){
    const updatedFields = {
      task_name : this.form.value.task_name,
      task_desc : this.form.value.task_desc
    }

    this.noteServices.updateNote(this.noteSelected.id, updatedFields);
  }

  async deleteTask(){
    this.noteServices.deleteNote(this.noteSelected.id);
    this.router.navigate(['/home']);
  }

}
