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
  aula: string = '';
  items: MaterialItem[] = [];
  task: any = [];
  taskPreviewImg: File | null = null;


  constructor(private firebaseService: FirebaseService, private router: Router, private toastController: ToastController) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      addOutline
    });

    const navigation = this.router.getCurrentNavigation();
    this.task = navigation?.extras.state?.['peticion'];
  }


  ngOnInit(){
    this.aula = this.task.aula;
    for(let material of this.task.materiales){
      let URLcolor: string = '';
      //Poner imagen del color
      switch(material.color){
        case "azul":
          URLcolor = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fcolores%2Fazul.png?alt=media&token=06804fcd-5967-44b1-b964-6abed7aaa5a3';
          break;
        case "negro":
          URLcolor = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fcolores%2Fnegro.png?alt=media&token=2760e0ee-3cf7-4230-905e-6e511c8e747f';
          break;
        case "verde":
          URLcolor = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fcolores%2Fverde.png?alt=media&token=32796fc8-7013-4b00-b23d-dc5c98ee4b70';
          break;
        case "rojo":
          URLcolor = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fcolores%2Frojo.png?alt=media&token=003d3f7e-2bb8-403f-a60b-75bbf4ae3427';
          break;
        case "blanco":
          URLcolor = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fcolores%2Fblanco.png?alt=media&token=06457162-7f64-424d-8ca9-b5bae12ab6ac';
          break;
        case "amarillo":
          URLcolor = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fcolores%2Famarillo.png?alt=media&token=616b99e8-5596-4c16-bccb-103c438eef62';
          break;
        case "naranja":
          URLcolor = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fcolores%2Fnaranja.png?alt=media&token=127b80d0-b7fd-40f9-b73c-4d171a1b5ea4';
          break;
        case "rosa":
          URLcolor = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fcolores%2Frosa.png?alt=media&token=c0542cda-991e-4898-b456-da463fa5e665';
          break;
        case "marron":
          URLcolor = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fcolores%2Fmarr%C3%B3n.png?alt=media&token=56267251-6262-4645-896d-47e24b95c41e';
          break;
        default: 
          URLcolor = '';
          break;
      }

      let URLtamaño: string = '';
      //Poner imagen del tamaño
      switch(material.tamanio){
        case "pequenio":
          URLtamaño = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fpeque%C3%B1o.png?alt=media&token=c6a04e04-447a-457c-bddb-d51012833333';
          break;
        case "mediano":
          URLtamaño = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fmediano.png?alt=media&token=dfea25ed-db2b-45b4-b223-cab8a635f435';
          break;
        case "grande":
          URLtamaño = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fgrande.png?alt=media&token=7293c467-7c92-4036-834b-84d1467a549a';
          break;
        default: 
          URLcolor = '';
          break;
      }

      let URLcantidad: string = '';
      //Poner imagen del tamaño
      switch(material.cantidad){
        case 1:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F1.png?alt=media&token=b0831dd7-769b-437b-8583-9f4aa273ab6c';
          break;
        case 2:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F2.png?alt=media&token=bc098c32-c147-4693-b3f3-bb6ed55037b6';
          break;
        case 3:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F3.png?alt=media&token=761c3451-1cde-45dd-ba2e-788786eb8afb';
          break;
        case 4:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F4.png?alt=media&token=2a3706a4-a98b-407b-b96a-45d07f11d6b9';
          break;
        case 5:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F5.png?alt=media&token=11340861-1ad7-40b7-a362-8c9f38cdf765';
          break;
        case 6:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F6.png?alt=media&token=57ce735a-c0c5-4471-bc3c-4250dfe02f55';
          break;
        case 7:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F7.png?alt=media&token=24826459-1bd1-4f55-be4a-0834eda50a61';
          break;
        case 8:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F8.png?alt=media&token=d5aa9c2b-d363-4979-a780-6ad87187bb05';
          break;
        case 9:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F9.png?alt=media&token=85b71a8a-f7e3-4c67-91ed-0c3fb7c254ff';
          break;
        case 10:
          URLcantidad = 'https://firebasestorage.googleapis.com/v0/b/aplicacion-d5cbf.appspot.com/o/pictogramas%2Fnumeros%2F10.png?alt=media&token=bb3af850-1f89-4c14-9b0f-fbf7d069dfe7';
          break;
        default: 
          URLcantidad = '';
          break;
      }

      const materialItem: MaterialItem = {material: material.nombreMaterial, tamanio: material.tamanio, color: material.color, imgTam: URLtamaño, imgColor: URLcolor, imagen: '', cantidad: material.cantidad, imgCantidad: URLcantidad};
      this.items.push(materialItem);
    }
  }

  imgTareaPreview(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.taskPreviewImg = input.files[0];
      this.previewUrl = URL.createObjectURL(this.taskPreviewImg);
    }
  }

  imgTamanioPreview(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.items[index].tamanio = URL.createObjectURL(file);
    }
  }

  imgColorPreview(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.items[index].color = URL.createObjectURL(file);
    }
  }

  imgColor(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.items[index].imgColor = URL.createObjectURL(file);
    }
  }


  imgTamanio(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.items[index].imgTam = URL.createObjectURL(file);
    }
  }

  imgCantidad(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
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


  // Método para cargar imágenes desde Firebase basado en las selecciones
  async updateImageBasedOnSelection(index: number) {
    const item = this.items[index];

    // Obtener imágenes predeterminadas según tamaño
    if (item.tamanio) {
      const pathTamanio = `pictogramas/${item.tamanio}.png`;
      item.imgTam = await this.firebaseService.getDownloadURL(pathTamanio);
    }

    // Obtener imágenes predeterminadas según color
    if (item.color) {
      const pathColor = `pictogramas/colores/${item.color}.png`;
      item.imgColor = await this.firebaseService.getDownloadURL(pathColor);
    }

    // Obtener imágenes predeterminadas según material
    if (item.material) {
      const pathMaterial = `materiales/${item.material}.png`;
      item.imagen = await this.firebaseService.getDownloadURL(pathMaterial);
    }

    if (item.cantidad && item.cantidad < 10){
      const pathCantidad = `pictogramas/numeros/${item.cantidad}.png`;
      item.imgCantidad = await this.firebaseService.getDownloadURL(pathCantidad);
    }
  }

  // Método para manejar cambios en el tamaño
  onSizeChange(index: number) {
    this.updateImageBasedOnSelection(index);
  }

  // Método para manejar cambios en el color
  onColorChange(index: number) {
    this.updateImageBasedOnSelection(index);
  }

  // Método para manejar cambios en el material
  onMaterialChange(index: number) {
    this.updateImageBasedOnSelection(index);
  }

  // Metodo para manejar cambios en la cantidad
  onCantidadChange(index: number){
    this.updateImageBasedOnSelection(index);
  }


  canAddItem(): boolean {
    // Verifica que todos los campos actuales estén completos
    return !!this.taskName && this.items.every(item =>
      item.material && item.imagen && item.cantidad  > 0
    );
  }

  addItem() {
    if (this.canAddItem()) {
      this.items.push({
        material: '',
        tamanio: '',
        color: '',
        imgTam: '',
        imgColor: '',
        imagen: '',
        cantidad: 0,
        imgCantidad: ''
      });
      this.mostrarToast('Nuevo item', true);
    } else {
      this.mostrarToast('Faltan campos por rellenar (debe haber nombre e imagen de la tarea y nombre, aula y cantidad de cada item)', false);
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

  async mostrarToast(mensaje: string, exito: boolean) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'middle'
    });
    if (exito) {
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


    if (item.imagen) {
      const fileBlob = await fetch(item.imagen).then(r => r.blob());
      await this.firebaseService.uploadFile(new File([fileBlob], `${item.material}.png`), pathImagen);
      const downloadUrl = await this.firebaseService.getDownloadURL(pathImagen);
      this.items[index].imagen = downloadUrl;
    }
    
  }


  canSave(): boolean {
    // Verifica que el nombre de la tarea esté completo y todos los campos de los materiales estén completos
    return !!this.taskName && !!this.aula && !!this.previewUrl && this.canAddItem();
  }

  async save() {
    if (this.canSave()) {
      const dataToSave: any = {
        nombre: this.taskName,
        previewUrl: '',
        aula: this.aula,
        items: this.items,
      };


      if (this.taskPreviewImg){
        const path = `imagenes/imagen_tarea_material_${this.taskName}.png`;
        await this.firebaseService.uploadFile(this.taskPreviewImg, path);
        const downloadUrl = await this.firebaseService.getDownloadURL(path);
        dataToSave.previewUrl = downloadUrl;
        
      }
      // Subir las imágenes a Firebase antes de guardar
      for (let i = 0; i < this.items.length; i++) {
        await this.uploadMaterialImage(i); // Sube cada imagen y actualiza su URL en `this.items`
      }

      await this.firebaseService.guardarTareaMaterial(dataToSave);
      this.router.navigate(['/peticion-material']);
      this.mostrarToast('Tarea material guardada', true);
    } else {
      this.mostrarToast('Faltan campos por rellenar (debe haber nombre e imagen de la tarea y nombre, aula y cantidad de cada item)', false);
    }


  }
}
