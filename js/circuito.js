class Circuito {

    #soporta;

    comprobarApiFile() {
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
        this.comprobarApiFile();
        var tipoArchivo = /html.*/;
        if (archivo.type.match(tipoArchivo)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                const main = document.querySelector("main");

                var parser = new DOMParser();
                var doc = parser.parseFromString(lector.result, "text/html");

                const contenido = doc.body.cloneNode(true);
                main.appendChild(contenido);

            }
            lector.readAsText(archivo);
        }
    }
}

class CargadorSVG {
    leerArchivoSVG(archivo) {
        var tipoArchivo = /svg.*/;
        if (archivo.type.match(tipoArchivo)) {
            var lector = new FileReader();
            var self = this;
            lector.onload = function (evento) {
                console.log(lector.result)
                self.insertarSVG(lector.result)
            }
            lector.readAsText(archivo);
        }
    }

    insertarSVG(result) {
        const main = document.querySelector("main");
        const h3 = document.createElement("h3");
        h3.textContent = "Altimetría del circuito de Mandalika"
        main.appendChild(h3);

        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "image/svg+xml");

        const svg = doc.documentElement.cloneNode(true);
        main.appendChild(svg);
    }
}

class CargadorKML {
    leerArchivoKML() {

    }

    insertarCapaKML() {

    }
}