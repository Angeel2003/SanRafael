import { Injectable } from '@angular/core';
import { FirebaseError, initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { from, map, Observable } from 'rxjs';
import { Asignacion } from '../asignar-tarea/asignar-tarea.page';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore"; // Para Firestore Database
import { deleteObject, getDownloadURL, getStorage, ref, listAll, uploadBytes } from "firebase/storage"; // Para Firebase Storage
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
    } catch (error) {
      console.error('Error al subir el archivo: ', error);
      throw new Error('Error al subir el archivo');
    }
  }

  async getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(this.storage, path); 

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
    } catch (error) {
      console.error('Error al eliminar el archivo: ', error);
      throw new Error('Error al eliminar el archivo');
    }
  }

  async guardarTareaPorPasos(taskData: any): Promise<boolean> {
    const tasksCollection = collection(this.db, 'tarea-por-pasos');

    try {
      await addDoc(tasksCollection, taskData);
      return true;
    } catch (error) {
      console.error('Error al guardar la tarea: ', error);
      return false;
    }
  }


  async guardarPerfil(profileData: any): Promise<void> {
    try {
      const usersCollection = collection(this.db, 'alumnos');
      await addDoc(usersCollection, profileData);
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
    const collectionNames = ['tarea-por-pasos', 'tarea-comanda', 'tarea-material'];
    let allNames: string[] = [];

    for (const collectionName of collectionNames) {
      const names = await this.getCollectionDocId(collectionName, 'nombre');
      const namescomanda = await this.getCollectionDocId(collectionName, 'name');
      allNames = allNames.concat(names);
      allNames = allNames.concat(namescomanda);
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
        return true;
      } else {
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

  //Agenda
  async getTareasForUser(userId: string): Promise<Tarea[]> {
    const alumnoDocRef = doc(this.db, 'alumnos', userId);
  
    try {
      const alumnoDocSnapshot = await getDoc(alumnoDocRef);
  
      if (!alumnoDocSnapshot.exists()) {
        console.warn("No se encontró el alumno con ID:", userId);
        return [];
      }
  
      const alumnoData = alumnoDocSnapshot.data();
      const tareasAsignadas = alumnoData?.['tareasAsig'] || [];
  
      if (!Array.isArray(tareasAsignadas) || tareasAsignadas.length === 0) {
        return [];
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Filtrar y mapear tareas
      const tareasFiltradas: Tarea[] = tareasAsignadas
        .filter((tarea: any) => {
          const fechaInicio = new Date(tarea.fechaInicio);
          const fechaFin = new Date(tarea.fechaFin);
  
          fechaInicio.setHours(0, 0, 0, 0);
          fechaFin.setHours(0, 0, 0, 0);
  
          // Tareas del día actual
          return today >= fechaInicio && today <= fechaFin;
        })
        .map((tarea: any) => ({
          nombre: tarea.nombreTarea || 'Sin nombre',
          imagen: tarea.preview || '',
          fechaInicio: tarea.fechaInicio,
          fechaFin: tarea.fechaFin,
          fueraDeTiempo: new Date(tarea.fechaFin) < new Date(), // Verificar si ha pasado la hora de fin
        }));
  
      return tareasFiltradas;
    } catch (error) {
      console.error("Error al obtener las tareas del alumno:", error);
      return [];
    }
  }
  
  
  async getStudentDocAcces(userId: string): Promise<string> {  // Retornamos un string
    const docRef = doc(this.db, 'alumnos', userId); // Referencia al documento del alumno
    
    try {
      const docSnapshot = await getDoc(docRef); // Obtén el documento del alumno
      
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const accesibilityLevel = data['nivelAccesibilidad']; // Suponiendo que es un string
        
        if (accesibilityLevel) {
          return accesibilityLevel; // Devuelve el string
        } else {
          console.warn("El campo 'nivelesAccesibilidad' está vacío o no existe");
          return ''; // Si no existe o está vacío, devuelve un string vacío
        }
        
      } else {
        console.warn(`No se encontró el alumno con ID: ${userId}`);
        return ''; // Si no existe el documento, devuelve un string vacío
      }
    } catch (error) {
      console.error("Error al obtener los niveles de accesibilidad:", error);
      return ''; // Devuelve un string vacío en caso de error
    }
  }

  // Bajar iamgen de Firebase
  async getImageUrl(path: string): Promise<string>{
    const storageRef = ref(this.storage, path);
    try{
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error){
      console.error('Error al obtener la URL de la imagen: ', error);
      throw new Error('No se pudo obtener la imagen');
    }
  }

  async getTareasDeColeccion(collectionName: string): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.db, collectionName));
    const tareas: any[] = [];
  
    querySnapshot.forEach(doc => {
      tareas.push({
        id: doc.id, // Guarda el ID del documento
        ...doc.data() // Guarda todos los atributos del documento
      });
    });
  
    return tareas;
  }

  async getPictogramImagesFromStorage(): Promise<string[]> {
  
    try {
      const folderPath = 'pictogramas'; // Ruta de la carpeta en Firebase Storage
  
      const folderRef = ref(this.storage, folderPath);
      const listResult = await listAll(folderRef);
  
      // Limitar a las primeras 6 imágenes
      const limitedItems = listResult.items.slice(0, 6); // Limitar a las primeras 6 imágenes
  
      if (limitedItems.length === 0) {
        console.warn('No se encontraron imágenes en la carpeta.');
        return [];
      }
  
      const urls = await Promise.all(
        limitedItems.map(item => getDownloadURL(item))
      );
      return urls; // Devuelve las URLs de las primeras 6 imágenes
    } catch (error) {
      console.error('Error al obtener imágenes de Firebase Storage:');
      throw new Error('No se pudieron obtener las imágenes desde Storage.');
    }
  }

  //Gestionar material
  async guardarMaterialesAlmacen(taskData: any): Promise<boolean> {
    const tasksCollection = collection(this.db, 'materiales');
    try {
      await addDoc(tasksCollection, taskData);
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
      return true;
    } catch (error) {
      console.error('Error al guardar la solicitud:', error);
      return false;
    }
  }

  async getCollection(collectionName: string): Promise<any[]> {
    const snapshot = await getDocs(collection(this.db, collectionName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(this.db, collectionName, docId);
    await deleteDoc(docRef);
  }
  
  //Obtener Peticiones Material
  async getMaterialRequest(): Promise<any[]>{
    try{
      const requestCollection = collection(this.db, 'peticionesMaterial');
      const snapshot = await getDocs(requestCollection);
      let request = [];
      request = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data())
      }));
      return request
    }catch(error){
      console.error("Error al obtener las peticiones de materiales:", error);
      return [];
    }
  }

  async getStudents(): Promise<any[]>{
    try{
      const studentsCollection = collection(this.db, 'alumnos');
      const snapshot = await getDocs(studentsCollection);
      let request = [];
      request = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data())
      }));
      return request
    }catch(error){
      console.error("Error al obtener los alumnos:", error);
      return [];
    }
  }

  //Comprobar si una coleccion esta vacia o no
   isCollectionEmpty(collectionName: string): Observable<number | null> {
    const collectionRef = collection(this.db, collectionName);
  
    return new Observable(observer => {
      getDocs(collectionRef)
        .then(snapshot => {
          observer.next(snapshot.size); // Emite true si está vacía, false si no.
          observer.complete();
        })
        .catch(error => {
          console.error('Error al comprobar la colección:', error);
          observer.next(null); // Emite null en caso de error.
          observer.complete();
        });
    });
  }

  async obtenerUsuario(id: string): Promise<any | null> {
    try {
      // Referencia al documento del alumno
      const alumnoDocRef = doc(this.db, 'alumnos', id);
      
      // Obtiene el documento del alumno
      const alumnoDocSnapshot = await getDoc(alumnoDocRef);
  
      // Verifica si el documento existe
      if (alumnoDocSnapshot.exists()) {
        // Retorna todos los campos del alumno junto con su ID
        return { id: alumnoDocSnapshot.id, ...alumnoDocSnapshot.data() };
      } else {
        console.warn('No se encontró un alumno con el ID especificado:', id);
        return null; // Retorna null si no existe el documento
      }
    } catch (error) {
      console.error('Error al obtener el alumno:', error);
      throw new Error('No se pudo obtener el alumno'); // Lanza un error si ocurre algún problema
    }
  }


  async actualizarAlumno(id: string, data: any): Promise<boolean> {
    try {
      const alumnoDocRef = doc(this.db, 'alumnos', id); // Referencia al documento del alumno
      const alumnoDocSnapshot = await getDoc(alumnoDocRef); // Verifica si el documento existe

      if (alumnoDocSnapshot.exists()) {
        await updateDoc(alumnoDocRef, data); // Actualiza el documento con los datos proporcionados
        return true; // Retorna true si la actualización fue exitosa
      } else {
        console.warn('No se encontró un alumno con el ID especificado para actualizar:', id);
        return false; // Retorna false si no existe el documento
      }
    } catch (error) {
      console.error('Error al actualizar el alumno:', error);
      throw new Error('No se pudo actualizar el alumno'); // Lanza un error si ocurre algún problema
    }
  }

  async getDocumentByName(collectionName: string, name: string): Promise<any> {
    const collectionRef = collection(this.db, collectionName);
    const q = query(collectionRef, where('nombre', '==', name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data(); // Devuelve el primer documento encontrado
    }
    return null; // Devuelve null si no encuentra nada
  }

  // Modificar usuario principal
  getPendientesAdmin(userId: string): Observable<number> {
    const alumnoRef = doc(this.db, 'alumnos', userId); // Referencia al documento del alumno
  
    return new Observable(observer => {
      getDoc(alumnoRef)
        .then(docSnapshot => {
          if (docSnapshot.exists()) {
            // Extraemos el array de tareasPendientes
            const data = docSnapshot.data();
            const tareasPendientes = data?.['tareasPendientes'] || []; // Por defecto un array vacío si no existe
            
            // Emitimos el número de tareas pendientes
            observer.next(tareasPendientes.length);
          } else {
            console.error(`El documento para el alumno ${userId} no existe.`);
            observer.next(0); // Si no existe el documento, asumimos 0 tareas pendientes
          }
          observer.complete();
        })
        .catch(error => {
          console.error(`Error al obtener las tareas pendientes para el usuario ${userId}:`, error);
          observer.next(0); // En caso de error, asumimos 0 tareas pendientes
          observer.complete();
        });
    });
  }

  async enviarNotificacion(notificacion: any) {
    try {
      const notificacionesCollection = collection(this.db, 'notificacionesAdmin');
      await addDoc(notificacionesCollection, notificacion);
    } catch (error) {
      console.error('Error al guardar la notificación:', error);
      throw error;
    }
  }

  async verificarNotificacionExistente(alumnoId: any, tipoNotificacion: string, fechaFin: any, fechaInicio: any, nombreTarea: any): Promise<boolean> {
    try {
      const notificacionesCollection = collection(this.db, 'notificacionesAdmin');
      const q = query(
        notificacionesCollection,
        where('alumnoId', '==', alumnoId),
        where('tipoNotificacion', '==', tipoNotificacion),
        where('fechaFin', '==', fechaFin),
        where('fechaInicio', '==', fechaInicio),
        where('nombreTarea', '==', nombreTarea)
      );
  
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // Devuelve `true` si ya existe la notificación
    } catch (error) {
      console.error('Error al verificar si la notificación ya existe:', error);
      throw error;
    }
  }
  
  async eliminarTareaPendiente(tarea: any, userId: string){
    const documentRef = doc(this.db, 'alumnos', userId);

    try {
      await updateDoc(documentRef, {
        tareasPendientes: arrayRemove(tarea)
      });
    } catch (error) {
      console.error('Error al eliminar el elemento:', error);
    }

  }

  async eliminarTareaAsignada(tarea: any, userId: string){
    const documentRef = doc(this.db, 'alumnos', userId);

    try {
      await updateDoc(documentRef, {
        tareasAsig: arrayRemove(tarea)
      });
    } catch (error) {
      console.error('Error al eliminar el elemento:', error);
    }

  }

  async añadirTareaTerminada(tarea: any, userId: string){
    const documentRef = doc(this.db, 'alumnos', userId);

    try {
      await updateDoc(documentRef, {
        tareasTermin: arrayUnion(tarea)
      });
    } catch (error) {
      console.error('Error al añadir el elemento:', error);
    }
  }

  getAdministradores(): Observable<any[]> {
    const adminCollection = collection(this.db, 'administradores'); // Referencia a la colección
    return from(getDocs(adminCollection)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      )
    );
  }

  actualizarPerfil(id: string, perfil: any): Promise<void> {
    const perfilRef = doc(this.db, 'administradores', id);
    return updateDoc(perfilRef, perfil);
  }

  subirImagen(file: File, ruta: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(this.storage, ruta); // Crear referencia en Firebase Storage
      uploadBytes(storageRef, file) // Subir el archivo
        .then(() => {
          // Obtener la URL de descarga una vez que el archivo esté subido
          getDownloadURL(storageRef)
            .then((url) => resolve(url))
            .catch((error) => reject('Error al obtener la URL: ' + error));
        })
        .catch((error) => reject('Error al subir la imagen: ' + error));
    });
  }

  
}
