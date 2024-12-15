import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { star, starHalf, starOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonButtons, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonList, IonBackButton, IonFooter, IonCheckbox, IonSelect, IonSelectOption, IonRadio, IonRadioGroup, IonToast } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';
import { Navigation, Router } from '@angular/router';

@Component({
  selector: 'app-historial-tareas',
  templateUrl: './historial-tareas.page.html',
  styleUrls: ['./historial-tareas.page.scss'],
  standalone: true,
  imports: [IonToast, IonRadioGroup, IonRadio, IonSelectOption, IonSelect, IonCheckbox, IonButtons, IonBackButton, 
    IonFooter, IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HistorialTareasPage implements OnInit {

  finishedTask: any = [];
  assignedTask: any = [];
  pendingTasks: any;
  pendingTaskFinished: any = [];
  pendingTaskUnfinished: any = [];
  puntuacion: number = 0;
  puntuacionMax: number = 5;
  numEstrellasEnteras: number = 0;
  mitadEstrella: boolean = false;
  numEstrellasRestantes: number = 0;
  navigation: Navigation | null | undefined;
  
  user: any;

  constructor(private router: Router, private firebaseService: FirebaseService, private cdr: ChangeDetectorRef) {
    addIcons({
      star,
      starHalf,
      starOutline
    });
  }

  async ngOnInit(){
    this.navigation = this.router.getCurrentNavigation();
    this.initializeValues(this.navigation);

    this.recalcularPuntuacion();
  }

  initializeValues(navigation: (Navigation | null | undefined)) {
    this.user = navigation?.extras.state?.['user'];

    this.pendingTasks = [];
    this.pendingTaskFinished = [];
    this.pendingTaskUnfinished = [];

    //Inicializamos las tareas
    this.finishedTask = this.user.tareasTermin;
    this.assignedTask = this.user.tareasAsig;
    this.pendingTasks = this.user.tareasPendientes;
    
    this.clasificarPendingTasks();
  
  }

  clasificarPendingTasks() {
    this.pendingTaskFinished = [];
    this.pendingTaskUnfinished = [];
    
    if(this.pendingTasks){
      for (let tarea of this.pendingTasks) {
        if (tarea.completada) {
          this.pendingTaskFinished.push(tarea);
        } else {
          this.pendingTaskUnfinished.push(tarea);
        }
      }
    }
    // Eliminar las tareas pendientes de tareasAsig
    this.assignedTask = this.assignedTask.filter(
      (t: any) =>
        !this.pendingTasks.some((pendiente: any) => pendiente.nombreTarea === t.nombreTarea)
    );
    // Eliminar las tareas pendientes de tareasTermin
    this.finishedTask = this.finishedTask.filter(
      (t: any) =>
        !this.pendingTasks.some((pendiente: any) => pendiente.nombreTarea === t.nombreTarea)
    );
  }

  pintarEstrellas(){
    this.numEstrellasEnteras = Math.trunc(this.puntuacion); //Sacamos la parte entera
    this.mitadEstrella = this.puntuacion - this.numEstrellasEnteras  == 0 ? false : true; //Si el resto es 0 no hay mitad estrella

    this.numEstrellasRestantes = this.mitadEstrella ? this.puntuacionMax - this.numEstrellasEnteras - 1 : this.puntuacionMax - this.numEstrellasEnteras;

    if(this.numEstrellasRestantes < 0){
      this.numEstrellasRestantes = 0; //En caso de que sea negativo lo igualamos a 0
    }

  }

  //Funcion para que se puedan pintar las estrellas
  createRange(num: number): number[] {
    return Array(num).fill(0);
  }

  recalcularPuntuacion() {
    let tareasCompletadas = 0;
    for(let tarea of this.finishedTask){
      if(tarea.completada == true){
        tareasCompletadas++;
      }
    }
    if(this.finishedTask.length == 0){
      this.puntuacion = 0;
    }
    else{
      this.puntuacion = (tareasCompletadas/this.finishedTask.length) * this.puntuacionMax;
    }

    this.puntuacion = Math.round(this.puntuacion * 2)/2;
    
    this.pintarEstrellas();
  }

  gestionarTareaFinished(task: any, index: number, done: boolean){
    const completedTask: any = {nombreTarea: task.nombreTarea, fechaInicio: task.fechaInicio, fechaFin: task.fechaFin, completada: done};
    const asignedTask: any = {
      nombreTarea: task.nombreTarea,
      fechaInicio: task.fechaInicio,
      fechaFin: task.fechaFin,
    };

    //Incluimos la tarea completada en la base de datos (en tareasTermin)
    this.firebaseService.añadirTareaTerminada(completedTask, this.user.id);
    //Incluimos la tarea completada en el array finishedTask
    this.finishedTask.push(completedTask);

    //Eliminamos la tarea del array pendingTask
    this.pendingTaskFinished.splice(index, 1);
    //Eliminamos la tarea de la base de datos (en tareasPendientes)
    this.firebaseService.eliminarTareaAsignada(asignedTask, this.user.id);
    this.firebaseService.eliminarTareaPendiente(task, this.user.id);

    this.recalcularPuntuacion();

    this.cdr.detectChanges();

  }

  gestionarTareaUnfinished(task: any, index: number, reasign: boolean) {
    const asignedTask: any = {
      nombreTarea: task.nombreTarea,
      fechaInicio: task.fechaInicio,
      fechaFin: task.fechaFin,
    };
  
    if (!reasign) {
      this.firebaseService.eliminarTareaAsignada(asignedTask, this.user.id);
  
      const asignedTaskUnfinished: any = {
        nombreTarea: task.nombreTarea,
        fechaInicio: task.fechaInicio,
        fechaFin: task.fechaFin,
        completada: reasign,
      };
  
      this.firebaseService.añadirTareaTerminada(asignedTaskUnfinished, this.user.id).then(() => {
        this.finishedTask.push(asignedTaskUnfinished);
    
        this.firebaseService.eliminarTareaPendiente(task, this.user.id).then(() => {
          this.pendingTaskFinished.splice(index, 1);
          this.recalcularPuntuacion();
          this.cdr.detectChanges(); 
        }).catch((error) => console.error('Error eliminando tarea pendiente:', error));
      }).catch((error) => console.error('Error añadiendo tarea terminada:', error));

    } else {
      if (asignedTask.fechaFin) {
        const hoy = new Date();
        hoy.setHours(hoy.getHours() + 2);
        asignedTask.fechaFin = hoy.toISOString().slice(0, -5);
      }
  
      this.firebaseService.actualizarAlumno(this.user.id, {
        tareasAsig: [...this.assignedTask, asignedTask],
      });
  
      this.assignedTask.push(asignedTask);
    }
  
    this.firebaseService.eliminarTareaPendiente(task, this.user.id);
    this.pendingTaskUnfinished.splice(index, 1);
  
    this.recalcularPuntuacion();
    this.cdr.detectChanges();
  }
  
  
}
