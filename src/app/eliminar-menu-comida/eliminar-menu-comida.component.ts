import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonFooter, IonCheckbox } from '@ionic/angular/standalone';
import { menu } from '../menu';

@Component({
  selector: 'app-eliminar-menu-comida',
  standalone: true,
  templateUrl: './eliminar-menu-comida.component.html',
  styleUrls: ['./eliminar-menu-comida.component.scss'],
  imports: [IonCheckbox, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonFooter, CommonModule, FormsModule],
})
export class EliminarMenuComidaComponent  implements OnInit {

  menus: menu[] = [
    {name: 'Menu1', img: '../assets/carne1.png', avaliable: true},
    {name: 'Menu2', img: '../assets/carne2.png', avaliable: true}
  ]
  
  constructor() { }

  ngOnInit() {}

}
