const socket = io();

/* const form = document.getElementById('myForm');
// Agrega un manejador de eventos para el evento de envío del formulario
form.addEventListener('submit', function(event) {
    // Previene el comportamiento predeterminado de envío del formulario
    event.preventDefault();

}); */

let listaProductos = document.getElementById('listaProductos');
let crearBtn = document.getElementById('crearSend');
let title = document.getElementById('crearTitle');

let eliminarId = document.getElementById('eliminarId')
let eliminarBtn = document.getElementById('eliminarSend')

crearBtn.addEventListener('click', () => {
    console.log(title.value)
    socket.emit('crearProducto', { title: title.value })
    title.value = ''
});

eliminarBtn.addEventListener('click', () => {
    console.log(eliminarId.value)
    socket.emit('eliminarProducto', eliminarId.value)
    eliminarId.value = ''
})

socket.on('actualizarProductos', (data) => {
    let html = '';

    data.forEach(element => {
        html += `
            <h3>Producto: ${element.title}</h3>
            <p>Id: ${element.id}</p>
            <br>
        `;
    });
    listaProductos.innerHTML = html;
})