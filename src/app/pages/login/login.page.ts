import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/app/service/custom-alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = 'user';
  password: string = 'pass';

  

  constructor(
    private router: Router,
    private alert: CancelAlertService
  ) {}

  ngOnInit() {}


  /* === Boton Registro === */
   onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }

  
  /* === Boton Login === */
   onLoginButton(){
    if(this.email == 'user' && this.password=='pass'){
      this.router.navigate(['/home']);
    } else {
      console.error("error");
      this.alert.showAlert('Error', 'Error', null);
    }

   } 

 


}
