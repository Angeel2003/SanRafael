import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modificar-admin-principal',
  templateUrl: './modificar-admin-principal.page.html',
  styleUrls: ['./modificar-admin-principal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class ModificarAdminPrincipalPage implements OnInit {
  perfiles: any[] = []; // Lista inicial vacía

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.cargarPerfiles();
  }

  cargarPerfiles() {
    this.firebaseService.getAdministradores().subscribe((data) => {
      this.perfiles = data.map((item: any) => ({
        id: item.id || item.correo, // Asegúrate de usar un identificador único
        nombre: item.nombre,
        imagen: item.foto || 'assets/default-avatar.png' // Imagen predeterminada si no hay foto
      }));
    });
  }

  modificarPerfil(id: number) {
    this.router.navigate(['/modificar-admin', id]);
  }

  crearPerfil() {
    this.router.navigate(['/modificar-admin']);
  }
}
