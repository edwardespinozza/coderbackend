const addToCartButtons = document.querySelectorAll('button[data-id]');

addToCartButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
    const productId = event.target.getAttribute('data-id');

    const response = await fetch(`/carts/64928782d7573f0d9c5df17c/products/${productId}`, {
        method: 'POST',
    });

    if (response.ok) {
        console.log('Producto agregado al carrito');
    } else {
        console.error('Error al agregar el producto al carrito');
    }
    });
});
