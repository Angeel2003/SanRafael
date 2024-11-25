import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { addOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonToast, IonSelectOption, IonSelect, IonRadio, IonRadioGroup, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { NavigationExtras, Router } from '@angular/router';
import {ToastController} from '@ionic/angular';


@Component({
  selector: 'app-peticion-material',
  templateUrl: './peticion-material.page.html',
  styleUrls: ['./peticion-material.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, IonFooter,
    IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgClass, FormsModule, IonBackButton, IonButtons,
    IonToast , IonSelectOption, IonSelect, IonRadio, IonRadioGroup]
})
export class PeticionMaterialPage implements OnInit {

  peticionesMaterial: any[] = [];
  desplegarMateriales:boolean[] = [];

  constructor(private firebaseService: FirebaseService, private router: Router){
    addIcons({
      chevronDownOutline,
      chevronUpOutline
    });
  }

  async ngOnInit(){
    this.peticionesMaterial =  await this.firebaseService.getMaterialRequest();
    for(let peticion of this.peticionesMaterial){
      this.desplegarMateriales.push(false);
    }
    console.log("Peticiones: " + this.peticionesMaterial.length + "  Booleanos: " + this.desplegarMateriales.length);
  }

  desplegarMaterial(index: number){
    if(this.desplegarMateriales[index]){
      console.log("Guardando material " + index);
    }else{
      console.log("Desplegando material " + index);
    }
    this.desplegarMateriales[index] = !this.desplegarMateriales[index];
  }

  goToMaterialTask(index: number){
    //Creamos tarea material en la base de datos
    const navigationExtras: NavigationExtras = {
      state: {
        peticion: this.peticionesMaterial[index] // Pasa el documento del administrador
      }
    };
    this.router.navigate(['/tarea-material'], navigationExtras);
    //Eliminamos peticion de esa tarea

  }
}
