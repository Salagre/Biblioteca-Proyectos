import React, { useEffect, useState } from "react";
import {auth, db} from "../firebase-config"
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'

function Usuario({isAuth}) {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [isProfesor, setIsProfesor] = useState("");

    useEffect(() => {
        if (isAuth) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setNombre(user.displayName);
                    setEmail(user.email);
                    getUsuario();
                } else {
                    console.log("no estas logeado")
                    navigate("/login");
                }
            });
        }else{
            navigate("/login");
        }

    }, [email]);

    const getUsuario = async () => {
        if (isAuth) {
            const q = query(collection(db, "usuarios"), where("correo", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let array = [doc.data()];
                setIsProfesor(array[0].isProfesor);
            });
        }
    };

   
    
    return (
        <div>
            <div>Usuario</div>
            {/* <pre>{JSON.stringify(auth)}</pre> */}
            {!isAuth ? <p>No puedes estar aqui</p> :
                <>
                    <p>información del usuario:</p>
                    <p>Nombre: {nombre}</p>
                    <p>Email: {email}</p>
                    <p>Rol: {isProfesor ? "Profesor" : "Alumno"}</p>
                    <p>{/*Link para solicitar cambio de rol*/}</p>
                </>
            }

        </div>

    );
}

export default Usuario;