class Memoria {
    constructor() {
        this.tablero_bloqueado = true;
        this.primera_carta = null;
        this.segunda_carta = null;
    }

    voltearCarta(card) {
        card.setAttribute("data-estado", "revelada");
    }

    barajarCartas() {
        const main = document.querySelector("main");
        const cartas = Array.from(document.querySelectorAll("main article"));


        cartas.forEach(carta => main.appendChild(carta));
    }

}