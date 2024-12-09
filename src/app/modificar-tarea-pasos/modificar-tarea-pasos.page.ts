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
  taskPreview: File | null = null;
  currentTab: string = 'video';
  videoCompletoFile: File | null = null;
  audioCompletoFile: File | null = null;
  selectedText: string[] = [];
  selectedPicto: File[] = [];
  selectedImages: File[] = [];
  selectedVideos: File[] = [];

  showToast: boolean = false;
  toastMessage: string = '';
  toastClass: string = '';

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
    this.task.pasosTexto = this.task.pasosTexto.filter((step: string) => step && step.trim() !== '');
    this.task.pasosPicto = this.task.pasosPicto.filter((step: any) => step !== null && step !== undefined);
    this.task.pasosImagenes = this.task.pasosImagenes.filter((step: any) => step !== null && step !== undefined);
    this.task.pasosVideos = this.task.pasosVideos.filter((step: any) => step !== null && step !== undefined);

    const maxSteps = Math.max(
      this.task.pasosTexto.length,
      this.task.pasosPicto.length,
      this.task.pasosImagenes.length,
      this.task.pasosVideos.length
    );

    // Rellena cada lista para que tenga la misma longitud
    this.task.pasosTexto = this.fillArray(this.task.pasosTexto, maxSteps, '');
    this.task.pasosPicto = this.fillArray(this.task.pasosPicto, maxSteps, null);
    this.task.pasosImagenes = this.fillArray(this.task.pasosImagenes, maxSteps, null);
    this.task.pasosVideos = this.fillArray(this.task.pasosVideos, maxSteps, null);

  }

  fillArray(array: any[], length: number, defaultValue: any): any[] {
    const newArray = [...array];
    while (newArray.length < length) {
      newArray.push(defaultValue);
    }
    return newArray;
  }

  goBackToGestionarTareas() {
    this.router.navigate(['/gestionar-tareas']);
  }

  imgPreview(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.taskPreview = file;
      this.task.previewUrl = URL.createObjectURL(file);
    }
  }
  
  pictoStep(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedPicto[index] = file; // Almacena el archivo
      this.task.pasosPicto[index] = URL.createObjectURL(file); // Crea una URL para mostrar la imagen
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
      this.task.pasosImagenes[index] = URL.createObjectURL(file); // Crea una URL para mostrar la imagen
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
      this.task.pasosVideos[index] = URL.createObjectURL(file); // Crea una URL para mostrar la imagen
      console.log('Archivo seleccionado:', file); // Verifica que el archivo se ha seleccionado
    } else {
      console.log('No se seleccionó ningún archivo'); // Mensaje si no hay archivos
    }
  }

  videoCompleto(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.videoCompletoFile = fileInput.files[0];
      this.task.videoCompletoUrl = URL.createObjectURL(this.videoCompletoFile); // Crea una URL de vista previa
    }
  }

  audioStep(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.audioCompletoFile = fileInput.files[0];
      this.task.audioCompletoUrl = URL.createObjectURL(this.audioCompletoFile); // Crea una URL de vista previa
    }
  }

  
  selectTab(tab: string) {
    this.currentTab = tab;
  }

  addStep() {
    this.task.pasosTexto.length += 1;
    this.task.pasosTexto.push('');
    this.task.pasosPicto.length += 1;
    this.task.pasosPicto.push(null);
    this.task.pasosImagenes.length += 1;
    this.task.pasosImagenes.push(null);
    this.task.pasosVideos.length += 1;
    this.task.pasosVideos.push(null);

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
        this.task.pasosTexto.splice(index, 1);
        break;
  
      case 'picto':
        this.task.pasosPicto.splice(index, 1);
        break;
  
      case 'imagenes':
        this.task.pasosImagenes.splice(index, 1);
        break;
  
      case 'videoPasos':
        this.task.pasosVideos.splice(index, 1);
        break;

      case 'video':
        this.task.videoCompletoUrl = '';
        break;

      case 'audio':
        this.task.audioCompletoUrl = '';
        break;
  
      default:
        console.error('Tipo de paso no válido');
      }
  
    // Asegurar que todas las listas tengan la misma longitud
    const maxLength = Math.max(
      this.task.pasosTexto?.length || 0,
      this.task.pasosPicto?.length || 0,
      this.task.pasosImagenes?.length || 0,
      this.task.pasosVideos?.length || 0
    );
  
    // Rellenar listas más cortas con valores vacíos
    this.rellenarConVacios(this.task.pasosTexto, maxLength, '');
    this.rellenarConVacios(this.task.pasosPicto, maxLength, null);
    this.rellenarConVacios(this.task.pasosImagenes, maxLength, null);
    this.rellenarConVacios(this.task.pasosVideos, maxLength, null);
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
      nombre: this.task.nombre,
      previewUrl: this.task?.previewUrl || '',
      description: this.task.description,
      pasosTexto: this.task?.pasosTexto || [],
      pasosPicto: this.task?.pasosPicto || [],
      pasosImagenes: this.task?.pasosImagenes || [],
      pasosVideos: this.task?.pasosVideos || [],
      videoCompletoUrl: this.task?.videoCompletoUrl || '',
      audioCompletoUrl: this.task?.audioCompletoUrl || '',
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
      const path = `pictogramas/picto_${index}_${timestamp}.png`;
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
      this.task.description != '' &&
      this.task.nombre != '' &&
      (this.task.previewUrl != null || dataToSave.previewUrl != '') &&
      (dataToSave.videoCompletoUrl != '' ||
        dataToSave.audioCompletoUrl != '' ||
        dataToSave.pasosPicto.length != 0 ||
        dataToSave.pasosImagenes.length != 0 ||
        dataToSave.pasosVideos.length != 0 ||
        dataToSave.pasosTexto.length != 0)
    ) {
      let guardadoExitoso = false;

      if (this.task && this.task.id) {
        // Actualizar tarea existente
        guardadoExitoso = await this.firebaseService.actualizarTarea(this.task.id, dataToSave, 'tarea-por-pasos');
      }

      if (guardadoExitoso) {
        this.mostrarToast('Modificado con éxito', true);
      } else {
        this.mostrarToast('Error al modificar', false);
      }
    } else {
      this.mostrarToast('Error al modificar: Verifica los datos', false);
    }

    this.goBackToGestionarTareas();
  }
  
  trackByIndex(index: number): number {
    return index;
  }

}
