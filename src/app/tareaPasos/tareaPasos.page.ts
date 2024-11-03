import { NgFor, NgForOf, NgIf, NgClass } from '@angular/common';
import { Component} from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, 
        IonInput, IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList} from '@ionic/angular/standalone';
import { FormBuilder } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons'
import { personCircleOutline } from 'ionicons/icons'
import { addOutline } from 'ionicons/icons'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tarea-pasos',
  templateUrl: './tareaPasos.page.html',
  styleUrls: ['./tareaPasos.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonInput, 
            IonItem, IonLabel, IonTabs, IonTabBar, IonTabButton, IonList, NgIf, NgFor, NgForOf, NgClass, FormsModule],
})
export class TareaPasosPage {
  taskName: string = '';
  previewUrl: string | ArrayBuffer | null | undefined= null;
  currentTab: string = 'texto';
  stepText: string[] = [];
  stepPicto: string[] = [];
  stepImg: string[] = [];
  stepVideo: string[] = [];

  constructor(private fb: FormBuilder) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      addOutline
    })
  }

  imagenPreview(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl = e.target?.result;
      reader.readAsDataURL(file);
    }
  }

  imagenPaso(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
    }
  }

  selectTab(tab: string) {
    this.currentTab = tab;
  }

  addStep() {
    if(this.currentTab == 'texto'){
      const stepTextNumber = this.stepText.length + 1; // Genera el número del paso
      this.stepText.push(`${stepTextNumber}`); // Añade el paso al array  
    }else if(this.currentTab == 'picto'){
      const stepPictoNumber = this.stepPicto.length + 1; // Genera el número del paso
      this.stepPicto.push(`${stepPictoNumber}`); // Añade el paso al array  
    }else if(this.currentTab == 'imagenes'){
      const stepImgNumber = this.stepImg.length + 1; // Genera el número del paso
      this.stepImg.push(`${stepImgNumber}`); // Añade el paso al array  
    }else if(this.currentTab == 'videoPasos'){
      const stepVideoNumber = this.stepVideo.length + 1; // Genera el número del paso
      this.stepVideo.push(`${stepVideoNumber}`); // Añade el paso al array  
    }
  }
}
