class Carrusel {

    #busqueda;
    #actual;
    #maximo;
    #imagenes;

    constructor(busqueda) {
        this.#busqueda = busqueda;
        this.#actual = 0;
        this.#maximo = 4;
    }

    getFotografias() {
        const url = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.ajax({
            url: url,
            dataType: "jsonp",
            data: {
                tags: this.#busqueda,
                tagmode: "any",
                format: "json"
            },
            success: (data) => {
                this.#procesarJSONFotografias(data);
            }, error: () => {
                console.error("Error al obtener las imágenes de la API de Flickr");
            }
        });
    }

    #procesarJSONFotografias(data) {
        var imgs = [];
        for (let i = 0; i <= this.#maximo; i++) {
            const item = data.items[i];
            const url = item.media.m.replace("_m", "_z");
            const title = item.title;
            imgs.push({ url, title });
        }
        this.#imagenes = imgs;
        this.#mostrarFotografias();
    }

    #mostrarFotografias() {
        const imagen = this.#imagenes[0];
        const title = imagen.title;
        const url = imagen.url;

        const h2 = $("<h2>").text("Imágenes del circuito de Mandalika");

        const img = $("<img>")
        img.attr("alt", title);
        img.attr("src", url);

        const elementos = h2.add(img);

        const section = $("<section>")
        section.append(elementos);

        $("main").append(section);

        setInterval(this.#cambiarFotografia.bind(this), 3000);
    }

    #cambiarFotografia() {
        this.#actual++;
        if (this.#actual > this.#maximo) {
            this.#actual = 0;
        }

        const imagen = this.#imagenes[this.#actual];
        const img = $("main section img");
        img.attr("src", imagen.url);
        img.attr("alt", imagen.title);

    }

}