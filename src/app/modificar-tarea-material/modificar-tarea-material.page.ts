import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { arrowBackOutline, personCircleOutline, addOutline } from 'ionicons/icons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonButtons, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonList, IonBackButton, IonFooter, IonCheckbox, IonSelect, IonSelectOption, IonRadio, IonRadioGroup, IonToast } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

interface MaterialItem {
  material: string;
  tamanio: string;
  color: string;
  imgTam: string,
  imgColor: string,
  imagen: string;
  aula: string;
  cantidad: number;
  imgCantidad: string;
}

@Component({
  selector: 'app-modificar-tarea-material',
  templateUrl: './modificar-tarea-material.page.html',
  styleUrls: ['./modificar-tarea-material.page.scss'],
  standalone: true,
  imports: [IonToast, IonRadioGroup, IonRadio, IonSelectOption, IonSelect, IonCheckbox, IonButtons, 
    IonBackButton, IonFooter, IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, 
    IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class ModificarTareaMaterialPage implements OnInit {
  taskName: string = 'material 1'; // Inicializado con un valor predeterminado
  previewUrl: string = '';
  items: MaterialItem[] = [];
  tarea: any = null; // Para almacenar los datos de la tarea cargada
  taskPreview: File | null = null;
  imgTamPreview: File[] = [];
  colorPreview: File[] = [];
  imgcolorPreview: File[] = [];
  imgTamaPreview: File[] = [];
  imgCantidadPreview: File[] = [];
  imageMaterialPreview: File[] = [];
  originalItems: MaterialItem[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      addOutline,
      trashOutline
    });
  }

  ngOnInit() {
    if (this.taskName) {
      this.loadTask();
    }
  }
  
  async loadTask() {
    try {
      const data = await this.firebaseService.getTarea(this.taskName, 'tarea-material').toPromise();
      if (data && data.length > 0) {
        this.tarea = data[0];
        this.taskName = this.tarea.nombre;
        this.previewUrl = this.tarea.previewUrl || '';
        this.items = this.tarea.items || [];
        this.originalItems = JSON.parse(JSON.stringify(this.items)); // Copia profunda
      }
    } catch (error) {
      console.error('Error al cargar la tarea:', error);
      this.mostrarToast('Error al cargar la tarea', false);
    }
  }

  imgTareaPreview(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.taskPreview = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }
  
  imgTamanioPreview(event: Event, index: number){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.imgTamPreview[index] = file;
      this.items[index].tamanio = URL.createObjectURL(file);
    }
  }

  imgColor(event: Event, index: number){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.imgcolorPreview[index] = file;
      this.items[index].imgColor = URL.createObjectURL(file);
    }
  }


  imgTamanio(event: Event, index: number){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.imgTamaPreview[index] = file;
      this.items[index].imgTam = URL.createObjectURL(file);
    }
  }

  imgCantidad(event: Event, index: number){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.imgCantidadPreview[index] = file;
      this.items[index].imgCantidad = URL.createObjectURL(file);
    }
  }

  imagenPreview(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.imageMaterialPreview[index] = file;
      this.items[index].imagen = URL.createObjectURL(file);
    }
  }

  
  canAddItem(): boolean {
    // Verifica que todos los campos actuales estén completos
    return !!this.taskName && this.items.every(item =>
      item.material && item.imagen && item.aula && item.cantidad  > 0
    );
  }

  addItem() {
    if(this.canAddItem()){
      this.items.push({
        material: '',
        tamanio: '',
        color: '',
        imgTam: '',
        imgColor: '',
        imagen: '',
        aula: '',
        cantidad: 0,
        imgCantidad: ''
      });
      this.mostrarToast('Nuevo item', true);
    } else {
      this.mostrarToast('Faltan campos por rellenar (debe haber nombre e imagen de la tarea y nombre, aula y cantidad de cada item)', false);
      console.log("Faltan campos por rellenar");
    }
  }

  async mostrarToast(mensaje: string, exito: boolean){
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'middle'
    });
    if (exito){
      toast.style.setProperty('--background', '#4caf50');
    } else {
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

  eliminarMaterial(index: number) {
    // Eliminar el material del array
    this.items.splice(index, 1);
    this.tarea.items.splice(index, 1);
  }
  

  canSave(): boolean {
    return !!this.taskName && !!this.previewUrl && this.items.every(item =>
      item.material && item.imagen && item.aula && item.cantidad > 0
    );
  }

  async uploadMaterialImage(index: number) {
    const item = this.items[index];
    
    if (this.imageMaterialPreview) {
      const pathImagen = `materiales/${item.material}.png`;
      await this.firebaseService.uploadFile(this.imageMaterialPreview[index], pathImagen);
      const downloadUrl = await this.firebaseService.getDownloadURL(pathImagen);
      this.items[index].imagen = downloadUrl;
    }

    if (this.imgTamPreview) {
      const pathTamanio = `pictogramas/${item.tamanio}.png`;
      await this.firebaseService.uploadFile(this.imgTamPreview[index], pathTamanio);
      const downloadUrl = await this.firebaseService.getDownloadURL(pathTamanio);
      this.items[index].imgTam = downloadUrl;
    }

    if (this.imgcolorPreview) {
      const pathColor = `pictogramas/colores/${item.color}.png`;
      await this.firebaseService.uploadFile(this.imgcolorPreview[index], pathColor);
      const downloadUrl = await this.firebaseService.getDownloadURL(pathColor);
      this.items[index].imgColor = downloadUrl;
    }

    if (this.imgCantidadPreview) {
      const pathCantidad = `pictogramas/numeros/${item.cantidad}.png`;
      await this.firebaseService.uploadFile(this.imgCantidadPreview[index], pathCantidad);
      const downloadUrl = await this.firebaseService.getDownloadURL(pathCantidad);
      this.items[index].imgCantidad = downloadUrl;
    }
  }

  handleBlur() {
    const ionSelect = document.querySelector('ion-select');
    if (ionSelect) {
      ionSelect.blur(); // Forzar que el foco salga de manera segura
    }
  }

  async save() {
    if (this.canSave()) {
      const dataToSave: any = {
        nombre: this.taskName,
        img: this.tarea?.previewUrl || '',
        items: this.items,
      };
  
      // Guardar la imagen principal de la tarea si cambió
      if (this.taskPreview) {
        const path = `imagenes/imagen_tarea_material_${this.taskName}.png`;
        await this.firebaseService.uploadFile(this.taskPreview, path);
        const downloadUrl = await this.firebaseService.getDownloadURL(path);
        dataToSave.img = downloadUrl;
      }
  
      // Procesar cambios en los materiales
      for (let i = 0; i < this.items.length; i++) {
        const currentItem = this.items[i];
        const originalItem = this.originalItems[i] || {};
  
        // Subir imágenes si hay cambios
        if (this.imageMaterialPreview[i] || currentItem.imagen !== originalItem.imagen) {
          await this.uploadMaterialImage(i); // Método que sube las imágenes
        }
  
        // Comparar y guardar otros cambios
        if (JSON.stringify(currentItem) !== JSON.stringify(originalItem)) {
          console.log(`Cambios detectados en el item ${i}:`, currentItem);
        }
      }
  
      // Guardar en Firebase
      await this.firebaseService.actualizarTarea(this.tarea.id, dataToSave, 'tarea-material');
      this.mostrarToast('Tarea material guardada', true);
      this.router.navigate(['/perfil-admin-profesor']);
    } else {
      this.mostrarToast('Por favor, completa todos los campos requeridos.', false);
    }
  }
  
}
