import { Injectable } from '@angular/core';
import { FirebaseError, initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

import { Auth, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { from, map, Observable } from 'rxjs';
import { Asignacion } from '../asignar-tarea/asignar-tarea.page';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore"; // Para Firestore Database
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"; // Para Firebase Storage
import { OrderTask } from '../crear-tarea-comanda/crear-tarea-comanda.page';
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


}
