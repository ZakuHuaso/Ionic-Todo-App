  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { CancelAlertService } from 'src/app/service/custom-alert.service';
  import { FormGroup, Validators, FormBuilder } from '@angular/forms';
  import { AuthService } from 'src/app/service/auth.service';

  @Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
  })
  export class LoginPage implements OnInit {
    loginForm: FormGroup;

    constructor(
      private router: Router,
      private alert: CancelAlertService,
      private fb: FormBuilder,
      private authService: AuthService
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

    ngOnInit() {}

    async onLoginButton() {
      if (this.loginForm.invalid) {
        return;
      }

      try {
        const { error } = await this.authService.signIn(
          this.loginForm.value.email ?? '',
          this.loginForm.value.password ?? ''
        );

        if (error) throw error;

        this.router.navigate(['/home']);
      } catch (error) {
        if (error instanceof error) {
          console.log(error);
        } else {
          console.error('Unexpected error', error);
        }
      }
    }

    /* === Boton Registro === */
    onRegisterButtonPressed() {
      this.router.navigate(['/register']);
    }
  }
