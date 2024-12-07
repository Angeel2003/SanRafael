import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveOutline, star, starHalf, starOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { arrowBackOutline, personCircleOutline, addOutline } from 'ionicons/icons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonButtons, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonList, IonBackButton, IonFooter, IonCheckbox, IonSelect, IonSelectOption, IonRadio, IonRadioGroup, IonToast } from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-historial-tareas',
  templateUrl: './historial-tareas.page.html',
  styleUrls: ['./historial-tareas.page.scss'],
  standalone: true,
  imports: [IonToast, IonRadioGroup, IonRadio, IonSelectOption, IonSelect, IonCheckbox, IonButtons, IonBackButton, 
    IonFooter, IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HistorialTareasPage implements OnInit {

  //Alumnos
  private students: any = [];
  //Tareas cuyo plazo de tiempo para ser completadas ya ha pasado.
  finishedTask: any = [];
  //Tareas que estan asignadas a un alumno.
  assignedTask: any = [];
  //TAreas pendientes de revision por el administrador para ver si estan comletadas.
  pendingTask: any = [];
  puntuacion: number = 0;
  puntuacionMax: number = 5;
  numEstrellasEnteras: number = 0;
  mitadEstrella: boolean = false;
  numEstrellasRestantes: number = 0;

  
  user: any;

  constructor(private router: Router, private firebaseService: FirebaseService) {
    addIcons({
      star,
      starHalf,
      starOutline
    });
  }

  async ngOnInit(){
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];
    
    //Inicializamos las tareas
    this.finishedTask = this.user.tareasTermin;
    this.assignedTask = this.user.tareasAsig;
    this.pendingTask = this.user.tareasPendientes;
  
    this.recalcularPuntuacion();
    
  }

  pintarEstrellas(){
    this.numEstrellasEnteras = Math.trunc(this.puntuacion); //Sacamos la parte entera
    this.mitadEstrella = this.puntuacion - this.numEstrellasEnteras  == 0 ? false : true; //Si el resto es 0 no hay mitad estrella
    //Calculamos las estrellas restantes para dibujarlas vacias. si tiene estrella mitd se resta uno.
    this.numEstrellasRestantes = this.mitadEstrella ? this.puntuacionMax - this.numEstrellasEnteras - 1 : this.puntuacionMax - this.numEstrellasEnteras;

    if(this.numEstrellasRestantes < 0){
      this.numEstrellasRestantes = 0; //En caso de que sea negativo lo igualamos a 0
    }

    console.log("Numero estrellas enteras", this.numEstrellasEnteras, "Hay mitad estrella", this.mitadEstrella, "Estrellas restantes: ", this.numEstrellasRestantes);
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

  gestionarTarea(task: any, index: number, done: boolean){
    const completedTask: any = {nombreTarea: task.nombreTarea, fechaInicio: task.fechaInicio, fechaFin: task.fechaFin, completada: done};
    console.log(completedTask);
    console.log(this.user.id);
    //Incluimos la tarea completada en la base de datos (en tareasTermin)
    this.firebaseService.añadirTareaTerminada(completedTask, this.user.id);
    //Incluimos la tarea completada en el array finishedTask
    this.finishedTask.push(completedTask);

    //Eliminamos la tarea de la base de datos (en tareasPendientes)
    this.firebaseService.eliminarTareaPendiente(task, this.user.id);
    //Eliminamos la tarea del array pendingTask
    this.pendingTask.splice(index, 1);

    this.recalcularPuntuacion();

  }
}
