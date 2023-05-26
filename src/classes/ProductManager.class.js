import fs from 'fs'
import { v4 as uuidV4 } from 'uuid'

const path = 'src/classes/files/products.json'

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
        const productos = await this.consultarProductos();
        info.id = uuidV4();
        productos.push(info);
        await fs.promises.writeFile(path, JSON.stringify(productos,null,'\t'));
        return info
    };


    borrarProductos = async (id) => {
        const productos = await this.consultarProductos();
        const productoBorrado = productos.find((producto) => producto.id == id);
    
        if (!productoBorrado) {
            return null;
        }
    
        const productosFiltrados = productos.filter((producto) => producto.id != id);
        await fs.promises.writeFile(path, JSON.stringify(productosFiltrados, null, '\t'));
        return productoBorrado;
    };
    
/*     borrarProductos = async(id) => {
        const productos = await this.consultarProductos()
        const productosFiltrados = productos.filter((producto)=>{
            return producto.id != id
        })
        await fs.promises.writeFile(path, JSON.stringify(productosFiltrados,null,'\t'))
    }; */

    consultarProductoPorId = async(id) => {
        const productos = await this.consultarProductos()
        const productoBuscado = productos.find((producto)=>{
            return producto.id == id
        })
        return productoBuscado ? productoBuscado : 'Producto no encontrado'
    }

    actualizarProducto = async (id, camposActualizados) => {
        let productos = await this.consultarProductos();
        const indice = productos.findIndex((producto) => producto.id === id);
        if (indice === -1) {
            return 'Producto no encontrado';
        }
        productos[indice] = {
            ...productos[indice],
            ...camposActualizados
        };
    
        await fs.promises.writeFile(path, JSON.stringify(productos, null, '\t'));
    
        return productos[indice];
    };
}