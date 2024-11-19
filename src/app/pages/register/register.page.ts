import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/app/service/custom-alert.service';
import { AuthService} from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private alert: CancelAlertService,
    private fb: FormBuilder,
    private authService: AuthService
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
    if (this.registerForm.invalid){
      return;
    }

    const authResponse = await this.authService.signUp(
      this.registerForm.value.email ?? '',
      this.registerForm.value.password ?? '',
    );
    
    console.log(authResponse);
  }

  
}
