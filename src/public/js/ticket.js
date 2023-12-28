document.addEventListener('DOMContentLoaded', async () => {
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

        const ticketData = await response.json();

        // Llamar a la función para renderizar el ticket
        renderizarTicket(ticketData);
    } catch (error) {
        console.log(error);
    }
});

  
  function renderizarTicket(ticketData) {
    const ticketContainer = document.getElementById('ticket-container');
  
    // Crear elementos HTML
    const h3 = document.createElement('h3');
    h3.textContent = 'Datos del Ticket';
    ticketContainer.appendChild(h3);
  
    const h4 = document.createElement('h4');
    h4.textContent = `Mostrando el Ticket ${ticketData._id}`;
    ticketContainer.appendChild(h4);
  
    const hr = document.createElement('hr');
    ticketContainer.appendChild(hr);
  
    // Crear tabla para Datos del Ticket
    const tableDatosTicket = document.createElement('table');
    tableDatosTicket.className = 'table table-bordered table-striped';
  
    const tbodyDatosTicket = document.createElement('tbody');
  
    // Crear filas y celdas para Datos del Ticket
    const datosTicket = [
      { label: 'Fecha', value: ticketData.createdAt },
      { label: 'E-Mail del Usuario', value: ticketData.purchaser },
      { label: 'Importe', value: `$ ${ticketData.amount}` },
      { label: 'Código', value: ticketData.code },
    ];
  
    datosTicket.forEach((dato) => {
      const tr = document.createElement('tr');
  
      const tdLabel = document.createElement('td');
      tdLabel.textContent = dato.label;
      tr.appendChild(tdLabel);
  
      const tdValue = document.createElement('td');
      const strong = document.createElement('strong');
      strong.textContent = dato.value;
      tdValue.appendChild(strong);
      tr.appendChild(tdValue);
  
      tbodyDatosTicket.appendChild(tr);
    });
  
    tableDatosTicket.appendChild(tbodyDatosTicket);
    ticketContainer.appendChild(tableDatosTicket);
  
    // Crear tabla para Productos
    if (ticketData.products && ticketData.products.length > 0) {
      const tableProductos = document.createElement('table');
      tableProductos.className = 'table table-bordered table-striped';
  
      const theadProductos = document.createElement('thead');
      const trProductos = document.createElement('tr');
  
      // Crear encabezados para Productos
      const headersProductos = ['Código', 'Título', 'Descripción', 'Categoría', 'Precio Un', 'Cantidad'];
  
      headersProductos.forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        trProductos.appendChild(th);
      });
  
      theadProductos.appendChild(trProductos);
      tableProductos.appendChild(theadProductos);
  
      // Crear cuerpo de la tabla para Productos
      const tbodyProductos = document.createElement('tbody');
  
      // Crear filas y celdas para Productos
      ticketData.products.forEach((producto) => {
        const tr = document.createElement('tr');
  
        const cells = ['code', 'title', 'description', 'category', 'price', 'quantity'];
  
        cells.forEach((cell) => {
          const td = document.createElement('td');
          td.textContent = producto.product[cell];
          tr.appendChild(td);
        });
  
        tbodyProductos.appendChild(tr);
      });
  
      tableProductos.appendChild(tbodyProductos);
      ticketContainer.appendChild(tableProductos);
    }
  
    // Crear tabla para Productos no disponibles
    if (ticketData.notAvailableProducts && ticketData.notAvailableProducts.length > 0) {
      const tableNoDisponibles = document.createElement('table');
      tableNoDisponibles.className = 'table table-bordered table-striped';
  
      const theadNoDisponibles = document.createElement('thead');
      const trNoDisponibles = document.createElement('tr');
  
      // Crear encabezados para Productos no disponibles
      const headersNoDisponibles = ['Código', 'Título', 'Descripción', 'Categoría', 'Precio Un', 'Cantidad'];
  
      headersNoDisponibles.forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        trNoDisponibles.appendChild(th);
      });
  
      theadNoDisponibles.appendChild(trNoDisponibles);
      tableNoDisponibles.appendChild(theadNoDisponibles);
  
      // Crear cuerpo de la tabla para Productos no disponibles
      const tbodyNoDisponibles = document.createElement('tbody');
  
      // Crear filas y celdas para Productos no disponibles
      ticketData.notAvailableProducts.forEach((productoNoDisponible) => {
        const tr = document.createElement('tr');
  
        const cells = ['code', 'title', 'description', 'category', 'price', 'quantity'];
  
        cells.forEach((cell) => {
          const td = document.createElement('td');
          td.textContent = productoNoDisponible.notAvailableProduct[cell];
          tr.appendChild(td);
        });
  
        tbodyNoDisponibles.appendChild(tr);
      });
  
      tableNoDisponibles.appendChild(tbodyNoDisponibles);
      ticketContainer.appendChild(tableNoDisponibles);
    }
  }
  