  import React, { useState} from 'react';
  import axios from 'axios';
  import CategorySelect from './CategorySelect'; 
  import '../assets/styles/Product.css';
  import Alert from './Alert';
  import { Modal, Button } from 'react-bootstrap';


  function CreateProduct() {

    const [product, setProduct] = useState({
      name: "",
      price: "",
      category: { id: "", name: "" },
      productDetails: []
    });

    const [showGlobalAddButtons, setShowGlobalAddButtons] = useState({ size: true, color: true, quantity:true });

    const formatNumberWithDots = (number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    
    const [alert, setAlert] = useState({ show: false, message: '' });

    const showAlert = (message) => {
      setAlert({ show: true, message });
    };

    const closeAlert = () => {
      setAlert({ show: false, message: '' });
    };

    const handleColorQuantityChange = (detailIndex, cqIndex, e) => {
      const newDetails = [...product.productDetails];
    
      // Si es la cantidad y es un valor negativo, lo establecemos a 0
      let value = e.target.value;
      if (e.target.name === 'quantity' && parseInt(value) < 0) {
        value = "0";
      }
    
      const newColorQuantity = { ...newDetails[detailIndex].colorQuantity[cqIndex], [e.target.name]: value };
      newDetails[detailIndex].colorQuantity[cqIndex] = newColorQuantity;
      setProduct({ ...product, productDetails: newDetails });
    };
    


    const addColorQuantityDetail = (detailIndex) => {
      const newDetails = [...product.productDetails];
      const newColorQuantities = [...newDetails[detailIndex].colorQuantity, { color: "", quantity: "1" }];
      newDetails[detailIndex].colorQuantity = newColorQuantities;
      newDetails[detailIndex].hideQuantityButton = true;
      newDetails[detailIndex].hideColor = false; 
      newDetails[detailIndex].hideAddButtons = false; 
      newDetails[detailIndex].hideAddColorButton = false;
      setProduct({ ...product, productDetails: newDetails });
    };
    
    const handleProductChange = (e) => {
      let { name, value } = e.target;
    
      if (name === 'price') {
        // Eliminar los puntos para obtener el valor numérico real
        let numericValue = value.replace(/\./g, '');
        // Aceptar solo números
        if (/^[0-9]*$/.test(numericValue)) {
          // Mantener el valor como cadena para el formato
          setProduct({ ...product, [name]: numericValue });
        }
      } else {
        setProduct({ ...product, [name]: value });
      }
    };
    
    
    

    const handleDetailChange = (detailIndex, e) => {
      const newDetails = [...product.productDetails];
      if (e.target.name === 'size') {
        newDetails[detailIndex] = { ...newDetails[detailIndex], [e.target.name]: e.target.value };
      } else {
        // Si es color o cantidad, actualizamos o creamos un nuevo objeto
        let colorQuantityIndex = newDetails[detailIndex].colorQuantity.findIndex(cq => cq.color === e.target.value || cq.quantity === e.target.value);

        if (colorQuantityIndex === -1) {
          // Si no existe, lo creamos
          colorQuantityIndex = newDetails[detailIndex].colorQuantity.length;
          newDetails[detailIndex].colorQuantity.push({ color: "", quantity: 1 });
        }

        newDetails[detailIndex].colorQuantity[colorQuantityIndex] = {
          ...newDetails[detailIndex].colorQuantity[colorQuantityIndex],
          [e.target.name]: e.target.value
        };
      }

      setProduct({ ...product, productDetails: newDetails });
    };

    const addQuantityDetail = (detailIndex) => {
      const newDetails = [...product.productDetails];
      if (!newDetails[detailIndex].colorQuantity) {
        newDetails[detailIndex].colorQuantity = [];
      }
      const newColorQuantities = [...newDetails[detailIndex].colorQuantity, { quantity: 1 }];
      newDetails[detailIndex].colorQuantity = newColorQuantities;
      newDetails[detailIndex].hideColor = true; // Oculta el campo de color
      newDetails[detailIndex].hideAddButtons = true; // Oculta los botones de añadir
      setProduct({ ...product, productDetails: newDetails });
    };
    

    const addNewSizeDetail = () => {
      setProduct({
        ...product,
        productDetails: [...product.productDetails, { size: "", colorQuantity: [], hideAddColorButton: false}]
      });
      setShowGlobalAddButtons({ ...showGlobalAddButtons, color: false, quantity: false });
    };
    
    const addColorDetail = () => {
      setProduct({
        ...product,
        productDetails: [
          ...product.productDetails, 
          { size: "", colorQuantity: [{ color: "", quantity: "" }], hideSize: true, hideAddColorButton: true, hideColor:false }
        ]
      });
      setShowGlobalAddButtons({ ...showGlobalAddButtons, size: false, quantity: false });
    };
    
    const addNewQuantity = () => {
      setProduct({
        ...product,
        productDetails: [
          ...product.productDetails, 
          { size: "", colorQuantity: [{ color: "", quantity: 1 }], hideSize: true, hideAddColorButton: true, hideColor:true }
        ]
      });
      setShowGlobalAddButtons({ ...showGlobalAddButtons, size: false, color: false, quantity: false });
      
    };
  

    const removeDetail = (index) => {
      const newDetails = [...product.productDetails];
      newDetails.splice(index, 1);
      setProduct({ ...product, productDetails: newDetails });
      if (newDetails.length === 0) {
        setShowGlobalAddButtons({ size: true, color: true, quantity:true });
      }
    };

    const saveProduct = () => {
      
      // Continuar con el procesamiento si pasa las validaciones
      const transformedProduct = {
        ...product,
        productDetails: product.productDetails.flatMap(detail =>
          detail.colorQuantity.length > 0 
          ? detail.colorQuantity.map(cq => ({
              size: detail.size || "",
              color: cq.color || "",
              quantity: cq.quantity || 1
            }))
          : [{ size: detail.size || "", color: "", quantity: 1 }] 
        )
      };
    
      if (transformedProduct.productDetails === '') {
        transformedProduct.productDetails = [{ 'quantity': 1, 'color': '', size: '' }];
      }
    
      // Enviar el producto a la API
      axios.post('http://localhost:8080/api/v1/products', transformedProduct)
    .then(response => {
      // Manejar la respuesta del servidor
      console.log(response.data);
      showAlert("Producto guardado con éxito!");
    })
    .catch(error => {
      // Manejar errores específicos aquí
      if (error.response) {
        if (error.response.status === 409) {
          showAlert("Error: Ese producto ya existe.");
        } else if (error.response.status === 500) {
          showAlert("Error interno del servidor al añadir el producto.");
        } else {
          showAlert("Error al guardar el producto.");
        }
      } else {
        // Para otros tipos de errores (ej. problemas de red)
        showAlert("Error al conectar con el servidor.");
      }
      console.error("Hubo un error al guardar el producto:", error);
    });
};
    
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
    // Verificar si el nombre, precio y categoría están establecidos
    if (!product.name.trim()) {
      showAlert("Por favor, ingresa el nombre del producto.");
      return;
    }
  
    else if (!product.price || isNaN(product.price)) {
      showAlert("Por favor, ingresa un precio válido para el producto.");
      return;
    }
  
    else if (!product.category.id.toString().trim()) {
      showAlert("Por favor, selecciona una categoría para el producto.");
      return;
    }else{setShowModal(true);}

    };
    const handleCloseModal = () => setShowModal(false);

    const handleSaveProduct = () => {
        handleCloseModal();
        saveProduct(); // Esta es tu función existente para guardar el producto
    };


    const handleCategoryChange = (category) => {
      setProduct({ ...product, category: category || { id: "", name: "" } });
    };
    

    return (
      
      <div className="product-container container mt-5">
        
        
        <div className="form-group">
          <h2
          className='title-product'
          >Añadir Producto
          </h2>
          <h5 htmlFor="category">Categoría</h5>
          <CategorySelect
            onCategoryChange={handleCategoryChange}
            selectedCategory={product.category}
          />
        </div>


        <div className="form-group">
          <h5 htmlFor="productName">Nombre del Producto</h5>
          <input
            type="text"
            className="form-control"
            id="productName"
            name="name"
            value={product.name}
            onChange={handleProductChange}
            placeholder="Ej: Uniforme de Enfermería, Zapatos Escolares..."
          />

        </div>

        <div className="form-group">
          <h5 htmlFor="price">Precio</h5>
          <input
            type="text"
            className="form-control"
            id="price"
            name="price"
            value={formatNumberWithDots(product.price)}
            onChange={handleProductChange}
            placeholder="Ej: 50000 (sin puntos ni comas)"
          />

        </div>
        
        {product.productDetails.map((detail, index) => (
          <div key={index} className="product-detail" style={{ backgroundColor: "#f0f0f0", padding: '10px', margin: '10px 0' }}>
            {(!detail.hideSize) && (
              <div className="form-group">
                <h5 htmlFor={`size-${index}`}>Talla</h5>
                <input
                  type="text"
                  className="form-control"
                  id={`size-${index}`}
                  name="size"
                  value={detail.size}
                  onChange={(e) => handleDetailChange(index, e)}
                  placeholder="Ej: M, L, 40, 42..."
                />

              </div>
            )}

            {detail.colorQuantity && detail.colorQuantity.map((cq, cqIndex) => (
              <div key={cqIndex} style={{border: '1px solid #ddd', padding: '5px', margin: '5px 0'}}>
                {(!detail.hideColor ) && (
                  <div className="form-group">
                    <h5 htmlFor={`color-${index}-${cqIndex}`}>Color</h5>
                    <input
                      type="text"
                      className="form-control"
                      id={`color-${index}-${cqIndex}`}
                      name="color"
                      value={cq.color}
                      onChange={(e) => handleColorQuantityChange(index, cqIndex, e)}
                      placeholder="Ej: Azul, Rojo, Verde..."
                    />

                  </div>
                )}
        
                <div className="form-group">
                  <h5 htmlFor={`quantity-${index}-${cqIndex}`}>Cantidad</h5>
                  <input
                    type="number"
                    className="form-control"
                    id={`quantity-${index}-${cqIndex}`}
                    name="quantity"
                    value={cq.quantity}
                    onChange={(e) => handleColorQuantityChange(index, cqIndex, e)}
                    placeholder="Ej: 10, 20, 30..."
                  />

                </div>
              </div>
            ))}

            <div className="title-product btn-group" role="group">
            {(!detail.hideAddButtons && !detail.hideAddColorButton)  && (
              <>
                <button type="button" className="btn btn-dark" onClick={() => addColorQuantityDetail(index)}>
                  Añadir Color
                </button>
                {!detail.hideQuantityButton && (
                  <button type="button" className="btn btn-dark" onClick={() => addQuantityDetail(index)}>
                    Añadir Cantidad
                  </button>
                )}
              </>
            )}
            <button type="button" className="btn btn-danger" onClick={() => removeDetail(index)}>
              Eliminar Detalle
            </button>
            </div>
          </div>
        ))}

        <div className="form-group">
          <h5 
          htmlFor="details"
          className='title-product'
          >Añadir Detalle:</h5>
          <div className="btn-group" role="group">
            {showGlobalAddButtons.size && (
              <button type="button" className="btn btn-dark" onClick={addNewSizeDetail}>
                Añadir Talla
              </button>
            )}
    
            {showGlobalAddButtons.color && (
              <button type="button" className="btn btn-dark" onClick={addColorDetail}>
                Añadir Color
              </button>
            )}
            {showGlobalAddButtons.quantity && (
              <button type="button" className="btn btn-dark" onClick={addNewQuantity}>
                Añadir Cantidad
              </button>
              )}
            <button type="button" className="btn btn-success" onClick={handleShowModal}>
              Guardar Producto
            </button>
            
          </div>
          <div
          className='alert-product'
          >{alert.show && <Alert message={alert.message} onClose={closeAlert} />}</div>
        </div>
        
        <div>
          <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Resumen del Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Nombre:</strong> {product.name}</p>
            <p><strong>Precio:</strong> {formatNumberWithDots(product.price)}</p>
            <p><strong>Categoría:</strong> {product.category.name}</p>
            <h5>Detalles:</h5>
            {product.productDetails.map((detail, index) => (
              <div key={index}>
                <p>Talla: {detail.size}</p>
                {detail.colorQuantity.map((cq, cqIndex) => (
                  <p key={cqIndex}>Color: {cq.color}, Cantidad: {cq.quantity}</p>
                ))}
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleSaveProduct}>
              Guardar Producto
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
      </div>
    );
  }

  export default CreateProduct;
