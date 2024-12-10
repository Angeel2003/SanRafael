import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { eyeOff, eye } from 'ionicons/icons';
import { lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-modificar-admin',
  templateUrl: './modificar-admin.page.html',
  styleUrls: ['./modificar-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class ModificarAdminPage implements OnInit {
  perfil: any = {
    nombre: '',
    correo: '',
    foto: '',
    tipoUsuario: ''
  };

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPerfil(id);
    }
  }

  cargarPerfil(id: string) {
    this.firebaseService.getAdministradores().subscribe((perfiles) => {
      const perfil = perfiles.find((p: any) => p.id === id);
      if (perfil) {
        this.perfil = perfil;
      }
    });
  }

  modificar() {
    // Lógica para actualizar el perfil en Firebase
    this.firebaseService.actualizarPerfil(this.perfil.id, this.perfil).then(() => {
      alert('Perfil modificado con éxito');
      this.router.navigate(['/perfil-admin-profesor']);
    });
  }
  subirFoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
  
    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        try {
          // Llamar a una función de tu servicio para subir la foto
          const url = await this.firebaseService.subirImagen(file, `perfil/${this.perfil.id}`);
          this.perfil.foto = url; // Actualizar la URL de la foto en el perfil
          alert('Foto cargada con éxito');
        } catch (error) {
          console.error('Error al subir la foto:', error);
          alert('Error al subir la foto');
        }
      }
    };
  
    input.click(); // Simular clic para abrir el selector de archivos
  }
}
