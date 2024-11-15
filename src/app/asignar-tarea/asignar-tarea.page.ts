import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonSelect, IonSelectOption, IonCheckbox, IonDatetime, IonToast 
} from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';


export interface Asignacion{
  nombreTarea: string;
  fechaInicio: string;
  fechaFin: string;
}

@Component({
  selector: 'app-asignar-tarea',
  templateUrl: './asignar-tarea.page.html',
  styleUrls: ['./asignar-tarea.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, IonFooter,
    IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgClass, FormsModule, IonBackButton, IonButtons,
    IonSelect, IonSelectOption, CommonModule, IonCheckbox, IonDatetime, IonToast
  ],
})

export class AsignarTarea {
  taskNames: string[] = [];
  studentNames: string[] = [];
  selectedTask: string = '';
  selectedStudent: string = '';
  selectedValueAcces: string[] = [];
  dateInit: string = '';
  dateEnd: string = '';
  newAsignation: Asignacion = {nombreTarea: '', fechaInicio: '', fechaFin: '' };

  constructor(private firebaseService: FirebaseService) {

  }

  onItemChange(event: any) {
    this.selectedTask = event.detail.value;
    console.log(event.detail.value);
  }
  
  async onSelectStudent(event: any) {
    const studentName = event.detail.value;
    this.selectedValueAcces = await this.firebaseService.getAllDefaultAccesValues(studentName);

    console.log(event.detail.value);
  }

  async ngOnInit() {
    try {
      this.taskNames = await this.firebaseService.getAllTaskNames();
      this.studentNames = await this.firebaseService.getAllStudentsNames();
    } catch (error) {
      console.error("Error al cargar los nombres de las tareas:", error);
    }
  }

  initializeComponents(){
    this.selectedTask = '';
    this.selectedStudent = '';
    this.selectedValueAcces = [];
    this.dateInit = '';
    this.dateEnd = '';
  }

  onCheckboxChange(event: any) {
    const value = event.detail.value;
    if (event.detail.checked) {
      this.selectedValueAcces.push(value);
    } else {
      this.selectedValueAcces = this.selectedValueAcces.filter(item => item !== value);
    }
  }

  onDateInitChange(event: any){
    this.dateInit = event.detail.value;
    console.log('Guardado inicio', this.dateInit);
  }

  onDateEndChange(event: any){
    this.dateEnd = event.detail.value;
    console.log('Guardado fin', this.dateEnd);

  }

  async guardarAsignacion(){
    this.newAsignation.nombreTarea = this.selectedTask;
    this.newAsignation.fechaInicio = this.dateInit;
    this.newAsignation.fechaFin = this.dateEnd;

    await this.firebaseService.addTaskToStudent(this.selectedStudent, this.newAsignation);

    this.initializeComponents();
    
  }

}
