import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { addOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
  IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, IonFooter, IonBackButton, IonButtons,
  IonToast, IonSelectOption, IonSelect
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-gestionar-material-admin',
  templateUrl: './gestionar-material-admin.page.html',
  styleUrls: ['./gestionar-material-admin.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, IonFooter,
    IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgClass, FormsModule, IonBackButton, IonButtons,
    IonToast , IonSelectOption, IonSelect
  ],
})


export class GestionarMaterialAdminPage implements OnInit{
  materials: { nombreMaterial: string }[] = [];
  materialsExistentes: { nombreMaterial: string }[] = [];

  constructor(private firebaseService: FirebaseService, private toastController: ToastController) {
    addIcons({
      addOutline,
      trashOutline
    })
  }

  ngOnInit() {
    this.cargarMateriales();
  }

  async cargarMateriales() {
    try {
      const materiales = await this.firebaseService.getNombreMaterialesAlmacen();
      if (materiales) {
        this.materials = materiales.map((material: any) => ({
          nombreMaterial: material,
        }));
      }
      this.materialsExistentes = [...this.materials];
    } catch (error) {
      console.error('Error al cargar los materiales:', error);
    }
  }

  addMaterial() {
    this.materials.push({ nombreMaterial: '' });
  }

  async save() {
    try {
      // Filtrar solo los materiales nuevos
      const nuevosMateriales = this.materials.filter(
        (material) => 
          material.nombreMaterial.trim() !== '' && 
          !this.materialsExistentes.some(
            (existente) => existente.nombreMaterial === material.nombreMaterial
          )
      );
  
      // Guardar únicamente los materiales nuevos en Firebase
      for (const material of nuevosMateriales) {
        await this.firebaseService.guardarMaterialesAlmacen(material);
      }
  
      // Mostrar mensaje de éxito
      if (nuevosMateriales.length > 0) {
        this.mostrarToast('Guardado con éxito', true);
      } else {
        this.mostrarToast('No hay nuevos materiales para guardar', true);
      }
    } catch (error) {
      console.error('Error al guardar materiales:', error);
      this.mostrarToast('Error al guardar', false);
    }
  }
  

  eliminarMaterial(index: number) {
    this.materials.splice(index, 1);
  }

  async mostrarToast(mensaje: string, exito: boolean) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'middle',
    });
    toast.style.setProperty(
      '--background',
      exito ? '#4caf50' : '#fa3333'
    );
    await toast.present();
  }

  trackByIndex(index: number): number {
    return index;
  }
}