import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/StorageService';
import { UserLogoutUseCase } from 'src/app/use cases/user-logout.use-case';
import { ImageUserUseCase } from 'src/app/use cases/ImageUser';
import { ProfileService } from 'src/app/service/profile.service';
import { ImageService } from 'src/app/service/Image-service';
import { ActionSheetController } from '@ionic/angular';
import { CancelAlertService } from 'src/app/service/cancelAlertService';

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
  userID: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private userLogout: UserLogoutUseCase,
    private ImageUserUseCase: ImageUserUseCase,
    private ProfileService: ProfileService,
    private ImageService: ImageService,
    private actionSheetController: ActionSheetController,
    private alert: CancelAlertService,
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    try {
      const { data: userData, error: userError } = await this.authService.getCurrentUser();
  
      if (userError || !userData) {
        console.warn('No se encontró información del usuario actual.');
        this.router.navigate(['/login']);
        return;
      }
  
      if (userData.id) {
        const profile = await this.ProfileService.getProfile(userData.id);
        this.userID = userData.id;
        if (profile) {
          this.profileImageUrl = profile.avatar_url || null; // Usa avatar_url
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
  

  async onProfileImagePressed() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Cámara',
          icon: 'camera',
          handler: async () => {
            const uploadResult = await this.ImageService.getImageFromCamera(this.userID);
            this.handleImageUploadResult(uploadResult);
          }
        },
        {
          text: 'Imágenes',
          icon: 'image',
          handler: async () => {
            const uploadResult = await this.ImageService.getImageFromGallery(this.userID);
            this.handleImageUploadResult(uploadResult);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    await actionSheet.present();
  }

  private handleImageUploadResult(uploadResult: { success: boolean, message: string, imageUrl?: string }) {
    if (uploadResult.success) {
      this.alert.showAlert(
        'Imagen Actualizada',
        'Tu imagen de perfil ha sido actualizada con éxito.',
        () => {
          this.profileImageUrl = uploadResult.imageUrl || 'assets/default-avatar.png';
        }
      );
    } else {
      this.alert.showAlert(
        'Error',
        uploadResult.message,
        () => { }
      );
    }
  }
  

  onFileInputClick() {
    this.fileInput.nativeElement.click();
  }

  async performLogout() {
    this.userLogout.performLogout();
  }
}
