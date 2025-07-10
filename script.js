/* Seleccionar elementos de los formularios */
const formularioReserva = document.querySelector('.formulario form');
const formularioPago = document.querySelector('.pago form');
const entradaNumeroTarjeta = document.querySelector('#cardNumber');

/* Función para formatear el número de tarjeta en 4 grupos de 4 dígitos */
function formatearNumeroTarjeta(evento) {
    let valor = evento.target.value.replace(/\D/g, ''); // Eliminar no dígitos
    let formateado = '';
    
    for (let i = 0; i < valor.length; i += 4) {
        formateado += valor.slice(i, i + 4) + ' ';
    }
    
    evento.target.value = formateado.trim().slice(0, 19); // Limitar a 16 dígitos + 3 espacios
}

/* Función para validar los campos de un formulario */
function validarFormulario(formulario, campos) {
    let esValido = true;
    let mensajeError = '';

    campos.forEach(campo => {
        const entrada = formulario.querySelector(`[name="${campo.nombre}"]`);
        if (!entrada.value.trim()) {
            esValido = false;
            mensajeError += `${campo.etiqueta} es requerido.\n`;
        }
    });

    return { esValido, mensajeError };
}

/* Función para validar que la fecha no sea anterior a hoy */
function validarFechaCita(fecha) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establecer hora a 00:00 para comparar solo fechas
    const fechaSeleccionada = new Date(fecha);
    if (fechaSeleccionada < hoy) {
        return { esValido: false, mensajeError: 'La fecha de la cita no puede ser anterior a hoy.\n' };
    }
    return { esValido: true, mensajeError: '' };
}

/* Función para formatear la fecha en un formato legible (dd/mm/aaaa) */
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

/* Función para crear y mostrar el modal */
function mostrarModal(datos) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const contenidoModal = document.createElement('div');
    contenidoModal.style.backgroundColor = 'white';
    contenidoModal.style.padding = '20px';
    contenidoModal.style.borderRadius = '5px';
    contenidoModal.style.maxWidth = '400px';
    contenidoModal.style.textAlign = 'center';

    contenidoModal.innerHTML = `
        <h2>Reserva Confirmada (Simulada)</h2>
        <p><strong>Cliente:</strong> ${datos.nombre}</p>
        <p><strong>Servicio:</strong> ${datos.servicio}</p>
        <p><strong>Vehículo:</strong> ${datos.vehiculo}</p>
        <p><strong>Fecha:</strong> ${datos.fecha}</p>
        <p><strong>Tarjeta:</strong> ${datos.numeroTarjeta}</p>
        <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
    `;

    modal.appendChild(contenidoModal);
    document.body.appendChild(modal);
}

/* Añadir evento para formatear el número de tarjeta */
entradaNumeroTarjeta.addEventListener('input', formatearNumeroTarjeta);

/* Añadir evento para el envío del formulario de reserva */
formularioReserva.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Evitar que la página se recargue
    
    const campos = [
        { nombre: 'name', etiqueta: 'Nombre del cliente' },
        { nombre: 'service', etiqueta: 'Tipo de reparación' },
        { nombre: 'vehicle', etiqueta: 'Descripción del vehículo' },
        { nombre: 'date', etiqueta: 'Fecha de la cita' }
    ];
    
    const validacionFormulario = validarFormulario(formularioReserva, campos);
    
    if (!validacionFormulario.esValido) {
        alert(validacionFormulario.mensajeError);
        return;
    }
    
    // Validar la fecha
    const fechaInput = formularioReserva.querySelector('[name="date"]').value;
    const validacionFecha = validarFechaCita(fechaInput);
    if (!validacionFecha.esValido) {
        alert(validacionFecha.mensajeError);
        return;
    }
    
    // Habilitar el botón de pago si el formulario de reserva es válido
    formularioPago.querySelector('button').disabled = false;
});

/* Añadir evento para el envío del formulario de pago (simulado) */
formularioPago.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Evitar que la página se recargue
    
    const campos = [
        { nombre: 'cardNumber', etiqueta: 'Número de tarjeta' },
        { nombre: 'cardHolder', etiqueta: 'Nombre del titular' },
        { nombre: 'cvv', etiqueta: 'CVV' }
    ];
    
    const validacion = validarFormulario(formularioPago, campos);
    
    // Validar que el número de tarjeta tenga exactamente 16 dígitos
    if (entradaNumeroTarjeta.value.replace(/\D/g, '').length !== 16) {
        validacion.esValido = false;
        validacion.mensajeError += 'El número de tarjeta debe tener 16 dígitos.\n';
    }
    
    // Validar que el CVV tenga exactamente 3 dígitos
    if (!formularioPago.querySelector('[name="cvv"]').value.match(/^\d{3}$/)) {
        validacion.esValido = false;
        validacion.mensajeError += 'El CVV debe tener 3 dígitos.\n';
    }
    
    if (!validacion.esValido) {
        alert(validacion.mensajeError);
        return;
    }
    
    // Recolectar datos para el modal
    const datosReserva = {
        nombre: formularioReserva.querySelector('[name="name"]').value,
        servicio: formularioReserva.querySelector('[name="service"]').value,
        vehiculo: formularioReserva.querySelector('[name="vehicle"]').value,
        fecha: formatearFecha(formularioReserva.querySelector('[name="date"]').value),
        numeroTarjeta: entradaNumeroTarjeta.value
    };
    
    // Mostrar el modal de confirmación
    mostrarModal(datosReserva);
    
    // Reiniciar los formularios
    formularioReserva.reset();
    formularioPago.reset();
    formularioPago.querySelector('button').disabled = true;
});