import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service'; // Ajusta la importación según la ubicación de tu servicio

@Injectable({
  providedIn: 'root'
})
export class AulasGuardadasService {
  aulasGuardadas: { [aula: string]: { [alumno: string]: boolean } } = {};
  aulasTotales: any;

  constructor(private firebaseService: FirebaseService) {
    this.reset();
  }

  // Método para marcar que la comanda de un aula ha sido guardada por un alumno
  guardarComanda(aulaNombre: string, alumnoNombre: string) {
    if (!this.aulasGuardadas[aulaNombre]) {
      this.aulasGuardadas[aulaNombre] = {};
    }
    this.aulasGuardadas[aulaNombre][alumnoNombre] = true;
  }

  // Método para verificar si una aula ha sido guardada por un alumno específico
  aulaGuardada(aula: string, alumno: string) {
    return this.aulasGuardadas[aula]?.[alumno] || false;
  }

  // Método para verificar si todas las aulas han sido guardadas por un alumno específico
  todasAulasGuardadas(alumno: string): boolean {
    return Object.values(this.aulasGuardadas).every(aula => aula[alumno]);
  }

  // Método para reiniciar el estado de las aulas
  async reset() {
    this.aulasTotales = await this.firebaseService.getCollection('aulas');
    
    for (let i = 0; i < this.aulasTotales.length; i++) {
      this.aulasGuardadas[this.aulasTotales[i].nombre] = {};
    }
  }
}
