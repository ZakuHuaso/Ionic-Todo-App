import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Note, NotesServices } from 'src/app/service/notes.service';
import { IonDatetime } from '@ionic/angular';

interface NoteForm {
  task_name: FormControl<string | null>;
  task_desc: FormControl<string | null>;
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
    private noteServices: NotesServices
  ) { }

  ngOnInit() {
  }

  selectedDate: string = '';
  selectedTime: string = '';

  form = this.fb.group<NoteForm>({
    task_name: this.fb.control(null, Validators.required),
    task_desc: this.fb.control(null),
  })

  async addNote(){
    this.noteServices.addNote(this.form.value.task_name, this.form.value.task_desc);
  }


}
