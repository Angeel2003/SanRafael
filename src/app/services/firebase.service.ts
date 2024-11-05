import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { addDoc, collection, getFirestore } from "firebase/firestore"; // Para Firestore Database
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"; // Para Firebase Storage
import { getAuth } from "firebase/auth"; 

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  private firebaseConfig = {
    apiKey: "AIzaSyBNS4uHdWMqQ6huVkqV4FhYtQi_9Jozn88",
    authDomain: "indepapp-sanrafael.firebaseapp.com",
    projectId: "indepapp-sanrafael",
    storageBucket: "indepapp-sanrafael.firebasestorage.app",
    messagingSenderId: "65579135683",
    appId: "1:65579135683:web:7dcb776bfbec36c67fe876",
    measurementId: "G-2K9V8MCKWE"
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
      const url = await getDownloadURL(storageRef); // Obtiene la URL de descarga
      return url;
    } catch (error) {
      console.error('Error al obtener la URL de descarga: ', error);
      throw new Error('Error al obtener la URL de descarga');
    }
  }

  async guardarTareaPorPasos(taskData: any): Promise<void> {
    const tasksCollection = collection(this.db, 'TareaPorPasos'); // Reemplaza 'tareas' con el nombre de tu colección

    try {
      await addDoc(tasksCollection, taskData); // Guarda los datos de la tarea en Firestore
      console.log('Tarea guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la tarea: ', error);
      throw new Error('Error al guardar la tarea');
    }
  }
}
