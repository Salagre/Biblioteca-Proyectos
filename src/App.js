import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inicio from "./Paginas/Inicio";
import Login from "./Paginas/Login";
import Usuario from "./Paginas/Usuario";
import { useState } from "react";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import Proyecto from './Paginas/Proyecto';

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
      <nav>
        <Link to={"/"}>Inicio</Link>
        {/* Elegir que páginas se muestran dependiendo de si estás logeado o no */}
        {!isAuth ?
          <Link to={"/login"}> Login </Link> :
          <>
            <Link to={"/usuario"}>Usuario</Link>
            <Link to={"/proyecto"}>Proyecto</Link>
            <button onClick={cerrarSesion}>Log Out</button>
          </>
        }


      </nav>
      <Routes>
        <Route path="/" element={<Inicio isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/usuario" element={<Usuario isAuth={isAuth} />} />
        <Route path="/proyecto" element={<Proyecto isAuth={isAuth} />} />
      </Routes>
    </Router>
  );
}

export default App;
