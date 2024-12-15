import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { arrowBackOutline, arrowForwardOutline, playOutline, volumeHigh } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonBackButton, IonButtons, IonRow, IonIcon, IonButton, IonGrid } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AulasGuardadasService } from '../services/aulas-guardadas.service';
import { TareasVencidasService } from '../services/tareas-vencidas.service';


export interface Tarea {
  nombre: string;
  imagen: string;
  fechaInicio: any; 
  fechaFin: any; 
}


interface TareaDevolver {
  tarea: any;
  tipoTarea: string;
  fechaInicio: any; 
  fechaFin: any; 
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
  tareaADevolver: TareaDevolver = { tarea: null, tipoTarea: '', fechaInicio: null, fechaFin: null };
  currentPage: number = 0;
  nivelAccesibilidad: string = '';
  finTarea: boolean = false;
  imageOk: string = 'https://static.arasaac.org/pictograms/5397/5397_300.png';
  showPlayButton: boolean[] = [];
  timeoutId: any;
  videoStates: { [index: number]: boolean } = {};

  nombreTarea: string = "Nombe de la tarea/aula";
  menus: any[] = [];
  aula: string = '';
  thingsPerPage:number = 4;
  usuario: any;
  numberImages: { [key: number]: string } = {};
  aulaGuardada: boolean = false;

  constructor(private router: Router, private firebaseService: FirebaseService, 
              private tareasVencidasService: TareasVencidasService,
              private aulaService: AulasGuardadasService) {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      playOutline,
      volumeHigh
    })

    const navigation = this.router.getCurrentNavigation();
    this.tarea = navigation?.extras.state?.['tarea'];
    this.tipoTarea = navigation?.extras.state?.['tipoTarea'];
    this.tareaADevolver.fechaInicio = navigation?.extras.state?.['fechaInicio'];
    this.tareaADevolver.fechaFin = navigation?.extras.state?.['fechaFin'];
    this.nivelAccesibilidad = navigation?.extras.state?.['nivelesAccesibilidad'];
    this.aula = navigation?.extras.state?.['aula'];
    this.usuario = navigation?.extras.state?.['usuario'];
    this.aulaGuardada = navigation?.extras.state?.['aulaGuardada'];

  }

  async ngOnInit() {
    this.initializeArrays();  
    
    addIcons({
      arrowBackOutline,
      arrowForwardOutline
    })
    
    if(this.tipoTarea == 'tarea-comanda'){
      this.menus = await this.firebaseService.getCollection('menus');
    }

    this.loadNumberImages();
  }

  initializeArrays() {
    if(this.tipoTarea == 'tarea-por-pasos'){
      for (let i = 0; i < this.tarea.pasosVideos.length; i++) {
        this.videoStates[i] = false;
        this.showPlayButton[i] = true;
      }
    }
  }

  async loadNumberImages() {
    for (let i = 0; i <= 10; i++) { 
      const path = `pictogramas/numeros/${i}.png`;
      this.numberImages[i] = await this.firebaseService.getDownloadURL(path);
    }
  }

  getNumberImage(num: number): string {
    return this.numberImages[num] || ''; 
  }


  async irAPagPrincipalTarea(tareaPulsada: Tarea, nombrePagina: string){
    await this.getTareaByNombre(tareaPulsada.nombre);
    
    const navigationExtras: NavigationExtras = {
      state: {
        tarea: this.tareaADevolver.tarea,
        tipoTarea: this.tareaADevolver.tipoTarea,
        nivelesAccesibilidad: this.nivelAccesibilidad,
        fechaInicio: this.tareaADevolver.fechaInicio,
        fechaFin: this.tareaADevolver.fechaFin,
        usuario: this.usuario
      }
    };
    this.router.navigate([nombrePagina], navigationExtras);
  }

  async tareaTerminada(tareaPulsada: Tarea, nombrePagina: string){
    await this.getTareaByNombre(tareaPulsada.nombre);
    
    await this.tareasVencidasService.tareaTerminada(this.usuario, this.tareaADevolver);
    const navigationExtras: NavigationExtras = {
      state: {
        tarea: this.tareaADevolver.tarea,
        tipoTarea: this.tareaADevolver.tipoTarea,
        nivelesAccesibilidad: this.nivelAccesibilidad,
        fechaInicio: this.tareaADevolver.fechaInicio,
        fechaFin: this.tareaADevolver.fechaFin,
        usuario: this.usuario
      }
    };
    this.router.navigate([nombrePagina], navigationExtras);
  }

  aumentar(index: number){
    this.menus[index].num++;
    
  }

  decrementar(index: number){
    if(this.menus[index].num > 0){
      this.menus[index].num--;
    }
  }

  get paginatedUsers() {
    const start = this.currentPage * this.thingsPerPage;
    const end = start + this.thingsPerPage;

    if(this.tipoTarea == 'tarea-comanda') {
      return this.menus.slice(start, end);
    }else {
      return this.tarea.items.slice(start, end);
    }
    
  }

  get maxPage() {
    if(this.tipoTarea == 'tarea-comanda') {
      return Math.ceil(this.menus.length / this.thingsPerPage) - 1;
    } else {
      console.log(this.tarea.items.length);
      return Math.ceil(this.tarea.items.length / this.thingsPerPage) - 1;
    }
  }

  prevPage(tareaPulsada: Tarea) {
    this.finTarea = false;
    const nombrePagina = '/realizar-tarea-principal';

    if(this.currentPage > 0) {
      this.currentPage--;
    }else if(this.currentPage == 0) {
      this.irAPagPrincipalTarea(tareaPulsada, nombrePagina);
    }
  }

  nextPage() {
    if(this.tipoTarea == 'tarea-por-pasos'){
      if(this.nivelAccesibilidad == 'Audio') {
        this.currentPage++;
        this.finTarea = true;
      }else{
        if(this.currentPage < this.tarea.pasosPicto.length - 1) {
          this.currentPage++;
        }else{
          this.currentPage++;
          this.finTarea = true;
        }
      }
    }else {
      console.log(this.currentPage, this.maxPage);
      if (this.currentPage < this.maxPage) {
        this.currentPage++;
      }else {
        this.currentPage++;
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

  guardarComanda(tarea: Tarea, ruta: string) {
    this.aulaGuardada = true;
    // Actualizar el estado en el servicio
    this.aulaService.guardarComanda(this.aula);
    this.irAPagPrincipalTarea(tarea, ruta)
  }

  

}
