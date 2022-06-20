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
            console.log(email)
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
        navigate("/Proyecto", { state: { props: props } });
    }


    return (
        <div>
            <h1 className="mx-5 my-3">Inicio</h1>
            {
                !isAuth
                    ?
                    <div style={{ background: "rgba(255, 0, 0, 0.4)" }} className="p-3 m-5 rounded">
                        <h3 style={{ color: "black" }}>Necesitas iniciar sesión para usar la aplicación.</h3>
                    </div>
                    :
                    isProfesor ?

                    isProfesor && proyectosProfesor.length == 0 && proyectosTutor.length == 0 ? <h5  className="d-grid gap-3 border m-3 p-3">No tienes ningun proyecto asignado</h5> : 
                        <div>
                            {proyectosTutor.length != 0 && <h5 className="p-3">&emsp;&emsp;&emsp;Listado de los proyectos que eres tutor</h5>}
                            

                            {
                                proyectosTutor.map((proyecto) => {
                                    return (
                                        <div className="card m-4 border rounded-3" key={proyecto[1]}>
                                            <div className="card-header ">
                                                {proyecto[0].tituloProyecto}
                                            </div>
                                            <div className="card-body">
                                                <p className="card-text">Alumno: {proyecto[0].alumno}</p>
                                                <p className="card-text">Tutor: {proyecto[0].tutor}</p>
                                                <p className="card-text">Tribunal: {proyecto[0].profesor}</p>
                                                <button href="#" className="btn btn-primary" onClick={() => abrirVistaDetalle(proyecto)}>Vista detalle / editar</button>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            {proyectosProfesor.length != 0 && <h5 className="p-3">&emsp;&emsp;&emsp;Listado de los proyectos que eres tribunal</h5> }
                            

                            {
                                proyectosProfesor.map((proyecto) => {
                                    return (
                                        <div className="card m-4 border rounded-3" key={proyecto[1]}>
                                            <div className="card-header ">
                                                {proyecto[0].tituloProyecto}
                                            </div>
                                            <div className="card-body">
                                                <p className="card-text">Alumno: {proyecto[0].alumno}</p>
                                                <p className="card-text">Tutor: {proyecto[0].tutor}</p>
                                                <p className="card-text">Tribunal: {proyecto[0].profesor}</p>
                                                <button href="#" className="btn btn-primary" onClick={() => abrirVistaDetalle(proyecto)}>Vista detalle / editar</button>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                        :

                        proyectosAlumno.length == 0 ? <h5 className="d-grid gap-3 border m-3 p-3" >&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;No tienes ningun proyecto asignado</h5> : 
                        <div className="d-grid gap-3 border m-3">
                            <h5 className="p-3">&emsp;&emsp;&emsp;Listado de tus proyectos</h5>
                            {
                                proyectosAlumno.map((proyecto) => {
                                    return (
                                        <div className="card m-4 border rounded-3" key={proyecto[1]}>
                                            <div className="card-header ">
                                                {proyecto[0].tituloProyecto}
                                            </div>
                                            <div className="card-body">
                                                <p className="card-text">Alumno: {proyecto[0].alumno}</p>
                                                <p className="card-text">Tutor: {proyecto[0].tutor}</p>
                                                <p className="card-text">Tribunal: {proyecto[0].profesor}</p>
                                                <button href="#" className="btn btn-primary" onClick={() => abrirVistaDetalle(proyecto)}>Vista detalle / editar</button>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
            }
        </div>

    )

}
export default Inicio;