import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NgIf } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
  IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';

import { FirebaseService } from 'src/app/services/firebase.service';

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

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) {
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
