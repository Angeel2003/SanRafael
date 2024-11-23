import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonToast, IonSelectOption, IonSelect, IonRadio, IonRadioGroup
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import {ToastController} from '@ionic/angular';


@Component({
  selector: 'app-peticion-material',
  templateUrl: './peticion-material.page.html',
  styleUrls: ['./peticion-material.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, IonFooter,
    IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgClass, FormsModule, IonBackButton, IonButtons,
    IonToast , IonSelectOption, IonSelect, IonRadio, IonRadioGroup]
})
export class PeticionMaterialPage implements OnInit {

  peticionesMaterial: any = []

  constructor(private firebaseService: FirebaseService, private router: Router){
  }

  async ngOnInit(){
    this.peticionesMaterial =  await this.firebaseService.getMaterialRequest();
  }

}
