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

  constructor(private firebaseService: FirebaseService) {
    addIcons({
    })
  }

  ngOnInit() {
    const imagePath = 'pictogramas/agenda.png';
    this.loadTareas();
    this.loadImagen(imagePath);
  }

  async loadImagen(imagePath: string) {
    console.log(imagePath);

    const urlImagen = 'gs://aplicacion-d5cbf.appspot.com/pictogramas/agenda.png';

    console.log('URL de la imagen:', urlImagen);

    try {
      this.imgAgenda = await this.firebaseService.getImageUrl(imagePath);
    } catch (error) {
      console.error("Error al cargar la imagen: ", error);
      this.imgAgenda = '';
    }
  }

  loading: boolean = true;

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
        imagen: tarea.imagen || ''
      }));
      console.log("Tareas cargadas:", this.tareas);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      this.loading = false; // Desactivar indicador de carga
    }
  }
}
