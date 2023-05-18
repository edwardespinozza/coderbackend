import fs from 'fs'

const path = 'src/classes/files/productos.json'

export default class ProductsManager {
    consultarProductos = async(limit) => {
        if(fs.existsSync(path)) {
            const data = await fs.promises.readFile(path, 'utf-8')
            const productos = JSON.parse(data)
            return productos.slice(0, limit);
        } else {
            return []
        }
    };

    crearProductos = async(info) => {
        const productos = await this.consultarProductos()
        if(productos.length==0) {
            info.id = 1
        } else {
            info.id = productos[productos.length-1].id + 1
        }
        productos.push(info)
        await fs.promises.writeFile(path, JSON.stringify(productos,null,'\t')) 
    };

    borrarProductos = async(id) => {
        const productos = await this.consultarProductos()
        const productosFiltrados = productos.filter((producto)=>{
            return producto.id != id
        })
        await fs.promises.writeFile(path, JSON.stringify(productosFiltrados,null,'\t'))
    };

    consultarProductoPorId = async(id) => {
        const productos = await this.consultarProductos()
        const productoBuscado = productos.find((producto)=>{
            return producto.id == id
        })
        return productoBuscado ? productoBuscado : 'Producto no encontrado'
    }
}