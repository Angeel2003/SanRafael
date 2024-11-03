import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
        IonCard, IonCardHeader, IonCardTitle} from '@ionic/angular/standalone';

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

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

  async goToUserLogin(user: any) {
    this.router.navigate(['/user-login', { user: JSON.stringify(user) }]);
  }

}
