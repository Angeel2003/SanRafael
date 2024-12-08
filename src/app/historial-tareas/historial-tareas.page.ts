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

  //Tareas cuyo plazo de tiempo para ser completadas ya ha pasado.
  finishedTask: any = [];
  //Tareas que estan asignadas a un alumno.
  assignedTask: any = [];
  //TAreas pendientes de revision por el administrador para ver si estan comletadas.
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
    //Calculamos las estrellas restantes para dibujarlas vacias. si tiene estrella mitd se resta uno.
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
      //this.puntuacion = (tareasCompletadas/this.finishedTask.length) * this.puntuacionMax;
      this.puntuacion = (tareasCompletadas/this.finishedTask.length) * this.puntuacionMax;
    }

    //Redondeamos el valor de la puntuacion para que tome valores enteros y valores terminados en .5
    this.puntuacion = Math.round(this.puntuacion * 2)/2;
    console.log("Puntuacion Total: ",this.puntuacion, "Tareas finalizadas: ",this.finishedTask.length, "Tareas completadas: ", tareasCompletadas);

    this.pintarEstrellas();
  }

  gestionarTareaFinished(task: any, index: number, done: boolean){
    const completedTask: any = {nombreTarea: task.nombreTarea, fechaInicio: task.fechaInicio, fechaFin: task.fechaFin, completada: done};
    
    //Incluimos la tarea completada en la base de datos (en tareasTermin)
    this.firebaseService.añadirTareaTerminada(completedTask, this.user.id);
    //Incluimos la tarea completada en el array finishedTask
    this.finishedTask.push(completedTask);

    //Eliminamos la tarea de la base de datos (en tareasPendientes)
    this.firebaseService.eliminarTareaPendiente(task, this.user.id);
    //Eliminamos la tarea del array pendingTask
    this.pendingTaskFinished.splice(index, 1);

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
      // Eliminar tarea asignada de la base de datos
      this.firebaseService.eliminarTareaAsignada(asignedTask, this.user.id);
  
      const asignedTaskUnfinished: any = {
        nombreTarea: task.nombreTarea,
        fechaInicio: task.fechaInicio,
        fechaFin: task.fechaFin,
        completada: reasign, // Marcar como completada
      };
  
      // Añadir tarea a terminadas en la base de datos
      this.firebaseService.añadirTareaTerminada(asignedTaskUnfinished, this.user.id).then(() => {
        this.finishedTask.push(asignedTaskUnfinished);
    
        this.firebaseService.eliminarTareaPendiente(task, this.user.id).then(() => {
          this.pendingTaskFinished.splice(index, 1);
          this.recalcularPuntuacion();
          this.cdr.detectChanges(); // Forzar actualización de la vista
        }).catch((error) => console.error('Error eliminando tarea pendiente:', error));
      }).catch((error) => console.error('Error añadiendo tarea terminada:', error));
    } else {
      // Sumar 1 hora a la fecha de fin
      if (asignedTask.fechaFin) {
        const hoy = new Date(); // Obtén la fecha y hora actual
        hoy.setHours(hoy.getHours() + 1); // Suma 1 hora
        asignedTask.fechaFin = hoy.toISOString();
      }
  
      // Actualizamos la tarea en la base de datos (en tareas asignadas)
      this.firebaseService.actualizarAlumno(this.user.id, {
        tareasAsig: [asignedTask], // Asignamos la tarea actualizada
      });
  
      // Añadimos la tarea a la lista de asignadas
      this.assignedTask.push(asignedTask);
    }
  
    // Eliminar tarea pendiente de la base de datos y del array local
    this.firebaseService.eliminarTareaPendiente(task, this.user.id);
    this.pendingTaskUnfinished.splice(index, 1);
  
    // Recalcular la puntuación y actualizar las listas
    this.recalcularPuntuacion();
    this.cdr.detectChanges();
  }
  
  
}
