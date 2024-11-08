import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveOutline } from 'ionicons/icons';
import { addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonButtons, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonList, IonBackButton } from '@ionic/angular/standalone';

interface MaterialItem {
  material: string;
  imagen: string;
  aula: string;
  cantidad: number;
}

@Component({
  selector: 'app-tarea-material',
  templateUrl: './tarea-material.page.html',
  styleUrls: ['./tarea-material.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, IonButtons, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, CommonModule, FormsModule]
})

export class TareaMaterialPage implements OnInit {
  taskName: string = '';
  imgTarea: string = '';
  items: MaterialItem[] = [];
  
  constructor() {
    addIcons({
      saveOutline,
      addOutline
    })
  }

  ngOnInit() {
  }

  goBackToAdmin(){
    this.router.navigate(['/admin-dentro']);
  }

  ngOnInit() {}

  imgPreview(event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length){
      const file = input.files[0];
      this.imgTarea = URL.createObjectURL(file);
    }
  }

  imagenPreview(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.items[index].imagen = URL.createObjectURL(file);
    }
  }

  addItem() {
    this.items.push({
      material: '',
      imagen: '',
      aula: '',
      cantidad: 0
    });
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

  async uploadMaterialImage(index: number) {
    const item = this.items[index];
    const path = `materiales/${item.material}.png`; // Usar el nombre del material como el nombre del archivo
    
    try {
      // Intentar obtener la URL de descarga
      const existingUrl = await this.firebaseService.getDownloadURL(path);
      this.items[index].imagen = existingUrl; // Si la imagen ya existe, la muestra
      console.log('Imagen ya existente encontrada:', existingUrl);
    } catch (error) {
      console.log('Imagen no encontrada, procediendo a subir una nueva');
      // Si no existe, procede con la subida
      if (item.imagen) {
        const fileBlob = await fetch(item.imagen).then(r => r.blob());
        await this.firebaseService.uploadFile(new File([fileBlob], `${item.material}.png`), path); // Sube el archivo con el nombre del material
        const downloadUrl = await this.firebaseService.getDownloadURL(path);
        this.items[index].imagen = downloadUrl; // Guarda la URL descargable
      }
    }
  }
  

  async save() {
    const dataToSave: any = {
      nombre: this.taskName,
      img: '',
      items: this.items,
    };

    if (this.imgTarea){
      const path = `imagenes/imagen_tarea_material_${this.taskName}.png`;
      const fileBlob = await fetch(this.imgTarea).then(r => r.blob());
      await this.firebaseService.uploadFile(new File([fileBlob], `${this.imgTarea}.png`), path); // Sube el archivo con el nombre del material
      const downloadUrl = await this.firebaseService.getDownloadURL(path);
      dataToSave.img = downloadUrl; // Guarda la URL descargable
    }

    // Subir las imágenes a Firebase antes de guardar
    for (let i = 0; i < this.items.length; i++) {
      await this.uploadMaterialImage(i); // Sube cada imagen y actualiza su URL en `this.items`
    }

    await this.firebaseService.guardarTareaMaterial(dataToSave);
    console.log('Datos guardados: ', this.items);
  }
}