import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotesServices } from 'src/app/service/notes.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  notes: any[] = []; // Almacena todas las notas
  filteredNotes: any[] = []; // Tareas filtradas por task_status
  selectedButton: string = ''; 

  constructor(
    private router: Router,
    private noteServices: NotesServices
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  // Función para cargar las tareas desde Supabase
  async loadTasks() {
    this.notes = await this.noteServices.getAllNotes(); // Llamada al método para obtener todas las notas
    this.filteredNotes = this.notes; // Inicialmente mostramos todas las tareas
  }

  filterTasks(status: number) {
    this.selectedButton = status === 1 ? 'pendientes' : 'completadas'; // Cambiar el estado del botón seleccionado

    // Filtrar las notas según task_status
    this.filteredNotes = this.notes.filter(note => note.task_status === status);
  }

  // Función para redirigir a la página de agregar tarea
  toNewTaskPage() {
    this.router.navigate(['/new-task']);
  }
}
