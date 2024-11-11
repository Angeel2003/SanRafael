import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonSelect, IonSelectOption, IonCheckbox
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
    IonSelect, IonSelectOption, CommonModule, IonCheckbox
  ],
})

export class AsignarTarea {
  taskNames: string[] = [];
  studentNames: string[] = [];
  selectedTask: string = '';
  selectedStudent: string = '';
  selectedValueAcces: string[] = [];

  constructor(private firebaseService: FirebaseService) {

  }

  onItemChange(event: any) {
    console.log(event.detail.value);
  }

  async ngOnInit() {
    try {
      this.taskNames = await this.firebaseService.getAllTaskNames();
      this.studentNames = await this.firebaseService.getAllStudentsNames();
      this.selectedValueAcces = await this.firebaseService.getAllDefaultAccesValues();
    } catch (error) {
      console.error("Error al cargar los nombres de las tareas:", error);
    }
  }

  onCheckboxChange(event: any) {
    const value = event.target.value;

    if (event.detail.checked) {
      this.selectedValueAcces.push(value);
    } else {
      this.selectedValueAcces = this.selectedValueAcces.filter(val => val !== value);
    }
  }

}
