import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tarea-comanda',
  templateUrl: './tarea-comanda.page.html',
  styleUrls: ['./tarea-comanda.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonGrid, IonRow, IonCol]
})
export class TareaComandaPage implements OnInit {
  nombreTarea: string = "Nombe de la tarea/aula";
  menus: any[] = [
    {name: 'Menu1', img: 'https://e7.pngegg.com/pngimages/478/821/png-clipart-restaurant-pictogram-buffet-diner-food-logo.png', num: 0},
    {name: 'Menu2', img: 'https://e7.pngegg.com/pngimages/478/821/png-clipart-restaurant-pictogram-buffet-diner-food-logo.png', num: 0}
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
