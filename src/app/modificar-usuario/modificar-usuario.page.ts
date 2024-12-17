import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.page.html',
  styleUrls: ['./modificar-usuario.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class ModificarUsuarioPage {
  usuario: any;

  user: any;
  profileImageUrl: string | null = null; // URL de la imagen seleccionada
  passwordVisible: boolean = false; // Controla la visibilidad de la contraseña

  // Pictogramas
  pictogramasDisponibles: string[] = [];
  pictogramasSeleccionados: string[] = [];
  nuevosPictogramas: File[] = []; // Archivos de imágenes nuevas seleccionadas
  isToastOpen = false; // Controla la visibilidad del toast
  toastMessage = ''; // Mensaje dinámico del toast
  toastClass = '';

  constructor(  
    private router: Router,
    private firebaseService: FirebaseService, 
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];
    this.pictogramasDisponibles = this.user.imagenesPicto;
    this.profileImageUrl = this.user.foto;
    if (this.user.tipoContrasena === 'Pictograma') {
      this.pictogramasSeleccionados = this.user.contrasenaPicto.map((index: number) => this.pictogramasDisponibles[index]);
    }
  }


  actualizarDatosUsuario(): void {
    if (this.user.nombre && this.user.usuario && this.user.nivelAccesibilidad) {
      this.firebaseService.actualizarAlumno(this.user.id, this.user).then((resultado) => {
        if (resultado) {
          this.showToast('Datos actualizados con éxito', true); 
        } else {
          this.showToast('Error al actualizar los datos del usuario.', true); 
        }
      }).catch(() => {
        this.showToast('Error al actualizar los datos', false); 
      });
    } else {
      this.showToast('Por favor, complete todos los campos.', false); 
    }
  }
  /**
   * Método para manejar la selección de imágenes de perfil.
   * @param event Evento de cambio del input de archivo.
   */
  onProfileImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result as string; // Vista previa de la imagen
      };
      reader.readAsDataURL(file);
  
      // Guardar la imagen seleccionada para subirla posteriormente
      this.user.foto = file;
    }
  }
  /**
   * Método para disparar el input de selección de imágenes.
   */
  triggerProfileImageInput(): void {
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  /**
   * Alternar la visibilidad de la contraseña.
   */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  togglePictogramaSeleccionado(index: number): void {
    const pictograma = this.pictogramasDisponibles[index];
  
    // Verifica si el pictograma ya está seleccionado
    const indexInSeleccionados = this.pictogramasSeleccionados.indexOf(pictograma);
  
    if (indexInSeleccionados !== -1) {
      // Si ya está seleccionado, lo quitamos de la lista
      this.pictogramasSeleccionados.splice(indexInSeleccionados, 1);
    } else {
      // Verifica si no se ha alcanzado el límite máximo
      if (this.pictogramasSeleccionados.length < 4) {
        this.pictogramasSeleccionados.push(pictograma);
      } else {
        // Muestra una alerta si se excede el límite de 4 pictogramas
        this.showToast('Solo puedes seleccionar un máximo de 4 pictogramas.', false); 
      }
    }

  }
  
  cambiarImagen(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.nuevosPictogramas[index] = file; // Guardar el archivo nuevo

      const reader = new FileReader();
      reader.onload = () => {
        this.pictogramasDisponibles[index] = reader.result as string; // Mostrar vista previa
      };
      reader.readAsDataURL(file);
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


  async modificarUsuario(): Promise<void> {
    try {
      if(this.user.tipoContrasena == 'Pictograma'){
        this.usuario = {
          nombre: this.user.nombre,
          usuario: this.user.usuario,
          foto: this.user.foto,
          nivelAccesibilidad: this.user.nivelAccesibilidad,
          tipoContrasena: this.user.tipoContrasena,
          contrasenaPicto: this.user.contrasena,
          imagenesPicto: this.user.imagenesPicto,
        };
      }else{
        this.usuario = {
          nombre: this.user.nombre,
          usuario: this.user.usuario,
          foto: this.user.foto,
          nivelAccesibilidad: this.user.nivelAccesibilidad,
          tipoContrasena: this.user.tipoContrasena,
          contrasena: this.user.contrasena,
        };
      }
      

      // Subir la imagen de perfil si se seleccionó una nueva
      if (this.profileImageUrl) {
        const filePath = `pictogramas/${this.user.foto.name}_${Date.now()}`; // Asegura el nombre único
        await this.firebaseService.uploadFile(this.user.foto, filePath); // Subir el archivo
        const downloadUrl = await this.firebaseService.getDownloadURL(filePath); // Obtener la URL
        this.usuario.foto = downloadUrl;
      }
  
      // Subir nuevas imágenes de pictogramas si se seleccionaron
      if(this.user.nivelAccesibilidad == 'Imagen' || this.user.nivelAccesibilidad == 'Pictograma' || this.user.nivelAccesibilidad == 'Video'){
        const urlsActualizadas: string[] = [];
        for (let i = 0; i < this.pictogramasDisponibles.length; i++) {
          if (this.nuevosPictogramas[i]) {
            const filePath = `pictogramas/${this.nuevosPictogramas[i].name}_${Date.now()}`;
            await this.firebaseService.uploadFile(this.nuevosPictogramas[i], filePath);
            const downloadUrl = await this.firebaseService.getDownloadURL(filePath);
            urlsActualizadas[i] = downloadUrl;
          } else {
            urlsActualizadas[i] = this.user.imagenesPicto[i];
          }
        }
          
        // Actualizar el objeto usuario con las nuevas URLs
        this.usuario.imagenesPicto = urlsActualizadas;
        
        this.usuario.contrasenaPicto = this.pictogramasSeleccionados
        .map((selectedImage) => this.pictogramasDisponibles.indexOf(selectedImage))
        .filter((index) => index !== -1); // Asegurarse de que no haya índices inválidos

      }
      
      console.log(this.usuario);
      // Guardar los datos en la base de datos
      await this.firebaseService.actualizarAlumno(this.user.id, this.usuario);
      this.showToast('Usuario modificado correctamente con las nuevas imágenes.', true); 
    } catch (error) {
      console.error('Error al modificar el usuario:', error);
      this.showToast('Error al actualizar las imágenes y los datos del usuario.', false); 
    }
  }

}