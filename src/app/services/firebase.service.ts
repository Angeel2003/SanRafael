import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore"; // Para Firestore Database
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"; // Para Firebase Storage
import { getAuth } from "firebase/auth"; 

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

  async getCollectionNames(collectionName: string): Promise<string[]> {
    const names: string[] = [];
    const querySnapshot = await getDocs(collection(this.db, collectionName));

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data['nombre']) { // Asegúrate de que el campo 'nombre' exista
        names.push(data['nombre']);
      }
    });

    return names;
  }

  // Método para obtener nombres de múltiples colecciones
  async getAllTaskNames(): Promise<string[]> {
    const collectionNames = ['tarea-por-pasos', 'tarea-comedor', 'tarea-materia'];
    let allNames: string[] = [];

    for (const collectionName of collectionNames) {
      const names = await this.getCollectionNames(collectionName);
      allNames = allNames.concat(names);
    }

    return allNames;
  }
  
}
