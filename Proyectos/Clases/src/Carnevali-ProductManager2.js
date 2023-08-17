const fs = require('fs')
let path = './archivos/products.json'

class ProductManager {
    constructor() {//Declaracion de constructor con un array vacio y una ruta hacia los archivos json
        this.products = [];
        this.path = path;
    }

//MÉTODO PARA OBTENER PRODUCTOS------------------------------------------------------------------------------------------

    async getProducts() {//Si declaro async, utilizo await en el return
        if (fs.existsSync(this.path)) {//Aca puede ir this.path o la ruta al archivo .json
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))//JSON.parse(fs.promises.readFile("RUTA AL .JSON" y 'utf-8'))
        } else return []
    }

//MÉTODO PARA AÑADIR PRODUCTOS-------------------------------------------------------------------------------------------

    async addProduct(title, description, price, thumbnail, code, stock) {//Le paso los parametros al metodo para cuando necesite instanciarlo
        let newProduct = { title, description, price, thumbnail, code, stock }//Declaracion de newProduct para trabajar el condicional

        if (this.products.length === 0) {
            newProduct.id = 1
        } else {
            newProduct.id = this.products[this.products.length - 1].id + 1
        }

        this.products.push(newProduct)//Pushear newProduct al array products
        await fs.promises.writeFile(this.path, JSON.stringify(this.products))//Escribir en el archivo .json los nuevos products 
    }

//MÉTODO PARA OBTENER PRODUCTOS POR ID-----------------------------------------------------------------------------------

    async getProductsById(idProduct) {
        if (!Number.isInteger(idProduct)) {
            console.log(`El ID del producto debe ser un número entero.`);
            return null;
        }

        if (fs.existsSync(this.path)) {//Declaro que parametro voy a utilizar para el condicional. En este caso corroboro con fs si existe un archivo en this.path(ruta .json)
            const productsData = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));//Convierto el archivo en formato objeto para leerlo 
            const foundProduct = productsData.find(product => product.id === idProduct);//Filtro por ID

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
        let indexToUpdate = this.products.findIndex(product => product.id === idProduct);//Instancio una variable que me permite seleccionar un producto a traves de su id con this.products

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
