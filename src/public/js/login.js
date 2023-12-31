const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch(`${process.env.PATHAPI}/login`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async result => {
        if (result.status === 201) {
            // Realizar algún trabajo adicional si es necesario
            // ...
            // Redirigir a la página de inicio de sesión después del trabajo adicional
            window.location.replace('/profile');
        } else if (result.status === 400) {
            // Manejar el caso de usuario ya existente
            console.log(await result.text()); // Mostrar el mensaje del servidor
        } else {
            // Manejar otros códigos de estado si es necesario
            console.log(`Error en el servidor: ${result.status}`);
        }
    }).catch(error => {
        console.error('Error en la solicitud fetch:', error);
    });
});
