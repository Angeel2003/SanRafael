import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
  users: any[] | undefined;

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getAlumnos().subscribe(data => {
      this.users = data;
    });
  }

  async goToUserLogin(user: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        user: user
      }
    };
    this.router.navigate(['/user-login'], navigationExtras);
  }

}
