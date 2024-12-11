import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Note, NotesServices } from 'src/app/service/notes.service';
import { IonDatetime } from '@ionic/angular';
import { TaskCreateUseCase } from 'src/app/use cases/task-create';
import { GeolocationService } from 'src/app/service/GeoLocation';

interface NoteForm {
  task_name: FormControl<string | null>;
  task_desc: FormControl<string | null>;
  task_date: FormControl<string | null>;
  task_location: { latitude: number; longitude: number } | null;
}

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.page.html',
  styleUrls: ['./new-task.page.scss'],
})

export class NewTaskPage implements OnInit {
  noteForm: FormGroup;
  dateExample = new Date().toISOString();
  location: { latitude: number; longitude: number } | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private noteServices: NotesServices,
    private taskCreate: TaskCreateUseCase,
    private geolocationService: GeolocationService
  ) { }

  ngOnInit() {
    this.initForm();
    
  }

  selectedDate: string = '';
  selectedTime: string = '';

  initForm() {
    this.noteForm = this.fb.group({
      task_name: this.fb.control(null, Validators.required),
      task_desc: this.fb.control(null),
      task_date: this.fb.control(null),
      task_location: ['']
    });
  }

  async captureLocation() {
    try {
      const locationData = await this.geolocationService.getLocation();
      if (locationData) {
        this.location = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };

        // Guarda la ubicación en el formulario
        this.noteForm.patchValue({
          task_location: `${this.location.latitude},${this.location.longitude}`,
        });
        console.log('Ubicación capturada:', this.location);
      } else {
        console.error('No se pudo obtener la ubicación.');
      }
    } catch (error) {
      console.error('Error al capturar la ubicación:', error);
    }
  }


  async addNote() {
    if (this.noteForm.valid) {
      const { task_name, task_desc, task_date, task_location } = this.noteForm.value;
      console.log('Formulario enviado con datos:', this.noteForm.value); // Depuración

      // Crear la nueva tarea incluyendo la geolocalización
      const newNote = await this.taskCreate.createTask(
        task_name!,
        task_desc!,
        task_date!,
        task_location
      );

      if (newNote) {
        this.router.navigate(['/home']).then(() => {
          window.location.reload(); // Recarga la página después de navegar
        });
      } else {
        console.error('Error al crear la tarea');
        // Puedes agregar un mensaje para el usuario aquí
      }
    } else {
      console.log('Formulario inválido');
      // Aquí puedes mostrar los errores de validación del formulario
    }
  }

}
