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
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';


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
  usuario: any = {
    nombre: '',
    usuario: '',
    nivelAccesibilidad: '',
    tipoContrasena: '',
    contrasena: '',
  };


  profileImageUrl: string | null = null; // URL de la imagen seleccionada
  passwordVisible: boolean = false; // Controla la visibilidad de la contraseña

    // Pictogramas
    pictogramasDisponibles: string[] = [
      'assets/pictogramas/imagen1.png',
      'assets/pictogramas/imagen2.png',
      'assets/pictogramas/imagen3.png',
      'assets/pictogramas/imagen4.png',
    ];
    pictogramasSeleccionados: string[] = [];

  constructor(  
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idUsuario = params.get('id');  // Aquí obtienes el parámetro 'id' de la URL
      console.log('ID Usuario desde la ruta:', idUsuario);  // Asegúrate de que el ID se obtenga correctamente
      if (idUsuario) {
        this.cargarDatosUsuario(idUsuario);
      } else {
        console.error('No se pudo obtener el ID del usuario.');
      }
    });
  }

  cargarDatosUsuario(id: string): void {
    this.firebaseService.obtenerUsuario(id).then((usuario: any) => {
      if (usuario) {
        this.usuario.nombre = usuario.nombre || '';
        this.usuario.usuario = usuario.usuario || '';
        this.usuario.nivelAccesibilidad = usuario.nivelAccesibilidad || ''; 
        this.usuario.tipoContrasena = usuario.tipoContrasena || '';
        this.usuario.contrasena = usuario.contrasena || '';
  
        // Cargar la foto de perfil desde Firestore
        if (usuario.foto) {
          this.profileImageUrl = usuario.foto;  // Aquí asignamos la URL de la foto
        }
  
        console.log('Usuario cargado:', this.usuario); // Debug
      } else {
        console.error('El usuario no existe en la base de datos.');
      }
    }).catch((error) => {
      console.error('Error al cargar el usuario:', error);
    });
  }
  actualizarDatosUsuario(): void {
    if (this.usuario.nombre && this.usuario.usuario && this.usuario.nivelAccesibilidad) {
      this.firebaseService.actualizarAlumno(this.usuario.id, this.usuario).then((resultado) => {
        if (resultado) {
          alert('Datos actualizados con éxito');
        } else {
          alert('Error al actualizar los datos del usuario.');
        }
      }).catch(() => {
        alert('Error al actualizar los datos.');
      });
    } else {
      alert('Por favor, complete todos los campos.');
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
        this.profileImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
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
    if (this.pictogramasSeleccionados.includes(pictograma)) {
      this.pictogramasSeleccionados = this.pictogramasSeleccionados.filter(p => p !== pictograma);
    } else {
      if (this.pictogramasSeleccionados.length < 4) { // Máximo de 4 pictogramas
        this.pictogramasSeleccionados.push(pictograma);
      } else {
        alert('Solo puedes seleccionar un máximo de 4 pictogramas.');
      }
    }
  }

  modificarUsuario(): void {
    // Aquí es donde puedes agregar la lógica para modificar el usuario.
    // Por ejemplo, actualizar los datos del usuario en Firebase.

    // Verifica que todos los campos estén llenos (por ejemplo, nombre, usuario, etc.)
    if (this.usuario.nombre && this.usuario.usuario && this.usuario.contrasena) {
      // Actualizar en Firebase o en la base de datos
      this.firebaseService.actualizarAlumno(this.usuario.id, this.usuario)
        .then(() => {
          // Redirige o muestra un mensaje de éxito
          alert('Usuario modificado correctamente.');
        })
        .catch((error) => {
          console.error('Error al modificar el usuario:', error);
          alert('Hubo un error al modificar el usuario.');
        });
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

}