import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.page.html',
  styleUrls: ['./user-login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class UserLoginPage implements OnInit {
  user: any;
  isPIN: boolean = false;
  isPictograma: boolean = false;

  constructor(private route: ActivatedRoute) {
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

  onSubmit() {
    // Lógica para el inicio de sesión del usuario
    console.log('Iniciando sesión para:', this.user);
  }
}
