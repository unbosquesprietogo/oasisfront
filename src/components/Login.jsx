import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    const savedIp = sessionStorage.getItem('ip');
    const savedPort = sessionStorage.getItem('puerto');
    if (!savedIp || !savedPort) {
      setShowModal(true);
    } else {
      setIp(savedIp);
      setPort(savedPort);
    }
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const saveTokenToSessionStorage = (token) => {
    const decodedKey = btoa('token');
    sessionStorage.setItem(decodedKey, token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(`http://${ip}:${port}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        saveTokenToSessionStorage(result.token);
        window.location.reload();
      } else {
        console.error('Error en la solicitud al servidor');
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    sessionStorage.setItem('ip', ip);
    sessionStorage.setItem('puerto', port);
    setShowModal(false);
  };


  return (
    <div className='login-div'>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 login-container">

            <h2>Sistema de Inventario</h2>
    
            <form onSubmit={handleSubmit}>
              <div className="form-group">  
                <label htmlFor="username">Usuario:</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña:</label>
                <div className="password-cont password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control custom-input"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <div className='eye-icon'>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={toggleShowPassword} className="toggle-password-icon" />
                  </div>          
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                {loading ? 'Cargando...' : 'Iniciar sesión'}
              </button>
            </form>
            {showModal && (
              <div>
                <div className="modal-backdrop" style={{ display: 'block', zIndex: 9998 }}></div>
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', zIndex: 9999 }}>
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Configuración de Backend</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={handleSaveSettings}>
                          <div className="form-group">
                            <label htmlFor="ip">IP del backend:</label>
                            <input
                              type="text"
                              className="form-control"
                              id="ip"
                              value={ip}
                              onChange={(e) => setIp(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="port">Puerto del backend:</label>
                            <input
                              type="number"
                              className="form-control"
                              id="port"
                              value={port}
                              onChange={(e) => setPort(e.target.value)}
                              required
                            />
                          </div>
                          <button type="submit" className="btn btn-primary">Guardar</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {showErrorAlert && (
            <div className="modal-backdrop" style={{ display: 'block' }}>
              <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Error</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseAlert}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p>Los datos ingresados son incorrectos. Por favor, inténtalo de nuevo.</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleCloseAlert}>
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
