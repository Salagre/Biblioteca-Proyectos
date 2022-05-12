import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase-config"
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'



function Inicio({ isAuth }) {

    const [email, setEmail] = useState("");
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        if (isAuth) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    setEmail(uid);
                    getProyectos();
                } else {
                    console.log("no estas logeado")
                }
            });
        }

    }, [email]);

    const getProyectos = async () => {
        if (isAuth) {
            const q = query(collection(db, "proyectos"), where("alumno", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let arra = [doc.data()];
                arra.push(doc.id);
                // console.log(arra[0].alumno)
                setProyectos(oldProyectos => [...oldProyectos, arra]);
            });
        }
    };




    return (
        <div>
            <div>Inicio</div>
            {
                !isAuth
                    ?
                    <div>Necesitas iniciar sesión para usar la aplicación.</div>
                    :
                    <div>
                        <div>Tus cosas</div>
                        <ul>
                            {
                                proyectos.map((proyecto) => {
                                    return (
                                        <li key={proyecto[1]}>
                                            <h4>Titulo:     <span>{proyecto[0].tituloProyecto}</span></h4>
                                            <h4>Alumno:     <span>{proyecto[0].alumno}</span></h4>
                                            <h4>Tutor:      <span>{proyecto[0].tutor}</span></h4>
                                            <h4>Profesor:       <span>{proyecto[0].profesor}</span></h4>
                                            <h4>Curso:      <span>{proyecto[0].curso}</span></h4>
                                            <h4>Tipo:       <span>{proyecto[0].tipo}</span></h4>
                                            <h4>Finalidad:      <span>{proyecto[0].finalidad}</span></h4>
                                            <h4>Requisitos/Objetivos:       <span>{proyecto[0].reqObj}</span></h4>
                                            <h4>Medios Software:        <span>{proyecto[0].mediosSoft}</span></h4>
                                            <h4>Medios Hardware:        <span >{proyecto[0].mediosHard}</span></h4>
                                            <h4>Etiquetas:      <span>{proyecto[0].etiquetas}</span></h4>
                                            <hr />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
            }
        </div>

    )

}
export default Inicio;