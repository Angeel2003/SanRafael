import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSpinner, IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonButton, IonIcon, IonGrid, IonRow, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';
import { NavigationExtras, Router } from '@angular/router';

export interface Tarea {
  nombre: string,
  imagen: string
}

interface TareaDevolver {
  tarea: any;
  tipoTarea: string;
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
  tareaADevolver: TareaDevolver = { tarea: null, tipoTarea: '' };

  constructor(private firebaseService: FirebaseService, private router: Router) {
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

  getIdFromTask(taskName: string){
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
        imagen: this.getPreviewFromTask(tarea.nombre)
      }));
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    } finally {
      this.loading = false;
    }
  }

  async getTareaByNombre(nombre: string) {
    try {
      const tareaPorPasos = await this.firebaseService.getDocumentByName('tarea-por-pasos', nombre);
      if (tareaPorPasos) {
        this.tareaADevolver.tarea = tareaPorPasos;
        this.tareaADevolver.tipoTarea = 'tarea-por-pasos';
      }
  
      const tareaComanda = await this.firebaseService.getDocumentByName('tarea-comanda', nombre);
      if (tareaComanda) {
        this.tareaADevolver.tarea = tareaComanda;
        this.tareaADevolver.tipoTarea = 'tarea-comanda';
      }
  
      const tareaMaterial = await this.firebaseService.getDocumentByName('tarea-material', nombre);
      if (tareaMaterial) {
        this.tareaADevolver.tarea = tareaMaterial;
        this.tareaADevolver.tipoTarea = 'tarea-material';
      }
    } catch (error) {
      console.error('Error al buscar la tarea:', error);
    }
  }

  async realizarTarea(tareaPulsada: Tarea){
    await this.getTareaByNombre(tareaPulsada.nombre);

    const navigationExtras: NavigationExtras = {
      state: {
        tarea: this.tareaADevolver.tarea,
        tipoTarea: this.tareaADevolver.tipoTarea,
        nivelesAccesibilidad: this.nivelesAccesibilidad
      }
    };
    this.router.navigate(['/realizar-tarea'], navigationExtras);
  }
}