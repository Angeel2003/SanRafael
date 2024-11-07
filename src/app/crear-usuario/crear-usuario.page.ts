import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonRadio, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonBackButton, IonGrid, IonLabel, IonRow, IonItem, IonCol, IonInput, IonCheckbox, 
    IonSelect, IonButtons, IonText, IonSelectOption, IonCard, IonCardContent, IonIcon, IonButton, IonRadio]
})
export class CrearUsuarioPage implements OnInit {

  passwordType : string = '';
  accessibilityLevel: string = 'pictogramas'; // Valor inicial por defecto


  constructor() { }

  ngOnInit() {
  }

  selectPictogram(pictogramNumber: number) {
    console.log('Pictograma seleccionado:', pictogramNumber);
    // Aquí puedes manejar la selección de pictogramas, por ejemplo,
    // almacenando el número en un array para crear la contraseña pictográfica.
  }

}
