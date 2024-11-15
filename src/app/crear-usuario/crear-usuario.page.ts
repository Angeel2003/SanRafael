import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class CrearUsuarioPage implements OnInit {
  passwordType: string = ''; // Para el tipo de contraseña
  // accessibilityLevel: any = { // Objeto para almacenar la selección de accesibilidad
  //   texto: false,
  //   audio: false,
  //   video: false,
  //   pictogramas: false
  // };

  // // Lista de URLs de imágenes cargadas (máximo 6 imágenes)
  // selectedImages: (string | null)[] = [null, null, null, null, null, null];

  // Almacena archivos y URLs separadamente
  selectedImages: (File | null)[] = [null, null, null, null, null, null];
  selectedImageUrls: (string | null)[] = [null, null, null, null, null, null];
  accessibilityLevel: string = ''; // Valor inicial por defecto


  // Lista de nombres de archivos de las imágenes cargadas, sin extensión
  imageNames: (string | null)[] = [null, null, null, null, null, null];

  // Array para controlar las imágenes seleccionadas para la contraseña
  selectedForPassword: boolean[] = [false, false, false, false, false, false];

  // Array para mantener el orden de selección
  selectedOrder: number[] = [];

  // Contraseña compuesta por los nombres de las imágenes seleccionadas
  password: string = '';

  // Referencia a los inputs de archivo
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit() { }

  async guardarPerfil() {
    const timestamp = new Date().getTime();
    const perfilData: any = {
      nombre: '', // Reemplazar con el valor correspondiente de nombre del usuario
      accessLevel: this.accessibilityLevel,
      passwordType: this.passwordType,
      imagePasswordUrls: [],
    };

    // Subir imágenes de la contraseña y agregar URLs al perfilData
    for (const [index, selected] of this.selectedForPassword.entries()) {
      if (selected && this.selectedImages[index]) {
        const path = `usuarios/${perfilData.nombre}/password_imagen_${index}_${timestamp}.png`;
        await this.firebaseService.uploadFile(this.selectedImages[index] as File, path);
        const downloadUrl = await this.firebaseService.getDownloadURL(path);
        perfilData.imagePasswordUrls.push(downloadUrl);
      }
    }

    // Guardar perfil en Firestore a través del servicio
    try {
      await this.firebaseService.guardarPerfil(perfilData);
      console.log('Perfil guardado con éxito en Firestore');
    } catch (e) {
      console.error('Error al guardar el perfil:', e);
    }
  }

  // Función para abrir el input file correspondiente
  triggerFileInput(index: number) {
    const fileInput = this.fileInputs.toArray()[index];
    if (fileInput) {
      fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Almacena el archivo en selectedImages
      this.selectedImages[index] = file;

      // Genera la URL de vista previa y almacénala en selectedImageUrls
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrls[index] = e.target.result;
      };
      reader.readAsDataURL(file);

      // Almacena el nombre del archivo sin la extensión
      const fileName = file.name.split('.').slice(0, -1).join('.');
      this.imageNames[index] = fileName;
    }
  }



  // Función para actualizar la contraseña según las imágenes seleccionadas
  updatePassword() {
    // Filtrar solo los primeros 3 elementos de selectedOrder y crear la contraseña usando los nombres de las imágenes
    this.password = this.selectedOrder.slice(0, 3)
      .map(index => this.imageNames[index] ?? '')
      .join(', ');
    console.log('Contraseña actual:', this.password);
  }

  // Evento al cambiar el estado del checkbox
  onCheckboxChange(index: number) {
    const isChecked = this.selectedForPassword[index];

    if (isChecked) {
      // Agregar al array de orden si el checkbox está seleccionado
      this.selectedOrder.push(index);
    } else {
      // Remover del array de orden si se deselecciona
      this.selectedOrder = this.selectedOrder.filter(i => i !== index);
    }

    // Llamamos a la función para actualizar la contraseña
    this.updatePassword();
  }

  // Función para deshabilitar checkbox cuando hay 3 imágenes seleccionadas
  isCheckboxDisabled(index: number): boolean {
    const selectedCount = this.selectedForPassword.filter(v => v).length;
    return this.selectedImages[index] === null || (selectedCount >= 3 && !this.selectedForPassword[index]);
  }
}