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
    /*
        Comprobar login: si el usuario no se ha registrado antes, se va a guardar su correo en la bd, 
        y se va a presuponer que no es profesor
    */
    const comprobarLogin = async (result) => {
        //Generacion de una "query" para coger los docs que tengan usuario igual al que te acabas de loguear
        const q = query(collection(db, "usuarios"), where("correo", "==", result.user.email));
        //Coger los docs 
        const querySnapshot = await getDocs(q);
        //Comprobar longitud de la respuesta
        if (querySnapshot.docs.length >= 1) {
            //Si es 1, es que existe, y no tenemos que hacer nada

        } else {
            //Si es 0, significa que hay que hacer un nuevo documento para el nuevo usuario
            const referenciaColUsuarios = collection(db, "usuarios");
            const newUsuario = {
                correo: result.user.email,
                isProfesor: false,
                isAdmin: false
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