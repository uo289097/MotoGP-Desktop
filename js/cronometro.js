class Cronometro {
    constructor() {
        this.tiempo = 0;
    }

    arrancar() {
        try {
            if (typeof Temporal !== "undefined") {
                this.inicio = Temporal.now.instant();
            } else {
                throw new Error("Objeto Temporal no disponible");
            }
        } catch (e) {
            this.inicio = new Date();
        }
        this.corriendo = setInterval(this.actualizar.bind(this), 100);
    }

    actualizar() {
        let actual;
        try {
            if (typeof Temporal !== "undefined") {
                actual = Temporal.now.instant();
                this.tiempo = actual.epochMilliseconds - this.inicio.epochMilliseconds;
            } else {
                throw new Error("Objeto Temporal no disponible");
            }
        } catch (e) {
            actual = new Date();
            this.tiempo = actual.getTime() - this.inicio.getTime();
        }
        this.mostrar();
    }

    mostrar() {
        let totalDecimas = parseInt(this.tiempo / 100)
        let minutos = parseInt(totalDecimas / 600);
        let segundos = parseInt((totalDecimas % 600) / 10);
        let decimas = parseInt(totalDecimas % 10);
        let mm = minutos.toString().padStart(2, "0");
        let ss = segundos.toString().padStart(2, "0");
        let d = decimas.toString();

        const p = document.querySelector("main p");
        if (p) {
            p.textContent = `${mm}:${ss}.${d}`;
        }
    }

    parar() {
        clearInterval(this.corriendo);
    }

    reiniciar() {
        clearInterval(this.corriendo);
        this.tiempo = 0;
        this.mostrar();
    }
}