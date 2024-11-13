import { Component, OnInit } from '@angular/core';
import { mailOutline } from 'ionicons/icons';
import { eyeOff } from 'ionicons/icons';
import { eye } from 'ionicons/icons';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons,
          IonInput, IonItem, IonLabel, IonBackButton } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonInput, IonItem, IonLabel, IonBackButton]
})
export class AdminLoginPage implements OnInit {
  private passwordVisible = false;

  constructor(private firebaseService: FirebaseService, private router: Router) {
    addIcons({
      mailOutline,
      eyeOff,
      lockClosedOutline,
      eye
    })
  }

  ngOnInit() {
  }

  toggleLoginPasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    var toggleIconName = (<HTMLInputElement>document.getElementById('togglePassword'));

    if (!this.passwordVisible) {
      passwordInput.type = 'text';
      toggleIconName.name = 'eye';
      this.passwordVisible = true;
    } else {
      passwordInput.type = 'password';
      toggleIconName.name = 'eye-off';
      this.passwordVisible = false;
    }
  }

  async onSubmit() {
    const email = (<HTMLInputElement>document.getElementById('emailLogin')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
    const isAuthenticated = await this.firebaseService.loginUser(email, password);

    if (isAuthenticated) {
      console.log("Inicio de sesión exitoso");
      this.router.navigate(['/admin-dentro']);
    } else {
      console.log("Error en las credenciales. Inténtalo de nuevo.");
      // Muestra un mensaje de error en la interfaz
    }
  }

}

