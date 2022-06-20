import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inicio from "./Paginas/Inicio";
import Login from "./Paginas/Login";
import Usuario from "./Paginas/Usuario";
import Admin from "./Paginas/Admin";
import Proyecto from './Paginas/Proyecto';
import Listado from './Paginas/Listado';
import PaginaNoEncontrada from './Paginas/PaginaNoEncontrada';
import React, { useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";


import { db } from "./firebase-config"
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [isProfesor, setIsProfesor] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        getUsuario();
      }
    });
  }, [email]);

  const getUsuario = async () => {
    if (isAuth) {
      const q = query(collection(db, "usuarios"), where("correo", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let array = [doc.data()];
        setIsProfesor(array[0].isProfesor);
        setNombre(array[0].nombre);
      });

    }
  };

  const cerrarSesion = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    }).catch((error) => {
      console.log(error);
    });
  };

  //Redirigir

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to={"/"}>Biblioteca Proyectos</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item" key="inicio">
                <Link className="nav-link" to={"/"}>Inicio</Link>
              </li>
              {!isAuth ?
                <li className="nav-item" key="login">
                  <Link className="nav-link" to={"/login"}> Login </Link>
                </li> :
                <>
                  {!isProfesor && <li className="nav-item" key="proyecto">
                    <Link className="nav-link" href="#" to={"/proyecto"}>Crear Proyecto</Link>
                  </li>}
                  {isProfesor && <li className="nav-item" key="listado">
                    <Link className="nav-link" href="#" to={"/listado"}>Listado</Link>
                  </li>

                  }
                  

                  <li className="nav-item dropdown ms-auto">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {nombre}
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li><Link className="nav-link" to={"/usuario"}>&emsp;Usuario</Link></li>
                      <li><hr className="dropdown-divider"/></li>
                      <li><a className="dropdown-item" href="#" onClick={cerrarSesion}>Cerrar Sesión</a></li>
                    </ul>
                  </li>
                </>
              }


            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Inicio isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/usuario" element={<Usuario isAuth={isAuth} />} />
        <Route path="/proyecto" element={<Proyecto isAuth={isAuth} />} />
        <Route path="/listado" element={<Listado isAuth={isAuth} />} />
        <Route path="/admin" element={<Admin isAuth={isAuth} />} />
        <Route path="/*" element={<PaginaNoEncontrada />} />
      </Routes>

    </Router>
  );
}

export default App;
