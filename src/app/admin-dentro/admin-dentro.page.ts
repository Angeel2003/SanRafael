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
    console.log("ELIMINAR CUANDO ESTE CREADO")
    //this.router.navigate(['/tarea-menu']);
  }

  goToMaterialTask() {
    this.router.navigate(['/tarea-material']);
  }

  goToCreateUser() {
    console.log("ELIMINAR CUANDO ESTE CREADO")
    //this.router.navigate(['/crear-usuario']);
  }
}
