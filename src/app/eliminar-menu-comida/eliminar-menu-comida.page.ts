import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonFooter, IonCheckbox } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eliminar-menu-comida',
  standalone: true,
  templateUrl: 'eliminar-menu-comida.page.html',
  styleUrls: ['eliminar-menu-comida.page.scss'],
  imports: [IonCheckbox, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonFooter, CommonModule, FormsModule],
})
export class EliminarMenuComidaComponent  implements OnInit {

  menus: any[] = []
  
  constructor(private router: Router,private firebaseService: FirebaseService) { }

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