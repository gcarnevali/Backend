function generateMockProducts() {
    const products = [];
    for (let i = 1; i <= 100; i++) {
      products.push({
        id: i,
        title: `Producto ${i}`,
        price: Math.floor(Math.random() * 1000),
      });
    }
    return products;
  }

  function mockProductDAO() {
    return {
      getProducts: () => generateMockProducts(),
      getProductById: (id) => {
        if (id === 1) {
          return { id: 1, title: 'Producto 1', price: 100 };
        } else if (id === 2) {
          return { id: 2, title: 'Producto 2', price: 50 };
        } else {
          return null;
        }
      },
      addProduct: (product) => {
        // Simula la creación del producto en la base de datos
        console.log(`Se creó el producto ${product.title}`);
      },
      updateProduct: (product) => {
        // Simula la actualización del producto en la base de datos
        console.log(`Se actualizó el producto ${product.title}`);
      },
      deleteProduct: (id) => {
        // Simula la eliminación del producto en la base de datos
        console.log(`Se eliminó el producto con ID ${id}`);
      },
    };
  }

  module.exports = { generateMockProducts, mockProductDAO };