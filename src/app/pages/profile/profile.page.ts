import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/StorageService';
import { UserLogoutUseCase } from 'src/app/use cases/user-logout.use-case';
import { ImageUserUseCase } from 'src/app/use cases/ImageUser';
import { ProfileService } from 'src/app/service/profile.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  nombreusuario: string | null = null;
  email: string | null = null;
  profileImageUrl: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private userLogout: UserLogoutUseCase,
    private ImageUserUseCase: ImageUserUseCase,
    private ProfileService: ProfileService
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    try {
      // Obtiene la información del usuario actual
      const { data: userData, error: userError } =
        await this.authService.getCurrentUser();

      if (userError || !userData) {
        console.warn('No se encontró información del usuario actual.');
        this.router.navigate(['/login']);
        return;
      }

      // Asegúrate de usar "id" en lugar de "uid"
      if (userData.id) {
        const profile = await this.ProfileService.getProfile(userData.id);

        if (profile) {
          this.profileImageUrl = await this.ImageUserUseCase.getProfileImage(userData.id)
          await this.storageService.set('Username', profile.username);
          await this.storageService.set('Correo', profile.email);
          this.email = await this.storageService.get('Correo');
          this.nombreusuario = await this.storageService.get('Username');
          console.log('Perfil obtenido:', profile);
        } else {
          console.warn('Perfil no encontrado para el usuario:', userData.id);
        }
      } else {
        console.warn('El campo "id" del usuario no está disponible.');
      }
    } catch (err) {
      console.error('Error general:', err.message);
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

    const userId = data.id; // Aquí accedes al ID correctamente

    // Subir la imagen usando el caso de uso
    const uploadedUrl = await this.ImageUserUseCase.execute(userId, file);

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
