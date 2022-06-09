import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase-config"
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc } from "firebase/firestore";

function Admin({ isAuth }) {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false)
    const [usuariosQueQuierenSerProfesores, setUsuariosQueQuierenSerProfesores] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [nuevoAdmin, setNuevoAdmin] = useState("");

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



            const q3 = query(collection(db, "usuarios"), where("isAdmin", "==", true));
            const querySnapshot3 = await getDocs(q3);
            setAdmins([]);
            querySnapshot3.forEach((doc) => {
                setAdmins(oldAdmins => [...oldAdmins, { idDoc: doc.id, correo: doc.data().correo, nombre: doc.data().nombre, isProfesor: doc.data().isProfesor }]);
            });
        }
    };

    const handleSubmit = async (e) => {
        //Comprobar si el usuario existe
        e.preventDefault();
        console.log(nuevoAdmin)
        const q = query(collection(db, "usuarios"), where("correo", "==", nuevoAdmin));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs)
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
        }
        try {
            await setDoc(doc(db, "usuarios", docs.id), {
                correo: docs.data().correo,
                nombre: docs.data().nombre,
                isProfesor: docs.data().isProfesor,
                isAdmin: true,
                isSolicitadoSerProfesor: docs.data().isSolicitadoSerProfesor
            });
            window.location.reload(false);
            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }


        //Hacerlo admin
    }

    const denegarPeticion = async (e) => {
        const q = query(collection(db, "usuarios"), where("correo", "==", e));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs)
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
        }
        try {
            await setDoc(doc(db, "usuarios", docs.id), {
                correo: docs.data().correo,
                nombre: docs.data().nombre,
                isProfesor: false,
                isAdmin: docs.data().isAdmin,
                isSolicitadoSerProfesor: false
            });
            window.location.reload(false);
            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }
    }

    const aprobarPeticion = async (e) => {
        const q = query(collection(db, "usuarios"), where("correo", "==", e));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs)
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
        }
        try {
            await setDoc(doc(db, "usuarios", docs.id), {
                correo: docs.data().correo,
                nombre: docs.data().nombre,
                isProfesor: true,
                isAdmin: docs.data().isAdmin,
                isSolicitadoSerProfesor: false
            });
            window.location.reload(false);
            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }
    }

    const eliminarAdmin = async (e) => {
        const q = query(collection(db, "usuarios"), where("correo", "==", e));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs)
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
        }
        try {
            await setDoc(doc(db, "usuarios", docs.id), {
                correo: docs.data().correo,
                nombre: docs.data().nombre,
                isProfesor: docs.data().isProfesor,
                isAdmin: false,
                isSolicitadoSerProfesor: docs.data().isSolicitadoSerProfesor
            });
            window.location.reload(false);
            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }
    }




    return (
        <div>
            <div>Cambiar roles de usuario</div>
            <div>Usuarios que quieren ser profesor</div>
            <div>
                <ul>
                    {usuariosQueQuierenSerProfesores.map((obj) => (
                        <li key={obj.idDoc}>
                            <p>Nombre: {obj.nombre} </p>
                            <p>Correo: {obj.correo} </p>
                            <button onClick={() => denegarPeticion(obj.correo)}>Denegar petición</button>
                            <button onClick={() => aprobarPeticion(obj.correo)}>Aprobar petición</button>
                        </li>
                    ))}
                </ul>

            </div>


            <div>Listado de Administradores</div>
            <div>
                <div>Añadir nuevo administrador</div>
                <form onSubmit={ handleSubmit}>
                    <input type="text" name="correo" onChange={event => setNuevoAdmin(event.target.value)} />
                    <input type="submit" value="Añadir" />
                </form>
            </div>
            <div>
                <ul>
                    {admins.map((user) => (
                        <li key={user.idDoc}>
                            <p>Nombre: {user.nombre} </p>
                            <p>Correo: {user.correo} </p>
                            <button  onClick={() => eliminarAdmin(user.correo) }>Eliminar Administrador</button>
                        </li>
                    ))}
                </ul>

            </div>

        </div>

    );
}

export default Admin;