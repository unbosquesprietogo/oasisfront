import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/SectionUnavailable.css';

const Config = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 section-unavailable">
          <h2>Esta sección aún no está disponible</h2>
          <p>Lo sentimos, la página que estás buscando aún no está lista. Por favor, vuelve más tarde.</p>
        </div>
      </div>
    </div>
  );
};

export default Config;