import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/StorageService';
import { UserLogoutUseCase } from 'src/app/use cases/user-logout.use-case';
import { UploadImageUserUseCase } from 'src/app/use cases/uploadImageUser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  username: string | null = null;
  email: string | null = null;
  profileImageUrl: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private userLogout: UserLogoutUseCase,
    private uploadImageUserUseCase: UploadImageUserUseCase
  ) {}

  async ngOnInit() {
    const { data, error } = await this.authService.getCurrentUser();
    
    if (error || !data) {
      console.error('Error obteniendo el usuario actual:', error?.message || 'Usuario no encontrado');
      return;
    }
    
    const user = data;  // user ahora tiene los datos del usuario directamente
    if (user) {
      this.username = user.user_metadata?.['username'] || 'Usuario'; // Asegúrate de que el metadata esté configurado.
      this.email = user.email || 'Correo no disponible';
      this.profileImageUrl = user.user_metadata?.['avatar_url'] || 'https://ionicframework.com/docs/img/demos/avatar.svg';
    } else {
      console.error('Usuario no autenticado o no disponible.');
    }
  }

  async onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      alert('No se seleccionó ninguna imagen.');
      return;
    }
  
    // Obtener el usuario actual
    const { data, error } = await this.authService.getCurrentUser();
    if (error || !data || !data.id) {
      alert('Error: Usuario no autenticado o ID no disponible.');
      return;
    }
  
    const userId = data.id;  // Aquí accedes al ID correctamente
    
    // Subir la imagen usando el caso de uso
    const uploadedUrl = await this.uploadImageUserUseCase.execute(userId, file);
  
    if (uploadedUrl) {
      this.profileImageUrl = uploadedUrl; // Actualiza la URL de la imagen en el perfil
      alert('¡Foto de perfil actualizada!');
    } else {
      alert('Error al subir la foto de perfil.');
    }
  }

  onFileInputClick() {
    this.fileInput.nativeElement.click();
  }

  async performLogout() {
    this.userLogout.performLogout();
  }
}
