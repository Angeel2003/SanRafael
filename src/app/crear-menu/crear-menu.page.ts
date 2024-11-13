import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { arrowBackOutline, personCircleOutline, addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCol, IonGrid, IonRow, IonItem, IonLabel, IonIcon, IonButton, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

export interface MenuItem {
  name: string;
  pictogram: string;
  image: string;
  quantity?: number;
}

@Component({
  selector: 'app-crear-menu',
  templateUrl: './crear-menu.page.html',
  styleUrls: ['./crear-menu.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonCol, IonGrid, IonRow, IonItem, IonLabel, IonIcon, IonButton, IonInput]
})
export class CrearMenuPage implements OnInit {

  menus: MenuItem[] = [
    { name: '', pictogram: '', image: '' }
  ];

  addMenu() {
    this.menus.push({ name: '', pictogram: '', image: '' });
  }


  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      addOutline
    });
  }

  ngOnInit() {
  }

  // imagenPreview(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length) {
  //     const file = input.files[0];
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //   }
  // }

  saveMenus() {
    console.log('Datos guardados: ', this.menus);
  }

}
