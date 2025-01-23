document.addEventListener("DOMContentLoaded", () => {
    // Clave para almacenar los datos en LocalStorage
    const STORAGE_KEY = "sistemaVotaciones";

    // Elementos clave del DOM
    const listaResultados = document.getElementById("resultados");
    const botonReiniciar = document.getElementById("reiniciar-btn");
    const botonResultados = document.getElementById("resultados-btn");
    const tarjetasCandidatos = document.querySelectorAll(".card");

    // Objeto para almacenar los votos
    let votos = {};

    /** Cargar votos desde LocalStorage */
    function cargarVotos() {
        try {
            const datosGuardados = localStorage.getItem(STORAGE_KEY);
            votos = datosGuardados ? JSON.parse(datosGuardados) : inicializarVotos();
        } catch (error) {
            console.error("Error al cargar los datos desde LocalStorage:", error);
            votos = inicializarVotos();
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
    function inicializarVotos() {
        const votosIniciales = {};
        tarjetasCandidatos.forEach((candidato) => {
            const nombreCandidato = candidato.querySelector("h1").textContent;
            votosIniciales[nombreCandidato] = {};
            candidato.querySelectorAll(".emoji").forEach((emoji) => {
                const emojiValue = emoji.dataset.emoji;
                votosIniciales[nombreCandidato][emojiValue] = 0;
            });
        });
        guardarVotos();
        return votosIniciales;
    }

    /** Actualizar la lista de resultados en pantalla */
    function actualizarResultados() {
        listaResultados.innerHTML = ""; // Limpiar resultados anteriores
        for (const [candidato, emojiVotos] of Object.entries(votos)) {
            const resultadoCandidato = document.createElement("li");
            resultadoCandidato.classList.add("collection-item");
            resultadoCandidato.innerHTML = `<strong>${candidato}:</strong> ${formatearVotos(emojiVotos)}`;
            listaResultados.appendChild(resultadoCandidato);
        }
    }

    /** Formatear los votos para mostrarlos */
    function formatearVotos(emojiVotos) {
        return Object.entries(emojiVotos)
            .map(([emoji, count]) => `${emoji} (${count})`)
            .join(", ");
    }

    /** Configurar eventos de clic en emojis y botón de reinicio */
    function configurarEventos() {
        tarjetasCandidatos.forEach((candidato) => {
            const nombreCandidato = candidato.querySelector("h1").textContent;
            candidato.querySelectorAll(".emoji").forEach((emoji) => {
                emoji.addEventListener("click", () => {
                    const emojiValue = emoji.dataset.emoji;

                    // Incrementar el voto
                    votos[nombreCandidato][emojiValue]++;
                    guardarVotos();
                    actualizarResultados();
                });
            });
        });

        // Evento para reiniciar votos
        botonReiniciar.addEventListener("click", () => {
            if (confirm("¿Estás seguro de reiniciar las votaciones?")) {
                votos = inicializarVotos();
                actualizarResultados();
            }
        });

        // Evento ocultar/mostrar rsultados
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
