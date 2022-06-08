import React from "react";
import { auth, provider, db } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

function Login({ setIsAuth }) {
    //Variable para redirigir a la pantalla de inicio.
    let navigate = useNavigate();

    /*
        Funcion para iniciar sesión en la app
    */
    const iniciarSesion = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                //Llamada a función
                console.log(result);
                comprobarLogin(result);
                //Poner en local storage una variable para saber si estas logueado
                localStorage.setItem("isAuth", true);
                //Cambiar variable de la aplicación para saber si estas logueado
                setIsAuth(true);
                //Redirigir a inicio
                navigate("/");
            })
            .catch((error) => {
                // Error
                console.log(error);
            });
    }

    const transformarEnCammelCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
          );
        
    }

    /*
        Comprobar login: si el usuario no se ha registrado antes, se va a guardar su correo en la bd, 
        y se va a presuponer que no es profesor
    */
    const comprobarLogin = async (result) => {
        //Generacion de una "query" para coger los docs que tengan usuario igual al que te acabas de loguear
        console.log("email", result.user.email)
        const q = query(collection(db, "usuarios"), where("correo", "==", result.user.email));
        //Coger los docs 
        const querySnapshot = await getDocs(q);
        //Comprobar longitud de la respuesta
        if (querySnapshot.docs.length >= 1) {
            //Si es 1, es que existe, y no tenemos que hacer nada
            console.log("ya existe: ", querySnapshot.docs)

        } else {
            //Si es 0, significa que hay que hacer un nuevo documento para el nuevo usuario
            console.log("no existe: ", querySnapshot.docs)
            const referenciaColUsuarios = collection(db, "usuarios");
            const newUsuario = {
                correo: result.user.email,
                nombre: transformarEnCammelCase(result.user.displayName),
                isProfesor: false,
                isAdmin: false,
                isSolicitadoSerProfesor: false,
                isSolicitadoSerAdmin: false
            }
            addDoc(referenciaColUsuarios, newUsuario);

        }
    }

    return (
        <div>
            <div>Login</div>
            <p>Iniciar sesión con Microsoft para continuar</p>
            <button onClick={iniciarSesion}>Iniciar sesión</button>
        </div>

    );
}


export default Login;