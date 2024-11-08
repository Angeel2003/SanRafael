import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
  IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.page.html',
  styleUrls: ['./user-login.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButtons, IonButton, IonBackButton, 
    IonItem, IonLabel, IonInput, NgIf,NgForOf, NgClass]
})

export class UserLoginPage implements OnInit {
  user: any;
  isPIN: boolean = false;
  isPictograma: boolean = false;

  buttons = [
    { image: 'https://img.freepik.com/vector-premium/cuadrado-sencillo-poner-fecha-blanco-negro-ilustracion-vectorial-linea-arte_969863-348534.jpg' },
    { image: 'https://www.j-line.be/media/images/HiRes/7844.jpg?v=73944c463c06b30eeac84d541a34e8f1' },
    { image: 'https://img.freepik.com/vector-premium/estrella-blanca-vector-icono-estrella-icono-vector-estrella-icono-linea-estrellas_619470-509.jpg' },
    { image: 'https://www.shutterstock.com/image-vector/equilateral-triangle-mathematics-arrow-line-260nw-2499367505.jpg' },
    { image: 'https://i.pinimg.com/736x/35/f3/58/35f3588006e7c87a71138ded73cd3d89.jpg' },
    { image: 'https://static.vecteezy.com/system/resources/thumbnails/005/200/636/small/hexagon-icon-black-color-illustration-flat-style-simple-image-vector.jpg' },
  ];

  userSelection: number[] = [];
  correctCombination = [0, 2, 4]; // Índices de la combinación correcta
  indicators = ['null', 'null', 'null']; // Estado del progreso: null = sin seleccionar, 'correct' o 'wrong'


  constructor(private route: ActivatedRoute, private router: Router) {
    addIcons({
      lockClosedOutline
    })

    this.route.params.subscribe(params => {
      this.user = JSON.parse(params['user']);
      // Verificar si el usuario tiene password = 'PIN'
      if (this.user.password === 'PIN') {
        this.isPIN = true;
      }
      else {
        this.isPictograma = true;
      }
    });
  }

  ngOnInit() {
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async selectButton(index: number) {
    if (this.userSelection.length < 3) {
      this.userSelection.push(index);
      this.indicators[this.userSelection.length - 1] = this.correctCombination[this.userSelection.length - 1] === index ? 'correct' : 'wrong';

      if (this.userSelection.some((selection, i) => selection !== this.correctCombination[i])) {
        await this.sleep(1000);
        this.resetSelection();
      } else if (this.userSelection.length === 3) {
        console.log('¡Contraseña correcta!');
        this.verifyCombination();
        await this.sleep(1000);
        this.resetSelection();
      }
    }
  }

  resetSelection() {
    this.userSelection = [];
    this.indicators = ['null', 'null', 'null']; // Reinicia el progreso
  }

  verifyCombination() {
    if (JSON.stringify(this.userSelection) === JSON.stringify(this.correctCombination)) {
      this.onSubmit();
    } else {
      console.log('Contraseña incorrecta');
      this.userSelection = []; // Reiniciar la selección
    }
  }

  onSubmit() {
    console.log('Iniciando sesión para:', this.user);
    this.router.navigate(['/agenda']);
  }
}
