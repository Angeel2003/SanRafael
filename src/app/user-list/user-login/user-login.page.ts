import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
  IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';

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
  selector: 'app-user-login',
  templateUrl: './user-login.page.html',
  styleUrls: ['./user-login.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
    IonItem, IonLabel, IonInput, NgIf]
})

export class UserLoginPage implements OnInit {
  user: any;
  isPIN: boolean = false;
  isPictograma: boolean = false;

  constructor(private route: ActivatedRoute) {
    addIcons({
      lockClosedOutline
    })

    this.route.params.subscribe(params => {
      this.user = JSON.parse(params['user']);
      // Verificar si el usuario tiene password = 'PIN'
      if (this.user.password === 'PIN') {
        this.isPIN = true;
      }
      else {
        this.isPictograma = true;
      }
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    // Lógica para el inicio de sesión del usuario
    console.log('Iniciando sesión para:', this.user);
  }
}
