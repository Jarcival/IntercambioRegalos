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

    // Detectar cambio de paso
    const observer = new MutationObserver(() => {
        if (!document.getElementById("step6").classList.contains("d-none")) {
            cargarParticipantes();
        }
    });

    observer.observe(document.body, { subtree: true, attributes: true });

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
    document.getElementById("btnFinalizar").addEventListener("click", () => {

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