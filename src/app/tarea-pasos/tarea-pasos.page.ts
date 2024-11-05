import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { arrowBackOutline, personCircleOutline, addOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tarea-pasos',
  templateUrl: './tarea-pasos.page.html',
  styleUrls: ['./tarea-pasos.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, IonFooter,
    IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgClass, FormsModule
  ],
})

export class TareaPasosPage {
  taskName: string = '';
  previewUrl: File | null = null;
  currentTab: string = 'texto';
  stepText: string[] = [];
  stepPicto: string[] = [];
  stepImg: string[] = [];
  stepVideo: string[] = [];
  videoCompletoFile: File | null = null;
  audioCompletoFile: File | null = null;
  selectedText: string[] = [];
  selectedPicto: File[] = [];
  selectedImages: File[] = [];
  selectedVideos: File[] = [];

  constructor(private firebaseService: FirebaseService) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      addOutline
    });
  }

  imagenPreview(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.previewUrl = file;
    }
  }

  pictoPaso(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedPicto.push(file);
    }
  }

  imagenPaso(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedImages.push(file);
    }
  }

  videoPaso(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedVideos.push(file);
    }
  }

  videoCompleto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.videoCompletoFile = file;
    }
  }

  audioPaso(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.audioCompletoFile = file;
    }
  }

  
  selectTab(tab: string) {
    this.currentTab = tab;
  }

  addStep() {
    if(this.currentTab == 'texto'){
      const stepTextNumber = this.stepText.length + 1; // Genera el número del paso
      this.stepText.push(`${stepTextNumber}`); // Añade el paso al array  
    }else if(this.currentTab == 'picto'){
      const stepPictoNumber = this.stepPicto.length + 1; // Genera el número del paso
      this.stepPicto.push(`${stepPictoNumber}`); // Añade el paso al array  
    }else if(this.currentTab == 'imagenes'){
      const stepImgNumber = this.stepImg.length + 1; // Genera el número del paso
      this.stepImg.push(`${stepImgNumber}`); // Añade el paso al array  
    }else if(this.currentTab == 'videoPasos'){
      const stepVideoNumber = this.stepVideo.length + 1; // Genera el número del paso
      this.stepVideo.push(`${stepVideoNumber}`); // Añade el paso al array  
    }
  }

  async guardarTarea() {
    const timestamp = new Date().getTime();

    const dataToSave: any = {
      nombre: this.taskName,
      previewUrl: '',
      pasosTexto: this.stepText,
      pasosPicto: [],
      pasosImagenes: [],
      pasosVideos: [],
      videoCompletoUrl: '',
      audioCompletoUrl: ''
    };

    if (this.previewUrl) {
      const path = `imagenes/preview_imagen_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(this.previewUrl, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.previewUrl = downloadUrl;
    }

    for (const [index, file] of this.selectedPicto.entries()) {
      const path = `pictograma/picto_${index}_${timestamp}.png`;
      await this.firebaseService.uploadFile(file, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.pasosPicto.push(downloadUrl);
    }

    for (const [index, file] of this.selectedImages.entries()) {
      const path = `imagenes/imagen_${index}_${timestamp}.png`;
      await this.firebaseService.uploadFile(file, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.pasosImagenes.push(downloadUrl);
    }

    for (const [index, file] of this.selectedVideos.entries()) {
      const path = `videos/paso_video_${index}_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(file, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.pasosVideos.push(downloadUrl);
    }

    if (this.videoCompletoFile) {
      const path = `videos/video_completo_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(this.videoCompletoFile, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.videoCompletoUrl = downloadUrl;
    }

    if (this.audioCompletoFile) {
      const path = `audios/audio_completo_${timestamp}.mp3`;
      await this.firebaseService.uploadFile(this.audioCompletoFile, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.audioCompletoUrl = downloadUrl;
    }

    await this.firebaseService.guardarTareaPorPasos(dataToSave);
    console.log('Datos guardados en Firestore con éxito');
  }
}

