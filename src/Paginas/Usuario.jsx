import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase-config"
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'
import { useLocation } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

function Usuario({ isAuth }) {
    let navigate = useNavigate();
    const [idDoc, setIdDoc] = useState("");
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [isProfesor, setIsProfesor] = useState("");
    const [isAdmin, setIsAdmin] = useState("");
    const [isSolicitadoSerProfesor, setIsSolicitadoSerProfesor] = useState("");

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
        } else {
            navigate("/login");
        }
    }, [email]);

    const getUsuario = async () => {
        if (isAuth) {
            const q = query(collection(db, "usuarios"), where("correo", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let array = [doc.data()];
                console.log(doc.id)
                setIdDoc(doc.id);
                setNombre(array[0].nombre);
                setIsProfesor(array[0].isProfesor);
                setIsAdmin(array[0].isAdmin);
                setIsSolicitadoSerProfesor(array[0].isSolicitadoSerProfesor);
            });

        }
    };

    const solicitarCambioRol = async (laCosa) => {
        const q = query(collection(db, "usuarios"), where("correo", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id)
            setIdDoc(doc.id);

        });

        try {
            if (laCosa === "admin") {
                await setDoc(doc(db, "usuarios", idDoc), {
                    correo: email,
                    nombre: nombre,
                    isProfesor: isProfesor,
                    isAdmin: isAdmin,
                    isSolicitadoSerProfesor: isSolicitadoSerProfesor

                });
            } else {
                await setDoc(doc(db, "usuarios", idDoc), {
                    correo: email,
                    nombre: nombre,
                    isProfesor: isProfesor,
                    isAdmin: isAdmin,
                    isSolicitadoSerProfesor: true

                });
            }

            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }
    }



    return (
        <div>
            <div>Usuario</div>
            {console.log(isSolicitadoSerProfesor)}
            {!isAuth ? <p>No puedes estar aqui</p> :
                <>
                    {isAdmin && <button onClick={() => { navigate("/admin") }}>Ir al panel de administración</button>}
                    <p>información del usuario: </p>
                    <p>Nombre: {nombre}</p>
                    <p>Email: {email}</p>
                    <p>Rol: {isProfesor ? "Profesor" : "Alumno"}{isAdmin && " con permisos de administrador"}</p>
                    <>
                        {
                            !isProfesor && <><button onClick={() => { solicitarCambioRol("profesor") }}>Solicitar cambio de rol a profesor</button></>
                        }
                    </>
                </>
            }

            <p>{isSolicitadoSerProfesor && "Se ha enviado una solicitud para cambio de rol a profesor, pronto un administrador atenderá tu petición"}</p>
        </div >

    );
}

export default Usuario;