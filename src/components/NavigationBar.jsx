import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/NavigationBar.css';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png'


const NavigationBar = () => {
  const [username, setUsername] = useState('Usuario');

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
          src={logo}
          width="30"
          height="30"
          className="d-inline-block align-top sections-div"
        />{' '}
       Inventario
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
              <Dropdown.Item as={Link} to="/create-sell">Crear Venta</Dropdown.Item>
              <Dropdown.Item as={Link} to="/sell-list">Lista de Ventas</Dropdown.Item>
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
              <Dropdown.Item as={Link} to="/create-combo">Crear Combo</Dropdown.Item>
              <Dropdown.Item as={Link} to="/combo-list">Lista de Combos</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="user-dropdown">
              <span className="mr-2">{username}</span>
              <i className="fas fa-user"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu id="dropdown-menu-list" className="dropdown-menu-left">
            <Dropdown.Item as={Link} to="/config">Configuración</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
