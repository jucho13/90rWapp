const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch('/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async result => {
        console.log(result.status);
        const response = await result.json(); // Parsear el cuerpo de la respuesta JSON

        if (result.status === 200) {
            // Autenticación exitosa
            console.log(response.message); // Mensaje del servidor
            window.location.replace('/profile');
        } else if (result.status === 401) {
            // Credenciales inválidas
            console.log(response.message); // Mensaje del servidor
        } else {
            // Manejar otros códigos de estado si es necesario
            console.log(`Error en el servidor: ${result.status}`);
        }
    })
    .catch(error => {
        // Manejo de errores generales de la solicitud fetch
        console.error('Error en la solicitud fetch:', error);
    });
});
