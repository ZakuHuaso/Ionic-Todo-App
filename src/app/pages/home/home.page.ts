import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Note, NotesServices } from 'src/app/service/notes.service';
import { AlertController } from '@ionic/angular';

interface NoteForm {
  task_name: FormControl<string | null>;
  task_desc: FormControl<string | null>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  noteForm: FormGroup;
  notes: Note[] = [];
  isLoading = false;  

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private noteServices: NotesServices,
    private alertController : AlertController
  ) {

  }
  
  noteSelected: Note | null = null;

  
  form = this.fb.group<NoteForm>({
    task_name: this.fb.control(null, Validators.required),
    task_desc: this.fb.control(null),
  })


  ngOnInit() {
    this.loadNotes();
  }

  async loadNotes() {
    this.isLoading = true;
    const notes = await this.noteServices.getAllNotes();
    if (notes) {
      this.notes = notes;
    }
    this.isLoading = false;
  }

  async signOutButton(){
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }

  async getNotes(){
    await this.noteServices.getAllNotes();
  }
  
  

  async updateNote(note : Note){
    this.noteSelected = note;

    this.form.setValue({
      task_name: this.noteSelected.task_name,
      task_desc: this.noteSelected.task_desc
    });

  }

  async deleteNote(noteId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this note?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            const success = await this.noteServices.deleteNote(noteId);
            if (success) {
              this.notes = this.notes.filter(note => note.id !== noteId);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  toNewTaskPage(){
    this.router.navigate(['/new-task'])
  }

  

}
  
   

