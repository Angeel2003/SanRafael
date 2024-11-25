import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
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
  selector: 'app-tarea-material',
  templateUrl: './tarea-material.page.html',
  styleUrls: ['./tarea-material.page.scss'],
  standalone: true,
  imports: [IonToast, IonRadioGroup, IonRadio, IonSelectOption, IonSelect, IonCheckbox, IonButtons, IonBackButton, IonFooter, IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class TareaMaterialPage implements OnInit {
  taskName: string = '';
  previewUrl: string = '';
  items: MaterialItem[] = [];


  constructor(private firebaseService: FirebaseService, private router: Router, private toastController: ToastController) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      addOutline
    });
  }


  ngOnInit() {}

  imgTareaPreview(event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  imgTamanioPreview(event: Event, index: number){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.items[index].tamanio = URL.createObjectURL(file);
    }
  }

  imgColorPreview(event: Event, index: number){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.items[index].color = URL.createObjectURL(file);
      console.log(this.items[index].color);
    }
  }

  imgColor(event: Event, index: number){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.items[index].imgColor = URL.createObjectURL(file);
    }
  }


  imgTamanio(event: Event, index: number){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.items[index].imgTam = URL.createObjectURL(file);
    }
  }

  imgCantidad(event: Event, index: number){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.items[index].imgCantidad = URL.createObjectURL(file);
    }
  }

  imagenPreview(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
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

  // Función para convertir base64 a Blob
  base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]); // Decodificar el contenido base64
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]; // Obtener el tipo MIME
    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeString });
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

  async uploadMaterialImage(index: number) {
    const item = this.items[index];
    const pathImagen = `materiales/${item.material}.png`; // Usar el nombre del material como el nombre del archivo
    const pathTamanio = `pictogramas/${item.tamanio}.png`; // Usar el nombre del material como el nombre del archivo
    const pathColor = `pictogramas/colores/${item.color}.png`; // Usar el nombre del material como el nombre del archivo
    const pathCantidad = `pictogramas/numeros/${item.cantidad}.png`; // Usar el nombre del material como el nombre del archivo
    

    if (item.imagen){
      const fileBlob = await fetch(item.imagen).then(r => r.blob());
      await this.firebaseService.uploadFile(new File([fileBlob], `${item.material}.png`), pathImagen);
      const downloadUrl = await this.firebaseService.getDownloadURL(pathImagen);
      this.items[index].imagen = downloadUrl;
    }
    if (item.imgTam){
      const fileBlob = await fetch(item.imgTam).then(r => r.blob());
      await this.firebaseService.uploadFile(new File([fileBlob], `${item.imgTam}.png`), pathTamanio);
      const downloadUrl = await this.firebaseService.getDownloadURL(pathTamanio);
      this.items[index].imgTam = downloadUrl;
    }
    if (item.imgColor){
      const fileBlob = await fetch(item.imgColor).then(r => r.blob());
      await this.firebaseService.uploadFile(new File([fileBlob], `${item.imgColor}.png`), pathColor);
      const downloadUrl = await this.firebaseService.getDownloadURL(pathColor);
      this.items[index].imgColor = downloadUrl;
    }
    if (item.imgCantidad){
      const fileBlob = await fetch(item.imgCantidad).then(r => r.blob());
      await this.firebaseService.uploadFile(new File([fileBlob], `${item.imgCantidad}.png`), pathCantidad);
      const downloadUrl = await this.firebaseService.getDownloadURL(pathCantidad);
      this.items[index].imgCantidad = downloadUrl;
    }
  }


  canSave(): boolean {
    // Verifica que el nombre de la tarea esté completo y todos los campos de los materiales estén completos
    return !!this.taskName && !!this.previewUrl && this.canAddItem();
  }

  async save() {
    if (this.canSave()){
      const dataToSave: any = {
        nombre: this.taskName,
        previewUrl: '',
        items: this.items,
      };
    

      if (this.previewUrl){
        const path = `imagenes/imagen_tarea_material_${this.taskName}.png`;
        const fileBlob = await fetch(this.previewUrl).then(r => r.blob());
        await this.firebaseService.uploadFile(new File([fileBlob], `${this.previewUrl}.png`), path); // Sube el archivo con el nombre del material
        const downloadUrl = await this.firebaseService.getDownloadURL(path);
        dataToSave.previewUrl = downloadUrl; // Guarda la URL descargable
      }

      // Subir las imágenes a Firebase antes de guardar
      for (let i = 0; i < this.items.length; i++) {
        await this.uploadMaterialImage(i); // Sube cada imagen y actualiza su URL en `this.items`
      }

      await this.firebaseService.guardarTareaMaterial(dataToSave);
      console.log('Datos guardados: ', this.items);
      this.router.navigate(['/perfil-admin-profesor']);
      this.mostrarToast('Tarea material guardada', true);
    } else {
      this.mostrarToast('Faltan campos por rellenar (debe haber nombre e imagen de la tarea y nombre, aula y cantidad de cada item)', false);
      console.log('Faltan campos por rellenar');
    }
  }
}
