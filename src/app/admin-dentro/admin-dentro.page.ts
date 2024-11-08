import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButtons, IonBackButton, IonButton} from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-admin-dentro',
  templateUrl: 'admin-dentro.page.html',
  styleUrls: ['admin-dentro.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButtons, IonButton, IonBackButton], 
})
export class AdminDentro {
  constructor(private router: Router, private firebaseService: FirebaseService){
  }

  goToStepTask() {
    this.router.navigate(['/tarea-pasos']);
  }

  goToMenuTask() {
    this.router.navigate(['/tarea-comanda']);
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
