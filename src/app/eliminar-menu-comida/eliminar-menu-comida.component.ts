import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonFooter, IonCheckbox } from '@ionic/angular/standalone';
<<<<<<< HEAD
import { FirebaseService } from '../services/firebase.service';
=======

interface menu {
  name : string;
  img : string;
  avaliable : boolean;
  }  
>>>>>>> 934167db54618992a938874ae919f7d1ba024ab7

@Component({
  selector: 'app-eliminar-menu-comida',
  standalone: true,
  templateUrl: './eliminar-menu-comida.component.html',
  styleUrls: ['./eliminar-menu-comida.component.scss'],
  imports: [IonCheckbox, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonFooter, CommonModule, FormsModule],
})

export class EliminarMenuComidaComponent  implements OnInit {

  menus: any[] = []
  
  constructor(private firebaseService: FirebaseService) { }

  async ngOnInit() {
    this.menus = await this.firebaseService.getMenus();
  }

  eliminarMenu(menuId: string, index: any){
    //Eliminamos el menu de la base de datos
    this.firebaseService.deleteMenu(menuId);
    //Eliminamos el menu del array de elementos menus para que se actualice la vista
    this.menus.splice(index, 1);
  }

}