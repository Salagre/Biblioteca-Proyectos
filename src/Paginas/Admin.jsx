import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase-config"
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc } from "firebase/firestore";
import { confirm } from "react-confirm-box";

function Admin({ isAuth }) {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false)
    const [usuariosQueQuierenSerProfesores, setUsuariosQueQuierenSerProfesores] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [nuevoAdmin, setNuevoAdmin] = useState("");
    const [nuevoProfesor, setNuevoProfesor] = useState("");

    useEffect(() => {
        if (isAuth) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    getUsuario(user.email);
                } else {
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

            const q4 = query(collection(db, "usuarios"), where("isProfesor", "==", true));
            const querySnapshot4 = await getDocs(q4);
            setProfesores([]);
            querySnapshot4.forEach((doc) => {
                setProfesores(oldProfesores => [...oldProfesores, { idDoc: doc.id, correo: doc.data().correo, nombre: doc.data().nombre, isProfesor: doc.data().isProfesor }]);
            });


        }
    };

    const anadirAdmin = async (e) => {
        //Comprobar si el usuario existe
        e.preventDefault();
        const q = query(collection(db, "usuarios"), where("correo", "==", nuevoAdmin));
        const querySnapshot = await getDocs(q);
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
            const result = await confirm("El usuario con correo " + nuevoAdmin + " obtendrá el rol, y privilegios de administrador, \n¿Quiére continuar?");
            if (!result) return;
        } else {

            alert("No existe un usuario con ese correo");
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

    const anadirNuevoProfesor = async (e) => {
        //Comprobar si el usuario existe
        e.preventDefault();
        const q = query(collection(db, "usuarios"), where("correo", "==", nuevoProfesor));
        const querySnapshot = await getDocs(q);
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
            const result = await confirm("El usuario con correo " + nuevoProfesor + " obtendrá el rol, y privilegios de profesor, \n¿Quiére continuar?");
            if (!result) return;
        } else {
            alert("No existe un usuario con ese correo");
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

    const denegarPeticion = async (e) => {
        const result = await confirm("Are you sure?");
        if (!result) return;
        const q = query(collection(db, "usuarios"), where("correo", "==", e));
        const querySnapshot = await getDocs(q);
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
            const result = await confirm("Al usuario con correo " + docs.data().correo + " se le negará el rol, y privilegios de profesor, \n¿Quiére continuar?");
            if (!result) return;
        } else {
            alert("No existe un usuario con ese correo");
        }
        try {
            await setDoc(doc(db, "usuarios", docs.id), {
                correo: docs.data().correo,
                nombre: docs.data().nombre,
                isProfesor: false,
                isAdmin: docs.data().isAdmin,
                isSolicitadoSerProfesor: false
            });
            alert("Operación completada con exito")
            window.location.reload(false);
            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }
    }

    const aprobarPeticion = async (e) => {
        const q = query(collection(db, "usuarios"), where("correo", "==", e));
        const querySnapshot = await getDocs(q);
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
            const result = await confirm("Al usuario con correo " + docs.data().correo + " obtendrá el rol, y privilegios de profesor, \n¿Quiére continuar?");
            if (!result) return;
        } else {
            alert("No existe un usuario con ese correo");
        }
        try {
            await setDoc(doc(db, "usuarios", docs.id), {
                correo: docs.data().correo,
                nombre: docs.data().nombre,
                isProfesor: true,
                isAdmin: docs.data().isAdmin,
                isSolicitadoSerProfesor: false
            });
            alert("Operación completada con exito")
            window.location.reload(false);
            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }
    }

    const eliminarAdmin = async (e) => {
        const q = query(collection(db, "usuarios"), where("correo", "==", e));
        const querySnapshot = await getDocs(q);
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
            const result = await confirm("Al usuario con correo " + docs.data().correo + " se le quitará el rol, y privilegios de administrador, \n¿Quiére continuar?");
            if (!result) return;
        } else {
            alert("No existe un usuario con ese correo");
        }
        try {
            await setDoc(doc(db, "usuarios", docs.id), {
                correo: docs.data().correo,
                nombre: docs.data().nombre,
                isProfesor: docs.data().isProfesor,
                isAdmin: false,
                isSolicitadoSerProfesor: docs.data().isSolicitadoSerProfesor
            });
            alert("Operación completada con exito")
            window.location.reload(false);
            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }
    }

    const eliminarProfesor = async (e) => {
        const q = query(collection(db, "usuarios"), where("correo", "==", e));
        const querySnapshot = await getDocs(q);
        let docs = [];
        //console.log(querySnapshot.size)
        if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
                //No hay usuario, asi que no es correcto
                //console.log(doc.data().correo);
                docs = doc;
            });
            const result = await confirm("Al usuario con correo " + docs.data().correo + " se le quitará el rol, y privilegios de profesor, incluido el acceso a proyectos que tenga como tutor, \n¿Quiére continuar?");
            if (!result) return;
        } else {
            alert("No existe un usuario con ese correo");
        }
        try {
            await setDoc(doc(db, "usuarios", docs.id), {
                correo: docs.data().correo,
                nombre: docs.data().nombre,
                isProfesor: false,
                isAdmin: docs.data().isAdmin,
                isSolicitadoSerProfesor: docs.data().isSolicitadoSerProfesor
            });
            alert("Operación completada con exito")
            window.location.reload(false);
            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }
    }




    return (
        <div className="d-flex justify-content-center ">
            <div className="row">
                <div className=" container-fluid border rounded p-3 m-3 col-xs-12 col-lg-3" >
                    <div>Cambiar roles de usuario</div>
                    <div className="mb-3">Usuarios que quieren ser profesor</div>
                    <div>

                        {usuariosQueQuierenSerProfesores.map((obj) => (
                            <div className="border rounded mb-2 p-3" key={obj.idDoc}>
                                <p>Nombre: {obj.nombre} </p>
                                <p>Correo: {obj.correo} </p>
                                <button className="btn-danger rounded mr-3" onClick={() => denegarPeticion(obj.correo)}>Denegar petición</button>
                                <button className="btn-success rounded" onClick={() => aprobarPeticion(obj.correo)}>Aprobar petición</button>
                            </div>
                        ))}


                    </div>
                </div>

                <div className="container-fluid border rounded p-3 m-3 col-xs-12 col-lg-3" >
                    <div>Listado de Profesores</div>
                    <div className="mb-3 ">
                        <div>Añadir nuevo profesor</div>
                        <p>Para añadir un profesor nuevo a la lista, este tiene que haber iniciado sesión una vez</p>
                        <form onSubmit={anadirNuevoProfesor}>
                            <input type="text" name="correo" onChange={event => setNuevoProfesor(event.target.value)} />
                            <input type="submit" value="Añadir" className="btn-success rounded" />
                        </form>
                    </div>
                    <div>

                        {profesores.map((user) => (
                            <div key={user.idDoc} className="border rounded mb-2 p-3">
                                <p>Nombre: {user.nombre} </p>
                                <p>Correo: {user.correo} </p>
                                <button className="btn-danger rounded" onClick={() => eliminarProfesor(user.correo)}>Quitar rol de profesor</button>
                            </div>
                        ))}


                    </div>

                </div>


            




                <div className="container-fluid border rounded p-3 m-3 col-xs-12 col-lg-3" >
                    <div>Listado de Administradores</div>
                    <div className="mb-3">
                        <div>Añadir nuevo administrador</div>
                        <p>Para añadir un administrador nuevo a la lista, este tiene que haber iniciado sesión una vez</p>
                        <form onSubmit={anadirAdmin}>
                            <input type="text" name="correo" onChange={event => setNuevoAdmin(event.target.value)} />
                            <input type="submit" value="Añadir" className="btn-success rounded" />
                        </form>
                    </div>
                    <div>
                        {admins.map((user) => (
                            <div key={user.idDoc} className="border rounded mb-2 p-3">
                                <p>Nombre: {user.nombre} </p>
                                <p>Correo: {user.correo} </p>
                                <button className="btn-danger rounded" onClick={() => eliminarAdmin(user.correo)}>Quitar rol de Administrador</button>
                            </div>
                        ))}


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;