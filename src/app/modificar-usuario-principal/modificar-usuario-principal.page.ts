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
  selector: 'app-modificar-usuario-principal',
  templateUrl: './modificar-usuario-principal.page.html',
  styleUrls: ['./modificar-usuario-principal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})

export class ModificarUsuarioPrincipalPage implements OnInit {
  // usuarios = [
  //   { id: 1, nombre: 'Usuario 1', imagen: 'assets/default-profile.jpg' },
  //   { id: 2, nombre: 'Usuario 2', imagen: 'assets/default-profile.jpg' },
  //   { id: 3, nombre: 'Usuario 3', imagen: 'assets/default-profile.jpg' },
  //   // Agrega más usuarios según sea necesario
  // ];
  usuarios: any[] = []; // Usuarios cargados de Firebase

  constructor(private router: Router, private firebaseService: FirebaseService) {}

  ngOnInit() { this.cargarUsuarios(); }

  async cargarUsuarios() {
    try {
      this.usuarios = await this.firebaseService.getCollection('alumnos');
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  }

  modificarUsuario(id: string) {
    console.log('Modificar usuario con ID:', id);
    this.router.navigate(['/modificar-usuario', id]); // Correctamente pasa el parámetro dinámico
  }
}
