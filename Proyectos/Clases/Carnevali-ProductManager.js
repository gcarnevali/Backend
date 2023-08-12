const fs = require('fs')
let path = './archivos/products.json'

class ProductManager {
    constructor() {
        this.products = [];
        this.path = path;
    }

    async getProducts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        } else return []
    }
    //TODO: Agregar un metodo para agregar el producto al array de products

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


    getProductsById(idProduct) {
        let indiceProducto = this.products.findIndex(product => product.id === idProduct)

        if (indiceProducto === -1) {
            console.log(`El producto ${idProduct} no existe`)
            return
        }

        return this.products[indiceProducto]
    }

}

const entorno = async () => {
    let path = './archivos/products.json'
    const manager = new ProductManager(path);

    await manager.addProduct('Producto1', 'Lorem', 100, '/img', 1, 5)
    await manager.addProduct('Producto2', 'Lorem Ipsum ', 150, '/img2', 2, 5)

    console.log(await manager.getProducts())

    console.log(manager.getProductsById(1))
    manager.getProductsById(3)

}

entorno()





/*getProductsById(idProduct) {
        try {
            const products = JSON.parse(data)
            const product = products.find(p => p.id === idProduct)

            if(product){
                return (idProduct)
            } else {
                return ('Producto no encontrado')
            }
        } catch (parseError) {
            return (parseError)
        }
    }*/