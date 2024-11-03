import { Component, OnInit } from '@angular/core';
import { mailOutline } from 'ionicons/icons';
import { eyeOff } from 'ionicons/icons';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons,
          IonInput, IonItem, IonLabel, IonBackButton } from '@ionic/angular/standalone';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBNS4uHdWMqQ6huVkqV4FhYtQi_9Jozn88",
  authDomain: "indepapp-sanrafael.firebaseapp.com",
  projectId: "indepapp-sanrafael",
  storageBucket: "indepapp-sanrafael.firebasestorage.app",
  messagingSenderId: "65579135683",
  appId: "1:65579135683:web:7dcb776bfbec36c67fe876",
  measurementId: "G-2K9V8MCKWE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonInput, IonItem, IonLabel, IonBackButton]
})
export class AdminLoginPage implements OnInit {
  private passwordVisible = false;

  constructor() {
    addIcons({
      mailOutline,
      eyeOff,
      lockClosedOutline
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

  onSubmit() {
    // Lógica para manejar el envío del formulario
  }

}
