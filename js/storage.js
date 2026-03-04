document.getElementById('btnContinuar').addEventListener('click', () => {
    const data = {
        organizador: document.getElementById('nombreOrganizador').value,
        incluirOrganizador: document.getElementById('incluirOrganizador').checked,
        participantes: listaNombres,
        presupuesto: document.getElementById('otroPresupuesto').value || presupuestoSeleccionado,
       
        celebracion: document.getElementById('otraFestividad').value ,

        fecha: document.getElementById('otraFecha').value || fechaSeleccionada
    };

    if(!data.organizador || data.participantes.length < 2) {

        alert("Por favor, completa el nombre del organizador y agrega al menos 2 participantes.");
        return;
    }

    // Guardando datos en el local storage
    localStorage.setItem('intercambio_chicha', JSON.stringify(data));
    
    // Navegar a la siguiente fase
    window.location.href = 'resumen.html'; // O la página de exclusiones
});