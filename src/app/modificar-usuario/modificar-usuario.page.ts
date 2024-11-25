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

  constructor() {}

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

  modificarUsuario(): void {
    if (this.usuario.tipoContrasena === 'Pictogramas' && this.pictogramasSeleccionados.length === 0) {
      alert('Por favor seleccione al menos un pictograma.');
      return;
    }

    console.log('Datos del usuario:', this.usuario);
    console.log('Pictogramas seleccionados:', this.pictogramasSeleccionados);
    alert('Usuario modificado con éxito.');
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


}