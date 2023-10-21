// const socketCliente = io();

// // socketCliente.on("all-products", (products) => {
// //   console.log(products);
// //   updateProductList(products);
// // });

// function agregarAlCarrito (idCart,id) {
//   socketCliente.emit('agregarProducto', idCart, id);
// }


// function getCookie(name) {
//   const cookieString = document.cookie;
//   console.log(cookieString);
//   const cookies = cookieString.split('; ');
//   for (const cookie of cookies) {
//     const [cookieName, cookieValue] = cookie.split('=');
//     if (cookieName === name) {
//       return decodeURIComponent(cookieValue);
//     }
//   }
//   return null; // La cookie no fue encontrada
// }


// function getCartID(){
//   const id = getCookie('cart'); 
//   return id;
// } 

// const prod= fetch('/api/productss', {
//   method: 'GET', 
// })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Error al obtener los productos');
//     }
//     return response.json(); // Parsea la respuesta JSON
//   })
//   .then(productos => {
//     updateProductList(productos);
//     console.log(productos);
//   })
//   .catch(error => {
//     console.error(error);
//   })
//   function agregarAlCarrito(cartID, productoId) {
//     try {
//       const response = fetch('/api/cart', {
//         method: 'POST', 
//         headers: {
//           'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
//         },
//         body: JSON.stringify({ cartID, productoId }),
//       });
  
//       if (response.ok) {
//         console.log('Producto agregado al carrito exitosamente.');
//       } else {
//         console.error('Error al agregar el producto al carrito.');
//       }
//     } catch (error) {
//       console.error('Error en la solicitud Fetch:', error);
//     }
//   }

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
const socketCliente = io();

// socketCliente.on("all-products", (products) => {
//   console.log(products);
//   updateProductList(products);
// });

function agregarAlCarrito(idCart, id) {
  socketCliente.emit('agregarProducto', idCart, id);
}

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
  return id;
}

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

async function agregarProductoAlCarrito(cartID, productoId) {
  try {
    const response = await fetch('/api/cart/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
      },
      body: JSON.stringify({ cartID, productoId }),
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
        const cartID = getCartID();
        console.log(productoId);

        if (cartID) {
          const cartID2 = cartID.match(/"([^"]+)"/)[1];
          console.log(cartID2);
          const nuevoProd = await agregarProductoAlCarrito(cartID2, productoId);
          console.log(nuevoProd);
          alert('Producto agregado');
        } else {
          console.error('No se pudo obtener el cartID.');
        }
      });
    });
  } else {
    console.error('No se pudieron obtener los productos.');
  }
}
  
   catch (error) {
    console.log(error);  
  }
}  
inicializar();




