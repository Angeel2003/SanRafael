import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonToast, IonSelectOption, IonSelect, IonRadio, IonRadioGroup
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-solicitar-material-profe',
  templateUrl: './solicitar-material-profe.page.html',
  styleUrls: ['./solicitar-material-profe.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, IonFooter,
    IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgClass, FormsModule, IonBackButton, IonButtons,
    IonToast , IonSelectOption, IonSelect, IonRadio, IonRadioGroup
  ],
})
export class SolicitarMaterialProfePage implements OnInit {
  aula: string = '';
  materialsAlmacen: string[] = [];
  selectedMaterial: string[] = [];
  materialesPeticion: {nombreMaterial: string, tamanio: string, color: string, cantidad: number}[] = [];
  nombreProf: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router, private toastController: ToastController) {
    addIcons({
      addOutline
    });
    const navigation = this.router.getCurrentNavigation();
    this.nombreProf = navigation?.extras.state?.['nombre'];
    
  }

  async ngOnInit() {
    this.materialsAlmacen = await this.firebaseService.getNombreMaterialesAlmacen();
    
;  }

  onSelectMaterial(event: any, index: number) {
    this.materialesPeticion[index].nombreMaterial = event.detail.value;
    this.selectedMaterial[index] = event.detail.value;
    
  }

  handleBlur() {
    const ionSelect = document.querySelector('ion-select');
    if (ionSelect) {
      ionSelect.blur(); // Forzar que el foco salga de manera segura
    }
  }

  async mostrarToast(mensaje: string, exito: boolean){
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'middle'
    });
    if (exito){
      toast.style.setProperty('--background', '#4caf50');
    } else {
      toast.style.setProperty('--background', '#fa3333');
    }
    toast.style.setProperty('--color', '#ffffff');
    toast.style.setProperty('font-weight', 'bold');
    toast.style.setProperty('font-size', 'xx-large');
    toast.style.setProperty('text-align', 'center');
    toast.style.setProperty('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.7)');
    toast.style.setProperty('border-radius', '10px');
    toast.style.marginTop = '50px';
    await toast.present();
  }

  addMaterialPet(){
    this.materialesPeticion.push({nombreMaterial: '', tamanio: '', color: '', cantidad: 0});
  }

  async request() {
    if (this.aula.trim() && this.materialesPeticion.length > 0) {
      try {
        const guardadoExitoso = await this.firebaseService.saveMaterialRequest(this.aula, this.nombreProf, this.materialesPeticion);
        
        if (guardadoExitoso) {
          this.mostrarToast('Guardado con éxito', true);
          console.log('exito');
        } else {
          this.mostrarToast('Error al guardar', false);
          console.log('error1');
        }

        this.resetForm();
      } catch (error) {
        this.mostrarToast('Error al guardar', false);
        console.error('Error al enviar la solicitud:', error);
      }
    } else {
      this.mostrarToast('Por favor completa todos llos campos', false);
      console.error('Por favor, completa todos los campos.');
    }
  }

  resetForm() {
    this.aula = '';
    this.materialesPeticion = [{nombreMaterial: '', tamanio: '', color: '', cantidad: 0}];
  }

}