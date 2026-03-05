document.addEventListener("DOMContentLoaded", () => {

    const listaDrag = document.getElementById("listaDrag");
    const listaExclusionesUI = document.getElementById("listaExclusionesUI");

    let participanteOrigen = null;
    let exclusionesTemp = [];

    function cargarParticipantes() {
        listaDrag.innerHTML = "";

        // Calcular la lista final basada en el checkbox
        let participantesFinales = [...listaNombres];
        const organizador = document.getElementById('nombreOrganizador').value;
        const incluirOrganizador = document.getElementById('incluirOrganizador').checked;

        if (incluirOrganizador) {
            if (!participantesFinales.includes(organizador)) {
                participantesFinales.push(organizador);
            }
        } else {
            participantesFinales = participantesFinales.filter(p => p !== organizador);
        }

        // Mostrar la lista final en el drag and drop
        participantesFinales.forEach(nombre => {
            listaDrag.innerHTML += `
                <li class="list-group-item"
                    draggable="true"
                    data-nombre="${nombre}">
                    ${nombre}
                </li>
            `;
        });
    }

    // Función para validar si todos los campos están completos
    function validarCamposCompletos() {
        const organizador = document.getElementById('nombreOrganizador').value.trim();
        const incluirOrganizador = document.getElementById('incluirOrganizador').checked;
        let participantesFinales = [...listaNombres];

        if (incluirOrganizador && organizador && !participantesFinales.includes(organizador)) {
            participantesFinales.push(organizador);
        } else if (!incluirOrganizador) {
            participantesFinales = participantesFinales.filter(p => p !== organizador);
        }

        const presupuesto = document.getElementById('otroPresupuesto').value || presupuestoSeleccionado;
        const celebracion = document.getElementById('otraFestividad').value || festividadSeleccionada;
        const fecha = document.getElementById('otraFecha').value || fechaSeleccionada;

        return organizador && participantesFinales.length >= 2 && presupuesto && celebracion && fecha;
    }

    const paso6 = document.getElementById("step6");
    if (paso6) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.target === paso6 && m.attributeName === 'class') {
                    if (!paso6.classList.contains("d-none")) {
                        cargarParticipantes();
                    }
                }
            });
        });
        observer.observe(paso6, { attributes: true });
    }


 // ==========================
// Drag start
// ==========================
    listaDrag.addEventListener("dragstart", (e) => {
        if (e.target.tagName === "LI") {
            participanteOrigen = e.target.dataset.nombre;
        }
    });
// ==========================
// Drag over (permitir soltar)
// ==========================
    listaDrag.addEventListener("dragover", (e) => {
        e.preventDefault();
    });


// ==========================
// Drop
// ==========================
    listaDrag.addEventListener("drop", (e) => {
        e.preventDefault();

        const destino = e.target.dataset.nombre;

        if (participanteOrigen && destino && participanteOrigen !== destino) {

            exclusionesTemp.push({
                de: participanteOrigen,
                noPuede: destino
            });

            listaExclusionesUI.innerHTML += `
                <li class="list-group-item">
                    ${participanteOrigen} no puede regalar a ${destino}
                </li>
            `;
        }
    });

    // Guardar exclusiones al finalizar
    document.getElementById("btnFinalizar").addEventListener("click", (e) => {

        // Validar si todos los campos están completos
        if (!validarCamposCompletos()) {
            
            if (window.Swal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, completa todos los campos obligatorios antes de continuar.',
                    confirmButtonText: 'Entendido'
                });
            } else {
                alert("Por favor, completa todos los campos obligatorios antes de continuar.");
            }
            return;
        }

        const organizador = document.getElementById('nombreOrganizador').value;
        const incluirOrganizador = document.getElementById('incluirOrganizador').checked;

        // Crear copia de los participantes agregados
        let participantesFinales = [...listaNombres];

        // Gestionar inclusión del organizador según el checkbox
        if (incluirOrganizador) {
            // Agregar solo si no está ya en la lista
            if (!participantesFinales.includes(organizador)) {
                participantesFinales.push(organizador);
            }
        } else {
            // Remover si está en la lista (por si se agregó manualmente)
            participantesFinales = participantesFinales.filter(p => p !== organizador);
        }

        const data = {
            organizador: organizador,
            incluirOrganizador: incluirOrganizador,
            participantes: participantesFinales,
            exclusiones: exclusionesTemp,
            evento: {
                presupuesto: document.getElementById('otroPresupuesto').value || presupuestoSeleccionado,
                celebracion: document.getElementById('otraFestividad').value || festividadSeleccionada,
                fecha: document.getElementById('otraFecha').value || fechaSeleccionada
            }
        };

        localStorage.setItem('intercambio_chicha', JSON.stringify(data));
        window.location.href = "resumen.html";
    });

});