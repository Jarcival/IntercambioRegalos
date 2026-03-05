document.getElementById('btnContinuar').addEventListener('click', () => {

    const organizador = document.getElementById('nombreOrganizador').value;
    const incluirOrganizador = document.getElementById('incluirOrganizador').checked;

    // Crear copia de los participantes agregados
    let participantes = [...listaNombres];

    // Solo agregar organizador si el checkbox está activo
    if (incluirOrganizador) {
        participantes.push(organizador);
    }

    const data = {
        organizador: organizador,
        incluirOrganizador: incluirOrganizador,

        participantes: participantes,

        exclusiones: [],
        evento: {
            presupuesto: document.getElementById('otroPresupuesto').value || presupuestoSeleccionado,
            celebracion: document.getElementById('otraFestividad').value || festividadSeleccionada,
            fecha: document.getElementById('otraFecha').value || fechaSeleccionada
        }
    };

    if (!data.organizador || data.participantes.length < 2) {
        alert("Por favor, completa el nombre del organizador y agrega al menos 2 participantes.");
        return;
    }

    // Guardar en localStorage
    localStorage.setItem('intercambio_chicha', JSON.stringify(data));

    // Ir a resumen
    window.location.href = 'resumen.html';
});