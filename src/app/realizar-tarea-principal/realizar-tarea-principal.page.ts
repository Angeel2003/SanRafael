import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { arrowBackOutline, arrowForwardOutline, playOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonCol, IonBackButton, IonButtons, IonRow, IonIcon, IonButton, IonGrid } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

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
  selector: 'app-realizar-tarea-principal',
  templateUrl: './realizar-tarea-principal.page.html',
  styleUrls: ['./realizar-tarea-principal.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, CommonModule, FormsModule, IonCol, IonBackButton, IonButtons, IonRow, IonIcon, IonButton, IonGrid]
})

export class RealizarTareaPrincipalPage implements OnInit {
  tarea: any;
  tipoTarea: string = '';
  nivelAccesibilidad: string = '';
  tareas: Tarea[] = [];
  tareaADevolver: TareaDevolver = { tarea: null, tipoTarea: '' };
  showPlayButton = true;
  timeoutId: any;
  @ViewChild('videoPlayer', { static: false })
  videoPlayer!: ElementRef<HTMLVideoElement>; // Referencia del video
  aulas: any[] = [];

  constructor(private router: Router, private firebaseService: FirebaseService) {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      playOutline
    })

    const navigation = this.router.getCurrentNavigation();
    this.tarea = navigation?.extras.state?.['tarea'];
    this.tipoTarea = navigation?.extras.state?.['tipoTarea'];
    this.nivelAccesibilidad = navigation?.extras.state?.['nivelesAccesibilidad'];
    this.showPlayButton = true;

  }

  async ngOnInit() {
    if(this.tipoTarea == 'tarea-comanda') {
      this.aulas = await this.firebaseService.getCollection('aulas');
      console.log(this.aulas);
    }
    
  }
  

  async realizarTareaPasos(tareaPulsada: Tarea, video: HTMLVideoElement){
    if (!video.paused) {
      video.pause();
    }
    await this.getTareaByNombre(tareaPulsada.nombre);

    const navigationExtras: NavigationExtras = {
      state: {
        tarea: this.tareaADevolver.tarea,
        tipoTarea: this.tareaADevolver.tipoTarea,
        nivelesAccesibilidad: this.nivelAccesibilidad
      }
    };
    this.router.navigate(['/realizar-tarea-pasos'], navigationExtras);
  }

  async realizarTarea(tareaPulsada: Tarea){
    
    await this.getTareaByNombre(tareaPulsada.nombre);

    const navigationExtras: NavigationExtras = {
      state: {
        tarea: this.tareaADevolver.tarea,
        tipoTarea: this.tareaADevolver.tipoTarea,
        nivelesAccesibilidad: this.nivelAccesibilidad
      }
    };
    this.router.navigate(['/realizar-tarea-comanda-material'], navigationExtras);
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

  togglePlay(video: HTMLVideoElement) {
    if (video.paused) {
      video.play();
      this.hidePlayButtonAfterDelay(); // Oculta el botón tras reproducir
    } else {
      video.pause();
      this.showPlayButton = true; // Muestra el botón al pausar
    }
  }


  hidePlayButtonAfterDelay() {
    this.showPlayButton = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId); // Limpia cualquier temporizador previo
    }
    
  }

  entrarAula(aula: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        tarea: this.tarea,
        tipoTarea: this.tipoTarea,
        nivelesAccesibilidad: this.nivelAccesibilidad,
        aula: aula
      }
    };
    this.router.navigate(['/tarea-comanda'], navigationExtras);
  }
}

