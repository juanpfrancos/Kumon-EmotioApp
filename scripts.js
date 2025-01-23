document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "sistemaVotaciones";

    const listaResultados = document.getElementById("resultados");
    const botonReiniciar = document.getElementById("reiniciar-btn");
    const botonResultados = document.getElementById("resultados-btn");
    const tarjetasCandidatos = document.querySelectorAll(".card");

    let votos = {};

    /** Cargar votos desde LocalStorage */
    function cargarVotos() {
        try {
            const datosGuardados = localStorage.getItem(STORAGE_KEY);
            votos = datosGuardados ? JSON.parse(datosGuardados) : inicializarVotos(false);
        } catch (error) {
            console.error("Error al cargar los datos desde LocalStorage:", error);
            votos = inicializarVotos(false);
        }
    }

    /** Guardar votos en LocalStorage */
    function guardarVotos() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(votos));
        } catch (error) {
            console.error("Error al guardar los datos en LocalStorage:", error);
        }
    }

    /** Inicializar votos con todos los candidatos y emojis */
    function inicializarVotos(guardar = true) {
        const votosIniciales = {};
        tarjetasCandidatos.forEach((candidato) => {
            const nombreCandidato = candidato.querySelector("h1").textContent;
            votosIniciales[nombreCandidato] = {};
            candidato.querySelectorAll(".emoji").forEach((emoji) => {
                const emojiValue = emoji.dataset.emoji;
                votosIniciales[nombreCandidato][emojiValue] = 0;
            });
        });
        if (guardar) guardarVotos();
        return votosIniciales;
    }

    /** Limpiar votos del estado y del almacenamiento */
    function reiniciarVotos() {
        try {
            // Limpiar localStorage completamente
            localStorage.removeItem(STORAGE_KEY);

            // Reiniciar votos en memoria
            votos = inicializarVotos(false);

            // Actualizar el DOM
            actualizarResultados();

            console.log("Votaciones reiniciadas y LocalStorage limpiado.");
        } catch (error) {
            console.error("Error al reiniciar las votaciones:", error);
        }
    }

    /** Actualizar la lista de resultados en pantalla */
    function actualizarResultados() {
        const tabla = document.getElementById("tabla").querySelector("tbody");
        tabla.innerHTML = ""; // Elimina todo el contenido del tbody
        for (const [candidato, emojiVotos] of Object.entries(votos)) {
            insertarRegistro(candidato, emojiVotos);
        }
    }

    /** Insertar un registro en la tabla de resultados */
    function insertarRegistro(nombre, emojiVotos) {
        const tabla = document.getElementById("tabla").querySelector("tbody");
        const nuevaFila = tabla.insertRow();
        nuevaFila.insertCell(0).textContent = nombre;
        nuevaFila.insertCell(1).textContent = emojiVotos["😊"] || 0;
        nuevaFila.insertCell(2).textContent = emojiVotos["🙁"] || 0;
        nuevaFila.insertCell(3).textContent = emojiVotos["😡"] || 0;
        nuevaFila.insertCell(4).textContent = emojiVotos["😐"] || 0;
    }

    /** Configurar eventos de clic en emojis y botones */
    function configurarEventos() {
        tarjetasCandidatos.forEach((candidato) => {
            const nombreCandidato = candidato.querySelector("h1").textContent;

            // Inicializar candidato si no existe
            if (!votos[nombreCandidato]) {
                votos[nombreCandidato] = {};
                candidato.querySelectorAll(".emoji").forEach((emoji) => {
                    const emojiValue = emoji.dataset.emoji;
                    votos[nombreCandidato][emojiValue] = 0;
                });
                guardarVotos();
            }

            // Configurar evento para incrementar votos
            candidato.querySelectorAll(".emoji").forEach((emoji) => {
                emoji.addEventListener("click", () => {
                    const emojiValue = emoji.dataset.emoji;
                    votos[nombreCandidato][emojiValue]++;
                    guardarVotos();
                    actualizarResultados();
                });
            });
        });

        // Evento para reiniciar votos
        botonReiniciar.addEventListener("click", () => {
            if (confirm("¿Estás seguro de reiniciar las votaciones?")) {
                reiniciarVotos();
            }
        });

        // Evento para ocultar/mostrar resultados
        botonResultados.addEventListener("click", () => {
            listaResultados.classList.toggle("hidden");
            const textoBoton = listaResultados.classList.contains("hidden")
                ? "Mostrar Resultados"
                : "Ocultar Resultados";
            botonResultados.textContent = textoBoton;
        });
    }

    /** Inicializar la aplicación */
    function inicializar() {
        cargarVotos();
        actualizarResultados();
        configurarEventos();
    }

    inicializar();
});
