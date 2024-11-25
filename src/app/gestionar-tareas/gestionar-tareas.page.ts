import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonIcon, IonText, IonLabel, IonButton, IonList, IonItem } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { AlertController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-gestionar-tareas',
  templateUrl: './gestionar-tareas.page.html',
  styleUrls: ['./gestionar-tareas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButtons, IonIcon, IonText, IonLabel, IonButton, IonList, IonItem]
})
export class GestionarTareasPage implements OnInit {
  tasks: any[] = [];

  constructor(private firebaseService: FirebaseService, private alertController: AlertController, private router: Router) {
    addIcons({
      createOutline,
      trashOutline
    })
  }

  async ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    this.tasks = await this.firebaseService.getCollection('tarea-por-pasos');
  }

  async deleteTask(taskId: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar Tarea',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              // Llamada al servicio de Firebase para eliminar la tarea
              await this.firebaseService.deleteDocument('tarea-por-pasos', taskId);
              console.log(`Tarea con ID ${taskId} eliminada correctamente.`);
              this.loadTasks(); // Refrescar la lista de tareas
            } catch (error) {
              console.error('Error al eliminar la tarea:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  modifyTask(task: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        task: task
      }
    };
    this.router.navigate(['/modificar-tarea-pasos'], navigationExtras);
  }
}
