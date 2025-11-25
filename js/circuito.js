class Circuito {

    #soporta;

    constructor() {
        const section = document.querySelectorAll("main section:nth-of-type(1)");
        const input = section[0].querySelector("input");
        this.#comprobarApiFile();
        if (this.#soporta) {
            input.addEventListener("change", event => {
                this.leerArchivoHTML(event.target.files[0]);
            });
        }
    }

    #comprobarApiFile() {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            const p = document.createElement("p");
            p.textContent = "Este navegador no soporta el API File";
            document.body.appendChild(p);
            this.#soporta = false;
        }
        else
            this.#soporta = true;
    }

    leerArchivoHTML(archivo) {
        var tipoArchivo = /html.*/;
        if (archivo.type.match(tipoArchivo)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                const main = document.querySelector("main section:nth-of-type(1)");

                var parser = new DOMParser();
                var doc = parser.parseFromString(lector.result, "text/html");

                const contenido = doc.body.cloneNode(true);

                contenido.querySelectorAll("p").forEach(p => {
                    const texto = p.textContent.trim();

                    if (texto.startsWith("Fecha del evento:")) {
                        const fechaStr = texto.replace("Fecha del evento:", "").trim();
                        const fecha = new Date(fechaStr);

                        const nuevoP = document.createElement("p");
                        nuevoP.textContent =
                            "Fecha del evento: " +
                            fecha.toLocaleDateString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            });

                        p.replaceWith(nuevoP);
                    }
                });

                contenido.querySelectorAll("img").forEach(img => {
                    let srcOriginal = img.getAttribute("src");
                    if (srcOriginal && srcOriginal.startsWith("../multimedia/")) {
                        img.src = srcOriginal.replace("../multimedia/", "multimedia/");
                    }
                });

                contenido.querySelectorAll("video").forEach(video => {
                    let srcOriginal = video.getAttribute("src");
                    if (srcOriginal && srcOriginal.startsWith("../multimedia/")) {
                        video.src = srcOriginal.replace("../multimedia/", "multimedia/");
                    }
                });

                main.appendChild(contenido);

            }
            lector.readAsText(archivo);
        }
    }
}

class CargadorSVG {

    constructor() { //PREGUNTAR
        const section = document.querySelectorAll("main section:nth-of-type(2)");
        const input = section[0].querySelector("input");
        input.addEventListener("change", event => {
            this.leerArchivoSVG(event.target.files[0]);
        });
    }

    leerArchivoSVG(archivo) {
        var tipoArchivo = /svg.*/;
        if (archivo.type.match(tipoArchivo)) {
            var lector = new FileReader();
            var self = this;
            lector.onload = function (evento) {
                console.log(lector.result)
                self.insertarSVG(lector.result);
            }
            lector.readAsText(archivo);
        }
    }

    insertarSVG(result) {
        const main = document.querySelector("main section:nth-of-type(2)");
        const h4 = document.createElement("h4");
        h4.textContent = "Altimetría del circuito de Mandalika";
        main.appendChild(h4);

        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "image/svg+xml");

        const svg = doc.documentElement.cloneNode(true);
        main.appendChild(svg);
    }
}

class CargadorKML {

    #apikey = "pk.eyJ1IjoidW8yODkwOTciLCJhIjoiY21pNGprbGZ1MXRnaTJpcXpvbGpoc3dvMyJ9.wuvFf63R5LlzT4ZKz4Mo7g";
    #puntos = [];

    constructor() {
        const section = document.querySelectorAll("main section:nth-of-type(3)");
        const input = section[0].querySelector("input");
        input.addEventListener("change", event => {
            this.leerArchivoKML(event.target.files[0]);
        });
    }

    leerArchivoKML(archivo) {
        const tipoArchivo = "kml";
        const name = archivo.name;
        const extension = name.substring(name.length - 3, name.length);
        if (tipoArchivo.match(extension)) {
            var lector = new FileReader();
            var self = this;
            lector.onload = function (evento) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(lector.result, "text/xml");

                const coordenadas = doc.getElementsByTagName("coordinates")[0];

                const lines = coordenadas.textContent.trim().split(/\s+/);

                lines.forEach(linea => {
                    const [lon, lat, alt] = linea.split(",").map(Number);
                    self.#puntos.push({ lon, lat, alt });
                });

                self.insertarCapaKML();
            }
            lector.readAsText(archivo);
        }

    }

    insertarCapaKML() {
        mapboxgl.accessToken = this.#apikey;
        const contenedorMapa = document.querySelector('section > div');
        const map = new mapboxgl.Map({
            container: contenedorMapa,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [116.30573077553126, -8.898637364738745],
            zoom: 14
        });

        const geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': this.#puntos.map(p => [p.lon, p.lat])
                    }
                }
            ]
        };

        map.on('load', () => {
            map.addSource('circuito-kml', {
                'type': 'geojson',
                'data': geojson
            });

            map.addLayer({
                'id': 'linea-circuito',
                'type': 'line',
                'source': 'circuito-kml',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#ff0000',
                    'line-width': 6
                }
            });
        });
    }
}