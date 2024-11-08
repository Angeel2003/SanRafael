import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-asignar-tarea',
  templateUrl: './asignar-tarea.page.html',
  styleUrls: ['./asignar-tarea.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, IonFooter,
    IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgClass, FormsModule, IonBackButton, IonButtons,
    IonSelect, IonSelectOption, CommonModule
  ],
})

export class AsignarTarea {
  taskNames: string[] = ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'];
  selectedTask: string = '';

  constructor(private firebaseService: FirebaseService) {

  }

  onItemChange(event: any) {
    console.log(event.detail.value);
  }

  async ngOnInit() {
    try {
      this.taskNames = await this.firebaseService.getAllTaskNames();
    } catch (error) {
      console.error("Error al cargar los nombres de las tareas:", error);
    }
  }

}
