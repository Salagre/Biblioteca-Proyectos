import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth, OAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth'
import {getStorage} from "firebase/storage"

//Configuración de firebase
const firebaseConfig = {
  apiKey: "AIzaSyByikB_66VTCMeg0jZvD6VIPlviLo2ewAo",
  authDomain: "bibliotecaproyectos-b8afd.firebaseapp.com",
  projectId: "bibliotecaproyectos-b8afd",
  storageBucket: "bibliotecaproyectos-b8afd.appspot.com",
  messagingSenderId: "546765229133",
  appId: "1:546765229133:web:b0364eee357eb81fc2a004"
};

// Inicializar Firebase
 const app = initializeApp(firebaseConfig);

// Coger la base de datos
export const db = getFirestore(app);

// Objeto Auth, para saber si estamos autenticados
export const auth = getAuth(app);
// Dar persistencia a la autorización para que cuando se cierre la página y se vuelva a abrir, 
// no haga falta iniciar sesión otra vez
setPersistence(auth, browserLocalPersistence);

// Provider para el servicio de autenticación
export const provider = new OAuthProvider("microsoft.com");

// Configuración del provider
provider.setCustomParameters({
    prompt: 'consent',
    login_hint: 'ahh',
    tenant: 'educa.jcyl.es'
});

export const storage = getStorage(app)