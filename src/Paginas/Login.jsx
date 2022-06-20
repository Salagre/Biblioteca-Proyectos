import React, { useState, useEffect } from "react";
import { auth, provider, db } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

function Login({ setIsAuth }) {
    //Variable para redirigir a la pantalla de inicio.
    let navigate = useNavigate();
    const [mantenerSesion, setMantenerSesion] = useState(false);

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
                localStorage.setItem("sesion", mantenerSesion ? "si" : "no");
                setIsAuth(true);
                //Redirigir a inicio
                navigate("/");
            })
            .catch((error) => {
                // Error
            });
    }

    const transformarEnCammelCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function (txt) {
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
            <div className="container d-flex align-items-center justify-content-center" style={{ width: "450px" }}>
                <div className="text-center">
                    <h3 className="m-5">Login</h3>
                    <h5 className="m-3">Debes iniciar sesión con tu cuenta del portal de EDUCACYL para continuar</h5>
                    <br />
                    <button className="btn btn-primary p-2 rounded" onClick={iniciarSesion}>
                        &emsp;<i className="bi bi-lock"></i>&emsp;Iniciar Sesión&emsp;
                    </button><br /><br />
                    <input id="ch1" type="checkbox" onChange={() => {setMantenerSesion(!mantenerSesion)}} /><label htmlFor="ch1">&emsp;Mantener sesión iniciada.</label>
                </div>

            </div>
            <br /><br /><br />
            <div className="container d-flex align-items-center">
                <ul>
                    <li>Para iniciar sesión se usa la cuenta del <a href="https://www.educa.jcyl.es/es">portal de EDUCACYL</a>, aquella que termina en @educa.jcyl.es</li>
                    <li>Al pulsar el botón de inicio de sesión, verás que se abre una ventana emergente, esto sucede porque el inicio de sesión lo gestiona el portal.</li>
                    <li>La única información que se guarda de los usuarios, es el correo del portal, y el nombre, ya que las contraseñas las gestiona el portal de la junta.</li>
                    <li>Salvo que hayas indicado lo contrario, la sesión permanecerá abierta al cerrar la pestaña o el navegador, salvo que estés en modo incógnito.</li>
                </ul>
            </div>
        </div>

    );
}


export default Login;