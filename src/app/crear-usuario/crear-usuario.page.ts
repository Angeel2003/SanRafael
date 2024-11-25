import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { eyeOff, eye } from 'ionicons/icons';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

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

  // Contraseña de tipo texto
  textPassword: string = '';


  passwordVisible: boolean = false;

  maxSelections: number = 3; // Máximo número de imágenes seleccionables
  currentSelections: number = 0;

  selectedImagesOrder: string[] = []; // Array para almacenar las URLs de los pictogramas seleccionados

  profileImageUrl: string | null = null; // Para almacenar la URL de la imagen de perfil
  profileImageFile: File | null = null; // Variable para almacenar la imagen temporalmente

  nombre: string = '';
  usuario: string = '';

  // Referencia a los inputs de archivo
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private firebaseService: FirebaseService, private router: Router,
    private toastController: ToastController) {
    addIcons({
      eyeOff,
      eye,
      lockClosedOutline
    });
  }

  ngOnInit() {
    console.log('ngOnInit ejecutado'); // Para verificar que el componente se inicializa
    this.loadPictogramImages(); // Llama a la función para cargar imágenes
  }


  async loadPictogramImages() {
    console.log('Cargando imágenes desde Firebase Storage...');
    try {
      // Llamar a la función que obtiene las primeras 6 imágenes
      this.selectedImageUrls = await this.firebaseService.getPictogramImagesFromStorage();

      console.log('Imágenes cargadas:', this.selectedImageUrls);

      if (this.selectedImageUrls.length === 0) {
        console.warn('No se cargaron imágenes.');
      }

      this.selectedForPassword = Array(this.selectedImageUrls.length).fill(false);
    } catch (error) {
      console.error('Error al cargar imágenes de pictogramas:');
    }
  }

  onPasswordTypeChange() {
    if (this.passwordType === 'pictogramas') {
      this.loadPictogramImages(); // Carga imágenes si se seleccionan pictogramas
    } else {
      // Restablece los datos si se selecciona otro tipo de contraseña
      this.selectedImageUrls.fill(null);
      this.selectedImages.fill(null);
      this.imageNames.fill(null);
      this.selectedForPassword.fill(false);
      this.selectedOrder = [];
      this.password = '';
    }
  }
  toggleTextPasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;

    const passwordInput = document.getElementById('textPasswordInput') as HTMLInputElement;
    const toggleIcon = document.getElementById('toggleTextPasswordIcon') as HTMLIonIconElement;

    if (this.passwordVisible) {
      passwordInput.type = 'text';
      toggleIcon.name = 'eye';
    } else {
      passwordInput.type = 'password';
      toggleIcon.name = 'eye-off';
    }
  }

  async guardarPerfil() {
    // Validar campos obligatorios
    if (!this.nombre.trim()) {
      await this.showToast('Por favor, ingresa un nombre.', 'danger');
      return;
    }
  
    if (!this.usuario.trim()) {
      await this.showToast('Por favor, ingresa un usuario.', 'danger');
      return;
    }
  
    if (!this.passwordType) {
      await this.showToast('Por favor, selecciona un tipo de contraseña.', 'danger');
      return;
    }
  
    if (this.passwordType === 'texto' && !this.textPassword.trim()) {
      await this.showToast('Por favor, ingresa una contraseña de texto.', 'danger');
      return;
    }
  
    if (this.passwordType === 'pin' && (!this.textPassword.trim() || this.textPassword.length !== 4)) {
      await this.showToast('Por favor, ingresa un PIN de 4 dígitos.', 'danger');
      return;
    }
  
    if (this.passwordType === 'pictogramas' && this.selectedImagesOrder.length < this.maxSelections) {
      await this.showToast(`Por favor, selecciona ${this.maxSelections} pictogramas para la contraseña.`, 'danger');
      return;
    }
  
    // Construir el objeto de datos del perfil
    const perfilData: any = {
      nombre: this.nombre,
      usuario: this.usuario,
      accessLevel: this.accessibilityLevel,
      passwordType: this.passwordType,
      imagePasswordOrder: [],
      textPassword: '',
      profileImageUrl: this.profileImageUrl // Incluye la URL de la imagen de perfil
    };
  
    if (this.passwordType === 'pictogramas') {
      perfilData.imagePasswordOrder = this.selectedOrder.map(index => ({
        position: index,
        imageName: this.imageNames[index]
      }));
    } else if (this.passwordType === 'texto' || this.passwordType === 'pin') {
      perfilData.textPassword = this.textPassword;
    }
  
    try {
      await this.firebaseService.guardarPerfil(perfilData); // Guarda el perfil en Firebase
      await this.showToast('Perfil guardado con éxito.', 'success');
      console.log('Perfil guardado con éxito en Firestore');
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      await this.showToast('Error al guardar el perfil. Inténtalo de nuevo.', 'danger');
    }
  }
  
  // Método auxiliar para mostrar mensajes Toast
  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
  
  triggerFileInput(index: number) {
    const fileInput = this.fileInputs.toArray()[index];
    if (fileInput) {
      fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImages[index] = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrls[index] = e.target.result;
      };
      reader.readAsDataURL(file);

      const fileName = file.name.split('.').slice(0, -1).join('.');
      this.imageNames[index] = fileName;
    }
  }

  updatePassword() {
    this.password = this.selectedOrder
      .map(index => this.imageNames[index])
      .filter(name => name !== null)
      .join(', ');
    console.log('Contraseña actualizada:', this.password);
  }

 onCheckboxChange(index: number) {
  // Marca o desmarca el pictograma
  this.selectedForPassword[index] = !this.selectedForPassword[index];

  // Actualiza el número de selecciones actuales
  this.currentSelections = this.selectedForPassword.filter(selected => selected).length;

  // Mantiene el orden de selección
  const selectedImage = this.selectedImageUrls[index];

  if (this.selectedForPassword[index] && selectedImage !== null) {
    // Si se selecciona, añadir al array en el orden correspondiente (solo si no es null)
    this.selectedImagesOrder.push(selectedImage);
  } else if (selectedImage !== null) {
    // Si se deselecciona, eliminar de la lista de seleccionados
    this.selectedImagesOrder = this.selectedImagesOrder.filter(image => image !== selectedImage);
  }

  console.log('Pictogramas seleccionados (en orden):', this.selectedImagesOrder);
}

  isCheckboxDisabled(index: number): boolean {
    return (
      this.currentSelections >= this.maxSelections &&
      !this.selectedForPassword[index]
    );
  }

  // Dispara el input de carga de archivo para la imagen de perfil
  triggerProfileImageInput() {
    const profileImageInput = document.querySelector('#profileImageInput') as HTMLInputElement;
    if (profileImageInput) {
      profileImageInput.click();
    }
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.profileImageFile = input.files[0]; // Guarda el archivo seleccionado
      const reader = new FileReader();
  
      reader.onload = () => {
        this.profileImageUrl = reader.result as string; // Muestra la vista previa
      };
  
      reader.readAsDataURL(this.profileImageFile);
    }
  }

async uploadProfileImage(file: File) {
  try {
    const filePath = `profile_images/${file.name}`;
    await this.firebaseService.uploadFile(file, filePath);
    const downloadUrl = await this.firebaseService.getDownloadURL(filePath);
    this.profileImageUrl = downloadUrl;
    console.log('Imagen de perfil subida:', downloadUrl);
  } catch (error) {
    console.error('Error al subir la imagen de perfil:', error);
  }
}

}