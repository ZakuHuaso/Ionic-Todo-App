import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../service/StorageService';

@Injectable({
  providedIn: 'root'
})
export class UserLogoutUseCase {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  async performLogout() {
    await this.authService.signOut();
    this.storageService.clear();
    this.router.navigate(['/login']);
    return 
    }
  
}