import { Component } from '@angular/core';
import { personOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton} from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-admin-dentro',
  templateUrl: 'admin-dentro.page.html',
  styleUrls: ['admin-dentro.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton], 
})
export class AdminDentro {
  constructor(private router: Router, private firebaseService: FirebaseService){
    addIcons({
      personOutline
    })
  }

  goToStepTask() {
    this.router.navigate(['/tarea-pasos']);
  }

  goToMenuTask() {
    this.router.navigate(['/tarea-menu']);
  }

  goToMaterialTask() {
    this.router.navigate(['/tarea-material']);
  }

  goToCreateUser() {
    this.router.navigate(['/crear-usuario']);
  }

  goToCreateMenu() {
    this.router.navigate(['/crear-menu']);
  }
}
