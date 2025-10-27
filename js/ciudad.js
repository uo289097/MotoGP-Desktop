class Ciudad {

    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;

    }

    inicializar(poblacion, longitud, latitud) {
        this.poblacion = poblacion;
        this.longitud = longitud;
        this.latitud = latitud;
    }

    getNombre() {
        return this.nombre;
    }

    getPais() {
        return this.pais;
    }

    getInfo() {
        const info =
            `<ul>
                <li>Gentilicio: ${this.gentilicio} </li>
                <li>Población: ${this.poblacion.toLocaleString()} habitantes </li>
            </ul>`
        return info;
    }

    getCoordenadas() {
        document.write("<p>Coordenadas de Baturiti: (" + this.longitud + ", "
            + this.latitud + ")</p>");
    }
}

long = -8.888753635975736
latitud = 116.27644785391404
poblacion = 52345