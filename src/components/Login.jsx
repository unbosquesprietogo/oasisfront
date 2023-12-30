import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    // Decodifica la clave en base64
    const decodedKey = btoa('token');
    // Guarda el token en sessionStorage
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
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        // Guarda el token en sessionStorage con la clave decodificada en base64
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



  
  return (
    <div className='login-div'>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 login-container">
            <img src="src\assets\img\logo.png" alt="Oasis Logo" className="img-fluid brand-image" />
            <h2>Oasis Uniformes</h2>
            <h2>Iniciar Sesión</h2>
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
                <input
                  type="password"
                  className="form-control custom-input"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                {loading ? 'Cargando...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>

          {showErrorAlert && (
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
          )}
        </div>
      </div>
    </div>
  );
};


export default Login;
