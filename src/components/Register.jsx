import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const ip = sessionStorage.getItem('ip');
        const port = sessionStorage.getItem('puerto');
        const response = await fetch(`http://${ip}:${port}/auth/role`);
        if (response.ok) {
          const rolesData = await response.json();
          setRoles(rolesData);
        } else {
          console.error('Error al obtener roles del servidor');
        }
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
      
    };

    fetchRoles();
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (password) => {
    const conditions = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
    };
    setPasswordConditions(conditions);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
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

    if (password !== confirmPassword) {
      setShowErrorAlert(true);
      return;
    }

    setLoading(true);

    const data = {
      username: username,
      password: password,
      idRole: selectedRole,
    };

    try {
      const ip = sessionStorage.getItem('ip');
      const port = sessionStorage.getItem('puerto');
      const response = await fetch(`http://${ip}:${port}/auth/register`, {
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

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className='login-div'>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 login-container" >
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="role">Rol:</label>
                <select
                  className="form-control custom-input"
                  id="role"
                  value={selectedRole}
                  onChange={handleRoleChange}
                  required
                >
                  <option value="">Seleccionar Rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.roleName}</option>
                  ))}
                </select>
              </div>
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
                <div className="password-conditions">
                  <p>Condiciones de contraseña:</p>
                  <ul>
                    <li>
                      {passwordConditions.length ? 
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success" /> : 
                        <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
                      }
                      {passwordConditions.length ? 'Longitud mínima de 8 caracteres' : 'Longitud mínima de 8 caracteres (no cumplido)'}
                    </li>
                    <li>
                      {passwordConditions.uppercase ? 
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success" /> : 
                        <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
                      }
                      {passwordConditions.uppercase ? 'Al menos una mayúscula' : 'Al menos una mayúscula (no cumplido)'}
                    </li>
                    <li>
                      {passwordConditions.number ? 
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success" /> : 
                        <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
                      }
                      {passwordConditions.number ? 'Al menos un número' : 'Al menos un número (no cumplido)'}
                    </li>
                    <li>
                      {passwordConditions.symbol ? 
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success" /> : 
                        <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
                      }
                      {passwordConditions.symbol ? 'Al menos un símbolo' : 'Al menos un símbolo (no cumplido)'}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                <div className="password-cont password-input-container">  
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control custom-input"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  <div className='eye-icon'>
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} onClick={toggleShowConfirmPassword} className="toggle-password-icon" />
                  </div>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-block">
                {loading ? 'Cargando...' : 'Registrar'}
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
                    <p>Las contraseñas no coinciden o los datos ingresados son incorrectos. Por favor, inténtalo de nuevo.</p>
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

export default Register;
