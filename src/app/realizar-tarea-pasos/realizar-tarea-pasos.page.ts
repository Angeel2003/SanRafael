import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { arrowBackOutline, arrowForwardOutline, playOutline, volumeHigh } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonBackButton, IonButtons, IonRow, IonIcon, IonButton, IonGrid } from '@ionic/angular/standalone';
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
  selector: 'app-realizar-tarea-pasos',
  templateUrl: './realizar-tarea-pasos.page.html',
  styleUrls: ['./realizar-tarea-pasos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCol, IonBackButton, IonButtons, IonRow, IonIcon, IonButton, IonGrid]
})

export class RealizarTareaPage implements OnInit {
  tarea: any;
  tipoTarea: string = '';
  tareas: Tarea[] = [];
  tareaADevolver: TareaDevolver = { tarea: null, tipoTarea: '' };
  currentIndex: number = 0;
  nivelAccesibilidad: string = '';
  finTarea: boolean = false;
  imageOk: string = 'https://static.arasaac.org/pictograms/5397/5397_300.png';
  showPlayButton: boolean[] = [];
  timeoutId: any;
  videoStates: { [index: number]: boolean } = {};


  constructor(private router: Router, private firebaseService: FirebaseService) {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      playOutline,
      volumeHigh
    })

    const navigation = this.router.getCurrentNavigation();
    this.tarea = navigation?.extras.state?.['tarea'];
    this.tipoTarea = navigation?.extras.state?.['tipoTarea'];
    this.nivelAccesibilidad = navigation?.extras.state?.['nivelesAccesibilidad'];
  }

  ngOnInit() {
    this.initializeArrays();  
    
  }

  initializeArrays() {
    if(this.tipoTarea == 'tarea-por-pasos'){
      for (let i = 0; i < this.tarea.pasosVideos.length; i++) {
        this.videoStates[i] = false;
        this.showPlayButton[i] = true;
      }
    }
  }

  async irAPagPrincipalTarea(tareaPulsada: Tarea, nombrePagina: string){
    await this.getTareaByNombre(tareaPulsada.nombre);

    const navigationExtras: NavigationExtras = {
      state: {
        tarea: this.tareaADevolver.tarea,
        tipoTarea: this.tareaADevolver.tipoTarea,
        nivelesAccesibilidad: this.nivelAccesibilidad
      }
    };
    this.router.navigate([nombrePagina], navigationExtras);
  }

  prevIndex(tareaPulsada: Tarea) {
    this.finTarea = false;
    const nombrePagina = '/realizar-tarea-principal';

    if(this.currentIndex > 0) {
      this.currentIndex--;
    }else if(this.currentIndex == 0) {
      this.irAPagPrincipalTarea(tareaPulsada, nombrePagina);
    }
  }

  nextIndex() {
    if(this.nivelAccesibilidad == 'Audio'){
      this.currentIndex++;
      this.finTarea = true;
    }else{
      if(this.currentIndex < this.tarea.pasosPicto.length - 1) {
        this.currentIndex++;
      }else{
        this.currentIndex++;
        this.finTarea = true;
      }
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

  togglePlay(video: HTMLVideoElement, index: number) {
    if (video.paused) {
      video.play();

      if(this.nivelAccesibilidad == 'Video'){
        this.videoStates[index] = true;
        this.showPlayButton[index] = false;
      }

    } else {
      video.pause();

      if(this.nivelAccesibilidad == 'Video'){
        this.videoStates[index] = false;
        this.showPlayButton[index] = true;
      }

    }
  }

  hidePlayButtonAfterDelay(index:number) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId); // Limpia cualquier temporizador previo
    }
    
  }

  toggleAudio(audioElement: HTMLAudioElement) {
    if (audioElement.paused) {
      audioElement.play();  // Reproduce el audio si está pausado
    } else {
      audioElement.pause();  // Pausa el audio si está reproduciéndose
    }
  }
}
