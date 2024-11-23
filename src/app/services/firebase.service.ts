import { Injectable } from '@angular/core';
import { FirebaseError, initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

import { Auth, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { from, map, Observable } from 'rxjs';
import { Asignacion } from '../asignar-tarea/asignar-tarea.page';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore"; // Para Firestore Database
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"; // Para Firebase Storage
import { OrderTask } from '../crear-tarea-comanda/crear-tarea-comanda.page';
import { Tarea } from '../agenda/agenda.page';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private firebaseConfig = {
    apiKey: "AIzaSyC6BGWDRfxIsN4PMDJvxEkI-5JpUBC3H5Q",
    authDomain: "aplicacion-d5cbf.firebaseapp.com",
    projectId: "aplicacion-d5cbf",
    storageBucket: "aplicacion-d5cbf.appspot.com",
    messagingSenderId: "814797117572",
    appId: "1:814797117572:web:03c7631b8567c0da05cad1",
    measurementId: "G-ZXV4F52H55"
  };

  app = initializeApp(this.firebaseConfig);
  analytics = getAnalytics(this.app);
  db = getFirestore(this.app); // Para acceder a Firestore
  storage = getStorage(this.app); // Para acceder a Storage
  auth = getAuth(this.app); // Para acceder a Auth

  constructor() { }

  //Tarea por pasos
  async uploadFile(file: File, path: string): Promise<void> {
    const storageRef = ref(this.storage, path); // Crea una referencia en Firebase Storage

    try {
      await uploadBytes(storageRef, file); // Sube el archivo
      console.log('Archivo subido con éxito');
    } catch (error) {
      console.error('Error al subir el archivo: ', error);
      throw new Error('Error al subir el archivo');
    }
  }

  async getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(this.storage, path); // Crea una referencia a la ubicación del archivo

    try {
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error al obtener la URL de descarga: ', error);
      throw new Error('Error al obtener la URL de descarga');
    }
  }

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);

    try {
      await deleteObject(storageRef);
      console.log('Archivo eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el archivo: ', error);
      throw new Error('Error al eliminar el archivo');
    }
  }

  async guardarTareaPorPasos(taskData: any): Promise<boolean> {
    const tasksCollection = collection(this.db, 'tarea-por-pasos');

    try {
      await addDoc(tasksCollection, taskData);
      console.log('Tarea guardada con éxito');
      return true;
    } catch (error) {
      console.error('Error al guardar la tarea: ', error);
      return false;
    }
  }

  async guardarPerfil(profileData: any): Promise<void> {
    const usersCollection = collection(this.db, 'alumnos'); // Define la colección 'usuarios'

    try {
      await addDoc(usersCollection, profileData);
      console.log('Perfil guardado con éxito en Firestore');
    } catch (error) {
      console.error('Error al guardar el perfil: ', error);
      throw new Error('Error al guardar el perfil');
    }
  }

  //Asignar tarea a alumno
  async getCollectionDocId(collectionName: string, docId: string): Promise<string[]> {
    const names: string[] = [];
    const querySnapshot = await getDocs(collection(this.db, collectionName));

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data[docId]) {
        names.push(data[docId]);
      }
    });

    return names;
  }

  async getAllTaskNames(): Promise<string[]> {
    const collectionNames = ['tarea-por-pasos', 'tarea-comedor', 'tarea-material'];
    let allNames: string[] = [];

    for (const collectionName of collectionNames) {
      const names = await this.getCollectionDocId(collectionName, 'nombre');
      allNames = allNames.concat(names);
    }

    return allNames;
  }

  async getAllStudentsNames(): Promise<string[]> {
    const collectionName = 'alumnos';
    let allNames: string[] = [];

    const names = await this.getCollectionDocId(collectionName, 'nombre');
    allNames = allNames.concat(names);

    return allNames;
  }

  async getAllDefaultAccesValues(nombreAlumno: string): Promise<string[]> {
    const collectionName = 'alumnos';
    let accesibilityLevels: string[] = [];

    const querySnapshot = await getDocs(collection(this.db, collectionName));

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data['nombre'] == nombreAlumno) {
        accesibilityLevels.push(data['nivelAccesibilidad']);
      }
    });

    return accesibilityLevels;
  }


  async addTaskToStudent(studentName: string, asignacion: Asignacion): Promise<boolean> {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'alumnos'));

      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        if (data['nombre'] === studentName) {
          const studentDocRef = doc(this.db, 'alumnos', docSnapshot.id);
          await updateDoc(studentDocRef, {
            tareasAsig: arrayUnion(asignacion)
          });
          console.log('Tarea agregada correctamente al estudiante');
          return true;  // Devuelve true si se agregó la tarea correctamente
        }
      }

      console.warn('No se encontró un estudiante con el nombre especificado');
      return false;  // Devuelve false si no se encontró el estudiante
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
      return false;  // Devuelve false si ocurrió un error al actualizar el documento
    }
  }


  //Tarea material
  async guardarTareaMaterial(taskData: any): Promise<void> {
    const tasksCollection = collection(this.db, 'tarea-material');
    try {
      await addDoc(tasksCollection, taskData);
      console.log('Tarea de material guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la tarea de material: ', error);
      throw new Error('Error al guardar la tarea de material');
    }
  }

  // Método para obtener un usuario por tipo de contraseña y contraseña
  async verifyLoginData(type: 'PIN' | 'Texto', value: string | number): Promise<boolean> {
    try {
      const usersCollection = collection(this.db, 'alumnos'); // Reemplaza 'alumnos' con el nombre de tu colección si es diferente
      const q = query(usersCollection, where('tipoContrasena', '==', type), where('contrasena', '==', value));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // Si hay al menos un documento, el usuario es válido
    } catch (error) {
      console.error("Error verificando datos de login: ", error);
      return false;
    }
  }

  // Método para obtener la lista de usuarios
  getAlumnos(): Observable<any[]> {
    const usersRef = collection(this.db, 'alumnos');  // Referencia a la colección 'users'

    // Usamos `from` para convertir el Promise en un Observable
    return from(getDocs(usersRef)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))  // Mapeo de datos de Firestore a un arreglo de objetos
      )
    );
  }

  // Método para iniciar sesión
  async loginUser(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true; // Login exitoso
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Error en inicio de sesión:", firebaseError.message);
      return false; // Login fallido
    }
  }

  // Modificar tarea por pasos
  getTarea(nombreTarea: string, tabla: string): Observable<any[]> {
    const tareaRef = collection(this.db, tabla);

    // Crear una consulta para filtrar por el campo nombreTarea
    const tareaQuery = query(tareaRef, where('nombre', '==', nombreTarea));

    return from(getDocs(tareaQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )
    );
  }

  async actualizarTarea(id: string, data: any, tabla: string): Promise<boolean> {
    try {
      const docRef = doc(this.db, tabla, id);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        await updateDoc(docRef, data);
        console.log('Tarea actualizada con éxito');
        return true;
      } else {
        console.log('no existe tarea');
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      return false;
    }
  }

  //Crear tarea commanda
  async guardarTareaComanda(taskData: OrderTask): Promise<void> {
    const tasksCollection = collection(this.db, 'tarea-comanda');
    try {
      await addDoc(tasksCollection, taskData);
      console.log('Tarea de comanda guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la tarea de comanda: ', error);
      throw new Error('Error al guardar la tarea de comanda');
    }
  }

  async getAdminByEmail(email: string): Promise<any | null> {
    try {
      const adminCollection = collection(this.db, 'administradores');
      const q = query(adminCollection, where('correo', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Devuelve el primer documento encontrado
        return querySnapshot.docs[0].data();
      }
      return null; // Si no se encuentra el administrador
    } catch (error) {
      console.error("Error al buscar el administrador: ", error);
      return null;
    }
  }

  async getTareasForUser(userId: string): Promise<Tarea[]> {
    const alumnoDocRef = doc(this.db, 'alumnos', userId); // Referencia al documento del alumno
    try {
      const alumnoDocSnapshot = await getDoc(alumnoDocRef); // Obtiene el documento del alumno

      if (!alumnoDocSnapshot.exists()) {
        console.warn("No se encontró el alumno con ID:", userId);
        return [];
      }

      const alumnoData = alumnoDocSnapshot.data(); // Datos del alumno
      console.log("Datos del alumno:", alumnoData);

      const tareasAsignadas = alumnoData?.['tareasAsig'] || []; // Obtén las tareas asignadas, si existen
      console.log("Tareas asignadas:", tareasAsignadas);

      // Mapea las tareas a la estructura esperada
      const mappedTareas: Tarea[] = tareasAsignadas.map((tarea: any) => ({
        nombre: tarea.nombreTarea || '',
        imagen: tarea.imagen || '',
        horaIni: tarea.fechaInicio || '',
        horaFin: tarea.fechaFin || ''
      }));
      console.log("Tareas mapeadas:", mappedTareas);

      return mappedTareas;
    } catch (error) {
      console.error("Error al obtener las tareas del alumno:", error);
      throw error;
    }
  }


  //Gestionar material
  async guardarMaterialesAlmacen(taskData: any): Promise<boolean> {
    const tasksCollection = collection(this.db, 'materiales');
    try {
      await addDoc(tasksCollection, taskData);
      console.log('Materiales guardados con éxito');
      return true;
    } catch (error) {
      console.error('Error al guardar materiales: ', error);
      return false;
    }
  }

  async getNombreMaterialesAlmacen(): Promise<string[]>{
    const collectionName = 'materiales';
    let materialNames: string[] = [];

    const querySnapshot = await getDocs(collection(this.db, collectionName));

    querySnapshot.forEach(doc => {
      const data = doc.data();
      materialNames.push(data['nombreMaterial']);
    });

    return materialNames;
  }

  //Peticion material profesor
  async saveMaterialRequest(aula: string, nombreProf: any, materialesPeticion: any[]): Promise<boolean> {
    const collectionRef = collection(this.db, 'peticionesMaterial');
    const solicitud = {
      aula,
      nombreProf,
      materiales: materialesPeticion,
    };
    try {
      await addDoc(collectionRef, solicitud);
      console.log('Solicitud guardada con éxito:', solicitud);
      return true;
    } catch (error) {
      console.error('Error al guardar la solicitud:', error);
      return false;
    }
  }

  //Obtener Peticiones Material
  async getMaterialRequest(): Promise<any[]>{
    try{
      const requestCollection = collection(this.db, 'peticionesMaterial');
      const snapshot = await getDocs(requestCollection);
      const request = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data())
      }));
      console.log("Peticion de material obtenido exitosamente");
      return request
    }catch(error){
      console.error("Error al obtener las peticiones de materiales:", error);
      return [];
    }
  }
}
