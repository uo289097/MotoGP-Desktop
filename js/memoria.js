class Memoria {

    #tablero_bloqueado;
    #primera_carta;
    #segunda_carta;
    #cronometro;

    constructor() {
        this.#tablero_bloqueado = true;
        this.#primera_carta = null;
        this.#segunda_carta = null;
        this.#reiniciarAtributos();
        this.#barajarCartas();
        this.#registrarEventos();
        this.#tablero_bloqueado = false;

        this.#cronometro = new Cronometro()
        this.#cronometro.arrancar()
    }

    #registrarEventos() {
        const cartas = document.querySelectorAll("main article");
        cartas.forEach(carta => {
            carta.addEventListener("click", event => {
                this.voltearCarta(event.currentTarget);
            });
        });
    }

    voltearCarta(carta) {
        const estado = carta.getAttribute("data-estado")
        if (estado === "revelada" || estado === "volteada" || this.#tablero_bloqueado) {
            return;
        } else {
            carta.setAttribute("data-estado", "volteada");
            if (this.#primera_carta === null) {
                this.#primera_carta = carta;
                return;
            } else {
                this.#segunda_carta = carta;
                this.#comprobarPareja();
            }
        }
    }

    #barajarCartas() {
        const main = document.querySelector("main");
        const cartas = Array.from(document.querySelectorAll("main article"));

        for (let i = cartas.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
        }

        cartas.forEach(carta => main.appendChild(carta));
    }

    #reiniciarAtributos() {
        this.#tablero_bloqueado = true;
        this.#primera_carta = null;
        this.#segunda_carta = null;
        this.#tablero_bloqueado = false;
    }

    #deshabilitarCartas() {
        this.#primera_carta.setAttribute("data-estado", "revelada");
        this.#segunda_carta.setAttribute("data-estado", "revelada");

        this.#comprobarJuego();
        this.#reiniciarAtributos();
        // PREGUNTAR SI SON PAREJA NO HAY TIMEOUT
    }

    #comprobarJuego() {
        const cartas = Array.from(document.querySelectorAll("main article"));
        let reveladas = true;
        cartas.forEach(carta => {
            if (carta.getAttribute("data-estado") !== "revelada") {
                reveladas = false;
            }
        });
        if (reveladas === true) {
            this.#cronometro.parar()
        }
    }

    #cubrirCartas() {
        this.#tablero_bloqueado = true;

        setTimeout(() => {
            this.#primera_carta.removeAttribute("data-estado");
            this.#segunda_carta.removeAttribute("data-estado");
            this.#reiniciarAtributos();
        }, 1500);

    }

    #comprobarPareja() {
        const estado1 = this.#primera_carta.getAttribute("data-estado");
        const estado2 = this.#segunda_carta.getAttribute("data-estado");

        const img1 = this.#primera_carta.querySelector("img").src;
        const img2 = this.#segunda_carta.querySelector("img").src;

        const sonPareja = (estado1 === "volteada" && estado2 === "volteada"
            && img1 === img2);

        sonPareja ? this.#deshabilitarCartas() : this.#cubrirCartas();
    }
}