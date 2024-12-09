import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonToast
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-tarea-pasos',
  templateUrl: './tarea-pasos.page.html',
  styleUrls: ['./tarea-pasos.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, IonFooter,
    IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgClass, FormsModule, IonBackButton, IonButtons,
    IonToast 
  ],
})

export class TareaPasosPage {
  taskName: string = '';
  taskPreview: File | null = null;
  taskDescription: string = '';
  currentTab: string = 'video';
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
  videoPreviewUrl: string | null = null;
  previewUrl: string | null = null;
  showToast: boolean = false;
  toastMessage: string = '';
  toastClass: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router, private toastController: ToastController) {
    addIcons({
      addOutline
    });
  }

  initializeComponents(){
    this.taskName = '';
    this.taskDescription = '';
    this.taskPreview = null;
    this.currentTab = 'video';
    this.stepText = [];
    this.stepPicto = [];
    this.stepImg = [];
    this.stepVideo = [];
    this.videoCompletoFile = null;
    this.audioCompletoFile = null;
    this.selectedText = [];
    this.selectedPicto = [];
    this.selectedImages = [];
    this.selectedVideos = [];

    this.stepTextValues = []; // Almacena los textos de cada paso en el tab 'texto'
    this.stepPictoValues = []; // Almacena las imágenes de pictogramas
    this.stepImgValues = []; // Almacena las imágenes
    this.stepVideoValues = []; // Almacena los videos de los pasos
    this.videoPreviewUrl = null;
    this.previewUrl = null;
    this.showToast = false;
  }

  goBackToAdmin() {
    this.router.navigate(['/admin-dentro']);
  }

  imgPreview(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.taskPreview = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }
  
  pictoStep(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedPicto[index] = file; // Almacena el archivo
      this.stepPictoValues[index] = URL.createObjectURL(file); // Crea una URL para mostrar la imagen
    }
  }
  

  imgStep(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedImages[index] = file; // Almacena el archivo
      this.stepImgValues[index] = URL.createObjectURL(file); // Crea una URL para mostrar la imagen
    }
  }

  videoStep(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedVideos[index] = file; // Almacena el archivo
      this.stepVideoValues[index] = URL.createObjectURL(file); // Crea una URL para mostrar la imagen
    }
  }

  videoCompleto(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const videoFile = fileInput.files[0];
      this.videoPreviewUrl = URL.createObjectURL(videoFile); // Crea una URL de vista previa
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
    const stepTextNumber = this.stepText.length + 1;
    this.stepText.push(`${stepTextNumber}`);
    this.stepTextValues.push('');
    const stepPictoNumber = this.stepPicto.length + 1;
    this.stepPicto.push(`${stepPictoNumber}`);
    this.stepPictoValues.push(null);
    const stepImgNumber = this.stepImg.length + 1;
    this.stepImg.push(`${stepImgNumber}`);
    this.stepImgValues.push(null);
    const stepVideoNumber = this.stepVideo.length + 1;
    this.stepVideo.push(`${stepVideoNumber}`);
    this.stepVideoValues.push(null);

  }
  

  async mostrarToast(mensaje: string, exito: boolean) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    if(exito){
      toast.style.setProperty('--background', '#4caf50');
    }else{
      toast.style.setProperty('--background', '#fa3333');
    }
    toast.style.setProperty('--color', '#ffffff');
    toast.style.setProperty('font-weight', 'bold');
    toast.style.setProperty('font-size', 'xx-large');
    toast.style.setProperty('text-align', 'center');
    toast.style.setProperty('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.7)');
    toast.style.setProperty('border-radius', '10px');
    toast.style.marginTop = '50px';
    await toast.present();
  }

  async guardarTarea() {
    const timestamp = new Date().getTime();

    const dataToSave: any = {
      nombre: this.taskName,
      previewUrl: '',
      description: this.taskDescription,
      pasosTexto: this.stepTextValues,
      pasosPicto: [],
      pasosImagenes: [],
      pasosVideos: [],
      videoCompletoUrl: '',
      audioCompletoUrl: ''
    };

    if (this.taskPreview) {
      const path = `imagenes/preview_imagen_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(this.taskPreview, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.previewUrl = downloadUrl;
    }

    for (const [index, file] of this.selectedPicto.entries()) {
      const path = `pictogramas/picto_${index}_${timestamp}.png`;
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

    this.videoPreviewUrl = null;
   

    if(this.taskDescription != '' && this.taskName != '' && this.taskPreview != null &&  (this.videoCompletoFile != null || this.audioCompletoFile != null 
      || this.stepPicto.length != 0 || this.stepImg.length != 0 || this.stepVideo.length != 0 || this.stepText.length != 0)){
      
      const guardadoExitoso = await this.firebaseService.guardarTareaPorPasos(dataToSave);
      
      if (guardadoExitoso) {
        this.mostrarToast('Guardado con éxito', true);
      } else {
        this.mostrarToast('Error al guardar', false);

      }
    }else{
      this.mostrarToast('Error al guardar', false);

    }
    
    this.initializeComponents();

  }
}
