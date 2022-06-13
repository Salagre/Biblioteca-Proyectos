import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Estilos/tags.scss";
import operacionesProyectos from "../Utiles/operacionesProyectos";
import { db } from "../firebase-config"
import { useLocation } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { storage } from "../firebase-config"
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage"
import { v4 } from "uuid"
import { collection, getDocs, query, where } from "firebase/firestore";

import { auth } from "../firebase-config"
import { onAuthStateChanged } from 'firebase/auth'

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
            setTituloProyecto(location.state.props[0].tituloProyecto)
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
            setUrlsOtrosDocs(location.state.props[0].urlsOtrosDocs)
        }
    },  [email]);

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
        e.preventDefault();
        if (alumno === "" || tutor === "") {
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
            etiquetas,
            urlDoc,
            urlCodigo,
            urlApp,
            urlPdfEvaluacion,
            urlHistoricoNotas,
            urlsOtrosDocs

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
    const subirDocumentacion = () => {
        if (documentacion == null) return;
        const refDocumentacion = ref(storage, `documentaciones/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + documentacion.name}`)
        uploadBytes(refDocumentacion, documentacion).then((snapshot) => {
            getDownloadURL(refDocumentacion).then((url) => {
                setUrlDoc(url);
            })
        })
    }
    const subirCodigo = () => {
        if (codigo == null) return;
        const refCodigo = ref(storage, `codigos/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + codigo.name}`)
        uploadBytes(refCodigo, codigo).then((snapshot) => {
            getDownloadURL(refCodigo).then((url) => {
                setUrlCodigo(url);
            })
        })
    }
    const subirApp = () => {
        if (app == null) return;
        const refApp = ref(storage, `apps/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + app.name}`)
        uploadBytes(refApp, app).then((snapshot) => {
            getDownloadURL(refApp).then((url) => {
                setUrlApp(url);
            })
        })

    }
    const subirPdfEvaluacion = () => {
        if (pdfEvaluacion == null) return;
        const refPdfEval = ref(storage, `pdfsEval/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + pdfEvaluacion.name}`)
        uploadBytes(refPdfEval, pdfEvaluacion).then((snapshot) => {
            getDownloadURL(refPdfEval).then((url) => {
                setUrlPdfEvaluacion(url);
            })
        })

    }
    const subirHistoricoNotas = () => {
        if (historicoNotas == null) return;
        const refHistoricoNotas = ref(storage, `historicoNotas/${v4() + "rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs" + historicoNotas.name}`)
        uploadBytes(refHistoricoNotas, historicoNotas).then((snapshot) => {
            getDownloadURL(refHistoricoNotas).then((url) => {
                setUrlHistoricoNotas(url);
            })
        })

    }
    const subirOtrosDocs = () => {
        if (otrosDocs == null) return;
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
                        value={!isProfesor ? email : alumno} 
                        disabled/>
                    <br />
                    <br />
                    Tutor
                    <input
                        type="text"
                        placeholder="Correo tutor"
                        name="tutor"
                        onChange={(e) => setTutor(e.target.value)}
                        value={tutor} 
                        disabled={!isProfesor && true}
                        />
                    <br />
                    <br />
                    Profesor
                    <input type="text" placeholder="Correo profesor" name="profesor" onChange={(e) => setProfesor(e.target.value)} value={profesor}
                        disabled={!isProfesor && true} />
                    <br />
                    <br />
                    Curso
                    <input type="text" placeholder="Curso" name="curso" onChange={(e) => setCurso(e.target.value)} value={curso} disabled={isProfesor && true} />
                    <br />
                    <br />
                    Título
                    <input type="text" placeholder="Título de proyecto" name="titulo" onChange={(e) => setTituloProyecto(e.target.value)} value={tituloProyecto} disabled={isProfesor && true} disabled={isProfesor && true} />
                    <br />
                    <br />
                    Tipo de proyecto
                    <div >
                        <input type="radio" value="documental" name="tipo" onChange={(e) => setTipo("documental")} checked={tipo === "documental" ? true : false} disabled={isProfesor && true}/> Proyecto documental:
                        Blablalblalblablbalballab <br />
                        <input type="radio" value="desarrollo" name="tipo" onChange={(e) => setTipo("desarrollo")} checked={tipo === "desarrollo" ? true : false} disabled={isProfesor && true}/> Proyecto de innovación, investigación experimental o desarrollo:
                        Blablalblalblablbalballab <br />
                        <input type="radio" value="gestion" name="tipo" onChange={(e) => setTipo("gestion")} checked={tipo === "gestion" ? true : false} disabled={isProfesor && true}/> Proyecto de gestión:
                        Blablalblalblablbalballab <br />
                    </div>

                    <br />
                    <br />

                    Finalidad
                    <input type="text" placeholder="Finalidad del proyecto" name="finalidad" onChange={(e) => setFinalidad(e.target.value)} value={finalidad} disabled={isProfesor && true} />
                    <br />
                    <br />
                    Requisitos / Objetivos(Uno por linea)
                    <textarea id="reqObj" placeholder="Listado de requisitos/objetivos" cols="30" rows="10" name="reqObj" onChange={(e) => setReqObj(e.target.value.replace(/\r\n/, "\n").split("\n"))} value={reqObj.join("\n")} disabled={isProfesor && true}/>
                    <br />
                    <br />
                    Medios (Uno por linea):
                    <textarea id="mediosSoft" placeholder="Medios Software" cols="30" rows="10" name="soft" onChange={(e) => setMediosSoft(e.target.value.replace(/\r\n/, "\n").split("\n"))} value={mediosSoft.join("\n")} disabled={isProfesor && true}/>
                    <textarea id="mediosHard" placeholder="Medios Hardware" cols="30" rows="10" name="hard" onChange={(e) => setMediosHard(e.target.value.replace(/\r\n/, "\n").split("\n"))} value={mediosHard.join("\n")} disabled={isProfesor && true}/>
                    <br />
                    <br />

                    <input type="hidden" value={etiquetas} />

                    <p>Documentación:</p>
                    {
                        urlDoc == null ?
                            <>
                                <input id="inputDocumentacion" type="file" name="documentacion" onChange={(event) => setDocumentacion(event.target.files[0])} disabled={isProfesor && true}/>
                                <button type="button" onClick={() => { subirDocumentacion() }} disabled={isProfesor && true}>Subir documentación</button>
                            </>
                            :
                            <>
                                <a href={urlDoc}>{urlDoc.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>
                                <button type="button" onClick={() => { setDocumentacion(null); setUrlDoc(null) }} disabled={isProfesor && true}>Borrar archivo</button>
                            </>
                    }
                    <br />
                    <br />
                    <p>Código de la aplicación:</p>
                    {
                        urlCodigo == null ?
                            <>
                                <input id="inputCodigo" type="file" name="codigo" onChange={(event) => setCodigo(event.target.files[0])} disabled={isProfesor && true}/>
                                <button type="button" onClick={() => { subirCodigo() }} disabled={isProfesor && true}>Subir documentación</button>
                            </>
                            :
                            <>
                                <a href={urlCodigo}>{urlCodigo.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>
                                <button type="button" onClick={() => { setCodigo(null); setUrlCodigo(null) }} disabled={isProfesor && true}>Borrar archivo</button>
                            </>
                    }
                    <br />
                    <br />
                    <p>Aplicación:</p>

                    {
                        urlApp == null ?
                            <>
                                <input id="inputApp" type="file" name="app" onChange={(event) => setApp(event.target.files[0])} disabled={isProfesor && true} />
                                <button type="button" onClick={() => { subirApp() }} disabled={isProfesor && true}>Subir app</button>
                            </>
                            :
                            <>
                                <a href={urlApp}>{urlApp.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>
                                <button type="button" onClick={() => { setApp(null); setUrlApp(null) }} disabled={isProfesor && true}>Borrar archivo</button>
                            </>
                    }
                    <br />
                    <br />
                    <p>Pdf de evaluación:</p>

                    {
                        urlPdfEvaluacion == null ?
                            <>
                                <input id="inputPdfEval" type="file" name="pdfEval" onChange={(event) => setPdfEvaluacion(event.target.files[0])} />
                                <button type="button" onClick={() => { subirPdfEvaluacion() }}>Subir pdfEvaluacion</button>
                            </>
                            :
                            <>
                                <a href={urlPdfEvaluacion}>{urlPdfEvaluacion.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>
                                <button type="button" onClick={() => { setPdfEvaluacion(null); setUrlPdfEvaluacion(null) }}>Borrar archivo</button>
                            </>
                    }
                    <br />
                    <br />
                    <p>Historico notas:</p>

                    {
                        urlHistoricoNotas == null ?
                            <>
                                <input id="inputHistoricoNotas" type="file" name="historicoNotas" onChange={(event) => setHistoricoNotas(event.target.files[0])} />
                                <button type="button" onClick={() => { subirHistoricoNotas() }}>Subir historico notas</button>
                            </>
                            :
                            <>
                                <a href={urlHistoricoNotas}>{urlHistoricoNotas.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>
                                <button type="button" onClick={() => { setHistoricoNotas(null); setUrlHistoricoNotas(null) }}>Borrar archivo</button>
                            </>
                    }
                    <br />
                    <br />
                    <p>Otros archivos:</p>

                    <input id="inputOtros" type="file" name="otros" multiple onChange={(e) => { setOtrosDocs(e.target.files) }} disabled={isProfesor && true}/>
                    <button type="button" onClick={() => { subirOtrosDocs() }} disabled={isProfesor && true}>Subir otros</button>
                    <br />
                    <ul>
                        {
                            urlsOtrosDocs.map((url, i) => {
                                return (
                                    <li key={url}>
                                        <a href={url}>{url.split('rjvgbarvbjdrsgfvkjsyfjvbgsrvefjyrgesvbfsgfs')[1].split("?alt=")[0]}</a>
                                        <button type="button" onClick={() => { removeItem(i) }

                                        } disabled={isProfesor && true}>Borrar archivo</button>
                                    </li>
                                )
                            })
                        }
                    </ul>


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
                {
                    isProfesor && <button>Cerrar entrega</button>
                }

            </div>

        </div>
    );
}

export default Proyecto;