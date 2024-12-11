import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonIcon, IonButton, IonButtons, IonBackButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { addIcons } from 'ionicons';
import { arrowBack, arrowForward } from 'ionicons/icons';


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
  selector: 'app-realizar-tarea-comanda-material',
  templateUrl: './realizar-tarea-comanda-material.page.html',
  styleUrls: ['./realizar-tarea-comanda-material.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonGrid, IonRow, IonCol]
})

export class TareaComandaPage implements OnInit {
  nombreTarea: string = "Nombe de la tarea/aula";
  menus: any[] = [];
  tarea: any;
  tipoTarea: string = '';
  nivelAccesibilidad: string = '';
  tareas: Tarea[] = [];
  tareaADevolver: TareaDevolver = { tarea: null, tipoTarea: '' };
  showPlayButton:boolean = true;
  timeoutId: any;
  aula: string = '';
  currentPage:number = 0;
  menuPerPage:number = 4;

  numberImages: { [key: number]: string } = {};

  constructor(private router: Router, private firebaseService: FirebaseService) {
    const navigation = this.router.getCurrentNavigation();
    this.tarea = navigation?.extras.state?.['tarea'];
    this.tipoTarea = navigation?.extras.state?.['tipoTarea'];
    this.nivelAccesibilidad = navigation?.extras.state?.['nivelesAccesibilidad'];
    this.aula = navigation?.extras.state?.['aula'];

  }

  async ngOnInit() {
    addIcons({
      arrowBack,
      arrowForward
    })
    
    this.menus = await this.firebaseService.getCollection('menus');

    this.loadNumberImages();
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

  aumentar(index: number){
    if(this.tipoTarea == 'tarea-comanda') {
      this.menus[index].num++;
    }
  }

  decrementar(index: number){
    if(this.tipoTarea == 'tarea-comanda') {
      if(this.menus[index].num > 0){
        this.menus[index].num--;
      }

      this.menus[index].num++;
    }
  }

  get paginatedUsers() {
    
    if(this.tipoTarea == 'tarea-comanda') {
      const start = this.currentPage * this.menuPerPage;
      const end = start + this.menuPerPage;
      return this.menus.slice(start, end);
    }else {
      return;
    }
    
  }

  get maxPage() {
    
    return Math.ceil(this.menus.length / this.menuPerPage) - 1;
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  guardarSeleccion(){
    
  }
}
