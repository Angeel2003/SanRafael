import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonToast, IonTextarea
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-modificar-tarea-pasos',
  templateUrl: './modificar-tarea-pasos.page.html',
  styleUrls: ['./modificar-tarea-pasos.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, IonFooter,
    IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgClass, FormsModule, IonBackButton, IonButtons,
    IonToast, IonTextarea
  ],
})

export class ModificarTareaPasosPage implements OnInit {
  taskName: string = 'Hacer la cama';
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

  stepTextValues: string[] = [];
  stepPictoValues: (File | null | string)[] = [];
  stepImgValues: (File | null | string)[] = [];
  stepVideoValues: (File | null | string)[] = [];
  videoPreviewUrl: string | null = null;
  audioPreviewUrl: string | null = null;
  previewUrl: string | null = null;
  showToast: boolean = false;
  toastMessage: string = '';
  toastClass: string = '';

  tarea: any | null = null;
  task: any;

  
  constructor(private firebaseService: FirebaseService, private router: Router, private toastController: ToastController) {
    addIcons({
      addOutline,
      trashOutline
    });


    const navigation = this.router.getCurrentNavigation();
    this.task = navigation?.extras.state?.['task'];
  }

  
  ngOnInit() {
  }

  fillArray(array: any[], length: number, defaultValue: any): any[] {
    const newArray = [...array];
    while (newArray.length < length) {
      newArray.push(defaultValue);
    }
    return newArray;
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
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const videoFile = fileInput.files[0];
      this.videoPreviewUrl = URL.createObjectURL(videoFile); // Crea una URL de vista previa
    }
  }

  audioStep(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const audioFile = fileInput.files[0];
      this.audioPreviewUrl = URL.createObjectURL(audioFile); // Crea una URL de vista previa
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

  eliminarPaso(index: number, tipo: string): void {
    switch (tipo) {
      case 'texto':
        this.stepTextValues.splice(index, 1); // Elimina el texto en el índice dado
        this.stepText.splice(index, 1);
        this.tarea.pasosTexto.splice(index, 1);
        break;
  
      case 'picto':
        this.stepPictoValues.splice(index, 1); // Elimina el texto en el índice dado
        this.stepPicto.splice(index, 1);
        this.tarea.pasosPicto.splice(index, 1);
        break;
  
      case 'imagenes':
        this.stepImgValues.splice(index, 1); // Elimina el texto en el índice dado
        this.stepImg.splice(index, 1);
        this.tarea.pasosImagenes.splice(index, 1);
        break;
  
      case 'videoPasos':
        this.stepVideoValues.splice(index, 1); // Elimina el texto en el índice dado
        this.stepVideo.splice(index, 1);
        this.tarea.pasosVideos.splice(index, 1);
        break;

      case 'video':
        this.videoCompletoFile = null;
        this.videoPreviewUrl = '';
        this.tarea.videoCompletoUrl = '';
        break;

      case 'audio':
        this.audioCompletoFile = null;
        this.audioPreviewUrl = '';
        this.tarea.audioCompletoUrl = '';
        break;
  
      default:
        console.error('Tipo de paso no válido');
      }
  
    // Asegurar que todas las listas tengan la misma longitud
    const maxLength = Math.max(
      this.tarea.pasosTexto?.length || 0,
      this.tarea.pasosPicto?.length || 0,
      this.tarea.pasosImagenes?.length || 0,
      this.tarea.pasosVideos?.length || 0
    );
  
    // Rellenar listas más cortas con valores vacíos
    this.rellenarConVacios(this.tarea.pasosTexto, maxLength, '');
    this.rellenarConVacios(this.tarea.pasosPicto, maxLength, null);
    this.rellenarConVacios(this.tarea.pasosImagenes, maxLength, null);
    this.rellenarConVacios(this.tarea.pasosVideos, maxLength, null);
  }
  
  private rellenarConVacios(lista: any[], longitud: number, valor: any): void {
    while (lista.length < longitud) {
      lista.push(valor);
    }
  }
  

  async modificarTarea() {
    const timestamp = new Date().getTime();

    // Cargar datos existentes, si los hay
    const dataToSave: any = {
      nombre: this.taskName,
      previewUrl: this.tarea?.previewUrl || '',
      description: this.taskDescription,
      pasosTexto: this.stepText ? this.stepTextValues : this.tarea?.pasosTexto || [],
      pasosPicto: this.stepPicto ? this.stepPictoValues : this.tarea?.pasosPicto || [],
      pasosImagenes: this.stepImg ? this.stepImgValues : this.tarea?.pasosImagenes || [],
      pasosVideos: this.stepVideo ? this.stepVideoValues : this.tarea?.pasosVideos || [],
      videoCompletoUrl: this.videoCompletoFile ? this.videoPreviewUrl : this.tarea?.videoCompletoUrl || '',
      audioCompletoUrl: this.audioPreviewUrl ? this.audioCompletoFile : this.tarea?.audioCompletoUrl || '',
    };

    // Subir archivo de previsualización si se modificó
    if (this.taskPreview) {
      const path = `imagenes/preview_imagen_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(this.taskPreview, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.previewUrl = downloadUrl;
    }

    // Subir nuevos pictogramas
    for (const [index, file] of this.selectedPicto.entries()) {
      const path = `pictograma/picto_${index}_${timestamp}.png`;
      await this.firebaseService.uploadFile(file, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.pasosPicto.push(downloadUrl);
    }

    // Subir nuevas imágenes
    for (const [index, file] of this.selectedImages.entries()) {
      const path = `imagenes/imagen_${index}_${timestamp}.png`;
      await this.firebaseService.uploadFile(file, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.pasosImagenes.push(downloadUrl);
    }

    // Subir nuevos videos
    for (const [index, file] of this.selectedVideos.entries()) {
      const path = `videos/paso_video_${index}_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(file, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.pasosVideos.push(downloadUrl);
    }

    // Subir video completo si se modificó
    if (this.videoCompletoFile) {
      const path = `videos/video_completo_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(this.videoCompletoFile, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.videoCompletoUrl = downloadUrl;
    }

    // Subir audio completo si se modificó
    if (this.audioCompletoFile) {
      const path = `audios/audio_completo_${timestamp}.mp3`;
      await this.firebaseService.uploadFile(this.audioCompletoFile, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.audioCompletoUrl = downloadUrl;
    }

    // Validación de datos antes de guardar
    if (
      this.taskDescription != '' &&
      this.taskName != '' &&
      (this.taskPreview != null || dataToSave.previewUrl != '') &&
      (dataToSave.videoCompletoUrl != '' ||
        dataToSave.audioCompletoUrl != '' ||
        dataToSave.pasosPicto.length != 0 ||
        dataToSave.pasosImagenes.length != 0 ||
        dataToSave.pasosVideos.length != 0 ||
        dataToSave.pasosTexto.length != 0)
    ) {
      let guardadoExitoso = false;

      if (this.tarea && this.tarea.id) {
        // Actualizar tarea existente
        guardadoExitoso = await this.firebaseService.actualizarTarea(this.tarea.id, dataToSave, 'tarea-por-pasos');
      }

      if (guardadoExitoso) {
        this.mostrarToast('Guardado con éxito', true);
      } else {
        this.mostrarToast('Error al guardar', false);
      }
    } else {
      this.mostrarToast('Error al guardar: Verifica los datos', false);
    }

    this.goBackToAdmin();
  }
  

}
