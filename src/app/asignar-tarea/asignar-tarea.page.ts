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
  today = new Date();

  constructor(private firebaseService: FirebaseService, private toastController: ToastController) { }

  async ngOnInit() {
    try {
      this.taskNames = await this.firebaseService.getAllTaskNames();
      this.studentNames = await this.firebaseService.getAllStudentsNames();
      this.filteredTasks = [...this.taskNames]; 
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
  }

  async onSelectStudent(event: any) {
    const studentName = event.detail.value;
    this.selectedValueAcces = await this.firebaseService.getAllDefaultAccesValues(studentName);
  }

  initializeComponents(){
    this.selectedTask = '';
    this.selectedStudent = '';
    this.selectedValueAcces = [];
    this.dateInit = '';
    this.dateEnd = '';
    this.today = new Date();
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
  }

  onDateEndChange(event: any){
    this.dateEnd = event.detail.value;

  }

  handleBlur() {
    const ionSelect = document.querySelector('ion-select');
    if (ionSelect) {
      ionSelect.blur(); // Forzar que el foco salga de manera segura
    }
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


  async guardarAsignacion() {
    this.newAsignation.nombreTarea = this.selectedTask;
    this.newAsignation.fechaInicio = this.dateInit;
    this.newAsignation.fechaFin = this.dateEnd;
  
    const fechaIni = new Date(this.dateInit);
    const fechaEnd = new Date(this.dateEnd);
    
    // Validar que las fechas sean correctas
    if (!this.selectedTask || !this.selectedStudent || !this.dateInit || !this.dateEnd) {
      this.mostrarToast('Faltan datos para guardar la asignación', false);
      return;
    }
  
    // Comprobamos que la fecha de inicio no esté en el pasado y que la fecha de fin sea posterior a la de inicio
    if (fechaIni < this.today) {
      this.mostrarToast('La fecha de inicio no puede ser anterior al día de hoy', false);
      return;
    }
  
    if (fechaEnd.getDate() < fechaIni.getDate()) {
      this.mostrarToast('La fecha de fin no puede ser anterior a la de inicio', false);
      return;
    }
  
    try {
      // Guardar la asignación en Firestore
      const guardadoExitoso = await this.firebaseService.addTaskToStudent(this.selectedStudent, this.newAsignation);
  
      if (guardadoExitoso) {
        this.mostrarToast('Guardado con éxito', true);
        this.initializeComponents(); // Reinicia los campos tras un guardado exitoso
      } else {
        this.mostrarToast('Error al guardar los datos', false);
      }
    } catch (error) {
      console.error('Error al guardar la asignación:', error);
      this.mostrarToast('Error inesperado al guardar', false);
    }
  }
  
}
