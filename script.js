document.addEventListener('DOMContentLoaded', () => {
    const tarjetas = [
        { img: 'img/actress1.jpg' }, { img: 'img/actress1.jpg' },
        { img: 'img/actress2.jpg' }, { img: 'img/actress2.jpg' },
        { img: 'img/animal1.jpg' },  { img: 'img/animal1.jpg' },
        { img: 'img/animal2.jpg' },  { img: 'img/animal2.jpg' },
        { img: 'img/extra1.jpg' },   { img: 'img/extra1.jpg' },
        { img: 'img/goku1.jpg' },    { img: 'img/goku1.jpg' },
        { img: 'img/goku2.jpg' },    { img: 'img/goku2.jpg' },
        { img: 'img/pic1.jpg' },     { img: 'img/pic1.jpg' }
    ];

    const tablero = document.querySelector('.tablero');
    const puntajeElemento = document.getElementById('puntaje');
    const tiempoElemento = document.getElementById('tiempo');
    const botonReiniciar = document.getElementById('reiniciar');
    const botonRegresar = document.getElementById('regresar');
    const mensajeElemento = document.getElementById('mensaje');

    let primeraTarjeta = null;
    let segundaTarjeta = null;
    let bloqueoTablero = true; // Bloquear el tablero inicialmente
    let puntaje = 0;
    let tiempoRestante = 0;
    let intervaloTiempo;

    function iniciarTemporizador() {
        tiempoElemento.textContent = `Tiempo restante: ${formatoTiempo(tiempoRestante)}`;
        intervaloTiempo = setInterval(() => {
            tiempoRestante--;
            tiempoElemento.textContent = `Tiempo restante: ${formatoTiempo(tiempoRestante)}`;
            if (tiempoRestante <= 0) {
                clearInterval(intervaloTiempo);
                mostrarMensaje('¡Tiempo agotado! No te rindas, inténtalo de nuevo. 💪');
            }
        }, 1000);
    }

    function formatoTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const restoSegundos = segundos % 60;
        return `${minutos}:${restoSegundos < 10 ? '0' : ''}${restoSegundos}`;
    }

    function crearTablero() {
        tablero.innerHTML = '';
        const tarjetasBarajadas = tarjetas.sort(() => 0.5 - Math.random());
        tarjetasBarajadas.forEach((tarjeta) => {
            const tarjetaElemento = document.createElement('div');
            tarjetaElemento.classList.add('tarjeta');

            const imagen = document.createElement('img');
            imagen.src = tarjeta.img;

            tarjetaElemento.appendChild(imagen);
            tablero.appendChild(tarjetaElemento);
            tarjetaElemento.addEventListener('click', voltearTarjeta);
        });

        // Mostrar todas las tarjetas al inicio
        revelarTodasLasTarjetas();
    }

    function revelarTodasLasTarjetas() {
        const todasLasTarjetas = document.querySelectorAll('.tarjeta');
        todasLasTarjetas.forEach((tarjeta) => tarjeta.classList.add('mostrada'));

        // Ocultar las tarjetas después de 5 segundos
        setTimeout(() => {
            todasLasTarjetas.forEach((tarjeta) => tarjeta.classList.remove('mostrada'));
            bloqueoTablero = false; // Permitir la interacción después de la previsualización
            iniciarTemporizador(); // Iniciar el temporizador
        }, 5000);
    }

    function voltearTarjeta() {
        if (bloqueoTablero || this === primeraTarjeta) return;

        this.classList.add('mostrada');

        if (!primeraTarjeta) {
            primeraTarjeta = this;
            return;
        }

        segundaTarjeta = this;
        bloqueoTablero = true;

        verificarEmparejamiento();
    }

    function verificarEmparejamiento() {
        const coincide = primeraTarjeta.querySelector('img').src === segundaTarjeta.querySelector('img').src;

        if (coincide) {
            desactivarTarjetas();
            actualizarPuntaje();
        } else {
            setTimeout(esconderTarjetas, 1000);
        }

        if (document.querySelectorAll('.tarjeta:not(.mostrada)').length === 0) {
            clearInterval(intervaloTiempo);
            mostrarMensaje('¡Felicidades! Has completado el juego. 🎉');
        }
    }

    function desactivarTarjetas() {
        primeraTarjeta.removeEventListener('click', voltearTarjeta);
        segundaTarjeta.removeEventListener('click', voltearTarjeta);
        resetearTablero();
    }

    function esconderTarjetas() {
        primeraTarjeta.classList.remove('mostrada');
        segundaTarjeta.classList.remove('mostrada');
        resetearTablero();
    }

    function resetearTablero() {
        [primeraTarjeta, segundaTarjeta] = [null, null];
        bloqueoTablero = false;
    }

    function actualizarPuntaje() {
        puntaje++;
        puntajeElemento.textContent = `Puntaje: ${puntaje}`;
    }

    function mostrarMensaje(texto) {
        mensajeElemento.textContent = texto;
        mensajeElemento.classList.add('mostrar');
        setTimeout(() => {
            mensajeElemento.classList.remove('mostrar');
        }, 3000);
    }

    botonReiniciar.addEventListener('click', () => {
        reiniciarJuego();
    });

    botonRegresar.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    function reiniciarJuego() {
        clearInterval(intervaloTiempo);
        puntaje = 0;
        tiempoRestante = parseInt(localStorage.getItem('tiempoSeleccionado')) || 60; // Leer tiempo desde localStorage
        puntajeElemento.textContent = 'Puntaje: 0';
        bloqueoTablero = true; // Bloquear tablero durante la previsualización
        crearTablero();
    }

    // Inicialización
    tiempoRestante = parseInt(localStorage.getItem('tiempoSeleccionado')) || 60; // Leer tiempo inicial
    reiniciarJuego();
});
