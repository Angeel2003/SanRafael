import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveOutline } from 'ionicons/icons';
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
  
  user: any;

  constructor(private router: Router, private firebaseService: FirebaseService) {
    addIcons({
    });
  }

  async ngOnInit(){
    // this.students = await this.firebaseService.getStudents();
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];
    
    //Inicializamos las tareas
    this.finishedTask = this.user.tareasTermin;
    this.assignedTask = this.user.tareasAsig;
    this.pendingTask = this.user.tareasPendientes;
  
    
  }

  accept(){

  }

  denied(){
    
  }


}
