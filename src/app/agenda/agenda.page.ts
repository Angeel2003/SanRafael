import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSpinner, IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonButton, IonIcon, IonGrid, IonRow, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkOutline } from 'ionicons/icons';
import { FirebaseService } from '../services/firebase.service';
import { NavigationExtras, Router } from '@angular/router';
import { TareasVencidasService } from '../services/tareas-vencidas.service';
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';

export interface Tarea {
  nombre: string;
  imagen: string;
  fechaInicio: any; 
  fechaFin: any; 
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
  tareaADevolver: TareaDevolver = { tarea: null, tipoTarea: ''};
  fullUser: any;
  fechaHoy: Date | undefined;
  currentPage = 1;
  tareasPerPage = 3;
  finTarea = false;

  constructor(private firebaseService: FirebaseService, private router: Router, private tareasVencidasService: TareasVencidasService) {

    addIcons({
      closeOutline,
      checkmarkOutline
    })
  }
  
  async cargarTareasCompletas(): Promise<void> {
    const collectionNames = ['tarea-por-pasos', 'tarea-material', 'tarea-comanda'];

    for (const collectionName of collectionNames) {
      try {
        // Obtiene todas las tareas de la colección
        const tareas = await this.firebaseService.getTareasDeColeccion(collectionName);
        // Concatenar las tareas obtenidas con las tareasCompletas
        this.tareasCompletas = [...this.tareasCompletas, ...tareas];
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('User ID not found in localStorage');
          return;
        }

        try {
          this.fullUser = await this.firebaseService.obtenerUsuario(userId);
          this.nivelesAccesibilidad = this.fullUser.nivelAccesibilidad;
        } catch (error) {
          console.error('Error al cargar los niveles de accesibilidad:', error);
        }
        
      } catch (error) {
        console.error('Error al cargar tareas de la colección', collectionName, error);
      }
    }
  }


  async ngOnInit() {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline
    })

    this.previewAgenda = await this.firebaseService.getImageUrl('pictogramas/agenda.png');
    this.fechaHoy = new Date();

    await this.cargarTareasCompletas();
    await this.loadTareas();    
     
    await this.tareasVencidasService.moverTareasVencidas();

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
      this.tareas = tareasFromFirebase.map((tarea: any) => ({
        nombre: tarea.nombre || '',
        imagen: this.getPreviewFromTask(tarea.nombre),
        fechaInicio: tarea.fechaInicio ? new Date(tarea.fechaInicio) : null,
        fechaFin: tarea.fechaFin ? new Date(tarea.fechaFin) : null,
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

  async realizarTareaPrincipal(tareaPulsada: Tarea){
    await this.getTareaByNombre(tareaPulsada.nombre);

    const navigationExtras: NavigationExtras = {
      state: {
        tarea: this.tareaADevolver.tarea,
        tipoTarea: this.tareaADevolver.tipoTarea,
        fechaInicio: tareaPulsada.fechaInicio ? new Date(tareaPulsada.fechaInicio) : null,
        fechaFin: tareaPulsada.fechaFin ? new Date(tareaPulsada.fechaFin) : null,
        nivelesAccesibilidad: this.nivelesAccesibilidad,
        usuario: this.fullUser
      }
    };
    this.router.navigate(['/realizar-tarea-principal'], navigationExtras);
  }

  isPastEndTime(fechaFin: string | Date): boolean {
    const now = new Date(); // Fecha y hora actuales
    const endTime = new Date(fechaFin); // Convertir fecha de fin
    return now > endTime; // Comparar si ya pasó la hora de fin
  }

  isFinished(tarea: any): boolean {
    
    let tareasPendientes = this.fullUser.tareasPendientes || [];
    const existeEnPendientes = tareasPendientes.some(
      (t: any) => t.nombreTarea === tarea.nombre
    );
    
    return existeEnPendientes; // Comparar si ya pasó la hora de fin
  }
  
  get paginatedTareas() {
    const start = (this.currentPage - 1) * this.tareasPerPage;
    const end = start + this.tareasPerPage;
    return this.tareas.slice(start, end);
  }
  
  get maxPage() {
    return Math.ceil(this.tareas.length / this.tareasPerPage);
  }
  

  prevPage() {
    this.finTarea = false;
    
    if (this.currentPage > 0) {
      this.currentPage--;
    } 
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    } else {
      this.currentPage++;
      this.finTarea = true;
    }
  }

}