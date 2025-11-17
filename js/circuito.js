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
        var tipoArchivo = /html.*/;
        if (archivo.type.match(tipoArchivo)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                const main = document.querySelector("main");
                console.log(lector.result)

                var parser = new DOMParser();
                var doc = parser.parseFromString(lector.result, "text/html");
                var h2 = document.createElement("h2")
                h2.textContent = doc.querySelector("h2").textContent;
                main.appendChild(h2);

                var parrafos = Array.from(doc.querySelectorAll("p"));
                parrafos.forEach(parrafo => {
                    var p = document.createElement("p");
                    p.textContent = parrafo.textContent;
                    main.appendChild(p);
                })

                var h3Ref = document.createElement("h3");
                h3Ref.textContent = doc.querySelector('h3:nth-of-type(1)').textContent;
                main.appendChild(h3Ref);

                const listaRef = doc.querySelector("ul");
                const ul = document.createElement("ul");
                listaRef.querySelectorAll("li").forEach(li => {
                    const li2 = document.createElement("li");
                    const enlace = li.querySelector("a");

                    const a = document.createElement("a")
                    a.href = enlace.href;
                    a.textContent = enlace.textContent;

                    li2.appendChild(a);
                    ul.appendChild(li2);
                });
                main.appendChild(ul);

                var h3Img = document.createElement("h3");
                h3Img.textContent = doc.querySelector('h3:nth-of-type(2)').textContent;
                main.appendChild(h3Img);
                doc.querySelectorAll("img").forEach(img => {
                    const img2 = document.createElement("img");
                    img2.src = img.src;
                    img2.alt = img.alt;
                    main.appendChild(img2)
                });


                var h3Vid = document.createElement("h3");
                h3Vid.textContent = doc.querySelector('h3:nth-of-type(3)').textContent;
                main.appendChild(h3Vid);

                var h3Clas = document.createElement("h3");
                h3Clas.textContent = doc.querySelector('h3:nth-of-type(4)').textContent;
                main.appendChild(h3Clas);

                const listaClas = doc.querySelector("ol");
                const ol = document.createElement("ol");
                listaClas.querySelectorAll("li").forEach(li => {
                    const li2 = document.createElement("li");
                    li2.textContent = li.textContent;

                    ol.appendChild(li2);
                });
                main.appendChild(ol);
            }
            lector.readAsText(archivo);
        }
    }

}

class CargadorSVG {
    leerArchivoSVG() {

    }

    insertarSVG() {

    }
}

class CargadorKML {
    leerArchivoKML() {

    }

    insertarCapaKML() {

    }
}