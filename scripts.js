document.addEventListener("DOMContentLoaded", () => {
    // Almacenar votos
    let votos = {};
  
    // Claves para almacenar los datos en LocalStorage
    const STORAGE_KEY = "sistemaVotaciones";
  
    // Cargar votos desde LocalStorage
    function cargarVotos() {
      const datosGuardados = localStorage.getItem(STORAGE_KEY);
      if (datosGuardados) {
        votos = JSON.parse(datosGuardados);
      } else {
        inicializarVotos();
      }
    }
  
    // Guardar votos en LocalStorage
    function guardarVotos() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(votos));
    }
  
    // Inicializar votos en blanco para todos los candidatos y emojis
    function inicializarVotos() {
      votos = {};
      document.querySelectorAll(".card").forEach((candidato) => {
        const nombreCandidato = candidato.querySelector("h4").textContent;
        votos[nombreCandidato] = {};
        candidato.querySelectorAll(".emoji").forEach((emoji) => {
          const emojiValue = emoji.dataset.emoji;
          votos[nombreCandidato][emojiValue] = 0;
        });
      });
      guardarVotos();
    }
  
    // Actualizar resultados en pantalla
    function actualizarResultados() {
      const listaResultados = document.getElementById("lista-resultados");
      listaResultados.innerHTML = ""; // Limpiar resultados anteriores
      for (const candidato in votos) {
        const resultadoCandidato = document.createElement("li");
        resultadoCandidato.classList.add("collection-item");
        resultadoCandidato.innerHTML = `<strong>${candidato}:</strong> ${formatearVotos(votos[candidato])}`;
        listaResultados.appendChild(resultadoCandidato);
      }
    }
  
    // Formatear los votos para mostrarlos
    function formatearVotos(emojiVotos) {
      return Object.entries(emojiVotos)
        .map(([emoji, count]) => `${emoji} (${count})`)
        .join(", ");
    }
  
    // Configurar eventos de clic en emojis
    function configurarEventos() {
      document.querySelectorAll(".emoji").forEach((emoji) => {
        emoji.addEventListener("click", () => {
          const candidato = emoji.closest(".card").querySelector("h4").textContent;
          const emojiValue = emoji.dataset.emoji;
  
          // Incrementar el voto
          votos[candidato][emojiValue]++;
          guardarVotos();
          actualizarResultados();
        });
      });
  
      // Evento para reiniciar votos
      document.getElementById("reiniciar-btn").addEventListener("click", () => {
        if (confirm("¿Estás seguro de reiniciar las votaciones?")) {
          inicializarVotos();
          actualizarResultados();
        }
      });
    }
  
    // Inicializar la aplicación
    function inicializar() {
      cargarVotos();
      actualizarResultados();
      configurarEventos();
    }
  
    inicializar();
  });
  