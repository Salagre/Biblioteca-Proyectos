import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inicio from "./Paginas/Inicio";
import Login from "./Paginas/Login";
import Usuario from "./Paginas/Usuario";
import Admin from "./Paginas/Admin";
import Proyecto from './Paginas/Proyecto';
import Listado from './Paginas/Listado';
import { useState } from "react";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
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
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#"><Link to={"/"}>Biblioteca Proyectos</Link></a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#"><Link to={"/"}>Inicio</Link></a>
              </li>
              {!isAuth ?
                <li class="nav-item">
                  <a class="nav-link" href="#"><Link to={"/login"}> Login </Link></a>
                </li> :
                <>
                  <li class="nav-item">
                    <a class="nav-link" href="#"><Link to={"/usuario"}>Usuario</Link></a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link" href="#"><Link to={"/proyecto"}>Proyecto</Link></a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#"><Link to={"/listado"}>Listado</Link></a>
                  </li>
                  <button onClick={cerrarSesion}>Log Out</button>
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
      </Routes>
    </Router>
  );
}

export default App;
