import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonList } from '@ionic/angular/standalone';
import { MenuItem } from '../models/menu.interface';
import { Router } from '@angular/router';
import { arrowBackOutline, personCircleOutline, addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-crear-menu',
  templateUrl: './crear-menu.page.html',
  styleUrls: ['./crear-menu.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
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

  goBackToAdmin() {
    this.router.navigate(['/admin-dentro']);
  }

}
