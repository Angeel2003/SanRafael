import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
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
  imgAgenda: string = '';
  loading: boolean = true;

  constructor(private firebaseService: FirebaseService) {
    addIcons({
    })
  }

  ngOnInit() {
    const imagePath = 'pictogramas/agenda.png';
    this.loadTareas();
    this.loadImagen(imagePath);
  }

  // Cargar imagen icono agenda
  async loadImagen(imagePath: string) {
    //console.log(imagePath);

    try {
      this.imgAgenda = await this.firebaseService.getImageUrl(imagePath);
    } catch (error) {
      console.error("Error al cargar la imagen: ", error);
      this.imgAgenda = '';
    }
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
      console.log("Datos obtenidos de Firebase:", tareasFromFirebase);
  
      this.tareas = tareasFromFirebase
        .map((tarea: Tarea) => ({
          nombre: tarea.nombre || 'Sin nombre',
          imagen: tarea.imagen || ''
        }))
        .filter(tarea => tarea.nombre !== 'Sin nombre'); // Filtrar tareas no válidas
  
      console.log("Tareas válidas después del filtro:", this.tareas);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      this.tareas = [];
    } finally {
      this.loading = false;
    }
  }
  
  
}
