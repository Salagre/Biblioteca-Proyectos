import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inicio from "./Paginas/Inicio";
import Login from "./Paginas/Login";
import Usuario from "./Paginas/Usuario";
import Proyecto from './Paginas/Proyecto';


function App() {
  return (
    <Router>
      <nav>
        <Link to={"/"}>Inicio</Link>
        <Link to={"/login"}> Login </Link>
        <Link to={"/usuario"}>Usuario</Link>
        <Link to={"/proyecto"}>Proyecto</Link>
        <button>Log Out</button>
      </nav>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/proyecto" element={<Proyecto />} />
      </Routes>
    </Router>
  );
}

export default App;
