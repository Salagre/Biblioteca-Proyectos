import { db } from "../firebase-config";
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const referenciaColeccionProyectos = collection(db, "proyectos");
class operacionesProyectos {
    addProyecto(newProyecto) {
        return addDoc(referenciaColeccionProyectos, newProyecto);
    }
    updateProyecto = (id, updatedProyecto) => {
        const proyectoDoc = doc(db, "proyectos", id);
        return updateDoc(proyectoDoc, updatedProyecto);
    };

    deleteProyecto = (id) => {
        const proyectoDoc = doc(db, "proyectos", id);
        return deleteDoc(proyectoDoc);
    };

    getAllProyectos = () => {
        return getDocs(referenciaColeccionProyectos);
    };

    getProyectosAlumno = (alumno) => {
        return query(referenciaColeccionProyectos, where("alumno", "==", "alejandro.salvar@educa.jcyl.es"));
        
    }

    getProyecto = (id) => {
        const proyectoDoc = doc(db, "proyectos", id);
        return getDoc(proyectoDoc);
    };
}

export default new operacionesProyectos;