import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonButton, IonIcon, IonGrid, IonRow, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';

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
  imports: [IonLabel, IonItem, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon, IonGrid, IonRow, IonButtons, IonBackButton]
})


export class AgendaPage implements OnInit {

  tareas: Tarea[] = [];

  constructor(private firebaseService: FirebaseService) {
    addIcons({
    })

    // this.tareas.push({nombre: "A", imagen: '', horaIni: "10:00", horaFin: "13:00"});
    // this.tareas.push({nombre: "B", imagen: '', horaIni: "10:00", horaFin: "13:00"});
  }

  ngOnInit() {
    this.loadTareas();
  }

  async loadTareas() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const tareasFromFirebase = await this.firebaseService.getTareasForUser(userId);
      console.log("Tareas obtenidas desde Firebase: ", tareasFromFirebase);

      // Filtrar tareas no válidas y asignar las propiedades necesarias
      this.tareas = tareasFromFirebase
        .filter((tarea: Tarea) => tarea.nombre || tarea.imagen || tarea.horaIni || tarea.horaFin) // Filtra tareas vacías
        .map((tarea: Tarea) => ({
          nombre: tarea.nombre || 'Sin nombre',
          imagen: tarea.imagen || '', // Deja vacío si no hay imagen
          horaIni: tarea.horaIni || 'Sin hora de inicio',
          horaFin: tarea.horaFin || 'Sin hora de fin'
        }));

      console.log("Tareas cargadas (después de filtrar):", this.tareas);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

}
  
  
  
