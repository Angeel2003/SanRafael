import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonList, IonImg } from '@ionic/angular/standalone';
import { MenuItem } from '../models/menu.interface';
import { removeCircleOutline } from 'ionicons/icons';
import { addCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-tarea-menu',
  templateUrl: './tarea-menu.page.html',
  styleUrls: ['./tarea-menu.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonImg]
})


export class TareaMenuPage implements OnInit {


  menus: MenuItem[] = [
    { name: 'Menu 1', pictogram: 'url-picto-1', image: 'url-image-1', quantity: 0 },
    { name: 'Menu 2', pictogram: 'url-picto-2', image: 'url-image-2', quantity: 0 },
  ];

  showPictogram: boolean = true;

  increaseQuantity(index: number) {
    this.menus[index].quantity = (this.menus[index].quantity ?? 0) + 1;
  }

  decreaseQuantity(index: number) {
    this.menus[index].quantity = Math.max((this.menus[index].quantity ?? 0) - 1, 0);
  }


  constructor() {
    addIcons({
      removeCircleOutline,
      addCircleOutline
    })
  }

  ngOnInit() {
  }

  saveOrder() {
    console.log('Datos guardados: ', this.menus);
  }

}
