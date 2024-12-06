import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, IonBadge } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-perfil-admin-profesor',
  templateUrl: './perfil-admin-profesor.page.html',
  styleUrls: ['./perfil-admin-profesor.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, NgIf, IonBadge]
})

export class PerfilAdminProfesorPage implements OnInit {
  adminProfe: any;
  private intervalId: any;
  peticiones: number | null = 0;

  constructor(private router: Router, private firebaseService: FirebaseService) {
    const navigation = this.router.getCurrentNavigation();
    this.adminProfe = navigation?.extras.state?.['adminProfe'];
  }

  //Crea un intervalo para saber si le ha llegado alguna peticion de material
  ngOnInit() {
    if(this.adminProfe.tipoUsuario == 'administrador'){
      this.intervalId = setInterval(() => {
        this.checkCollectionStatus();
      }, 100);
    }
  }

  checkCollectionStatus() {
    this.firebaseService.isCollectionEmpty("peticionesMaterial").subscribe({
      next: peticiones => {
        this.peticiones = peticiones;
      },
      error: error => {
        console.error('Error en el observable:', error);
      },
    });
  }

  ngOnDestroy() {
    if (this.intervalId && this.adminProfe.tipoUsuario == 'administrador') {
      clearInterval(this.intervalId);
    }
  }

  crearUsuario() {
    this.router.navigate(['/crear-usuario']);
  }

  crearAdminProfe() {
    this.router.navigate(['/crear-profe-admin']);
  }

  gestionarUsuarios() {
    const navigationExtras: NavigationExtras = {
      state: {
        tipoUsuario: 'administrador'
      }
    };
    this.router.navigate(['/modificar-usuario-principal'], navigationExtras);
  }

  crearTareaPorPasos() {
    this.router.navigate(['/tarea-pasos']);

  }

  crearTareaDeMaterial() {
    this.router.navigate(['/tarea-material']);
  }

  crearTareaDeComedor() {
    this.router.navigate(['/crear-tarea-comanda']);
  }

  modificarMenu() {
    this.router.navigate(['/editar-menu']);
  }

  gestionarTareas() {
    this.router.navigate(['/gestionar-tareas']);
  }

  gestionarMateriales() {
    this.router.navigate(['/gestionar-material-admin']);
  }

  solicitarMaterial(nombre: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        nombre: nombre
      }
    };
    this.router.navigate(['/solicitar-material-profe'], navigationExtras);
  }

  peticionMaterial() {
    this.router.navigate(['/peticion-material']);
  }

}
