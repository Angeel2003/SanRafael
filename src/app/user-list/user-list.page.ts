import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
        IonCard, IonCardHeader, IonCardTitle} from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';

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
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
    IonCard, IonCardHeader, IonCardTitle, NgFor]
})
export class UserListPage implements OnInit {
  users = [
    { name: 'Usuario 1', photoUrl: 'https://via.placeholder.com/150', password: 'PIN' },
    { name: 'Usuario 2', photoUrl: 'https://via.placeholder.com/150', password: 'Pictograma' },
    { name: 'Usuario 3', photoUrl: 'https://via.placeholder.com/150', password: 'PIN' },
    // Agrega más usuarios según sea necesario
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  async goToUserLogin(user: any) {
    this.router.navigate(['/user-login', { user: JSON.stringify(user) }]);
  }

}
