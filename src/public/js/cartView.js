const socketCliente = io();

const btnTicket= document.getElementById('verTicket');
console.log(`btnTicket${btnTicket}`);
const cart= document.getElementById('cart');
let cartProducts;
socketCliente.on('recibirCart', async (cart)=>{
  console.log(cart);
  await mostrarCart(cart);
})
const mostrarCart= async (cart1) => {
    console.log(cart1);
    let productos = "";
    cart1.products.forEach(product => {
    productos += `
        <article>
          <div>
            <h2>${product.productId}</h2>
            <p>CANTIDAD:${product.quantity}</p>
          </div>
        </article>
        `;
    });
  
  cart.innerHTML = productos;
        
};


function getCookie(name) {
  const cookieString = document.cookie;
  console.log(cookieString);
  const cookies = cookieString.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null; // La cookie no fue encontrada
}
function getCartID() {
  const id = getCookie('cart');
  console.log(id);
  return id;
}
const userCart=getCartID();
const match = userCart.match(/"([^"]+)"/);
let valorDeseado;
if (match && match[1]) {
  valorDeseado = match[1];
  console.log(valorDeseado); 
} else {
  console.log("No se encontró ningún valor en el formato esperado.");
}
btnTicket.addEventListener('click', async ()=>{
  try {
    console.log('aiuda');
    const response = await fetch(`/ticket/vista`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
      },
      body: JSON.stringify({valorDeseado: valorDeseado}),
      headers: {
        'Content-Type': 'application/json'
      }
    })}
    catch (error) {
       console.log(error);
    }
})
console.log(valorDeseado);
socketCliente.emit('solicitudDeCart', valorDeseado);


// try {
//     const response = await fetch('/ticket', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
//       },
//       body: JSON.stringify({ cartID}),
//     });
  
//     if (response.ok) {
//       const responseData = await response.json();
//       if (responseData) {
//         console.log('Ticket creado exitosamente.', responseData);
//         await mostrarTicket(cartID);
//         return responseData;
//       } else {
//         console.error('Respuesta JSON vacía o inválida.');
//         return null;
//       }
//     } else {
//       console.error('Error al agregar el producto al carrito.');
//       return null;
//     }
//   }
//   catch(error){
//     console.log(error);
//   }




