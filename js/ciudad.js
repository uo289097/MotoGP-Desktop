class Ciudad {

    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #longitud;
    #latitud;

    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;

    }

    inicializar(poblacion, longitud, latitud) {
        this.#poblacion = poblacion;
        this.#longitud = longitud;
        this.#latitud = latitud;
    }

    getNombre() {
        return this.#nombre;
    }

    getPais() {
        return this.#pais;
    }

    getInfo() {
        const ul = document.createElement("ul");
        const liGent = document.createElement("li");
        liGent.textContent = `Gentilicio: ${this.#gentilicio}`;
        ul.appendChild(liGent);

        const liPoblacion = document.createElement("li");
        liPoblacion.textContent = `Población: ${this.#poblacion.toLocaleString()} habitantes`;
        ul.appendChild(liPoblacion);

        return ul;
    }

    getCoordenadas() {
        const p = document.createElement("p");
        p.textContent = `Coordenadas de ${this.#nombre}: (${this.#longitud}, ${this.#latitud})`;

        return p;
    }
}