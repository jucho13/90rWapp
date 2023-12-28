
const btnTicket= document.getElementById('verTicket');

async function getCookie(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

async function getCartID() {
  const id = await getCookie('cart');
  return id;
}

async function main() {
  const userCart = await getCartID();

  const match = userCart.match(/"([^"]+)"/);
  let valorDeseado;
  if (match && match[1]) {
    valorDeseado = match[1];
    console.log(valorDeseado);
  } else {
    console.log("No se encontró ningún valor en el formato esperado.");
  }
}

main();

btnTicket.addEventListener('click', async () => {
  try {
    const response = await fetch("/ticket/vistas", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }
    else{
      window.location.href = '/ticket/vistas';
    }

  } catch (error) {
    console.log(error);
  }
});



