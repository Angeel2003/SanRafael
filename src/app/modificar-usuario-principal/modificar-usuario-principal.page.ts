import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { arrowBack, arrowForward } from 'ionicons/icons';
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
  users: any[] = [];
  currentPage = 0;
  usersPerPage = 5; // Muestra 4 usuarios por página

  constructor(private router: Router, private firebaseService: FirebaseService) {
    addIcons({
      arrowBack,
      arrowForward
    })
  }

  ngOnInit() { 
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    try {
      this.users = await this.firebaseService.getCollection('alumnos');
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  }

  get paginatedUsers() {
    // Calcula el índice de inicio y final de la página actual
    const start = this.currentPage * this.usersPerPage;
    const end = start + this.usersPerPage;
    return this.users.slice(start, end);
  }

  get maxPage() {
    // Calcula el número total de páginas
    return Math.ceil(this.users.length / this.usersPerPage) - 1;
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  asignarTarea() {
    this.router.navigate(['/asignar-tarea']);
  }

  modificarUsuario(id: string) {
    this.router.navigate(['/modificar-usuario', id]); // Correctamente pasa el parámetro dinámico
  }
}
