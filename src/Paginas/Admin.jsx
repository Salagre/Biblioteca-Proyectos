import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase-config"
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'

function Admin({ isAuth }) {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false)
    const [usuariosQueQuierenSerProfesores, setUsuariosQueQuierenSerProfesores] = useState([]);
    const [usuariosQueQuierenSerAdministradores, setUsuariosQueQuierenSerAdministradores] = useState([]);

    useEffect(() => {
        if (isAuth) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    getUsuario(user.email);
                } else {
                    console.log("no estas logeado")
                    navigate("/login");
                }
            });
        } else {
            navigate("/login");
        }

    }, [email]);

    const getUsuario = async (emilio) => {
        if (isAuth) {
            const q = query(collection(db, "usuarios"), where("correo", "==", emilio));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let array = [doc.data()];
                setIsAdmin(array[0].isAdmin);
                if (!array[0].isAdmin) {
                    navigate("/usuario");
                }

            });
            const q2 = query(collection(db, "usuarios"), where("isSolicitadoSerProfesor", "==", true));
            const querySnapshot2 = await getDocs(q2);
            setUsuariosQueQuierenSerProfesores([]);
            querySnapshot2.forEach((doc) => {
                setUsuariosQueQuierenSerProfesores(oldUsuariosQueQuierenSerProfesores => [...oldUsuariosQueQuierenSerProfesores, { idDoc: doc.id, correo: doc.data().correo, nombre: doc.data().nombre }]);
            });



            const q3 = query(collection(db, "usuarios"), where("isSolicitadoSerAdmin", "==", true));
            const querySnapshot3 = await getDocs(q3);
            setUsuariosQueQuierenSerAdministradores([]);
            querySnapshot3.forEach((doc) => {
                setUsuariosQueQuierenSerAdministradores(oldUsuariosQueQuierenSerAdministradores => [...oldUsuariosQueQuierenSerAdministradores, { idDoc: doc.id, correo: doc.data().correo, nombre: doc.data().nombre }]);
            });
        }
    };




    return (
        <div>
            <div>Cambiar roles de usuario</div>
            <div>Usuarios que quieren ser profesor</div>
            <div>
                <ul>
                    {usuariosQueQuierenSerProfesores.map((obj) => (
                        <li className={obj.idDoc}>
                            <p>Nombre: {obj.nombre} </p>
                            <p>Correo: {obj.correo} </p>
                            <button>Conceder petición</button>
                            <button>Denegar petición</button>
                        </li>
                    ))}
                </ul>

            </div>


            <div>Usuarios que quieren ser administradores</div>
            <div>
                <ul>
                    {usuariosQueQuierenSerAdministradores.map((user) => (
                        <li className={user.idDoc}>
                            <p>Nombre: {user.nombre} </p>
                            <p>Correo: {user.correo} </p>
                            <button>Conceder petición</button>
                            <button>Denegar petición</button>
                        </li>
                    ))}
                </ul>

            </div>

        </div>

    );
}

export default Admin;