import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { addIcons } from 'ionicons';
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
  users: any[] = [];
  currentPage = 0;
  usersPerPage = 4; // Muestra 4 usuarios por página
  previewUserGirl: string = '';
  previewUserBoy: string = '';

  constructor(private router: Router, private firebaseService: FirebaseService) {
    addIcons({
      arrowBack,
      arrowForward
    })
  }

  async ngOnInit() {
    this.firebaseService.getAlumnos().subscribe(data => {
      this.users = data;
    });
    this.previewUserGirl = await this.firebaseService.getImageUrl('pictogramas/niña.png');
    this.previewUserBoy = await this.firebaseService.getImageUrl('pictogramas/niño.png');
  }

  get paginatedUsers() {
    // Calcula el índice de inicio y final de la página actual
    const start = this.currentPage * this.usersPerPage;
    const end = start + this.usersPerPage;
    return this.users.slice(start, end);
  }

  get maxPage() {
    // Calcula el número total de páginas
    return Math.ceil(this.users.length / this.usersPerPage) - 1;
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
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
