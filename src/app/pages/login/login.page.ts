import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserLoginUseCase } from 'src/app/use cases/user-login.use-case';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userLoginUseCase: UserLoginUseCase,
    private alertController: AlertController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$'),
        ],
      ],
    });
  }

  ngOnInit() {
    // No need to check for existing session here, as Splash page will handle that
  }

  async onLoginButton() {
    if (this.loginForm.invalid) {
      return;
    }

    try {
      await this.userLoginUseCase.execute(
        this.loginForm.value.email ?? '',
        this.loginForm.value.password ?? ''
      );
      // If login is successful, UserLoginUseCase will handle navigation
    } catch (error) {
      console.error('Login failed:', error);
      await this.showErrorAlert(error);
    }
  }

  async showErrorAlert(error: any) {
    const alert = await this.alertController.create({
      header: 'Error de inicio de sesión',
      message: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
      buttons: ['OK']
    });

    await alert.present();
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}

