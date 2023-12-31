const btnModificarUser = document.querySelectorAll(".btnModificarRol");
const btnEliminarUser = document.querySelectorAll(".btnEliminarUser");

btnModificarUser.forEach((boton) => {
    boton.addEventListener('click', async (evt) => {
        const email = evt.target.getAttribute('id');
        const status = evt.target.getAttribute('status');
        await modificarUser(email,status);
    }) 
})   
btnEliminarUser.forEach((boton) => {
    boton.addEventListener('click', async (evt) => {
        const email = evt.target.getAttribute('id');
        await eliminarUser(email);
    }) 
})

async function modificarUser (email,status) {
    try {
        const response = await fetch('/api/users/admin', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
          },
          body: JSON.stringify({email,status}),
        });
      
        if (response.ok) {
          const responseData = await response.json();
          if (responseData) {
            alert('Usuario ha sido modificado con exito');
            console.log('Usuario modificado exitosamente.', responseData);
            return responseData;
          } else {
            console.error('Respuesta JSON vacía o inválida.');
            return null;
          }
        } else {
          console.error('Error al intentar cambiar de status del usuario');
          return null;
        }
      }
      catch(error){
        console.log(error);
      }
}
async function eliminarUser (email) {
    try {
        const response = await fetch('/api/users/admin', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json', // Ajusta los encabezados según tus necesidades
          },
          body: JSON.stringify({email}),
        });
      
        if (response.ok) {
          const responseData = await response.json();
          if (responseData) {
            alert('Usuario ha sido eliminado con exito');
            console.log('Usuario eliminado exitosamente.', responseData);
            return responseData;
          } else {
            console.error('Respuesta JSON vacía o inválida.');
            return null;
          }
        } else {
          console.error('Error al intentar eliminar el usuario');
          return null;
        }
      }
      catch(error){
        console.log(error);
      }
}
