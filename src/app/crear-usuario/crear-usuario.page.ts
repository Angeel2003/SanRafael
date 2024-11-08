import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class CrearUsuarioPage implements OnInit {
  passwordType: string = ''; // Para el tipo de contraseña
  accessibilityLevel: string = ''; // Para el tipo de accesibilidad

<<<<<<< HEAD
  passwordType : string = '';
  accessibilityLevel: string = ''; // Valor inicial por defecto
=======
  constructor() {}
>>>>>>> master

  ngOnInit() {}

  // Método para manejar la acción de guardar
  guardarPerfil() {
    if (!this.accessibilityLevel || !this.passwordType) {
      console.log('Por favor, completa todos los campos');
      return;
    }

    const perfilData = {
      accessLevel: this.accessibilityLevel,
      passwordType: this.passwordType,
    };

    console.log('Perfil guardado:', perfilData);
    // Aquí puedes añadir lógica adicional para enviar los datos al servidor o guardarlos.
  }

  // Método para seleccionar el pictograma
  selectPictogram(pictogramNumber: number) {
    console.log('Pictograma seleccionado:', pictogramNumber);
  }
}

