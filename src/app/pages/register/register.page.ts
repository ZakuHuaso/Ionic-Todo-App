import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserRegisterUseCase } from 'src/app/use cases/user-register.use-case';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private alertController: AlertController,
    private userRegisterUseCase: UserRegisterUseCase
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$')
      ]]
    });
  }

  ngOnInit() { }

  async onRegisterButton() {
    if (this.registerForm.invalid) {
      return;
    }

    try {
      const { user, profile } = await this.userRegisterUseCase.execute(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.username
      );
      
      console.log('Usuario registrado:', user);
      console.log('Perfil creado:', profile);

      const alert = await this.alertController.create({
        header: 'Registro Exitoso',
        message: 'Tu cuenta ha sido creada exitosamente.',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error de registro:', error);

      const alert = await this.alertController.create({
        header: 'Registro Fallido',
        message: error.message || 'Ocurrió un error inesperado durante el registro.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  
}
