import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

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
    private authService: AuthService
  ) {}

  ngOnInit() {  
    
  }

  async performLogout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
    }
  

  
}
