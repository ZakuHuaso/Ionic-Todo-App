import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/StorageService';
import { UserLogoutUseCase } from 'src/app/use cases/user-logout.use-case';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  username: string | null = null;
  email: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private userLogout: UserLogoutUseCase
  ) {}

  ngOnInit() {  
    
  }

  async performLogout() {
    this.userLogout.performLogout();
  }
  
  
}
