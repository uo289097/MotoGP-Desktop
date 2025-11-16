class Noticias {

    constructor(busqueda) {
        this.busqueda = busqueda;
        this.url = "https://api.thenewsapi.com/v1/news/all";
        this.apiKey = "ht6tU0SqhKMm0KryX9pF5ZwwncgySTRNezQys5dF";
        this.jsonNoticias = null;
    }

    buscar() {
        const params = new URLSearchParams({
            api_token: this.apiKey,
            search: this.busqueda,
            language: "es",
            page: 1,
            limit: 10
        });

        const urlCompleta = `${this.url}?${params.toString()}`;


        return fetch(urlCompleta)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la petición: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.jsonNoticias = data;
                return data;
            })
            .catch(err => {
                console.error("Error al obtener noticias:", err);
                return null;
            });
    }


    procesarInformacion() {

        if (!this.jsonNoticias || !this.jsonNoticias.data) {
            console.error("No hay noticias para procesar");
            return [];
        }

        return this.jsonNoticias.data.map(noticia => ({
            titulo: noticia.title,
            descripcion: noticia.description,
            url: noticia.url,
            fecha: noticia.published_at,
            fuente: noticia.source
        }));
    }

    mostrarNoticias() {

        const contenedor = document.querySelector("main section");
        if (!contenedor) {
            console.error("No se encontró el contenedor main section");
            return;
        }

        const h2 = document.createElement("h2");
        h2.textContent = "Noticias de MotoGP";
        contenedor.appendChild(h2)

        const cargar = this.jsonNoticias
            ? Promise.resolve()
            : this.buscar();

        cargar.then(() => {

            const noticias = this.procesarInformacion();
            if (!noticias || noticias.length === 0) {
                const p = document.createElement("p");
                p.textContent = "No se encontraron noticias.";
                contenedor.appendChild(p);
                return;
            }

            noticias.forEach(n => {
                const article = document.createElement("article");

                const h3 = document.createElement("h3");
                h3.textContent = n.titulo;
                article.appendChild(h3);

                const pDesc = document.createElement("p");
                pDesc.textContent = n.descripcion || "Sin descripción";
                article.appendChild(pDesc);

                const pInfo = document.createElement("p");
                const fecha = new Date(n.fecha).toLocaleString();
                pInfo.textContent = `Fecha: ${fecha} | Fuente: ${n.fuente}`;
                article.appendChild(pInfo);

                const a = document.createElement("a");
                a.href = n.url;
                a.target = "_blank";
                a.textContent = "Leer noticia completa";
                article.appendChild(a);

                contenedor.appendChild(article);
            });
        });
    }

}
