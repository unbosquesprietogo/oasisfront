import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Row, Col, Form } from 'react-bootstrap';


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const [editingProductId, setEditingProductId] = useState(null);
    const [editingDetailId, setEditingDetailId] = useState(null);

    const [editedProduct, setEditedProduct] = useState({});
    const [editedDetail, setEditedDetail] = useState({});


    const handleEditProduct = (productId) => {
        const productToEdit = products.find(p => p.id === productId);
        setEditedProduct({ ...productToEdit });
        setEditingProductId(productId);
    };
    
    const handleSaveProduct = async (productId) => {
        console.log('product', editedProduct);
        try {
            await axios.put(`http://localhost:8080/api/v1/products/${productId}`, editedProduct);
            
            // Actualizar el estado local
            setProducts(products.map(product => {
                if (product.id === productId) {
                    return { ...product, ...editedProduct };
                }
                return product;
            }));
    
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
        setEditingProductId(null);
    };
    
    
    const handleSaveDetail = async (detailId) => {
        console.log('detail', editedDetail);
        try {
            await axios.put(`http://localhost:8080/api/v1/products/detail/${detailId}`, editedDetail);
           
            // Actualizar el estado local
            setProducts(products.map(product => {
                return {
                    ...product,
                    productDetails: product.productDetails.map(detail => {
                        if (detail.id === detailId) {
                            return { ...detail, ...editedDetail };
                        }
                        return detail;
                    })
                };
            }));
    
        } catch (error) {
            console.error('Error al actualizar el detalle:', error);
        }
        setEditingDetailId(null);
    };
    
    
    
    const handleEditDetail = (detailId) => {

        const detailToEdit = findDetailById(detailId);
        setEditedDetail({ ...detailToEdit });
        setEditingDetailId(detailId);
    };
    
    
    const findDetailById = (detailId) => {
        for (let product of products) {
            for (let detail of product.productDetails) {
                if (detail.id === detailId) {
                    return detail;
                }
            }
        }
        return null; 
    };
    

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };

        fetchProducts();
    }, []);


    const toggleDetails = (productId) => {
        setSelectedProductId(selectedProductId === productId ? null : productId);
    };

    const getTotalQuantity = (productDetails) => {
        return productDetails.reduce((total, detail) => total + parseInt(detail.quantity), 0);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sizeFilter, setSizeFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');

    const filteredProducts = products.filter(product => {
        return (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!categoryFilter || product.category.name.toLowerCase().includes(categoryFilter.toLowerCase())) &&
            (!sizeFilter || product.productDetails.some(detail => detail.size.toLowerCase().includes(sizeFilter.toLowerCase()))) &&
            (!colorFilter || product.productDetails.some(detail => detail.color.toLowerCase().includes(colorFilter.toLowerCase())))
        );
    });

    const styles = {
        actionsColumn: {
            width: '25%' 
        },
        otherColumns: {
            width: '9%' 
        }
    };
    

    const renderProductDetails = (product) => {
        if (selectedProductId === product.id) {
            // Filtrar los detalles del producto según los filtros de talla y color
            const filteredDetails = product.productDetails.filter(detail => {
                return (!sizeFilter || detail.size.toLowerCase().includes(sizeFilter.toLowerCase())) &&
                       (!colorFilter || detail.color.toLowerCase().includes(colorFilter.toLowerCase()));
            });
    
            return (
                <tr>
                    <td colSpan="6">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Talla</th>
                                    <th>Color</th>
                                    <th>Cantidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDetails.map((detail, index) => (
                                    <tr key={index}>
                                        <td style={styles.otherColumns}>{detail.id}</td>
                                        <td style={styles.otherColumns}>
                                            {editingDetailId === detail.id ? (
                                                <input 
                                                    type="text" 
                                                    defaultValue={detail.size} 
                                                    onChange={(e) => setEditedDetail({ ...editedDetail, size: e.target.value })}
                                                />
                                            ) : (
                                                detail.size
                                            )}</td>
                                        <td style={styles.otherColumns}>
                                            {editingDetailId === detail.id ? (
                                                <input 
                                                    type="text" 
                                                    defaultValue={detail.color} 
                                                    onChange={(e) => setEditedDetail({ ...editedDetail, color: e.target.value })}
                                                />
                                            ) : (
                                                detail.color
                                            )}
                                        </td>
                                        <td style={styles.otherColumns}>
                                            {editingDetailId === detail.id ? (
                                                <input 
                                                    type="number" 
                                                    defaultValue={detail.quantity} 
                                                    onChange={(e) => setEditedDetail({ ...editedDetail, quantity: e.target.value })}
                                                />
                                            
                                            ) : (
                                                detail.quantity
                                            )}
                                        </td>
                                        <td style={styles.actionsColumn}>
                                            {editingDetailId === detail.id ? (
                                                <div className="btn-group" role="group">
                                                    <Button variant="primary" onClick={() => handleSaveDetail(detail.id)}>
                                                        Guardar
                                                    </Button>
                                                    <Button variant="secondary" onClick={() => setEditingDetailId(null)}>
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="btn-group" role="group">
                                                    <Button variant="dark" onClick={() => handleEditDetail(detail.id)}>
                                                        Editar Detalle
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </td>
                </tr>
            );
        }
    };    

    return (
        <Container className="mt-5">
            <h1 className="mb-4">Lista de Productos</h1>
            <Row className="mb-3">
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Filtrar por categoría..."
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                </Col>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Filtrar por talla..."
                        value={sizeFilter}
                        onChange={(e) => setSizeFilter(e.target.value)}
                    />
                </Col>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Filtrar por color..."
                        value={colorFilter}
                        onChange={(e) => setColorFilter(e.target.value)}
                    />
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>ID</th>
                        <th>Categoría</th>
                        <th>Nombre</th> 
                        <th>Precio</th>
                        <th>Cantidad Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <React.Fragment key={product.id}>
                            <tr onClick={() => toggleDetails(product.id)}>
                                <td>{product.id}</td>
                                <td>{product.category.name}</td>
                                <td>
                                    {editingProductId === product.id ? (
                                        <input 
                                            type="text" 
                                            defaultValue={product.name} 
                                            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                                        />                                    
                                    ) : (
                                        product.name
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product.id ? (
                                        <input 
                                            type="text" 
                                            defaultValue={product.price} 
                                            onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                                        /> 
                                    ) : (
                                        product.price
                                    )}
                                </td>
                                <td>{getTotalQuantity(product.productDetails)}</td>
                                <td>
                                {editingProductId === product.id ? (
                                    <div className="btn-group" role="group" >
                                        <Button variant='success' onClick={() => handleSaveProduct(product.id)}>Guardar</Button>
                                        <Button variant='danger' onClick={() => setEditingProductId(null)}>Cancelar</Button>
                                    </div>
                                ) : (
                                    <Button onClick={() => handleEditProduct(product.id)}>Editar</Button>
                                )}

                                </td>
                            </tr>
                            {renderProductDetails(product)}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ProductList;