import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveOutline } from 'ionicons/icons';
import { addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonButtons, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonList, IonBackButton } from '@ionic/angular/standalone';

interface MaterialItem {
  material : string;
  imagen : string;
  aula : string;
  cantidad : number;
}

@Component({
  selector: 'app-tarea-material',
  templateUrl: './tarea-material.page.html',
  styleUrls: ['./tarea-material.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, IonButtons, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, CommonModule, FormsModule]
})


export class TareaMaterialPage implements OnInit {

  taskName : string = '';
  items: MaterialItem[] = [];

  
  constructor() {
    addIcons({
      saveOutline,
      addOutline
    })
  }

  ngOnInit() {
  }

  imagenPreview(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
    }
  }

  addItem(){
    this.items.push({
      material: '',
      imagen: '',
      aula: '',
      cantidad: 0
    }); 
  }

  save(){
    console.log('Datos guardados: ', this.items);
  }

}
