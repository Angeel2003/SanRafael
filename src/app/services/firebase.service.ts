// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Para Firestore Database
import { getStorage } from "firebase/storage"; // Para Firebase Storage
import { getAuth } from "firebase/auth"; // Para autenticación

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
}
