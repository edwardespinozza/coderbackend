const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(result => {
            if (result.status === 200) {
            console.log('Esto se imprime?');
            window.location.replace('/products');
            } else if (result.status === 400) {
                result.json().then(data => {
                    console.log('Mensaje de error:', data.message);
                    alert(data.message);
                });
            }
        })
        .catch(error => {
            console.log('Error en la solicitud:', error);
            alert('Error en la solicitud');
        });
});