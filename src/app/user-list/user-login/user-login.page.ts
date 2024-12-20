import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { lockClosedOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NgIf, NgForOf, NgClass, CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
  IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.page.html',
  styleUrls: ['./user-login.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
    IonItem, IonLabel, IonInput, NgIf,NgForOf, NgClass, CommonModule]
})

export class UserLoginPage implements OnInit {
  @ViewChild('pinInput') pinInput!: number;
  @ViewChild('textInput') textInput!: string;

  user: any;
  isPIN: boolean = false;
  isPictograma: boolean = false;
  isTexto: boolean = false;
  pinValue: number = -1;
  textValue: string = '';
  isPasswordIncorrect: boolean = false;
  incorrectPictogram: number[] = [-1, -1, -1];

  images : string[] = [];

  userSelection: number[] = [];
  correctCombination: number[] = []; // Índices de la combinación correcta
  indicators: string[] = ['https://img.freepik.com/fotos-premium/fondo-gris-claro-pequenos-destellos-textura-enfoque-macro-microtextura_328295-112.jpg', 'https://img.freepik.com/fotos-premium/fondo-gris-claro-pequenos-destellos-textura-enfoque-macro-microtextura_328295-112.jpg', 'https://img.freepik.com/fotos-premium/fondo-gris-claro-pequenos-destellos-textura-enfoque-macro-microtextura_328295-112.jpg'];


  constructor(private router: Router, private firebaseService: FirebaseService) {
    addIcons({
      lockClosedOutline,
      closeOutline,
      checkmarkOutline
    })

    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];

    // Verificar si el usuario tiene password = 'PIN'
    if (this.user.tipoContrasena === 'PIN') {
      this.isPIN = true;
    }
    else if (this.user.tipoContrasena === 'Pictograma'){
      this.isPictograma = true;
      this.images = this.user.imagenesPicto;
      this.correctCombination = this.user.contrasenaPicto;
    }
    else {
      this.isTexto = true;
    }
  }

  ngOnInit() {
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async selectButton(index: number) {
    if(this.incorrectPictogram[this.userSelection.length - 1] == 1) {
      this.userSelection.pop();
    }

    if (this.userSelection.length < 3) {
      if(this.incorrectPictogram[this.userSelection.length - 1] == 1) {
        this.userSelection.pop();
        this.userSelection.push(index);
        this.indicators[this.userSelection.length - 1] = this.images[index];
      } else {
        this.userSelection.push(index);
        this.indicators[this.userSelection.length - 1] = this.images[index];
      }

      if (this.userSelection.some((selection, i) => selection !== this.correctCombination[i])) {
        this.incorrectPictogram[this.userSelection.length - 1] = 1;
      } else {
        this.incorrectPictogram[this.userSelection.length - 1] = 0;
        await this.sleep(250);
      } 

      if (this.userSelection.length === 3) {
        this.verifyCombination();
        await this.sleep(1000);
      }
    }
  }

  deleteSelection() {
    // Elimina el último elemento de `userSelection`
    const lastIndex = this.userSelection.length - 1;
    if (lastIndex >= 0) {
      this.userSelection.pop();  // Quita el último elemento
  
      // Restablece la imagen del último indicador
      this.indicators[lastIndex] = 'https://img.freepik.com/fotos-premium/fondo-gris-claro-pequenos-destellos-textura-enfoque-macro-microtextura_328295-112.jpg';
  
      // Restablece el estado de incorrectPictogram en el último índice
      this.incorrectPictogram[lastIndex] = -1;
    }
  }

  resetSelection() {
    this.userSelection = [];
    this.indicators = ['https://img.freepik.com/fotos-premium/fondo-gris-claro-pequenos-destellos-textura-enfoque-macro-microtextura_328295-112.jpg', 'https://img.freepik.com/fotos-premium/fondo-gris-claro-pequenos-destellos-textura-enfoque-macro-microtextura_328295-112.jpg', 'https://img.freepik.com/fotos-premium/fondo-gris-claro-pequenos-destellos-textura-enfoque-macro-microtextura_328295-112.jpg']; // Reinicia el progreso
    this.incorrectPictogram= [-1, -1, -1];
  }

  verifyCombination() {
    if (JSON.stringify(this.userSelection) === JSON.stringify(this.correctCombination)) {
      this.onSubmit();
      this.resetSelection();
    }
  }

  async onSubmitPass() {
    const type = this.isPIN ? 'PIN' : 'Texto';
    
    // Obtener los valores de los inputs según el id
    this.pinValue = parseInt((document.getElementById('pinLogin') as HTMLInputElement)?.value || '');
    this.textValue = (document.getElementById('textoLogin') as HTMLInputElement)?.value || '';

    const value = this.isPIN ? this.pinValue : this.textValue;
    const isValid = await this.firebaseService.verifyLoginData(type, value);

    if (isValid) {
      this.isPasswordIncorrect = false;
      this.onSubmit();

      if(type == 'PIN')
        (document.getElementById('pinLogin') as HTMLInputElement).value = '';
      else
        (document.getElementById('textoLogin') as HTMLInputElement).value = '';
      
    } else {
      this.isPasswordIncorrect = true;
      this.resetInputs(); // Restablece los campos

    }
  }

  resetInputs() {
    this.pinValue = -1;
    this.textValue = '';
  }

  onSubmit() {
    localStorage.setItem('userId', this.user.id);
    this.router.navigate(['/agenda']);
  }
}
