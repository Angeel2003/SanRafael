import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonButton, IonIcon, IonGrid, IonRow, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';

interface Tareas {
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

  tareas: Tareas[] = [];

  constructor() {
    addIcons({

    })
    
    this.tareas.push({nombre: "A", imagen: '', horaIni: "10:00", horaFin: "13:00"});
    this.tareas.push({nombre: "B", imagen: '', horaIni: "10:00", horaFin: "13:00"});
  }

  ngOnInit() {
  }
}
