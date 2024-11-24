import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-perfil-admin-profesor',
  templateUrl: './perfil-admin-profesor.page.html',
  styleUrls: ['./perfil-admin-profesor.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, NgIf]
})

export class PerfilAdminProfesorPage implements OnInit {
  adminProfe: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.adminProfe = navigation?.extras.state?.['adminProfe'];
  }

  ngOnInit() {
  }

  crearUsuario() {
    this.router.navigate(['/crear-usuario']);
  }

  crearAdminProfe() {
    console.log("Solicitando material por parte del profesor");
    console.log("Descomentar cuando este implementado");
    // this.router.navigate(['/crear-admin-profe']);
  }

  gestionarUsuarios() {
    console.log("Solicitando material por parte del profesor");
    console.log("Descomentar cuando este implementado");
    // this.router.navigate(['/gestionar-usuarios']);
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

  modificarTareaPorPasos() {
    this.router.navigate(['/modificar-tarea-pasos']);
  }

  modificarTareaMaterial() {
    this.router.navigate(['/modificar-tarea-material']);
  }

}
