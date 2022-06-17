import { db } from "../firebase-config";
import { collection, getDocs, getDoc, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";

const referenciaColeccionProyectos = collection(db, "proyectos");
class operacionesProyectos {
    addProyecto(newProyecto) {
        console.log(newProyecto)
        return addDoc(referenciaColeccionProyectos, newProyecto);
    }
    updateProyecto = async (ids, updatedProyecto) => {
        try {
            await setDoc(doc(db, "proyectos", ids), {
                alumno: updatedProyecto.alumno,
                tutor: updatedProyecto.tutor,
                profesor: updatedProyecto.profesor,
                curso: updatedProyecto.curso,
                tituloProyecto: updatedProyecto.tituloProyecto,
                tipo: updatedProyecto.tipo,
                finalidad: updatedProyecto.finalidad,
                reqObj: updatedProyecto.reqObj,
                mediosSoft: updatedProyecto.mediosSoft,
                mediosHard: updatedProyecto.mediosHard,
                etiquetas: updatedProyecto.etiquetas,
                urlDoc: updatedProyecto.urlDoc,
                urlCodigo: updatedProyecto.urlCodigo,
                urlApp: updatedProyecto.urlApp,
                urlPdfEvaluacion: updatedProyecto.urlPdfEvaluacion,
                urlsOtrosDocs: updatedProyecto.urlsOtrosDocs,
                isCerrado: updatedProyecto.isCerrado

            });
            //return updateDoc(proyectoDoc, updatedProyecto);
        } catch (err) {
            console.log(err)
        }
    };

    deleteProyecto = (id) => {
        const proyectoDoc = doc(db, "proyectos", id);
        return deleteDoc(proyectoDoc);
    };

    getAllProyectos = () => {
        return getDocs(referenciaColeccionProyectos);
    };

    getProyecto = (id) => {
        const proyectoDoc = doc(db, "proyectos", id);
        return getDoc(proyectoDoc);
    };
}

export default new operacionesProyectos();