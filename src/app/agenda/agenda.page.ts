import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSpinner, IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonButton, IonIcon, IonGrid, IonRow, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';

export interface Tarea {
  nombre: string,
  imagen: string,
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonLabel, IonItem, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon, IonGrid, IonRow, IonButtons, IonBackButton]
})


export class AgendaPage implements OnInit {
  tareas: Tarea[] = [];
  nivelesAccesibilidad: string = '';
  loading: boolean = true;
  tareasCompletas: any[] = [];
  previewAgenda: any;

  constructor(private firebaseService: FirebaseService) {
    this.cargarTareasCompletas();
  }
  
  async cargarTareasCompletas(): Promise<void> {
    const collectionNames = ['tarea-por-pasos', 'tarea-material', 'tarea-comanda'];
  
    for (const collectionName of collectionNames) {
      // Obtiene todas las tareas de la colección
      const tareas = await this.firebaseService.getTareasDeColeccion(collectionName);
  
      // Combina las tareas obtenidas con las ya existentes
      this.tareasCompletas = this.tareasCompletas.concat(tareas);
    }
  }


  async ngOnInit() {
    this.previewAgenda = await this.firebaseService.getImageUrl('pictogramas/agenda.png');

    await this.loadAccesibilityLevels();
    await this.loadTareas();
  }

  getPreviewFromTask(taskName: string){
    let preview = '';

    for(let i = 0; i < this.tareasCompletas.length; i++){
      if(this.tareasCompletas[i].nombre == taskName){
        preview = this.tareasCompletas[i].previewUrl;
      }
    }

    return preview;
  }

  // Carga los niveles de accesibilidad del usuario actual
  async loadAccesibilityLevels() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    try {
      this.nivelesAccesibilidad = await this.firebaseService.getStudentDoc(userId);
    } catch (error) {
      console.error('Error al cargar los niveles de accesibilidad:', error);
    }
  }

  // Carga las tareas asignadas al usuario actual
  async loadTareas() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    this.loading = true;

    try {
      const tareasFromFirebase = await this.firebaseService.getTareasForUser(userId);
      this.tareas = tareasFromFirebase.map((tarea: Tarea) => ({
        nombre: tarea.nombre || '',
        imagen: this.getPreviewFromTask(tarea.nombre),
      }));
      console.log("Tareas cargadas:", this.tareas);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    } finally {
      this.loading = false;
    }
  }
}