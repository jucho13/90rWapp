const btnClearUsers= document.getElementById('clearUsers');

btnClearUsers.addEventListener('click', async ()=>{
    
    try {
        const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json', 
        },
        });
  
        if (response.ok) {
            const responseData = await response.json();
        if (responseData) {
            console.log('exito', responseData);
            alert('Usuario/s eliminado/s');
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
const btnRefreshPage = document.getElementById('refreshPage');

btnRefreshPage.addEventListener('click', async () => {
  location.reload(); 
});