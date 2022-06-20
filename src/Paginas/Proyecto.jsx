import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Estilos/tags.scss";
import operacionesProyectos from "../Utiles/operacionesProyectos";
import { db } from "../firebase-config"
import { useLocation } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { storage } from "../firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../firebase-config"
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth'

function Proyecto({ isAuth }) {
    const [isEditando, setIsEditando] = useState(false);
    const [email, setEmail] = useState("");
    const [isProfesor, setIsProfesor] = useState(false);
    const location = useLocation();
    let navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email);
                getUsuario();
            } else {
                navigate("/login");
            }
        });
        if (location.state != null) {
            setIsEditando(true);
            setAlumno(location.state.props[0].alumno)
            setTutor(location.state.props[0].tutor)
            setProfesor(location.state.props[0].profesor)
            setCurso(location.state.props[0].curso)
            setCiclo(location.state.props[0].ciclo)
            setTituloProyecto(location.state.props[0].tituloProyecto)
            setTituloHasChanged(true)
            setTipo(location.state.props[0].tipo)
            setFinalidad(location.state.props[0].finalidad)
            setReqObj(location.state.props[0].reqObj)
            setMediosSoft(location.state.props[0].mediosSoft)
            setMediosHard(location.state.props[0].mediosHard)
            setEtiquetas(location.state.props[0].etiquetas)
            setUrlDoc(location.state.props[0].urlDoc)
            setUrlCodigo(location.state.props[0].urlCodigo)
            setUrlApp(location.state.props[0].urlApp)
            setUrlPdfEvaluacion(location.state.props[0].urlPdfEvaluacion)
            setUrlHistoricoNotas(location.state.props[0].urlHistoricoNotas)
            setUrlsOtrosDocs(location.state.props[0].urlsOtrosDocs)
            setIsCerrado(location.state.props[0].isCerrado)

            if(email != location.state.props[0].alumno && email != location.state.props[0].profesor && email != location.state.props[0].tutor){
                console.log(location.state.props[0].alumno)
                console.log(location.state.props[0].profesor)
                console.log(location.state.props[0].tutor)
                setDesc(true);
            }
        } else {

        }
    }, [email]);





    const [alumno, setAlumno] = useState("");
    const [tutor, setTutor] = useState("");
    const [profesor, setProfesor] = useState("");
    const [ciclo, setCiclo] = useState("");
    const [curso, setCurso] = useState("");
    const [tituloProyecto, setTituloProyecto] = useState("");
    const [tituloHasChanged, setTituloHasChanged] = useState(false);
    const [tipo, setTipo] = useState("");
    const [finalidad, setFinalidad] = useState("");
    const [reqObj, setReqObj] = useState([]);
    const [mediosSoft, setMediosSoft] = useState([]);
    const [mediosHard, setMediosHard] = useState([]);
    const [etiquetas, setEtiquetas] = useState([]);
    const [documentacion, setDocumentacion] = useState(null)
    const [urlDoc, setUrlDoc] = useState(null)
    const [codigo, setCodigo] = useState(null)
    const [urlCodigo, setUrlCodigo] = useState(null)
    const [app, setApp] = useState(null)
    const [urlApp, setUrlApp] = useState(null)
    const [pdfEvaluacion, setPdfEvaluacion] = useState(null)
    const [urlPdfEvaluacion, setUrlPdfEvaluacion] = useState(null)
    const [historicoNotas, setHistoricoNotas] = useState(null)
    const [urlHistoricoNotas, setUrlHistoricoNotas] = useState(null)
    const [otrosDocs, setOtrosDocs] = useState(null)
    const [urlsOtrosDocs, setUrlsOtrosDocs] = useState([])
    const [isCerrado, setIsCerrado] = useState(false);
    const [desc, setDesc] = useState(false)


    const getUsuario = async () => {
        if (isAuth) {
            const q = query(collection(db, "usuarios"), where("correo", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let array = [doc.data()];
                setIsProfesor(array[0].isProfesor);
            });

        }
    };


    const handleSubmit = async (e) => {
        setAlumno(document.getElementById("alumn").value)
        e.preventDefault();
        if (document.getElementById("alumn").value === "" || tutor === "") {
            return;
        }

        const nuevoProyecto = {
            alumno,
            tutor,
            profesor,
            ciclo,
            curso,
            tituloProyecto,
            tipo,
            finalidad,
            reqObj,
            mediosSoft,
            mediosHard,
            etiquetas,
            urlDoc,
            urlCodigo,
            urlApp,
            urlPdfEvaluacion,
            urlHistoricoNotas,
            urlsOtrosDocs,
            isCerrado

        };
        try {
            if (isEditando) {
                await operacionesProyectos.updateProyecto(location.state.props[1], nuevoProyecto);
                alert("Cambios guardados con exito")
            } else {
                await operacionesProyectos.addProyecto(nuevoProyecto);
                setIsEditando(true)
                alert("Proyecto guardado con exito")

            }
        } catch (err) {
            console.log(err);
        }

    }
    const subirDocumentacion = () => {
        if (documentacion == null) {
            alert("No hay archivos que subir")
            return;
        }
        const refDocumentacion = ref(storage, `documentaciones/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + documentacion.name}`)
        uploadBytes(refDocumentacion, documentacion).then((snapshot) => {
            getDownloadURL(refDocumentacion).then((url) => {
                setUrlDoc(url);
            })
        })
    }
    const subirCodigo = () => {
        if (codigo == null) {
            alert("No hay archivos que subir")
            return;
        }
        const refCodigo = ref(storage, `codigos/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + codigo.name}`)
        uploadBytes(refCodigo, codigo).then((snapshot) => {
            getDownloadURL(refCodigo).then((url) => {
                setUrlCodigo(url);
            })
        })
    }
    const subirApp = () => {
        if (app == null) {
            alert("No hay archivos que subir")
            return;
        }
        const refApp = ref(storage, `apps/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + app.name}`)
        uploadBytes(refApp, app).then((snapshot) => {
            getDownloadURL(refApp).then((url) => {
                setUrlApp(url);
            })
        })

    }
    const subirPdfEvaluacion = () => {
        if (pdfEvaluacion == null) {
            alert("No hay archivos que subir")
            return;
        }
        const refPdfEval = ref(storage, `pdfsEval/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + pdfEvaluacion.name}`)
        uploadBytes(refPdfEval, pdfEvaluacion).then((snapshot) => {
            getDownloadURL(refPdfEval).then((url) => {
                setUrlPdfEvaluacion(url);
            })
        })

    }
    const subirHistoricoNotas = () => {
        if (historicoNotas == null) {
            alert("No hay archivos que subir")
            return;
        }
        const refHistoricoNotas = ref(storage, `historicoNotas/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + historicoNotas.name}`)
        uploadBytes(refHistoricoNotas, historicoNotas).then((snapshot) => {
            getDownloadURL(refHistoricoNotas).then((url) => {
                setUrlHistoricoNotas(url);
            })
        })

    }
    const subirOtrosDocs = () => {
        if (otrosDocs == null) {
            alert("No hay archivos que subir")
            return;
        }
        for (let i = 0; i < otrosDocs.length; i++) {
            const refOtros = ref(storage, `otros/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + otrosDocs[i].name}`)
            uploadBytes(refOtros, otrosDocs[i].name).then((snapshot) => {
                getDownloadURL(refOtros).then((url) => {
                    setUrlsOtrosDocs(oldUrlsOtrosDocs => [...oldUrlsOtrosDocs, url]);
                })
            })
        }
        setOtrosDocs([])
        document.getElementById("inputOtros").value = null;

    }
    const removeItem = (index) => {
        setUrlsOtrosDocs([
            ...urlsOtrosDocs.slice(0, index),
            ...urlsOtrosDocs.slice(index + 1, urlsOtrosDocs.length)
        ]);
    }

    const navegar = () => {
        navigate("/")
    }


    return (
        <div className="d-flex justify-content-center">

            <div className="w-75 border rounded m-3 p-3">
                <h3 className="text-break bg-primary p-2 rounded-top text-white " style={{ minHeight: "55px" }}>{tituloHasChanged ? tituloProyecto : ""}</h3>
                {isCerrado && <h3 className="text-break bg-danger p-2 rounded-top text-white">El proyecto está cerrado, solo los profesores pueden hacer cambios</h3>}
                
                {
                    isEditando ?
                        <button className="btn btn-default" type="submit" form="FormularioProyecto">Actualizar</button>
                        :
                        <button className="btn btn-default border" type="submit" form="FormularioProyecto">Guardar</button>
                }
                {
                    isProfesor && (
                        <>
                            {isCerrado ? <><button disabled={!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc} className="btn btn-default" onClick={() => setIsCerrado(false)}>Abrir entrega</button></> :
                                <><button disabled={!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc} className="btn btn-default" onClick={() => setIsCerrado(true)}>Cerrar entrega</button></>
                            }
                        </>
                    )
                }
                <div >
                    <form onSubmit={handleSubmit} id="FormularioProyecto">
                        <div className="mb-3">
                            <label htmlFor="alumn" className="form-label">Alumno</label>
                            <input
                                type="email"
                                id="alumn"
                                placeholder="Correo alumno"
                                name="alumno"
                                onChange={(e) => setAlumno(e.target.value)}
                                value={alumno}
                                disabled={isCerrado || isProfesor || desc}
                                className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="titulo" className="form-label">Título de proyecto</label>
                            <input
                                required
                                type="text"
                                placeholder="Título de proyecto"
                                name="titulo"
                                onChange={(e) => {setTituloProyecto(e.target.value) ; setTituloHasChanged(true)}}
                                value={tituloProyecto}
                                disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}
                                className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tutor" className="form-label">Tutor de proyecto</label>
                            <input
                                required
                                type="email"
                                id="tutor"
                                placeholder="Correo del tutor del proyecto"
                                name="tutor"
                                onChange={(e) => setTutor(e.target.value)}
                                value={tutor}
                                disabled={isCerrado || email == tutor || desc}
                                className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="tribunal" className="form-label">Tribunal de proyecto</label>
                            <input type="text"
                                placeholder="Correo profesor"
                                name="profesor"
                                onChange={(e) => setProfesor(e.target.value)}
                                value={profesor}
                                disabled={isCerrado || email == profesor || desc}
                                className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="ciclo" className="form-label">Ciclo</label>&emsp;
                            <select id="ciclo" className="form-select" onChange={(e) => { setCiclo(e.target.value) }} value={ciclo} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}>
                                <option value="CFGS Administración y Finanzas">CFGS Administración y Finanzas</option>
                                <option value="CFGS Administración de Sistemas Informáticos en Red">CFGS Administración de Sistemas Informáticos en Red</option>
                                <option value="CFGS Desarrollo de Aplicaciones Multiplataforma">CFGS Desarrollo de Aplicaciones Multiplataforma</option>
                                <option value="CFGS Desarrollo de Aplicaciones Web">CFGS Desarrollo de Aplicaciones Web</option>
                                <option value="CFGS Desarrollo de Aplicaciones Multiplataforma(Distancia)">CFGS Desarrollo de Aplicaciones Multiplataforma(Distancia)</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="curso" className="form-label">Curso</label>
                            <input
                                required
                                type="text"
                                placeholder="2X/2X"
                                id="curso"
                                onChange={(e) => setCurso(e.target.value)}
                                value={curso}
                                disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="tipoProyecto" className="form-label">Tipo de proyecto:</label>
                            <div className="form-check">
                                <div className="form-check">
                                    <input required className="form-check-input" type="radio" name="tipo" id="documental" value="documental" onChange={(e) => setTipo("documental")} checked={tipo === "documental" ? true : false} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado} />
                                    <label className="form-check-label" htmlFor="documental">
                                        <b>Proyecto documental:</b>  Se  dirigirá  al  análisis  y  comentario  crítico  de  trabajos    científicos  publicados  recientemente  sobre  un  tema  específico  de  actualidad    relacionado    con    el    ciclo    formativo,    o    sobre    la    evolución    tecnológica experimentada en el campo relacionado con el título.
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input required className="form-check-input" type="radio" name="tipo" id="desarrollo" value="desarrollo" onChange={(e) => setTipo("desarrollo")} checked={tipo === "desarrollo" ? true : false} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado} />
                                    <label className="form-check-label" htmlFor="desarrollo">
                                        <b>Proyecto de innovación, investigación experimental o desarrollo:</b> Consistirá en            la   realización   de   un   proyecto   de   innovación   o   de   investigación experimental, de   producción de un objeto tecnológico, de desarrollo aplicado o de diseño de un procedimiento relacionado con la calidad, la prevención laboral o la protección del medio ambiente.
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input required className="form-check-input" type="radio" name="tipo" id="gestion" value="gestion" onChange={(e) => setTipo("gestion")} checked={tipo === "gestion" ? true : false} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado} />
                                    <label className="form-check-label" htmlFor="gestion">
                                        <b>Proyecto  de  gestión:</b>  Estará  encaminado  a  la  realización  de  estudios  de viabilidad    y mercadotecnia o la elaboración de un proyecto empresarial.
                                    </label>
                                </div>
                            </div>
                            <br />
                            <p>En  cualquier  caso  el  proyecto  ha  de  estar  basado  en <u>situaciones  reales</u> y  exigir una serie de <u>actividades que se estructuranen un plan de trabajo.</u></p>
                        </div>


                        <div className="mb-3">
                            <label htmlFor="finalidad" className="form-label">Finalidad del proyecto</label>
                            <textarea className="form-control"
                                id="finalidad"
                                rows="3"
                                placeholder="Finalidad del proyecto"
                                name="finalidad"
                                onChange={(e) => setFinalidad(e.target.value)}
                                value={finalidad}
                                disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="reqObj" className="form-label">Requisitos / Objetivos(Uno por linea)</label>
                            <textarea className="form-control"
                                id="reqObj"
                                placeholder="Listado de requisitos/objetivos"
                                rows="3"
                                name="reqObj"
                                onChange={(e) => setReqObj(e.target.value.replace(/\r\n/, "\n").split("\n"))}
                                value={reqObj.join("\n")}
                                disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}></textarea>

                        </div>
                        <div className="mb-3">
                            <label htmlFor="medios" className="form-label">Medios (Uno por linea):</label>
                            <textarea className="form-control"
                                id="mediosSoft"
                                placeholder="Medios Software"
                                rows="3" name="soft"
                                onChange={(e) => setMediosSoft(e.target.value.replace(/\r\n/, "\n").split("\n"))}
                                value={mediosSoft.join("\n")}
                                disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado} />

                            <textarea className="form-control"
                                id="mediosHard"
                                placeholder="Medios Hardware"
                                rows="3" name="hard"
                                onChange={(e) => setMediosHard(e.target.value.replace(/\r\n/, "\n").split("\n"))}
                                value={mediosHard.join("\n")}
                                disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado} />
                        </div>

                        <input type="hidden" value={etiquetas} />


                        <div className="mb-3 border rounded p-3">
                            <p>Documentación:</p>
                            {
                                urlDoc == null ?
                                    <div className="d-flex flex-row">
                                        
                                        <button className="btn btn-default" type="button" onClick={() => { subirDocumentacion() }} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}>Subir documentación</button>
                                        &emsp;<input className="form-control" id="inputDocumentacion" type="file" name="documentacion" onChange={(event) => setDocumentacion(event.target.files[0])} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado} />
                                    </div>
                                    :
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-default" type="button" onClick={() => { setDocumentacion(null); setUrlDoc(null) }} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}>Borrar archivo</button>
                                        &emsp;&emsp;<a target="_blank" href={urlDoc}>{urlDoc.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>

                                    </div>
                            }
                        </div>
                        <div className="mb-3 border rounded p-3">
                            <p>Código de la aplicación:</p>
                            {
                                urlCodigo == null ?
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-default" type="button" onClick={() => { subirCodigo() }} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}>Subir documentación</button>
                                        &emsp;<input className="form-control" id="inputCodigo" type="file" name="codigo" onChange={(event) => setCodigo(event.target.files[0])} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado} />

                                    </div>
                                    :
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-default" type="button" onClick={() => { setCodigo(null); setUrlCodigo(null) }} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}>Borrar archivo</button>
                                        &emsp;&emsp; <a target="_blank" href={urlCodigo}>{urlCodigo.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>

                                    </div>
                            }</div>
                        <div className="mb-3 border rounded p-3">
                            <p>Aplicación:</p>

                            {
                                urlApp == null ?
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-default" type="button" onClick={() => { subirApp() }} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}>Subir app</button>
                                        &emsp;<input className="form-control" id="inputApp" type="file" name="app" onChange={(event) => setApp(event.target.files[0])} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado} />

                                    </div>
                                    :
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-default" type="button" onClick={() => { setApp(null); setUrlApp(null) }} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}>Borrar archivo</button>
                                        &emsp;&emsp; <a target="_blank" href={urlApp}>{urlApp.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>

                                    </div>
                            }
                        </div>
                        <div className="mb-3 border rounded p-3">
                            <p>Pdf de evaluación:</p>

                            {
                                urlPdfEvaluacion == null ?
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-default" type="button" onClick={() => { subirPdfEvaluacion() }} disabled={(!!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc)}>Subir pdfEvaluacion</button>
                                        &emsp;<input className="form-control" id="inputPdfEval" type="file" name="pdfEval" onChange={(event) => setPdfEvaluacion(event.target.files[0])} disabled={(!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc)} />

                                    </div>
                                    :
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-default" type="button" onClick={() => { setPdfEvaluacion(null); setUrlPdfEvaluacion(null) }} disabled={(!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc)}>Borrar archivo</button>
                                        &emsp;&emsp; <a target="_blank" href={urlPdfEvaluacion}>{urlPdfEvaluacion.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>

                                    </div>
                            }
                        </div>
                        <div className="mb-3 border rounded p-3">
                            <p>Histórico notas:</p>

                            {
                                urlHistoricoNotas == null ?
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-default" type="button" onClick={() => { subirHistoricoNotas() }} disabled={(!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc)}>Subir historico notas</button>
                                        &emsp;<input className="form-control" id="inputHistoricoNotas" type="file" name="historicoNotas" disabled={(!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc)} onChange={(event) => setHistoricoNotas(event.target.files[0])} />

                                    </div>
                                    :
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-default" type="button" onClick={() => { setHistoricoNotas(null); setUrlHistoricoNotas(null) }} disabled={(!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc ) }>Borrar archivo</button>
                                        &emsp;&emsp;<a target="_blank" href={urlHistoricoNotas}>{urlHistoricoNotas.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>

                                    </div>
                            }
                        </div>
                        <div className="mb-3 border rounded p-3">
                            <p>Otros archivos:</p>
                            <div className="d-flex flex-row">
                                <button className="btn btn-default" type="button" onClick={() => { subirOtrosDocs() }} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}>Subir otros</button>
                                &emsp;<input className="form-control" id="inputOtros" type="file" name="otros" multiple onChange={(e) => { setOtrosDocs(e.target.files) }} disabled={(isProfesor && true) || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado} />
                            </div>
                            <ul>
                                {
                                    urlsOtrosDocs.map((url, i) => {
                                        return (
                                            <li key={url}>
                                                <button className="btn btn-default" type="button" onClick={() => { removeItem(i) }}
                                                    disabled={isProfesor || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}>Borrar archivo</button> &emsp;&emsp;
                                                <a target="_blank" href={url}>{url.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>

                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>

                    </form>
                    Etiquetas:
                    <ReactTagInput
                    hint="Aaa"
                        readOnly={isProfesor || isCerrado && email != alumno && email != tutor && email != profesor || isCerrado}
                        tags={etiquetas}
                        onChange={(newTags) => {
                            setEtiquetas(newTags)

                        }}
                    />

                    <br />
                    <br />
                    <br />
                    <br />
                    {
                        isEditando ?
                            <button className="btn btn-default" type="submit" form="FormularioProyecto">Actualizar</button>
                            :
                            <button className="btn btn-default" type="submit" form="FormularioProyecto">Guardar</button>
                    }
                    {
                        isProfesor && (
                            <>
                                {isCerrado ? <><button disabled={!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc} className="btn btn-default" onClick={() => setIsCerrado(false)}>Abrir entrega</button></> :
                                <><button disabled={!isProfesor && true && email != alumno && email != tutor && email != profesor || !desc && !isProfesor || isCerrado && email == alumno || desc} className="btn btn-default" onClick={() => setIsCerrado(true)}>Cerrar entrega</button></>
                            }
                            </>
                        )
                    }
                </div>

            </div></div>
    );
}

export default Proyecto;