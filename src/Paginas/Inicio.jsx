import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase-config"
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from "react-router-dom";



function Inicio({ isAuth }) {
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [proyectosAlumno, setProyectosAlumno] = useState([]);
    const [proyectosTutor, setProyectosTutor] = useState([]);
    const [proyectosProfesor, setProyectosProfesor] = useState([]);
    const [isProfesor, setIsProfesor] = useState();

    useEffect(() => {
        if (isAuth) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    setEmail(uid);
                    getProyectosAlumno();
                    getUsuario();
                } else {
                    //No loged
                }
            });
        }

    }, [email]);


    const getUsuario = async () => {
        if (isAuth) {
            const q = query(collection(db, "usuarios"), where("correo", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let array = [doc.data()];
                setIsProfesor(array[0].isProfesor);
                if (array[0].isProfesor) {
                    getProyectosTutor();
                    getProyectosProfesor();
                }
            });
        }
    };

    const getProyectosAlumno = async () => {
        if (isAuth) {
            const q = query(collection(db, "proyectos"), where("alumno", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let arra = [doc.data()];
                arra.push(doc.id);
                // console.log(arra[0].alumno)
                setProyectosAlumno(oldProyectosAlumno => [...oldProyectosAlumno, arra]);
            });
        }
    };

    const getProyectosTutor = async () => {
        if (isAuth) {
            const q = query(collection(db, "proyectos"), where("tutor", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let arra = [doc.data()];
                arra.push(doc.id);
                setProyectosTutor(oldProyectosTutor => [...oldProyectosTutor, arra]);
            });
        }
    }

    const getProyectosProfesor = async () => {
        if (isAuth) {
            const q = query(collection(db, "proyectos"), where("profesor", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let arra = [doc.data()];
                arra.push(doc.id);
                setProyectosProfesor(oldProyectosProfesor => [...oldProyectosProfesor, arra]);
            });
        }
    }

    const abrirVistaDetalle = (props) => {
        navigate("/Proyecto",{state:{props: props}});
    }


    return (
        <div>
            <div>Inicio</div>
            {
                !isAuth
                    ?
                    <div>Necesitas iniciar sesión para usar la aplicación.</div>
                    :
                    isProfesor ?
                        <div>
                            <div>Maestro</div>
                            <ul>
                                {
                                    proyectosTutor.map((proyecto) => {
                                        return (
                                            <li key={proyecto[1]}>
                                                <div>
                                                    <button onClick={() => abrirVistaDetalle(proyecto)}>Vista detalle</button>
                                                    <h4>Titulo:     <span>{proyecto[0].tituloProyecto}</span></h4>
                                                    <h4>Alumno:     <span>{proyecto[0].alumno}</span></h4>
                                                    <h4>Tutor:      <span>{proyecto[0].tutor}</span></h4>
                                                    <h4>Profesor:       <span>{proyecto[0].profesor}</span></h4>
                                                    <h4>Curso:      <span>{proyecto[0].curso}</span></h4>
                                                    <h4>Tipo:       <span>{proyecto[0].tipo}</span></h4>
                                                    <h4>Finalidad:      <span>{proyecto[0].finalidad}</span></h4>
                                                    <h4>Requisitos/Objetivos:      </h4><pre>{proyecto[0].reqObj.join("\n")} </pre>
                                                <h4>Medios Software:        </h4><pre>{proyecto[0].mediosSoft.join("\n")}</pre>
                                                <h4>Medios Hardware:        </h4><pre >{proyecto[0].mediosHard.join("\n")}</pre>
                                                    <h4>Etiquetas:      <span>{proyecto[0].etiquetas}</span></h4>
                                                </div>
                                                <hr />
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <div>Profesor</div>
                            <ul>
                                {
                                    proyectosProfesor.map((proyecto) => {
                                        return (
                                            <li key={proyecto[1]}>
                                            <button onClick={() => abrirVistaDetalle(proyecto)}>Vista detalle</button>
                                                <h4>Titulo:     <span>{proyecto[0].tituloProyecto}</span></h4>
                                                <h4>Alumno:     <span>{proyecto[0].alumno}</span></h4>
                                                <h4>Tutor:      <span>{proyecto[0].tutor}</span></h4>
                                                <h4>Profesor:       <span>{proyecto[0].profesor}</span></h4>
                                                <h4>Curso:      <span>{proyecto[0].curso}</span></h4>
                                                <h4>Tipo:       <span>{proyecto[0].tipo}</span></h4>
                                                <h4>Finalidad:      <span>{proyecto[0].finalidad}</span></h4>
                                                <h4>Requisitos/Objetivos:      </h4><pre>{proyecto[0].reqObj.join("\n")} </pre>
                                                <h4>Medios Software:        </h4><pre>{proyecto[0].mediosSoft.join("\n")}</pre>
                                                <h4>Medios Hardware:        </h4><pre >{proyecto[0].mediosHard.join("\n")}</pre>
                                                <h4>Etiquetas:      <span>{proyecto[0].etiquetas}</span></h4>
                                                <hr />
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        :
                        <div>
                            <div>Tus cosas</div>
                            <ul>
                                {
                                    proyectosAlumno.map((proyecto) => {
                                        return (
                                            <li key={proyecto[1]}>
                                            <button onClick={() => abrirVistaDetalle(proyecto)}>Vista detalle</button>
                                                <h4>Titulo:     <span>{proyecto[0].tituloProyecto}</span></h4>
                                                <h4>Alumno:     <span>{proyecto[0].alumno}</span></h4>
                                                <h4>Tutor:      <span>{proyecto[0].tutor}</span></h4>
                                                <h4>Profesor:       <span>{proyecto[0].profesor}</span></h4>
                                                <h4>Curso:      <span>{proyecto[0].curso}</span></h4>
                                                <h4>Tipo:       <span>{proyecto[0].tipo}</span></h4>
                                                <h4>Finalidad:      <span>{proyecto[0].finalidad}</span></h4>
                                                <h4>Requisitos/Objetivos:      </h4><pre>{proyecto[0].reqObj.join("\n")} </pre>
                                                <h4>Medios Software:        </h4><pre>{proyecto[0].mediosSoft.join("\n")}</pre>
                                                <h4>Medios Hardware:        </h4><pre >{proyecto[0].mediosHard.join("\n")}</pre>
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