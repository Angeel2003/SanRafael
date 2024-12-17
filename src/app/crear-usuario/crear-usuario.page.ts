import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
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
  tipoContrasena: string = '';

  // Almacena archivos y URLs separadamente
  selectedImages: (File | null)[] = [null, null, null, null, null, null];
  selectedImageUrls: (string | null)[] = [null, null, null, null, null, null];
  nivelAccesibilidad: string = ''; // Valor inicial por defecto


  // Lista de nombres de archivos de las imágenes cargadas, sin extensión
  imageNames: (string | null)[] = [null, null, null, null, null, null];

  // Array para controlar las imágenes seleccionadas para la contraseña
  selectedForPassword: boolean[] = [false, false, false, false, false, false];

  // Array para mantener el orden de selección
  selectedOrder: number[] = [];

  // Contraseña de tipo texto
  contrasena: string = '';


  passwordVisible: boolean = true;

  maxSelections: number = 3; // Máximo número de imágenes seleccionables
  currentSelections: number = 0;

  selectedImagesOrder: string[] = []; // Array para almacenar las URLs de los pictogramas seleccionados

  profileImageUrl: string | null = null; // Para almacenar la URL de la imagen de perfil
  profileImageFile: File | null = null; // Variable para almacenar la imagen temporalmente

  nombre: string = '';
  usuario: string = '';

  pictogramasDisponibles: string[] = [];
  pictogramasSeleccionados: string[] = [];
  nuevosPictogramas: File[] = []; 
  isToastOpen = false; // Controla la visibilidad del toast
  toastMessage = ''; // Mensaje dinámico del toast
  toastClass = '';

  // Referencia a los inputs de archivo
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private firebaseService: FirebaseService, private toastController: ToastController) {
    addIcons({
      eyeOff,
      eye,
      lockClosedOutline
    });
  }

  ngOnInit() {
    this.loadPictogramImages(); // Llama a la función para cargar imágenes
  }


  async loadPictogramImages() {
    try {
      // Llamar a la función que obtiene las primeras 6 imágenes
      this.selectedImageUrls = await this.firebaseService.getPictogramImagesFromStorage();

      if (this.selectedImageUrls.length === 0) {
        console.warn('No se cargaron imágenes.');
      }

      this.selectedForPassword = Array(this.selectedImageUrls.length).fill(false);
    } catch (error) {
      console.error('Error al cargar imágenes de pictogramas:');
    }
  }

  ontipoContrasenaChange() {
    if (this.tipoContrasena === 'Pictograma') {
      this.loadPictogramImages(); // Carga imágenes si se seleccionan pictogramas
    } else {
      // Restablece los datos si se selecciona otro tipo de contraseña
      this.selectedImageUrls.fill(null);
      this.selectedImages.fill(null);
      this.imageNames.fill(null);
      this.selectedForPassword.fill(false);
      this.selectedOrder = [];
      this.contrasena = '';
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

  showToast(message: string, success: boolean = true) {
    this.toastMessage = message;
    this.toastClass = success ? 'toast-success' : 'toast-error';
    this.isToastOpen = true;
  }

  // Método llamado al cerrarse el toast
  onToastDismiss() {
    this.isToastOpen = false;
  }

  async guardarPerfil() {
    // Validar campos obligatorios
    if (!this.nombre.trim()) {
      this.showToast('Por favor, ingresa un nombre.', false);
      return;
    }
  
    if (!this.usuario.trim()) {
      this.showToast('Por favor, ingresa un usuario.', false);
      return;
    }
  
    if (!this.tipoContrasena) {
      this.showToast('Por favor, selecciona un tipo de contraseña.', false);
      return;
    }
  
    if (this.tipoContrasena === 'Texto' && !this.contrasena.trim()) {
      this.showToast('Por favor, ingresa una contraseña de texto.', false);
      return;
    }
  
    if (this.tipoContrasena === 'Pictograma' && this.selectedImagesOrder.length < this.maxSelections) {
      this.showToast(`Por favor, selecciona ${this.maxSelections} pictogramas para la contraseña.`, false);
      return;
    }
  
    // Construir el objeto de datos del perfil
    const perfilData: any = {
      nombre: this.nombre,
      usuario: this.usuario,
      nivelAccesibilidad: this.nivelAccesibilidad,
      tipoContrasena: this.tipoContrasena,
      foto: this.profileImageUrl, // Incluye la URL de la imagen de perfil
      tareasAsig: [],
      tareasTermin: []
    };
    
    // Solo se agrega contrasenaPicto o contrasena cuando ya se ha decidido el tipo de contraseña
    if (this.tipoContrasena === 'Pictograma') {
      const uploadedImageUrls: string[] = [];
      for (const file of this.nuevosPictogramas) {
        if (file) {
          const uploadedUrl = await this.uploadImage(file);  // Subir cada imagen
          uploadedImageUrls.push(uploadedUrl);
        }
      }

      const finalSelectedImageUrls = [...this.selectedImageUrls]; // Copiar las imágenes seleccionadas
      if (uploadedImageUrls.length > 0) {
        // Si hay nuevas imágenes subidas, reemplazarlas en el array de URLs
        for (let i = 0; i < uploadedImageUrls.length; i++) {
          finalSelectedImageUrls[i] = uploadedImageUrls[i];  // Reemplazar las URLs con las nuevas
        }
      }
      perfilData.contrasenaPicto = this.selectedOrder; // Aquí agregas la contraseña de pictogramas
      perfilData.imagenesPicto = finalSelectedImageUrls; // Si es necesario, las imágenes de los pictogramas seleccionados
    } else if (this.tipoContrasena === 'Texto' || this.tipoContrasena === 'PIN') {
      perfilData.contrasena = this.contrasena; // Aquí agregas la contraseña de texto o PIN
    }
  
    try {
      await this.firebaseService.guardarPerfil(perfilData); // Guarda el perfil en Firebase
      this.showToast('Perfil guardado con éxito.', true);
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      this.showToast('Error al guardar el perfil. Inténtalo de nuevo.', false);
    }
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
    this.selectedOrder.push(index);
  } else if (selectedImage !== null) {
    // Si se deselecciona, eliminar de la lista de seleccionados
    this.selectedImagesOrder = this.selectedImagesOrder.filter(image => image !== selectedImage);
  }
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
      const filePath = `pictogramas/${file.name}_${Date.now()}`;
      await this.firebaseService.uploadFile(file, filePath);
      const downloadUrl = await this.firebaseService.getDownloadURL(filePath);
      this.profileImageUrl = downloadUrl;
    } catch (error) {
      console.error('Error al subir la imagen de perfil:', error);
    }
  }

  async uploadImage(file: File): Promise<string> {
    try {
      const filePath = `pictogramas/${file.name}_${Date.now()}`;
      await this.firebaseService.uploadFile(file, filePath); // Subir la imagen al almacenamiento de Firebase
      const downloadUrl = await this.firebaseService.getDownloadURL(filePath); // Obtener la URL de descarga
      return downloadUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw new Error('Error al subir imagen');
    }
  }

  cambiarImagen(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.nuevosPictogramas[index] = file; // Guardar el archivo nuevo

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrls[index] = reader.result as string; // Mostrar vista previa
      };
      reader.readAsDataURL(file);
    }
  }

}