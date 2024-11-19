import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonSelect, IonSelectOption, IonCheckbox, IonDatetime, IonToast, IonSearchbar 
} from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';

import {ToastController} from '@ionic/angular';

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
    IonSelect, IonSelectOption, CommonModule, IonCheckbox, IonDatetime, IonToast, IonSearchbar
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
  newAsignation: Asignacion = { nombreTarea: '', fechaInicio: '', fechaFin: '' };
  filteredTasks: string[] = [];
  searchTerm: string = '';

  constructor(private firebaseService: FirebaseService, private toastController: ToastController) { }

  async ngOnInit() {
    try {
      this.taskNames = await this.firebaseService.getAllTaskNames();
      this.studentNames = await this.firebaseService.getAllStudentsNames();
      this.filteredTasks = [...this.taskNames]; // Inicializa filteredTasks con todas las tareas
    } catch (error) {
      console.error("Error al cargar los nombres de las tareas:", error);
    }
  }

  filterTasks(event: any): void {
    const query = event.target.value.toLowerCase();
    if (query) {
      this.filteredTasks = this.taskNames.filter((task) =>
        task.toLowerCase().includes(query)
      );
    } else {
      this.filteredTasks = [...this.taskNames]; // Si no hay búsqueda, mostrar todas las tareas
    }
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

  onSelectTask(event: any){
    const value = event.detail.value;
    if (event.detail.checked) {
      this.selectedTask = value;
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

  async mostrarToast(mensaje: string, exito: boolean) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    if(exito){
      toast.style.setProperty('--background', '#4caf50');
    }else{
      toast.style.setProperty('--background', '#fa3333');
    }
    toast.style.setProperty('--color', '#ffffff');
    toast.style.setProperty('font-weight', 'bold');
    toast.style.setProperty('font-size', 'xx-large');
    toast.style.setProperty('text-align', 'center');
    toast.style.setProperty('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.7)');
    toast.style.setProperty('border-radius', '10px');
    toast.style.marginTop = '50px';
    await toast.present();
  }


  async guardarAsignacion(){
    this.newAsignation.nombreTarea = this.selectedTask;
    this.newAsignation.fechaInicio = this.dateInit;
    this.newAsignation.fechaFin = this.dateEnd;

    if(this.selectedTask != '' && this.selectedStudent != '' && this.dateInit != '' && this.dateEnd != ''){
      const guardadoExitoso = await this.firebaseService.addTaskToStudent(this.selectedStudent, this.newAsignation);
      console.log('Datos guardados en Firestore con éxito');  
      
      if (guardadoExitoso) {
        this.mostrarToast('Guardado con éxito', true);
        console.log('exito');
      } else {
        this.mostrarToast('Error al guardar', false);
        console.log('error1');

      }
    }else{
      this.mostrarToast('Error al guardar', false);
      console.log('error2');

    }
    
    this.initializeComponents();
    
  }

}
