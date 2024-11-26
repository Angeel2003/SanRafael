import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSpinner, IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonButton, IonIcon, IonGrid, IonRow, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';

export interface Tarea {
  nombre: string,
  imagen: string
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
  tareasCompletas: any[] = [];
  loading: boolean = true;

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
  
    console.log('Tareas completas:', this.tareasCompletas);
  }

  ngOnInit() {
    const imagePath = 'pictogramas/agenda.png';
    this.loadTareas();
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

  // Cargar tareas de la base de datos
  async loadTareas() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in localStorage");
      this.tareas = [];
      this.loading = false;
      return;
    }
  
    try {
      const tareasFromFirebase = await this.firebaseService.getTareasForUser(userId);
      console.log("Tareas obtenidas desde Firebase: ", tareasFromFirebase);
      this.tareas = tareasFromFirebase.map((tarea: Tarea) => ({
        nombre: tarea.nombre || '',
        imagen: this.getPreviewFromTask(tarea.nombre)
      }))
      .filter(tarea => tarea.nombre !== 'Sin nombre');
      console.log("Tareas cargadas:", this.tareas);

    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      this.tareas = [];
    } finally {
      this.loading = false;
    }
  }
}
