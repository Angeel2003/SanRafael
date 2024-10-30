import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { personOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule], // Usar IonicModule en lugar de componentes individuales
})
export class HomePage {
  constructor(private router: Router){
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
