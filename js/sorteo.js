function mezclar(array){
    for(let i = array.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function esValido(origen, destino, exclusiones){

    if(origen === destino) return false;

    for(let ex of exclusiones){
        if(ex.de === origen && ex.noPuede === destino){
            return false;
        }
    }

    return true;
}

function realizarSorteo(){

    const data = JSON.parse(localStorage.getItem("intercambio_chicha"));

    let participantes = [...data.participantes];
    let resultadoValido = false;
    let asignaciones = [];

    while(!resultadoValido){

        let copia = [...participantes];
        mezclar(copia);

        resultadoValido = true;

        for(let i = 0; i < participantes.length; i++){
            if(!esValido(participantes[i], copia[i], data.exclusiones)){
                resultadoValido = false;
                break;
            }
        }

        if(resultadoValido){
            asignaciones = participantes.map((p, i) => ({
                de: p,
                para: copia[i]
            }));
        }
    }

    return asignaciones;
}

///PARTE VISUAL DEL SORTEO

function mostrarParticipantes(){

    const data = JSON.parse(localStorage.getItem("intercambio_chicha"));
    const contenedor = document.getElementById("participantesSorteo");

    data.participantes.forEach(nombre => {

        const li = document.createElement("li");
        li.className = "list-group-item text-center fw-bold";
        li.textContent = nombre;

        contenedor.appendChild(li);

    });
}


function animacionSorteo(){

    const lista = document.getElementById("participantesSorteo");
    const items = [...lista.children];

    let contador = 0;

    const intervalo = setInterval(() => {

        items.forEach(el => el.classList.remove("active"));

        const random = Math.floor(Math.random() * items.length);
        items[random].classList.add("active");

        contador++;

        if(contador > 15){
            clearInterval(intervalo);
            mostrarResultados();
        }

    }, 150);
}


function mostrarResultados(){

    const resultados = realizarSorteo();
    const contenedor = document.getElementById("resultadoSorteo");

    contenedor.innerHTML = "";

    resultados.forEach(r => {

        const card = document.createElement("div");

        card.className = "card shadow-sm p-3 mb-3";

        card.innerHTML = `
            <h5 class="text-center">
                🎁 <strong>${r.de}</strong> regala a
                <span style="color:#FF6F61">${r.para}</span>
            </h5>
        `;

        contenedor.appendChild(card);

    });

}

document.getElementById("btnSortear").addEventListener("click", animacionSorteo);

mostrarParticipantes();