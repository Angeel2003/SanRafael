import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { NavigationExtras, Router } from '@angular/router';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, IonBadge } from '@ionic/angular/standalone';

@Component({
  selector: 'app-modificar-usuario-principal',
  templateUrl: './modificar-usuario-principal.page.html',
  styleUrls: ['./modificar-usuario-principal.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonIcon, IonCard, IonCardHeader, IonCardTitle, ReactiveFormsModule, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, IonBadge]
})

export class ModificarUsuarioPrincipalPage implements OnInit {
  users: any[] = [];
  currentPage = 0;
  usersPerPage = 5; // Muestra 4 usuarios por página
  notificaciones: any;
  adminProfe: string;
  private intervalId: any;
  peticiones: number | null = 0;

  constructor(private router: Router, private firebaseService: FirebaseService) {
    const navigation = this.router.getCurrentNavigation();
    this.adminProfe = navigation?.extras.state?.['tipoUsuario'];

    addIcons({
      arrowBack,
      arrowForward
    })
  }

  ngOnInit() { 
    if(this.adminProfe == 'administrador'){
      this.intervalId = setInterval(() => {
        this.checkCollectionStatus();
      }, 100);
    }
    this.cargarUsuarios();
  }

  ngOnDestroy() {
    if (this.intervalId && this.adminProfe == 'administrador') {
      clearInterval(this.intervalId);
    }
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

  checkCollectionStatus() {
    // Aquí usamos el método `getPendientesAdmin` para obtener el número de tareas pendientes
    for (let user of this.users) {
      this.firebaseService.getPendientesAdmin(user.id).subscribe({
        next: (numTareasPendientes) => {
          // Asumimos que numTareasPendientes es el número de tareas pendientes de cada alumno
          user.notificacionesCount = numTareasPendientes;
        },
        error: (error) => {
          console.error(`Error al obtener tareas pendientes para el usuario ${user.id}:`, error);
          user.notificacionesCount = 0;  // En caso de error, asignamos 0
        },
      });
    }
  }
  
  historialTareas(user: any){
    const navigationExtras: NavigationExtras = {
      state: {
        user: user
      }
    };
    this.router.navigate(['/historial-tareas'], navigationExtras);
  }
  
  
}
