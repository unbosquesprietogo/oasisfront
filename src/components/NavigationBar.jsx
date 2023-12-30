import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/NavigationBar.css';
import { Link, useNavigate} from 'react-router-dom';



const NavigationBar = () => {
  const [username, setUsername] = useState('Usuario');
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem(btoa('token'));
    window.location.reload();
  };
  
  useEffect(() => {
    // Obtener el token almacenado en sessionStorage y decodificarlo
    const encodeToken = btoa('token');
    const token = sessionStorage.getItem(encodeToken);

    if (token) { 
      const parsedToken =  JSON.parse (atob (token.split ('.')[1]));
      // Extraer el nombre de usuario del token decodificado
      setUsername(parsedToken.username);
    }
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand className='logo-div' href="#home">
        <img
          alt="Logo"
          src="src\\assets\\img\\logo.png"
          width="30"
          height="30"
          className="d-inline-block align-top sections-div"
        />{' '}
       Oasis Uniformes
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className='nav-items sections-div' id="basic-navbar-nav">
        <Nav className="mr-auto">
        <Dropdown>
            <Dropdown.Toggle variant="dark" id="user-dropdown">
              <span className="mr-2">Venta</span>
              <i className="fas fa-user"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu id="dropdown-menu-list" className="dropdown-menu-left">
              <Dropdown.Item href="">Crear Venta</Dropdown.Item>
              <Dropdown.Item href="">Lista de Ventas</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="user-dropdown">
              <span className="mr-2">Productos</span>
              <i className="fas fa-user"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu id="dropdown-menu-list" className="dropdown-menu-left">
              <Dropdown.Item as={Link} to="/create-product">Crear Producto</Dropdown.Item>
              <Dropdown.Item as={Link} to="/product-list">Lista de Productos</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="user-dropdown">
              <span className="mr-2">Combos</span>
              <i className="fas fa-user"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu id="dropdown-menu-list" className="dropdown-menu-left">
              <Dropdown.Item href="">Crear Combo</Dropdown.Item>
              <Dropdown.Item href="">Lista de Combos</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="user-dropdown">
              <span className="mr-2">{username}</span>
              <i className="fas fa-user"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu id="dropdown-menu-list" className="dropdown-menu-left">
              <Dropdown.Item href="#configuracion">Configuración</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
