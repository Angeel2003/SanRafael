import { Component, OnInit } from '@angular/core';
import { mailOutline } from 'ionicons/icons';
import { eyeOff } from 'ionicons/icons';
import { eye } from 'ionicons/icons';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons,
          IonInput, IonItem, IonLabel, IonBackButton } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';
import { NavigationExtras, Router } from '@angular/router';
import {ToastController} from '@ionic/angular';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonInput, IonItem, IonLabel, IonBackButton]
})
export class AdminLoginPage implements OnInit {
  private passwordVisible = false;

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

  async mostrarToast(mensaje: string, exito: boolean){
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'middle'
    });
    if (exito){
      toast.style.setProperty('--background', '#4caf50');
    } else {
      toast.style.setProperty('--background', '#fa3333');
    }
    toast.style.setProperty('--color', '#ffffff');
    toast.style.setProperty('font-weight', 'bold');
    toast.style.setProperty('font-size', 'xx-large');
    toast.style.setProperty('text-align', 'center');
    toast.style.setProperty('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.7)');
    toast.style.setProperty('border-radius', '10px');
    toast.style.marginTop = '50px';
    await toast.present();
  }

  async onSubmit() {
    const email = (<HTMLInputElement>document.getElementById('emailLogin')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
  
    // Verificar credenciales
    const isAuthenticated = await this.firebaseService.loginUser(email, password);
  
    if (isAuthenticated) {
      console.log("Inicio de sesión exitoso");
      this.mostrarToast('Inicio de sesión exitoso.', true);
      // Buscar al administrador en la base de datos
      const adminProfe = await this.firebaseService.getAdminByEmail(email);
      if (adminProfe) {
        console.log("Administrador encontrado");  
        // Enviar los datos del administrador al perfil
        const navigationExtras: NavigationExtras = {
          state: {
            adminProfe: adminProfe // Pasa el documento del administrador
          }
        };
        this.router.navigate(['/perfil-admin-profesor'], navigationExtras);
      } else {
        this.mostrarToast('No se encontró ningún administrador o profesor con el correo proporcionado', false);
        console.error("No se encontró ningún administrador con el correo proporcionado.");
      }
    } else {
      this.mostrarToast('Error en las credenciales. Inténtalo de nuevo.', false);
      console.log("Error en las credenciales. Inténtalo de nuevo.");
      // Muestra un mensaje de error en la interfaz
    }
  }

}

