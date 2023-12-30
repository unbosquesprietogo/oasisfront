import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; // Asegúrate de tener 'react-bootstrap' instalado

function CategorySelect({ onCategoryChange, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleNewCategory = async () => {
    if (!newCategoryName) return;
    try {
      const response = await axios.post('http://localhost:8080/api/v1/categories', { name: newCategoryName });
      const newCategory = response.data;
      setCategories([...categories, newCategory]);
      onCategoryChange(newCategory);
      setNewCategoryName('');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding new category:', error);
    }
  };

  return (
    <>
    <div>
    <Button 
      variant="outline-secondary"
      className=''
      onClick={() => setShowModal(true)}
      style={{ margin: "10px 0" }} // Esto agrega 10px de margen arriba y abajo
    >
      Añadir Categoría
    </Button>

      <select
        className="form-control"
        value={selectedCategory?.id || ''}
        onChange={(e) => onCategoryChange(categories.find(cat => cat.id === Number(e.target.value)))}
        style={{ margin: "10px 0" }}
      >
        <option value="">Seleccione una categoría</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nombre de la categoría"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleNewCategory}>
            Guardar Categoría
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CategorySelect;
