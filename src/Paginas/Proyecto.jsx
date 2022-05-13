import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Estilos/tags.scss";
import operacionesProyectos from "../Utiles/operacionesProyectos";
import { useLocation } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

function Proyecto({ isAuth }) {
    const [isEditando, setIsEditando] = useState(false);
    const location = useLocation();

    let navigate = useNavigate();
    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
        if (location.state != null) {
            setIsEditando(true);
            setAlumno(location.state.props[0].alumno)
            setTutor(location.state.props[0].tutor)
            setProfesor(location.state.props[0].profesor)
            setCurso(location.state.props[0].curso)
            setTituloProyecto(location.state.props[0].tituloProyecto)
            setTipo(location.state.props[0].tipo)
            setFinalidad(location.state.props[0].finalidad)
            setReqObj(location.state.props[0].reqObj)
            setMediosSoft(location.state.props[0].mediosSoft)
            setMediosHard(location.state.props[0].mediosHard)
            setEtiquetas(location.state.props[0].etiquetas)
        }
    }, []);

    const [alumno, setAlumno] = useState("");
    const [tutor, setTutor] = useState("");
    const [profesor, setProfesor] = useState("");
    const [curso, setCurso] = useState("");
    const [tituloProyecto, setTituloProyecto] = useState("");
    const [tipo, setTipo] = useState("");
    const [finalidad, setFinalidad] = useState("");
    const [reqObj, setReqObj] = useState([]);
    const [mediosSoft, setMediosSoft] = useState([]);
    const [mediosHard, setMediosHard] = useState([]);
    const [etiquetas, setEtiquetas] = useState([]);
    const [alerta, setAlerta] = useState({ error: false, msg: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlerta("");
        if (alumno === "" || tutor === "") {
            setAlerta({ error: true, msg: "Todos los campos son obligatorios" });
            return;
        }

        // var area = document.getElementById("mediosSoft");             
        // setMediosSoft(area.value.replace(/\r\n/g,"\n").split("\n"));
        // var area2 = document.getElementById("mediosHard");             
        // setMediosHard(area2.value.replace(/\r\n/g,"\n").split("\n"));
        // var area3 = document.getElementById("reqObj");             
        // setReqObj(area3.value.replace(/\r\n/g,"\n").split("\n"));

        const nuevoProyecto = {

            alumno,
            tutor,
            profesor,
            curso,
            tituloProyecto,
            tipo,
            finalidad,
            reqObj,
            mediosSoft,
            mediosHard,
            etiquetas

        };
        try {
            if (isEditando) {
                await operacionesProyectos.updateProyecto(location.state.props[1], nuevoProyecto);
            } else {
                await operacionesProyectos.addProyecto(nuevoProyecto);

            }
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div>
            <h3>Proyecto</h3>
            <div>
                <form onSubmit={handleSubmit} id="FormularioProyecto">
                    Alumno
                    <input 
                    type="text" 
                    placeholder="Correo alumno" 
                    name="alumno" 
                    onChange={(e) => setAlumno(e.target.value)} 
                    value={alumno} />
                    <br />
                    <br />
                    Tutor
                    <input 
                    type="text" 
                    placeholder="Correo tutor" 
                    name="tutor" 
                    onChange={(e) => setTutor(e.target.value)} 
                    value={tutor} />
                    <br />
                    <br />
                    Profesor
                    <input type="text" placeholder="Correo profesor" name="profesor" onChange={(e) => setProfesor(e.target.value)} value={profesor} />
                    <br />
                    <br />
                    Curso
                    <input type="text" placeholder="Curso" name="curso" onChange={(e) => setCurso(e.target.value)} value={curso} />
                    <br />
                    <br />
                    Título
                    <input type="text" placeholder="Título de proyecto" name="titulo" onChange={(e) => setTituloProyecto(e.target.value)} value={tituloProyecto} />
                    <br />
                    <br />
                    Tipo de proyecto
                    <div >
                        <input type="radio" value="documental" name="tipo" onChange={(e) => setTipo("documental")} checked={tipo === "documental" ? true : false} /> Proyecto documental:
                        Blablalblalblablbalballab <br />
                        <input type="radio" value="desarrollo" name="tipo" onChange={(e) => setTipo("desarrollo")} checked={tipo === "desarrollo" ? true : false} /> Proyecto de innovación, investigación experimental o desarrollo:
                        Blablalblalblablbalballab <br />
                        <input type="radio" value="gestion" name="tipo" onChange={(e) => setTipo("gestion")} checked={tipo === "gestion" ? true : false} /> Proyecto de gestión:
                        Blablalblalblablbalballab <br />
                    </div>

                    <br />
                    <br />

                    Finalidad
                    <input type="text" placeholder="Finalidad del proyecto" name="finalidad" onChange={(e) => setFinalidad(e.target.value)} value={finalidad} />
                    <br />
                    <br />
                    Requisitos / Objetivos(Uno por linea)
                    <textarea id="reqObj" placeholder="Listado de requisitos/objetivos" cols="30" rows="10" name="reqObj" onChange={(e) => setReqObj(e.target.value.replace(/\r\n/, "\n").split("\n"))} value={reqObj.join("\n")} />
                    <br />
                    <br />
                    Medios (Uno por linea):
                    <textarea id="mediosSoft" placeholder="Medios Software" cols="30" rows="10" name="soft" onChange={(e) => setMediosSoft(e.target.value.replace(/\r\n/, "\n").split("\n"))} value={mediosSoft.join("\n")} />
                    <textarea id="mediosHard" placeholder="Medios Hardware" cols="30" rows="10" name="hard" onChange={(e) => setMediosHard(e.target.value.replace(/\r\n/, "\n").split("\n"))} value={mediosHard.join("\n")} />
                    <br />
                    <br />

                    <input type="hidden" value={etiquetas} />
                    {/* <input type="file" /> */}
                </form>
                Etiquetas:
                <ReactTagInput
                    tags={etiquetas}
                    onChange={(newTags) => setEtiquetas(newTags)}
                />

                <br />
                <br />
                {
                    isEditando ?
                        <button type="submit" form="FormularioProyecto">Actualizar</button>
                        :
                        <button type="submit" form="FormularioProyecto">Submit</button>
                }

            </div>

        </div>
    );
}

export default Proyecto;