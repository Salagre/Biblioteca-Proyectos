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
                setIdDoc(doc.id);
                setNombre(array[0].nombre);
                setIsProfesor(array[0].isProfesor);
                setIsAdmin(array[0].isAdmin);
                setIsSolicitadoSerProfesor(array[0].isSolicitadoSerProfesor);
            });

        }
    };

    const solicitarCambioRol = async (laCosa) => {
        setIsSolicitadoSerProfesor(true);
        const q = query(collection(db, "usuarios"), where("correo", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
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
        
        <div className="d-flex justify-content-center">
        <div className="w-75 border rounded p-3 m-3" style={{ width: "450px" }}>
           
            <h3>Información del usuario:</h3>
                    {isAdmin && <button className="btn btn-secondary mb-3" onClick={() => { navigate("/admin") }}>Ir al panel de administración</button>}
            

            {!isAuth ? <p>No puedes estar aqui</p> :
                <>
                <br />
                    <p>Nombre: {nombre}</p>
                    <p>Email: {email}</p>
                    <p>Rol: {isProfesor ? "Profesor" : "Alumno"}{isAdmin && " con permisos de administrador"}</p>
                    <>
                        {
                            !isProfesor && !isSolicitadoSerProfesor ? <><button className="btn btn-secondary mb-3" onClick={() => { solicitarCambioRol("profesor") }}>Solicitar cambio de rol a profesor</button></> : <></>
                        }
                    </>
                    {isSolicitadoSerProfesor &&  <p className="bg-warning p-3 rounded">Se ha enviado una solicitud para cambio de rol a profesor, pronto un administrador atenderá tu petición</p>}
                </>
            }
          
        </div >
        </div>
    );
}

export default Usuario;