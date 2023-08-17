const fs = require('fs')
let path = './archivos/products.json'

class ProductManager {
    constructor() {
        this.products = [];
        this.path = path;
    }

//MÉTODO PARA OBTENER PRODUCTOS------------------------------------------------------------------------------------------

    async getProducts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        } else return []
    }

//MÉTODO PARA AÑADIR PRODUCTOS-------------------------------------------------------------------------------------------

    async addProduct(title, description, price, thumbnail, code, stock) {
        let newProduct = { title, description, price, thumbnail, code, stock }

        if (this.products.length === 0) {
            newProduct.id = 1
        } else {
            newProduct.id = this.products[this.products.length - 1].id + 1
        }

        this.products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products))
    }

//MÉTODO PARA OBTENER PRODUCTOS POR ID-----------------------------------------------------------------------------------

    async getProductsById(idProduct) {
        if (!Number.isInteger(idProduct)) {
            console.log(`El ID del producto debe ser un número entero.`);
            return null;
        }

        if (fs.existsSync(this.path)) {
            const productsData = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
            const foundProduct = productsData.find(product => product.id === idProduct);

            if (foundProduct) {
                console.log(`Producto encontrado con ID ${idProduct}.`);
                return foundProduct; // Devolver el objeto completo del producto encontrado
            } else {
                console.log(`No se encontró ningún producto con ID ${idProduct}.`);
                return null;
            }
        } else {
            console.log(`No existe el archivo de productos.`);
            return null;
        }
    }

//MÉTODO PARA ACTUALIZAR PRODUCTOS---------------------------------------------------------------------------------------

    async updateProducts(idProduct, newStock) {
        let indexToUpdate = this.products.findIndex(product => product.id === idProduct);

        if (indexToUpdate === -1) {
            console.log(`El producto con ID ${idProduct} no existe.`);
            return;
        }

        this.products[indexToUpdate].stock = newStock;
        await this.saveProductsToFile(); // Llamamos al método para guardar productos en el archivo
        console.log(`Stock del producto con ID ${idProduct} actualizado a ${newStock}.`);
    }

    async saveProductsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log('Productos guardados en el archivo.');
        } catch (error) {
            console.error('Error al guardar los productos en el archivo:', error);
        }
    }

//MÉTODO PARA BORRAR PRODUCTOS-------------------------------------------------------------------------------------------

    async deleteProduct(idProduct) {
        if (!Number.isInteger(idProduct)) {
            console.log(`El ID del producto debe ser un número entero.`);
            return;
        }

        if (fs.existsSync(this.path)) {
            const productsData = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
            const productIndex = productsData.findIndex(product => product.id === idProduct);

            if (productIndex !== -1) {
                productsData.splice(productIndex, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(productsData, null, 2));
                console.log(`Producto con ID ${idProduct} eliminado.`);
            } else {
                console.log(`No se encontró ningún producto con ID ${idProduct}.`);
            }
        } else {
            console.log(`No existe el archivo de productos.`);
        }
    }

}

//VARIABLE PARA INSTANCIAR DE MANERA ASÍNCRONA AL PROGRAMA---------------------------------------------------------------
const entorno = async () => {
    let path = './archivos/products.json'
    const manager = new ProductManager(path);

    await manager.addProduct('Producto1', 'Lorem', 100, '/img', 1, 5)
    await manager.addProduct('Producto2', 'Lorem Ipsum ', 150, '/img2', 2, 5)
    await manager.addProduct('Producto3', 'Lorem Ipsum Lorem', 200, '/img', 3, 5)
    await manager.addProduct('Producto4', 'Lorem Ipsum Lorem Ipsum', 300, '/img2', 4, 5)

    await manager.getProducts()


}

//entorno()

//export default ProductManager
