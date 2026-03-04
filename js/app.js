let listaNombres = [];
let presupuestoSeleccionado = 0;
let fechaSeleccionada = '';

// logica para manejar los pasos del formulario
document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step-section');
    let currentStep = 0;

    // Función para mostrar solo el paso actual
    function showStep(index) {
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.remove('d-none'); // Muestra el paso activox
            } else {
                step.classList.add('d-none'); // Oculta los demás
            }
        });
    }

    // Botones "Siguiente"
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Botones "Atrás"
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    //fechas dinamicas
    generarFechasSugeridas();

});

// Agregar nombre a la lista
document.getElementById('btnAgregar').addEventListener('click', () => {
    const input = document.getElementById('inputParticipante');
    const nombre = input.value.trim();
    
    if(nombre) {
        listaNombres.push(nombre);
        actualizarListaUI();
        input.value = '';
        input.focus();
    }
});

function actualizarListaUI() {
    const ul = document.getElementById('listaParticipantes');
    ul.innerHTML = '';
    listaNombres.forEach((nombre, index) => {
        ul.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center ">
                <span><i class=" text-primary"></i>${nombre}</span>
                <button type="button" class="btn btn-danger" onclick="eliminar(${index})">
                    <i >X</i>
                </button>
            </li>
        `;
    });
}

function eliminar(index) {
    listaNombres.splice(index, 1);
    actualizarListaUI();
}

// Manejo de presupuesto
document.querySelectorAll('.btn-budget').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.btn-budget').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        presupuestoSeleccionado = this.getAttribute('data-amount');
        document.getElementById('otroPresupuesto').value = '';
    });
}); 

//Manejo de fecha
function generarFechasSugeridas() {
    const contenedorFechas = document.getElementById('opcionesFechas');
    contenedorFechas.innerHTML = '';  

    const dias = [1,2,3]; // un arreglo de 3 dias cercanos a la fecha actial 
    
    dias.forEach(dias => {

        const fechaSugerida = new Date();
        fechaSugerida.setDate(fechaSugerida.getDate() + dias); //sum dias a la fecha actual
        
        // Formato bonito para el botón (Ej: viernes, 13 de marzo de 2026)
        const fechaFormateada = fechaSugerida.toLocaleDateString('es-ES', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });

        // Formato estándar para guardar en LocalStorage (Ej: 2026-03-13)
        const fechaISO = fechaSugerida.toISOString().split('T')[0];

        // Crear el botón dinámico
        contenedorFechas.innerHTML += `
            <button type="button" class="btn btn-outline-primary-chicha text-start w-100 btn-fecha" data-fecha="${fechaISO}">
                ${fechaFormateada}
            </button>
        `;
    });

    // Agregar el evento click a los nuevos botones
    document.querySelectorAll('.btn-fecha').forEach(btn => {
        btn.addEventListener('click', function() {
            // Quitar clase active de todos y ponerla en el clickeado
            document.querySelectorAll('.btn-fecha').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Guardar la selección
            fechaSeleccionada = this.getAttribute('data-fecha');
            
            // Limpiar el input de calendario si se seleccionó un botón sugerido
            document.getElementById('otraFecha').value = '';
        });
    });
}