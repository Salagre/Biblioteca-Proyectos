import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase-config"
import { arrayRemove, collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import 'jspdf-autotable'

function Listado({ isAuth }) {
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [posts, setPosts] = useState([]);
    const [ensTitulo, setEnsTitulo] = useState(true);
    const [ensAlumno, setEnsAlumno] = useState(true);
    const [ensTutor, setEnsTutor] = useState(true);
    const [ensProfesor, setEnsProfesor] = useState(false);
    const [ensCurso, setEnsCurso] = useState(false);
    const [ensTipo, setEnsTipo] = useState(false);
    const [ensEtiquetas, setEnsEtiquetas] = useState(false);
    const [ensBoton, setEnsBoton] = useState(true);
    const ref = collection(db, "proyectos");

    const [orden, setOrden] = useState("asc");
    const [filtro, setFiltro] = useState("");
    const [filtroEtiquetas, setFiltroEtiquetas] = useState("");

    useEffect(() => {
        if (isAuth) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    setEmail(uid);
                    getProyectos();

                } else {
                    //No loged
                    navigate("/login");
                }
            });

        }
    }, []);

    const abrirVistaDetalle = (props) => {
        navigate("/Proyecto", { state: { props: props } });
    }
    const getProyectos = async () => {
        setPosts([]);
        const querySnapshot = await getDocs(collection(db, "proyectos"));
        querySnapshot.forEach((doc) => {
            let arra = [doc.data()];
            arra.push(doc.id);
            // console.log(arra[0].alumno)
            setPosts(posts => [...posts, arra]);
        });
    };

    const ordenar = (columna) => {
        console.log(posts)
        if (orden === "asc") {
            const ordenado = [...posts].sort((a, b) =>
                a[0][columna].toLowerCase() > b[0][columna].toLowerCase() ? 1 : -1);
            setPosts(ordenado);
            setOrden("dsc")
        }
        if (orden === "dsc") {
            const ordenado = [...posts].sort((a, b) =>
                a[0][columna].toLowerCase() < b[0][columna].toLowerCase() ? 1 : -1);
            setPosts(ordenado);
            setOrden("asc")
        }
    }

    const filtrar = (data) => {
        let array = []

        data.forEach(element => {
            let tiene = false;
            element[0].etiquetas.forEach(etiqueta => {
                if (etiqueta.toLowerCase().includes(filtro.toLocaleLowerCase())) {
                    tiene = true;
                }
            })
            if (element[0].alumno.toLowerCase().includes(filtro.toLowerCase()) ||
                element[0].tituloProyecto.toLowerCase().includes(filtro.toLowerCase()) ||
                element[0].tutor.toLowerCase().includes(filtro.toLowerCase()) ||
                element[0].profesor.toLowerCase().includes(filtro.toLowerCase()) ||
                element[0].curso.toLowerCase().includes(filtro.toLowerCase()) ||
                element[0].tipo.toLowerCase().includes(filtro.toLowerCase())) {
                tiene = true;
            }
            if (tiene) {
                array.push(element);
            }
        });

        return array;




    }

    const exportarAPdf = () => {
        const doc = new jsPDF()
        doc.text("Listado de proyectos", 20, 10)
        let arrayCabeceras = []
        let arrayCuerpo = []
        if (ensTitulo) arrayCabeceras.push("Titulo")
        if (ensAlumno) arrayCabeceras.push("Alumno")
        if (ensTutor) arrayCabeceras.push("Tutor")
        if (ensProfesor) arrayCabeceras.push("Tribunal")
        if (ensCurso) arrayCabeceras.push("Curso")
        if (ensTipo) arrayCabeceras.push("Tipo")
        if (ensEtiquetas) arrayCabeceras.push("Etiquetas")

        let newArray = []
        posts.map((item) => {
            
            let arr = []
            if (ensTitulo) arr.push(item[0].tituloProyecto)
            if (ensAlumno) arr.push(item[0].alumno)
            if (ensTutor) arr.push(item[0].tutor)
            if (ensProfesor) arr.push(item[0].profesor)
            if (ensCurso) arr.push(item[0].curso)
            if (ensTipo) arr.push(item[0].tipo)
            if (ensEtiquetas) arr.push(item[0].etiquetas)
            newArray.push(arr)
        })
        console.log(newArray);
        doc.autoTable({
            head: [arrayCabeceras],
            body: [...newArray]
        })
        doc.save("listado.pdf");
    }

    const Table = ({ data }) => {
        return (
            <table>
                <thead>
                    <tr>
                        {ensTitulo && <th></th>}
                        {ensTitulo && <th onClick={() => ordenar("tituloProyecto")}>Titulo</th>}
                        {ensAlumno && <th onClick={() => ordenar("alumno")}>Alumno</th>}
                        {ensTutor && <th onClick={() => ordenar("tutor")}>Tutor</th>}
                        {ensProfesor && <th onClick={() => ordenar("profesor")}>Tribunal</th>}
                        {ensCurso && <th onClick={() => ordenar("curso")}>Curso</th>}
                        {ensTipo && <th onClick={() => ordenar("tipo")}>Tipo</th>}
                        {ensEtiquetas && <th>Etiquetas</th>}
                    </tr>
                </thead>
                <tbody>


                    {
                        data.map((proyecto) => {
                            return (
                                <tr key={proyecto[1]}>
                                    {ensBoton && <td><button onClick={() => abrirVistaDetalle(proyecto)}>Vista detalle</button></td>}
                                    {ensTitulo && <td>{proyecto[0].tituloProyecto}</td>}
                                    {ensAlumno && <td>{proyecto[0].alumno}</td>}
                                    {ensTutor && <td>{proyecto[0].tutor}</td>}
                                    {ensProfesor && <td>{proyecto[0].profesor}</td>}
                                    {ensCurso && <td>{proyecto[0].curso}</td>}
                                    {ensTipo && <td>{proyecto[0].tipo}</td>}
                                    {ensEtiquetas && <td>{proyecto[0].etiquetas.join(", ")}</td>}
                                </tr>
                            )
                        })

                    }
                </tbody>

            </table>
        )
    }


    return (
        <div>
            <div>
                Que campos mostrar en la tabla:
                <br />
                <input type="checkbox" onChange={() => { setEnsBoton(!ensBoton) }} checked={ensBoton} />Boton editar
                <input type="checkbox" onChange={() => { setEnsTitulo(!ensTitulo) }} checked={ensTitulo} />Titulo
                <input type="checkbox" onChange={() => { setEnsAlumno(!ensAlumno) }} checked={ensAlumno} />Alumno
                <input type="checkbox" onChange={() => { setEnsTutor(!ensTutor) }} checked={ensTutor} />Tutor
                <input type="checkbox" onChange={() => { setEnsProfesor(!ensProfesor) }} checked={ensProfesor} />Tribunal
                <input type="checkbox" onChange={() => { setEnsCurso(!ensCurso) }} checked={ensCurso} />Curso
                <input type="checkbox" onChange={() => { setEnsTipo(!ensTipo) }} checked={ensTipo} />Tipo
                <input type="checkbox" onChange={() => { setEnsEtiquetas(!ensEtiquetas) }} checked={ensEtiquetas} />Etiquetas
            </div>
            <div>Listado Proyectos</div>
            {
                !isAuth
                    ?
                    <div>Necesitas iniciar sesión para usar la aplicación.</div>
                    :
                    <>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="buscar"
                            onChange={(e) => { setFiltro(e.target.value) }} />
                        <button onClick={() => { exportarAPdf() }}>Exportar tabla a pdf</button>
                        <Table data={filtrar(posts)} />
                    </>

            }

        </div>

    )

}
export default Listado;