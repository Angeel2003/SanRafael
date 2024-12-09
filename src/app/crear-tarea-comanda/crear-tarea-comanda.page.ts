import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowBackOutline, personCircleOutline, addOutline } from 'ionicons/icons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonButtons, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonList, IonBackButton, IonFooter, IonCheckbox, IonSelect, IonSelectOption, IonRadio, IonRadioGroup } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

export interface OrderTask {
  nombre: string;
  previewUrl: string;
  aula: string;
}

@Component({
  selector: 'app-crear-tarea-comanda',
  templateUrl: './crear-tarea-comanda.page.html',
  styleUrls: ['./crear-tarea-comanda.page.scss'],
  standalone: true,
  imports: [IonRadioGroup, IonRadio, IonSelectOption, IonSelect, IonCheckbox, IonButtons, IonBackButton, IonFooter, IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class CrearTareaComandaPage implements OnInit {
  task: OrderTask = {
    nombre: '',
    previewUrl: '',
    aula: ''
  };
  imageFile: File | undefined;
  localImageURL: string | undefined;


  constructor(private firebaseService: FirebaseService, private router: Router) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      addOutline
    });
  }

  ngOnInit() { }

  loadFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.imageFile = file;
      this.localImageURL = URL.createObjectURL(file);
    }
  }

  async saveTask() {
    if (!this.task.nombre || !this.task.aula || !this.imageFile) {
      throw new Error('Missing data. Please file all fields');
    }

    const timestamp = new Date().getTime();

    const path = `imagenes/tarea-comanda_${timestamp}.png`;
    await this.firebaseService.uploadFile(this.imageFile, path);
    this.task.previewUrl = await this.firebaseService.getDownloadURL(path);

    this.firebaseService.guardarTareaComanda(this.task);
    this.router.navigate(['/perfil-admin-profesor']);
  }
}
