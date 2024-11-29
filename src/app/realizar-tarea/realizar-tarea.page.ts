import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonBackButton, IonButtons, IonRow, IonIcon, IonButton, IonGrid } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-realizar-tarea',
  templateUrl: './realizar-tarea.page.html',
  styleUrls: ['./realizar-tarea.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCol, IonBackButton, IonButtons, IonRow, IonIcon, IonButton, IonGrid]
})
export class RealizarTareaPage implements OnInit {
  tarea: any;
  tipoTarea: string = '';
  currentIndex: number = 0;
  nivelAccesibilidad: string = '';

  constructor(private router: Router, private firebaseService: FirebaseService) {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline
    })

    const navigation = this.router.getCurrentNavigation();
    this.tarea = navigation?.extras.state?.['tarea'];
    this.tipoTarea = navigation?.extras.state?.['tipoTarea'];
    this.nivelAccesibilidad = navigation?.extras.state?.['nivelesAccesibilidad'];

  }

  ngOnInit() {
  }

  prevIndex() {
    if(this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextIndex() {
    if(this.currentIndex < this.tarea.pasosPicto.length) {
      this.currentIndex++;
    }
  }

}
