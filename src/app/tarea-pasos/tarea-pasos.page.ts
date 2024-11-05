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

  stepTextValues: string[] = []; // Almacena los textos de cada paso en el tab 'texto'
  stepPictoValues: (File | null | string)[] = []; // Almacena las imágenes de pictogramas
  stepImgValues: (File | null | string)[] = []; // Almacena las imágenes
  stepVideoValues: (File | null | string)[] = []; // Almacena los videos de los pasos
 

  constructor(private firebaseService: FirebaseService) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      addOutline
    });
  }

  imgPreview(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.previewUrl = file;
    }
  }
  

  // pictoStep(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length) {
  //     const file = input.files[0];
  //     this.selectedPicto.push(file);
  //   }
  // }

  pictoStep(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedPicto[index] = file; // Almacena el archivo
      this.stepPictoValues[index] = URL.createObjectURL(file); // Crea una URL para mostrar la imagen
      console.log('Archivo seleccionado:', file); // Verifica que el archivo se ha seleccionado
    } else {
      console.log('No se seleccionó ningún archivo'); // Mensaje si no hay archivos
    }
  }
  

  imgStep(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedImages[index] = file; // Almacena el archivo
      this.stepImgValues[index] = URL.createObjectURL(file); // Crea una URL para mostrar la imagen
      console.log('Archivo seleccionado:', file); // Verifica que el archivo se ha seleccionado
    } else {
      console.log('No se seleccionó ningún archivo'); // Mensaje si no hay archivos
    }
  }

  videoStep(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedVideos[index] = file; // Almacena el archivo
      this.stepVideoValues[index] = URL.createObjectURL(file); // Crea una URL para mostrar la imagen
      console.log('Archivo seleccionado:', file); // Verifica que el archivo se ha seleccionado
    } else {
      console.log('No se seleccionó ningún archivo'); // Mensaje si no hay archivos
    }
  }

  videoCompleto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.videoCompletoFile = file;
    }
  }

  audioStep(event: Event) {
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
    if (this.currentTab === 'texto') {
      const stepTextNumber = this.stepText.length + 1;
      this.stepText.push(`${stepTextNumber}`);
      this.stepTextValues.push(''); // Inicializa un valor vacío para el nuevo paso
    } else if (this.currentTab === 'picto') {
      const stepPictoNumber = this.stepPicto.length + 1;
      this.stepPicto.push(`${stepPictoNumber}`);
      this.stepPictoValues.push(null); // Inicializa un valor nulo para el nuevo pictograma
    } else if (this.currentTab === 'imagenes') {
      const stepImgNumber = this.stepImg.length + 1;
      this.stepImg.push(`${stepImgNumber}`);
      this.stepImgValues.push(null); // Inicializa un valor nulo para la nueva imagen
    } else if (this.currentTab === 'videoPasos') {
      const stepVideoNumber = this.stepVideo.length + 1;
      this.stepVideo.push(`${stepVideoNumber}`);
      this.stepVideoValues.push(null); // Inicializa un valor nulo para el nuevo video
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

