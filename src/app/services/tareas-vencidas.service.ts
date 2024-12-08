import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service'; // Ajusta la importación según la ubicación de tu servicio

@Injectable({
  providedIn: 'root',
})
export class TareasVencidasService {
  constructor(private firebaseService: FirebaseService) {}

  async moverTareasVencidas(): Promise<void> {
    try {
      // Paso 1: Obtener todos los usuarios del sistema
      const usuarios = await this.firebaseService.getCollection('alumnos');

      // Paso 2: Iterar sobre cada usuario y procesar sus tareas
      for (const usuario of usuarios) {
        let tareasAsignadas = usuario.tareasAsig || [];
        let tareasPendientes = usuario.tareasPendientes || [];

        if (!Array.isArray(tareasAsignadas)) {
          tareasAsignadas = [tareasAsignadas];
        }

        let tareasNuevasPendientes = false;
        for (const tarea of tareasAsignadas) {
          // Paso 3: Verificar si la tarea está vencida
          const fechaFin = tarea.fechaFin ? new Date(tarea.fechaFin) : null;
          const hoy = new Date();

          if (fechaFin && fechaFin < hoy) {
            // Verificar si ya está en tareasPendientes
            const existeEnPendientes = tareasPendientes.some(
              (t: any) => t.nombreTarea === tarea.nombreTarea
            );

            if (!existeEnPendientes) {
              // Agregar la tarea al array de pendientes
              tareasPendientes.push({
                nombreTarea: tarea.nombreTarea,
                fechaInicio: tarea.fechaInicio,
                fechaFin: tarea.fechaFin,
                completada: false,
              });
              tareasNuevasPendientes = true;
            }
          }
        }

        // Paso 4: Si hay cambios, actualizar el usuario en la base de datos
        if (tareasNuevasPendientes) {
          await this.firebaseService.actualizarAlumno(usuario.id, {
            tareasPendientes: tareasPendientes,
          });
          console.log(`Tareas vencidas movidas a pendientes para el usuario ${usuario.id}`);
        }
      }
    } catch (error) {
      console.error('Error al procesar las tareas vencidas:', error);
    }
  }
}
