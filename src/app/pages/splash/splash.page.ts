import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/StorageService';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router, private storageService: StorageService, private authService: AuthService) { }

  async ngOnInit() { }

  async ionViewDidEnter() {
    this.checkSession()
  }

  async checkSession() {
    try {
      const { data, error } = await this.authService.session();
      if (error) throw error;

      if (data.session) {
        // Si hay una sesión activa, redirigimos al home
        this.router.navigate(['/home']);
      } else {
        // Si no hay sesión, redirigimos al login
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      // En caso de error, redirigimos al login por seguridad
      this.router.navigate(['/login']);
    }
  }

}

