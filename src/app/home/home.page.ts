import { Component } from '@angular/core';
import { personOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton} from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton], 
})
export class HomePage {
  constructor(private router: Router, private firebaseService: FirebaseService){
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
