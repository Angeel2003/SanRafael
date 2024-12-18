import { Component } from '@angular/core';
import { personOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { TareasVencidasService } from '../services/tareas-vencidas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton], 
})
export class HomePage {

  imagen: string = '';
  constructor(private router: Router, private firebaseService: FirebaseService, private tareasVencidasService: TareasVencidasService){
    addIcons({
      personOutline
    })
  }

  async ngOnInit() {
    this.imagen = await this.firebaseService.getImageUrl('pictogramas/niña.png');
    
    await this.tareasVencidasService.moverTareasVencidas();
  }
  
  
  goToUserLogin() {
    this.router.navigate(['/user-list']);
  }

  goToAdminLogin() {
    this.router.navigate(['/admin-login']);
  }
}
