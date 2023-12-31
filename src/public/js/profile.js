const socketCliente = io();

// // socketCliente.on("all-products", (products) => {
// //   console.log(products);
// //   updateProductList(products);
// // });
let btnCart= document.getElementById('cart');
let cartID;
btnCart.addEventListener('click', async () => {
  cartID=await getCartID();
  try {
    const response = await fetch('/ticket', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
      },
      body: JSON.stringify({ cartID}),
    });
  
    if (response.ok) {
      const responseData = await response.json();
      if (responseData) {
        console.log('exito', responseData);
        return responseData;
      } else {
        console.error('Respuesta JSON vacía o inválida.');
        return null;
      }
    } else {
      console.error('Error.');
      return null;
    }
  }
  catch(error){
    console.log(error);
  }
})
async function mostrarTicket(cartID){
  try {
    const response = await fetch('/ticket/${cartID}', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener el ticket ');
    }

    const ticket = await response.json();
    return ticket;
  } catch (error) {
    console.error(error);
    return null;
  }
}
function updateProductList (productLista) {
  if (!Array.isArray(productLista.payload)) {
    console.log(productLista);
    // Si productLista no es un arreglo, muestra un mensaje de error o realiza el manejo adecuado.
    console.error('productLista no es un arreglo válido');
    return;
  }
    let div = document.getElementById("producto");
    let productos = "";
  
    productLista.payload.forEach((product) => {
      productos += `
        <article>
          <div>
            <div>
              <img src="${product.thumbnail}" />
            </div>
            <div>
              <h2>${product.title}</h2>
              <div>
                <p>${product.description}</p>
              </div>
              <div>
                <p>US$${product.price}</p>
              </div>
              <div>
                <button class="btnAddProduct" data-product-id="${product._id}">Agregar al carrito</button>
              </div>
              <div>
                <button class="btnVerMas" data-product-id="${product._id}">VER MAS...</button>
              </div>
            </div>
          </div>
        </article>`;
    });
  
  div.innerHTML = productos;
   
}
// const btnsAddProdtoCart = document.querySelectorAll(".btnAddProduct"); 
// console.log(btnsAddProdtoCart);
// btnsAddProdtoCart.forEach( (boton) => {
//     boton.addEventListener('click', (evt) => {
//       // console.log(btnAddProdtoCart);
//       const productoId = evt.target.id; // Obtén el ID del botón
//       const cartID = getCartID();
//       console.log(productoId);
//       const cartID2 = cartID.match(/"([^"]+)"/)[1];
//       console.log(cartID);
//       const nuevoProd= agregarAlCarrito(cartID2, productoId); // Espera a que se complete la operación
//       console.log(nuevoProd);
//       alert('producto agregado');
//     });
//   });


// socketCliente.on("all-products", (products) => {
//   console.log(products);
//   updateProductList(products);
// });

// function agregarAlCarrito(idCart, id) {
//   socketCliente.emit('agregarProducto', idCart, id);
// }
const btnUsers= document.getElementById("btnUsers");
const btnAdmin= document.getElementById("btnAdmin");
async function getCookie(name) {
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

btnAdmin.addEventListener('click', async () =>{
  await fetGetAdminView();
})

async function getCartID() {
  const id = await getCookie('cart');
  return id;
}
btnUsers.addEventListener('click', async () => {
  await fetchGetUsers();
})
async function obtenerProductos() {
  try {
    const response = await fetch('/api/productss', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }

    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function agregarProductoAlCarrito(cartID, productoID) {
  try {
    const response = await fetch('/api/cart/productsput', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
      },
      body: JSON.stringify({cartID, productoID}),
    });
  
    if (response.ok) {
      const responseData = await response.json();
      if (responseData) {
        console.log('Producto agregado al carrito exitosamente.', responseData);
        return responseData;
      } else {
        console.error('Respuesta JSON vacía o inválida.');
        return null;
      }
    } else {
      console.error('Error al agregar el producto al carrito.');
      return null;
    }
  }
  catch(error){
    console.log(error);
  }
}
async function fetchGetUsers() {
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
      },
    });
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }

    // Si la respuesta es exitosa, redirige a la nueva ubicación
    window.location.href = '/api/users';
  }
  catch(error){
    console.log(error);
  }
}
async function fetGetAdminView () {
  try {
    const response = await fetch('/api/users/admin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
      },
    });
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }

    // Si la respuesta es exitosa, redirige a la nueva ubicación
    window.location.href = '/api/users/admin';
  }
  catch(error){
    console.log(error);
  }
}

// async function inicializar() {
//   try {
//     const productos = await obtenerProductos();
//   if (productos) {
//     await updateProductList(productos);
//     const btnsAddProdtoCart = document.querySelectorAll(".btnAddProduct");
//     console.log(btnsAddProdtoCart);

//     btnsAddProdtoCart.forEach((boton) => {
//       boton.addEventListener('click', async (evt) => {
//         const productoId = evt.target.getAttribute('data-product-id'); // Obtén el ID del producto desde el atributo de datos
//         const cartID = getCartID();
//         console.log(productoId);

//         if (cartID) {
//           const cartID2 = cartID.match(/"([^"]+)"/)[1];
//           console.log(cartID2);
//           const nuevoProd = await agregarProductoAlCarrito(cartID2, productoId);
//           console.log(nuevoProd);
//           alert('Producto agregado');
//         } else {
//           console.error('No se pudo obtener el cartID.');
//         }
//       });
//     });
//   } else {
//     console.error('No se pudieron obtener los productos.');
//   }
// }
  
//    catch (error) {
//     console.log(error);  
//   }
// }  
// inicializar();
async function inicializar() {
  try {
    const productos = await obtenerProductos();
    if (productos) {
      await updateProductList(productos);
      const btnsAddProdtoCart = document.querySelectorAll(".btnAddProduct");
      console.log(btnsAddProdtoCart);

      btnsAddProdtoCart.forEach((boton) => {
        boton.addEventListener('click', async (evt) => {
          const productoId = evt.target.getAttribute('data-product-id'); // Obtén el ID del producto desde el atributo de datos
          const cartID = await getCartID();
          console.log(productoId);

          if (cartID && typeof cartID === 'string') {
            const cartID2 = cartID.match(/"([^"]+)"/);
            const nuevoProd = await agregarProductoAlCarrito(cartID2 ? cartID2[1] : cartID, productoId);
            console.log(nuevoProd);
            alert('Producto agregado');
          } else {
            console.error('No se pudo obtener el cartID o no es una cadena válida.');
          }
        });
      });
    } else {
      console.error('No se pudieron obtener los productos.');
    }
  } catch (error) {
    console.log(error);
  }
}

inicializar();





