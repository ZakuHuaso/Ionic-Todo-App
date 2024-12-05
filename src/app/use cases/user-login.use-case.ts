import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../service/StorageService';
@Injectable({
  providedIn: 'root'
})
export class UserLoginUseCase {
  constructor(
    private authService: AuthService,
    private router: Router,
    private StorageService: StorageService
  ) { }

  async execute(email: string, password: string): Promise<void> {
    try {
      const { error } = await this.authService.signIn(email, password);

      if (error) throw error;
      this.StorageService.set('user_session',true);
      this.router.navigate(['/home']);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
        throw error;
      } else {
        console.error('Error inesperado en el inicio de sesion', error);
        throw new Error('Un error ha ocurrido al intentar iniciar sesion');
      }
    }
  }
}

