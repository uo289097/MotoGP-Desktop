class Noticias {

    #busqueda;
    #urlBase;
    #apikey;

    constructor(busqueda) {
        this.#busqueda = busqueda;
        this.#urlBase = "https://api.thenewsapi.com/v1/news/all";
        this.#apikey = "ht6tU0SqhKMm0KryX9pF5ZwwncgySTRNezQys5dF";
    }

    async buscar() {
        const url = `${this.#urlBase}?api_token=${this.#apikey}&search=${this.#busqueda}&language=es`;

        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error('Noticias no encontradas para esa búsqueda');
            const datos = await respuesta.json();
            this.#procesarInformacion(datos);
        } catch (error) {
            console.error('Error al obtener las noticias: ' + error.message);
        }

    }

    #procesarInformacion(datos) {
        var noticias = [];
        for (let i = 0; i < datos.data.length; i++) {
            const title = datos.data[i].title;
            const entradilla = datos.data[i].description;
            const url = datos.data[i].url;
            const source = datos.data[i].source;

            noticias.push({ title, entradilla, url, source });
        }
        this.#mostrarNoticias(noticias);
    }

    #mostrarNoticias(noticias) {
        const section = $("<section>");

        const h2 = $("<h2>").text("Noticias de MotoGP");
        section.append(h2);

        for (let i = 0; i < noticias.length; i++) {
            const h3 = $("<h3>").text(noticias[i].title);
            const entradilla = $("<p>").text(noticias[i].entradilla);
            const url = $("<a>")
                .attr("href", noticias[i].url)
                .text("Leer noticia completa");
            const source = $("<p>").text(noticias[i].source)

            const article = $("<article>").append(h3, entradilla, url, source);
            section.append(article);
        }
        $("main").append(section);
    }
}
