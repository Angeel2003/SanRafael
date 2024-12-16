import { Component, OnInit } from '@angular/core';
import { mailOutline } from 'ionicons/icons';
import { eyeOff } from 'ionicons/icons';
import { eye } from 'ionicons/icons';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons,
          IonInput, IonItem, IonLabel, IonBackButton, IonToast } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';
import { NavigationExtras, Router } from '@angular/router';
import {ToastController} from '@ionic/angular';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar,IonToast, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonInput, IonItem, IonLabel, IonBackButton]
})
export class AdminLoginPage implements OnInit {
  private passwordVisible = false;
  isToastOpen = false; // Controla la visibilidad del toast
  toastMessage = ''; // Mensaje dinámico del toast
  toastClass = '';

  constructor(private firebaseService: FirebaseService, private router: Router, private toastController: ToastController) {
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

  showToast(message: string, success: boolean = true) {
    this.toastMessage = message;
    this.toastClass = success ? 'toast-success' : 'toast-error';
    this.isToastOpen = true;
  }

  // Método llamado al cerrarse el toast
  onToastDismiss() {
    this.isToastOpen = false;
  }

  async onSubmit() {
    const email = (<HTMLInputElement>document.getElementById('emailLogin')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
  
    // Verificar credenciales
    const isAuthenticated = await this.firebaseService.loginUser(email, password);
  
    if (isAuthenticated) {
      this.showToast('Inicio de sesión exitoso', true); 
      // Buscar al administrador en la base de datos
      const adminProfe = await this.firebaseService.getAdminByEmail(email);
      if (adminProfe) {
        // Enviar los datos del administrador al perfil
        const navigationExtras: NavigationExtras = {
          state: {
            adminProfe: adminProfe // Pasa el documento del administrador
          }
        };
        this.router.navigate(['/perfil-admin-profesor'], navigationExtras);
      } else {
        this.showToast('No se encontró ningún administrador o profesor con el correo proporcionado', false); 
      }
    } else {
      this.showToast('Error en las credenciales, inténtelo de nuevo', false); 

    }
  }

}

