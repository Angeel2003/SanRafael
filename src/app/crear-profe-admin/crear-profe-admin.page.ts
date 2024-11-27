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
  selector: 'app-crear-profe-admin',
  templateUrl: './crear-profe-admin.page.html',
  styleUrls: ['./crear-profe-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})

export class CrearProfeAdminPage implements OnInit {
  // Variables para almacenar datos del formulario
  nombre: string = '';
  correo: string = '';
  tipoUsuario: string = ''; // Valor predeterminado

  adminProfe = {
    nombre: '',
    correo: '',
    tipoUsuario: '',
    foto: '', // URL de la foto de perfil
    contrasena: ''
  };
  
  passwordVisible: boolean = false; // Para alternar visibilidad de la contraseña

  constructor() {
    addIcons({
      eyeOff,
      eye,
      lockClosedOutline
    });
   }

  ngOnInit() {}

  // Abre el selector de archivos
  triggerImageInput() {
    const input = document.getElementById('imageInput') as HTMLInputElement;
    input.click();
  }

  // Maneja la selección de imagen
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.adminProfe.foto = e.target.result; // Guarda la URL base64 de la imagen
      };
      reader.readAsDataURL(file);
    }
  }


   // Método para guardar el perfil
   guardarPerfil() {
    if (!this.adminProfe.nombre || !this.adminProfe.correo || !this.adminProfe.contrasena) {
      console.error('Por favor, completa todos los campos');
      return;
    }

    console.log('Datos guardados:', this.adminProfe);

    // Resetea el formulario
    this.adminProfe = {
      nombre: '',
      correo: '',
      tipoUsuario: 'admin',
      foto: '',
      contrasena: ''
    };
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}