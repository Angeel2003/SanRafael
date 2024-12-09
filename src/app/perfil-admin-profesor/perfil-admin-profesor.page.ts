import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, IonBadge } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { addIcons } from 'ionicons';
import { alertOutline } from 'ionicons/icons';
import { TareasVencidasService } from '../services/tareas-vencidas.service';

@Component({
  selector: 'app-perfil-admin-profesor',
  templateUrl: './perfil-admin-profesor.page.html',
  styleUrls: ['./perfil-admin-profesor.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, NgIf, IonBadge]
})

export class PerfilAdminProfesorPage implements OnInit {
  adminProfe: any;
  private intervalId: any;
  peticiones: number | null = 0;
  users: any;
  showBadge: boolean | undefined;

  constructor(private router: Router, private firebaseService: FirebaseService, private tareasVencidasService: TareasVencidasService) {
    const navigation = this.router.getCurrentNavigation();
    this.adminProfe = navigation?.extras.state?.['adminProfe'];
    addIcons({
      alertOutline
    })
  }

  //Crea un intervalo para saber si le ha llegado alguna peticion de material
  async ngOnInit() {
    this.showBadge = false;
  
    this.users = await this.firebaseService.getCollection('alumnos');
    await this.tareasVencidasService.moverTareasVencidas();
    console.log('Descomentar para presentacion');
    // if (this.adminProfe.tipoUsuario === 'administrador') {
    //   this.checkCollectionStatus(); // Primera carga
    //   this.intervalId = setInterval(() => {
    //     this.checkCollectionStatus(); // Actualizaciones periódicas
    //   }, 100);
    // }
    this.checkCollectionStatus();
  }

  async checkCollectionStatus() {
    
    this.firebaseService.isCollectionEmpty('peticionesMaterial').subscribe({
      next: peticiones => {
        this.peticiones = peticiones;
      },
      error: error => {
        console.error('Error en el observable:', error);
      },
    });
  
    // Variable temporal para determinar si hay tareas pendientes
    let anyPendingTasks = false;
  
    const pendientesPromises = this.users.map((user: { id: string; }) => 
      this.firebaseService.getPendientesAdmin(user.id).toPromise()
    );
  
    Promise.all(pendientesPromises)
      .then(results => {
        results.forEach((numTareasPendientes, index) => {
          this.users[index].notificacionesCount = numTareasPendientes;
          if (numTareasPendientes > 0) {
            anyPendingTasks = true;
          }
        });
  
        // Actualizamos el badge solo si cambia el estado
        if (this.showBadge !== anyPendingTasks) {
          this.showBadge = anyPendingTasks;
        }
      })
      .catch(error => {
        console.error('Error al verificar tareas pendientes:', error);
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
