import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { IonSpinner, IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonButton, IonIcon, IonGrid, IonRow, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';

export interface Tarea {
  nombre: string,
  imagen: string,
  horaIni: string,
  horaFin: string
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

  async loadTareas() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    this.loading = true; // Activar indicador de carga

    try {
      const tareasFromFirebase = await this.firebaseService.getTareasForUser(userId);
      console.log("Tareas obtenidas desde Firebase: ", tareasFromFirebase);
      this.tareas = tareasFromFirebase.map((tarea: Tarea) => ({
        nombre: tarea.nombre || '',
        imagen: this.getPreviewFromTask(tarea.nombre),
        horaIni: tarea.horaIni || '',
        horaFin: tarea.horaFin || ''
      }));
      console.log("Tareas cargadas:", this.tareas);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      this.loading = false; // Desactivar indicador de carga
    }
  }

  
}



