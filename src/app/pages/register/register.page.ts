import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/app/service/custom-alert.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage {

  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alert: CancelAlertService
  ) { }

  onRegisterButton(){

  }

  clean() {
    this.email = '';
    this.password = '';
  }
}
