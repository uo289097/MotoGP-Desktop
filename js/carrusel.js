class Carrusel {

    #busqueda;
    #actual;
    #maximo;
    #fotos;
    #imgElement;
    #json;
    #jsonPr

    constructor() {
        this.#busqueda = "mandalika, motogp";
        this.#actual = 0;
        this.#maximo = 4;
        this.#imgElement = null;
    }

    getFotografias(callback) {
        const url = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.ajax({
            url: url,
            dataType: "jsonp",
            data: {
                tags: this.#busqueda,
                format: "json"
            },
            success: (data) => {
                this.#json = data;
                this.procesarJSONFotografias();
                if (callback) callback(this.#jsonPr);
            },
            error: () => {
                console.error("Error al obtener las imágenes de Flickr.");
            }
        });
    }

    procesarJSONFotografias() {
        if (!this.#json) {
            console.error("No se ha obtenido el JSON.");
            return;
        }
        let resultado = { imagenes: [] };
        for (let i = 0; i < this.#json.items.length && i < this.#maximo; i++) {
            let item = this.#json.items[i];
            resultado.imagenes.push({
                url: item.media.m.replace("_m.", "_z."),
                titulo: item.title
            });
        }

        this.#jsonPr = resultado;
        $("pre").text(JSON.stringify(this.#jsonPr, null, 2));
    }

    mostrarFotografias(fotos) {
        if (!this.#jsonPr || this.#jsonPr.imagenes.length === 0) {
            console.error("No hay imágenes para mostrar.");
            return;
        }

        let primeraImagen = this.#jsonPr.imagenes[0];

        let titulo = $("<h2>").text("Imágenes del circuito de Mandalika");
        let imagen = $("<img>").attr({
            src: primeraImagen.url,
            alt: primeraImagen.titulo
        });

        let elementos = titulo.add(imagen);
        let article = $("<article>").append(elementos);
        $("main").append(article);

        setInterval(this.cambiarFotografia.bind(this), 3000);
    }

    cambiarFotografia() {
        if (!this.#jsonPr || this.#jsonPr.imagenes.length === 0) {
            return;
        }

        this.#actual = (this.#actual + 1) % this.#jsonPr.imagenes.length;
        let siguiente = this.#jsonPr.imagenes[this.#actual];

        $("main article img").attr({
            src: siguiente.url,
            alt: siguiente.titulo
        });
    }

}

