import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonFooter, IonCheckbox } from '@ionic/angular/standalone';
import { menuTarea } from '../menuTarea';

@Component({
  selector: 'app-tarea-comedor',
  templateUrl: './tarea-comedor.component.html',
  styleUrls: ['./tarea-comedor.component.scss'],
  standalone: true,
  imports: [IonCheckbox, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonFooter, CommonModule, FormsModule]
})
export class TareaComedorComponent  implements OnInit {

  nombreTarea: string = "Nombe de la tarea/aula";
  menus: menuTarea[] = [
    {name: 'Menu1', img: '../assets/carne1.png', num: 0},
    {name: 'Menu2', img: '../assets/carne2.png', num: 0}
  ]
  constructor() { }

  ngOnInit() {}

  Aumentar(index: number){
    this.menus[index].num++;
  }

  Decrementar(index: number){
    if(this.menus[index].num > 0){
      this.menus[index].num--;
    }
  }
}
