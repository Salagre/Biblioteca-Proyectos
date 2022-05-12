import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Estilos/tags.scss";
import operacionesProyectos from "../Utiles/operacionesProyectos";

const TagsInput = props => {
    const [tags, setTags] = React.useState(props.tags);
    const removeTags = indexToRemove => {
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
    };
    const addTags = event => {
        if (event.target.value !== "") {
            setTags([...tags, event.target.value]);
            props.selectedTags([...tags, event.target.value]);
            event.target.value = "";
        }
    };
    return (
        <div className="tags-input">
            <ul id="tags">
                {tags.map((tag, index) => (
                    <li key={index} className="tag">
                        <span className='tag-title'>{tag}</span>
                        <span className='tag-close-icon'
                            onClick={() => removeTags(index)}
                        >
                            {/* Esta X es lo que se usa para quitar etiquetas,
                             no es un fallo */}
                            x
                        </span>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                id="inputTag"
                onKeyUp={event => event.key === "Enter" ? addTags(event) : null}
                placeholder="Pulsa enter para añadir una etiqueta nueva"
            />
        </div>
    );
};



function Proyecto({ isAuth }) {

    let navigate = useNavigate();
    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, []);



    const [alumno, setAlumno] = useState("");
    const [tutor, setTutor] = useState("");
    const [profesor, setProfesor] = useState("");
    const [curso, setCurso] = useState("");
    const [tituloProyecto, setTituloProyecto] = useState("");
    const [tipo, setTipo] = useState("");
    const [finalidad, setFinalidad] = useState("");
    const [reqObj, setReqObj] = useState("");
    const [mediosSoft, setMediosSoft] = useState("");
    const [mediosHard, setMediosHard] = useState("");
    const [etiquetas, setEtiquetas] = useState("");
    const [alerta, setAlerta] = useState({ error: false, msg: "" });

    const selectedTags = tags => {
        setEtiquetas(tags);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlerta("");
        if (alumno === "" || tutor === "") {
            setAlerta({ error: true, msg: "Todos los campos son obligatorios" });
            return;
        }
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
            await operacionesProyectos.addProyecto(nuevoProyecto);
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
                    <input type="text" placeholder="Correo alumno" name="alumno" onChange={(e) => setAlumno(e.target.value)} />
                    <br />
                    <br />
                    Tutor
                    <input type="text" placeholder="Correo tutor" name="tutor" onChange={(e) => setTutor(e.target.value)} />
                    <br />
                    <br />
                    Profesor
                    <input type="text" placeholder="Correo profesor" name="profesor" onChange={(e) => setProfesor(e.target.value)} />
                    <br />
                    <br />
                    Curso
                    <input type="text" placeholder="Curso" name="curso" onChange={(e) => setCurso(e.target.value)} />
                    <br />
                    <br />
                    Título
                    <input type="text" placeholder="Título de proyecto" name="titulo" onChange={(e) => setTituloProyecto(e.target.value)} />
                    <br />
                    <br />
                    Tipo de proyecto
                    <select name="tipo" onChange={(e) => setTipo(e.target.value)}>
                        <option value="documental">Proyecto documental</option>
                        blablablablablablablablablabla
                        <option value="desarrollo">Proyecto de innovación, investigación experimental o desarrollo</option>
                        blablablablablablablablablablablabla
                        <option value="gestion">Proyecto de gestión</option>
                        blablablablablablablablablabla
                    </select>
                    <br />
                    <br />

                    Finalidad
                    <input type="text" placeholder="Finalidad del proyecto" name="finalidad" onChange={(e) => setFinalidad(e.target.value)} />
                    <br />
                    <br />
                    Requisitos / Objetivos
                    <textarea placeholder="Listado de requisitos/objetivos" cols="30" rows="10" name="reqObj" onChange={(e) => setReqObj(e.target.value)} />
                    <br />
                    <br />
                    Medios:
                    <textarea placeholder="Medios Software" cols="30" rows="10" name="soft" onChange={(e) => setMediosSoft(e.target.value)} />
                    <textarea placeholder="Medios Hardware" cols="30" rows="10" name="hard" onChange={(e) => setMediosHard(e.target.value)} />
                    <br />
                    <br />

                    <input type="hidden" value={etiquetas} />
                    {/* <input type="file" /> */}
                </form>
                Etiquetas:
                <TagsInput selectedTags={selectedTags} tags={[]} />
                <br />
                <br />

                <button type="submit" form="FormularioProyecto">Submit</button>
            </div>

        </div>
    );
}

export default Proyecto;