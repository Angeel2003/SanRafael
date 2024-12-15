import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service'; // Ajusta la importación según la ubicación de tu servicio

@Injectable({
  providedIn: 'root'
})
export class AulasGuardadasService {
  aulasGuardadas: { [key: string]: boolean } = {};
  aulasTotales: any;

  constructor(private firebaseService: FirebaseService) {
    this.reset();
  }
  // Método para marcar que la comanda de un aula ha sido guardada
  guardarComanda(aulaNombre: string) {
    this.aulasGuardadas[aulaNombre] = true;
  }

  aulaGuardada( aula: string) {
    return this.aulasGuardadas[aula];
  }

  // Método para verificar si todas las aulas han guardado su comanda
  todasAulasGuardadas(): boolean {
    return Object.values(this.aulasGuardadas).every(guardada => guardada);
  }

  // Método para reiniciar el estado de las aulas
  async reset() {
    this.aulasTotales = await this.firebaseService.getCollection('aulas');
    
    for(let i = 0; i < this.aulasTotales.length; i++) {
      this.aulasGuardadas[this.aulasTotales[i].nombre] = false;
    }
  }
}
