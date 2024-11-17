import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
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
  taskName: string = 'hacer la cama';
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
  previewUrl: string | null = null;
  showToast: boolean = false;
  toastMessage: string = '';
  toastClass: string = '';

  tarea: any | null = null;

  
  constructor(private firebaseService: FirebaseService, private router: Router, private toastController: ToastController) {
    addIcons({
      addOutline
    });
  }

  
  ngOnInit() {
    if (this.taskName) {
      this.loadTask();
    }
  }

  loadTask() {
    this.firebaseService.getTareaPorPasos(this.taskName).subscribe((data) => {
      console.log('Datos recibidos de Firebase:', data); // Depuración
  
      if (data && Array.isArray(data) && data.length > 0) {
        this.tarea = data[0];
  
        this.previewUrl = this.tarea.previewUrl;
        this.taskDescription = this.tarea.description;
        this.taskName = this.tarea.nombre
        // Verifica y asigna los pasos
        this.stepText = Array.isArray(this.tarea.pasosTexto) ? this.tarea.pasosTexto : [];
        this.stepPicto = Array.isArray(this.tarea.pasosPicto) ? this.tarea.pasosPicto : [];
        this.stepImg = Array.isArray(this.tarea.pasosImagenes) ? this.tarea.pasosImagenes : [];
        this.stepVideo = Array.isArray(this.tarea.pasosVideos) ? this.tarea.pasosVideos : [];
  
        // Encuentra el número máximo de pasos entre todas las categorías
        const maxSteps = Math.max(
          this.stepText.length,
          this.stepPicto.length,
          this.stepImg.length,
          this.stepVideo.length
        );
  
        // Rellena cada lista para que tenga la misma longitud
        this.stepText = this.fillArray(this.stepText, maxSteps, '');
        this.stepPicto = this.fillArray(this.stepPicto, maxSteps, null);
        this.stepImg = this.fillArray(this.stepImg, maxSteps, null);
        this.stepVideo = this.fillArray(this.stepVideo, maxSteps, null);
  
        // Almacena los valores
        this.stepTextValues = [...this.stepText];
        this.stepPictoValues = [...this.stepPicto];
        this.stepImgValues = [...this.stepImg];
        this.stepVideoValues = [...this.stepVideo];
  
        // Maneja las URL de video y audio completo
        this.videoPreviewUrl = this.tarea.videoCompletoUrl || null;
        this.audioCompletoFile = this.tarea.audioCompletoUrl || null;
  
        console.log('Tarea cargada: ', this.tarea);
      } else {
        console.error("No se encontraron datos de tarea o el formato es incorrecto.");
      }
    }, (error) => {
      console.error("Error al cargar tarea: ", error);
    });
  }

  fillArray(array: any[], length: number, defaultValue: any): any[] {
    const newArray = [...array];
    while (newArray.length < length) {
      newArray.push(defaultValue);
    }
    return newArray;
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

  async modificarTarea() {
    const timestamp = new Date().getTime();
  
    const dataToSave: any = {
      nombre: this.taskName,
      previewUrl: this.previewUrl,
      description: this.taskDescription,
      pasosTexto: this.stepTextValues,
      pasosPicto: [],
      pasosImagenes: [],
      pasosVideos: [],
      videoCompletoUrl: '',
      audioCompletoUrl: ''
    };
  
    // Subir archivo de previsualización
    if (this.taskPreview) {
      const path = `imagenes/preview_imagen_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(this.taskPreview, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.previewUrl = downloadUrl;
    }
  
    // Subir pictogramas
    for (const [index, file] of this.selectedPicto.entries()) {
      const path = `pictograma/picto_${index}_${timestamp}.png`;
      await this.firebaseService.uploadFile(file, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.pasosPicto.push(downloadUrl);
    }
  
    // Subir imágenes
    for (const [index, file] of this.selectedImages.entries()) {
      const path = `imagenes/imagen_${index}_${timestamp}.png`;
      await this.firebaseService.uploadFile(file, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.pasosImagenes.push(downloadUrl);
    }
  
    // Subir videos
    for (const [index, file] of this.selectedVideos.entries()) {
      const path = `videos/paso_video_${index}_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(file, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.pasosVideos.push(downloadUrl);
    }
  
    // Subir video completo
    if (this.videoCompletoFile) {
      const path = `videos/video_completo_${timestamp}.mp4`;
      await this.firebaseService.uploadFile(this.videoCompletoFile, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.videoCompletoUrl = downloadUrl;
    }
  
    // Subir audio completo
    if (this.audioCompletoFile) {
      const path = `audios/audio_completo_${timestamp}.mp3`;
      await this.firebaseService.uploadFile(this.audioCompletoFile, path);
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.audioCompletoUrl = downloadUrl;
    }
  
    this.videoPreviewUrl = null;
    console.log({
      taskDescription: this.taskDescription,
      taskName: this.taskName,
      previewUrl: this.previewUrl,
      videoCompletoFile: this.videoCompletoFile,
      audioCompletoFile: this.audioCompletoFile,
      stepPicto: this.stepPicto,
      stepImg: this.stepImg,
      stepVideo: this.stepVideo,
      stepText: this.stepText,
    });
    
    // Validación de datos
    if (
      this.taskDescription != '' &&
      this.taskName != '' &&
      (this.taskPreview != null || this.previewUrl != '') &&
      (this.videoCompletoFile != null ||
        this.audioCompletoFile != null ||
        this.stepPicto.length != 0 ||
        this.stepImg.length != 0 ||
        this.stepVideo.length != 0 ||
        this.stepText.length != 0)
    ) {
      let guardadoExitoso = false;
      if (this.tarea && this.tarea.id) {
        // Actualizar tarea existente
        guardadoExitoso = await this.firebaseService.actualizarTarea(this.tarea.id, dataToSave);
      }
  
      if (guardadoExitoso) {
        this.mostrarToast('Guardado con éxito', true);
      } else {
        this.mostrarToast('Error al guardar', false);
      }
    } else {
      this.mostrarToast('Error al guardar: Verifica los datos', false);
    }
    
    this.loadTask();
  }
  

}
