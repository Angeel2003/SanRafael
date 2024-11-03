import { Component } from '@angular/core';
import { personOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton} from '@ionic/angular/standalone';

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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton], 
})
export class HomePage {
  constructor(private router: Router){
    addIcons({
      personOutline
    })
  }

  goToUserLogin() {
    this.router.navigate(['/user-list']);
  }

  goToAdminLogin() {
    this.router.navigate(['/admin-login']);
  }
}
