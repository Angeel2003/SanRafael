import { Injectable } from '@angular/core';
import { FirebaseError, initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, where } from "firebase/firestore"; // Para Firestore Database
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"; // Para Firebase Storage
import { Auth, getAuth, signInWithEmailAndPassword } from "firebase/auth"; 
import { from, map, Observable } from 'rxjs';

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

  constructor() {}

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

  async guardarTareaPorPasos(taskData: any): Promise<void> {
    const tasksCollection = collection(this.db, 'tarea-por-pasos'); 

    try {
      await addDoc(tasksCollection, taskData); 
      console.log('Tarea guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la tarea: ', error);
      throw new Error('Error al guardar la tarea');
    }
  }

  //Asignar tarea a alumno
  async getCollectionDocId(collectionName: string, docId: string): Promise<string[]> {
    const names: string[] = [];
    const querySnapshot = await getDocs(collection(this.db, collectionName));

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data[docId]) { // Asegúrate de que el campo 'nombre' exista
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
  
  async getAllDefaultAccesValues(): Promise<string[]> {
    const collectionName = 'alumnos';
    let allAccesibilities: string[] = [];

    const names = await this.getCollectionDocId(collectionName, 'nivelAccesibilidad');
    allAccesibilities = allAccesibilities.concat(names);

    return allAccesibilities;
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

  async getMenus(): Promise<any[]> {
    try {
      // Referencia a la colección 'menu-prueba'
      const menuCollection = collection(this.db, 'menu-prueba');
      // Obtén los documentos de la colección
      const snapshot = await getDocs(menuCollection);
      // Mapea los documentos a un array de objetos
      return  snapshot.docs.map(doc => ({
        id: doc.id, // ID del documento
        ...doc.data() // Datos del documento
      }));

    } catch (error) {
      console.error("Error al obtener los menús:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  async deleteMenu(docId: string): Promise<void>{
    try{
      const menuDocRef = doc(this.db, 'menu-prueba', docId);
      await deleteDoc(menuDocRef);
    }catch (error) {
      console.error("Error al eliminar menu:", error);
    }
    
  }
}