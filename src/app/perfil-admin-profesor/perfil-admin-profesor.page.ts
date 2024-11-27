import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-perfil-admin-profesor',
  templateUrl: './perfil-admin-profesor.page.html',
  styleUrls: ['./perfil-admin-profesor.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, NgIf]
})

export class PerfilAdminProfesorPage implements OnInit {
  adminProfe: any;
  private intervalId: any; 
  isEmpty: boolean | null = null;

  constructor(private router: Router, private firebaseService: FirebaseService) {
    const navigation = this.router.getCurrentNavigation();
    this.adminProfe = navigation?.extras.state?.['adminProfe'];
  }

  //Crea un intervalo para saber si le ha llegado alguna peticion de material
  ngOnInit() {
    if(this.adminProfe.tipoUsuario == 'administrador'){
      this.intervalId = setInterval(() => {
        this.checkCollectionStatus();
      }, 2000);
    }
  }

  checkCollectionStatus() {
    this.firebaseService.isCollectionEmpty("peticionesMaterial").subscribe({
      next: isEmpty => {
        this.isEmpty = isEmpty;
        console.log(
          isEmpty === null
            ? 'Error al comprobar la colección.'
            : isEmpty
            ? 'La colección está vacía.'
            : 'La colección tiene documentos.'
        );
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
    console.log("Solicitando material por parte del profesor");
    console.log("Descomentar cuando este implementado");
    this.router.navigate(['/crear-profe-admin']);
  }

  gestionarUsuarios() {
    console.log("Solicitando material por parte del profesor");
    console.log("Descomentar cuando este implementado");
     this.router.navigate(['/modificar-usuario-principal']);
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
    console.log('Nombre del profesor:', nombre);
    const navigationExtras: NavigationExtras = {
      state: {
        nombre: nombre
      }
    };
    this.router.navigate(['/solicitar-material-profe'], navigationExtras);
  }

  


  // BOTONES SIN COLOCAR
  asignarTarea() {
    this.router.navigate(['/asignar-tarea']);
  }

  modificarTareaMaterial() {
    this.router.navigate(['/modificar-tarea-material']);
  }

  peticionMaterial() {
    this.router.navigate(['/peticion-material']);
  }
}
