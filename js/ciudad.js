class Ciudad {

    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #longitud;
    #latitud;
    #meteorologia;
    #meteorologiaEntrenos;

    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;

    }

    inicializar(poblacion, latitud, longitud) {
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

    getMeteorologiaEntrenos() {

        const lat = this.#latitud;
        const lon = this.#longitud;

        const fechaCarrera = "2023-09-15";

        const f = new Date(fechaCarrera);
        const f1 = new Date(f); f1.setDate(f.getDate() - 3);
        const f2 = new Date(f); f2.setDate(f.getDate() - 1);

        const fechaInicio = f1.toISOString().split("T")[0];
        const fechaFin = f2.toISOString().split("T")[0];

        const url = "https://historical-forecast-api.open-meteo.com/v1/forecast";

        return $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: {
                latitude: lat,
                longitude: lon,
                start_date: fechaInicio,
                end_date: fechaFin,
                hourly: [
                    "temperature_2m",
                    "precipitation",
                    "wind_speed_10m",
                    "relative_humidity_2m"
                ].join(","),
                timezone: "auto"
            }
        })
            .then(response => {

                const jsonEntrenos = {
                    ciudad: this.#nombre,
                    pais: this.#pais,
                    coordenadas: { latitud: lat, longitud: lon },

                    datosHorarios: {
                        horas: response.hourly.time,
                        temperatura: response.hourly.temperature_2m,
                        lluvia: response.hourly.precipitation,
                        vientoVelocidad: response.hourly.wind_speed_10m,
                        humedad: response.hourly.relative_humidity_2m
                    }
                };

                this.#meteorologiaEntrenos = jsonEntrenos;

                return jsonEntrenos;
            })
            .catch(err => {
                console.error("Error obteniendo meteorología de entrenos:", err);
                return null;
            });
    }

    procesarJSONEntrenos() {

        const datos = this.#meteorologiaEntrenos;

        if (!datos) {
            console.error("No hay datos de entrenos para procesar.");
            return null;
        }

        const horas = datos.datosHorarios.horas;
        const temp = datos.datosHorarios.temperatura;
        const lluvia = datos.datosHorarios.lluvia;
        const viento = datos.datosHorarios.vientoVelocidad;
        const humedad = datos.datosHorarios.humedad;

        const dias = {};

        horas.forEach((timestamp, i) => {
            const dia = timestamp.split("T")[0];

            if (!dias[dia]) dias[dia] = [];
            dias[dia].push(i);
        });

        const medias = [];

        Object.keys(dias).forEach(dia => {
            const indices = dias[dia];

            const mediaTemp = (indices.reduce((s, i) => s + temp[i], 0) / indices.length).toFixed(2);
            const mediaLluvia = (indices.reduce((s, i) => s + lluvia[i], 0) / indices.length).toFixed(2);
            const mediaViento = (indices.reduce((s, i) => s + viento[i], 0) / indices.length).toFixed(2);
            const mediaHumedad = (indices.reduce((s, i) => s + humedad[i], 0) / indices.length).toFixed(2);

            medias.push({
                dia: dia,
                temperatura: parseFloat(mediaTemp),
                lluvia: parseFloat(mediaLluvia),
                viento: parseFloat(mediaViento),
                humedad: parseFloat(mediaHumedad)
            });
        });

        return {
            ciudad: datos.ciudad,
            pais: datos.pais,
            coordenadas: datos.coordenadas,
            mediasPorDia: medias
        };
    }

    mostrarDatosEntrenos() {

        const contenedor = document.querySelector("main section");

        const cargarDatos = this.#meteorologiaEntrenos
            ? Promise.resolve()
            : this.getMeteorologiaEntrenos();

        cargarDatos.then(() => {

            const datos = this.procesarJSONEntrenos();
            if (!datos) return;

            const titulo = document.createElement("h3");
            titulo.textContent = "Medias meteorológicas de entrenamientos (3 días previos)";
            contenedor.appendChild(titulo);

            datos.mediasPorDia.forEach(dia => {

                const h4 = document.createElement("h4");
                h4.textContent = `Día: ${dia.dia}`;
                contenedor.appendChild(h4);

                const ul = document.createElement("ul");

                const liTemp = document.createElement("li");
                liTemp.textContent = `Temperatura media: ${dia.temperatura} °C`;
                ul.appendChild(liTemp);

                const liLluvia = document.createElement("li");
                liLluvia.textContent = `Lluvia media: ${dia.lluvia} mm`;
                ul.appendChild(liLluvia);

                const liViento = document.createElement("li");
                liViento.textContent = `Viento medio: ${dia.viento} km/h`;
                ul.appendChild(liViento);

                const liHumedad = document.createElement("li");
                liHumedad.textContent = `Humedad media: ${dia.humedad} %`;
                ul.appendChild(liHumedad);

                contenedor.appendChild(ul);
            });
        });
    }





    getMeteorologiaCarrera() {
        const fechaCarrera = "2025-10-05";
        const urlBase = "https://historical-forecast-api.open-meteo.com/v1/forecast";
        const url = `${urlBase}?latitude=${this.#latitud}&longitude=${this.#longitud}` +
            `&start_date=${fechaCarrera}&end_date=${fechaCarrera}&timezone=Asia/Singapore` +
            `&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,` +
            `wind_direction_10m,rain&daily=sunrise,sunset`;
        $.ajax({
            url: url,
            dataType: "json"
            , success: (data) => {
                this.#procesarJSONCarrera(data);
            }, error: () => {
                console.error("Error al obtener los datos de la API");
            }
        });
    }

    #procesarJSONCarrera(data) {
        const temperature_2m = data.hourly.temperature_2m[15];
        const apparent_temperature = data.hourly.apparent_temperature[15];
        const rain = data.hourly.rain[15];
        const relative_humidity_2m = data.hourly.relative_humidity_2m[15];
        const wind_speed_10m = data.hourly.wind_speed_10m[15];
        const wind_direction_10m = data.hourly.wind_direction_10m[15];

        const sunrise = data.daily.sunrise;
        const sunset = data.daily.sunset;

        const datosCarrera = {
            temperature_2m,
            apparent_temperature,
            rain,
            relative_humidity_2m,
            wind_speed_10m,
            wind_direction_10m,
            sunrise,
            sunset
        };
        this.#mostrarDatosCarrera(datosCarrera);
    }

    #mostrarDatosCarrera(datosCarrera) {
        const section = $("<section>");
        section.append($("<h3>").text("Datos meteorológicos de la carrera"));

        const lista = $("<ul>");
        lista.append($("<li>").text(`Temperatura: ${datosCarrera.temperature_2m} ºC`));
        lista.append($("<li>").text(`Sensación térmica: ${datosCarrera.apparent_temperature} ºC`));
        lista.append($("<li>").text(`Humedad: ${datosCarrera.relative_humidity_2m}%`));
        lista.append($("<li>").text(`Lluvia: ${datosCarrera.rain} mm`));
        lista.append($("<li>").text(`Viento: ${datosCarrera.wind_speed_10m} km/h`));
        lista.append($("<li>").text(`Dirección del viento: ${datosCarrera.wind_direction_10m}º`));
        lista.append($("<li>").text(`Amanecer: ${datosCarrera.sunrise[0].split("T")[1]}`));
        lista.append($("<li>").text(`Atardecer: ${datosCarrera.sunset[0].split("T")[1]}`));

        section.append(lista);

        $("main").append(section);
    }

    getMeteorologiaEntrenos2() {
        const startDate = "2025-10-03";
        const endDate = "2025-10-04";
        const urlBase = "https://historical-forecast-api.open-meteo.com/v1/forecast";
        const url = `${urlBase}?latitude=${this.#latitud}&longitude=${this.#longitud}` +
            `&start_date=${startDate}&end_date=${endDate}&timezone=Asia/Singapore` +
            `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,rain`;
        $.ajax({
            url: url,
            dataType: "json"
            , success: (data) => {
                this.#procesarJSONEntrenos2(data);
            }, error: () => {
                console.error("Error al obtener los datos de la API");
            }
        });
    }

    #procesarJSONEntrenos2(data) {
        console.log(data);
        //ENTRENOS 1 -> 10 - 11 (03)
        //ENTRENOS 2 -> 15 - 16 (03) -> MEDIA DE ESTAS 4
        //ENTRENOS 3 -> 10 - 11 (04)
        //SPRINT -> 15 (04) -> MEDIA DE ESTAS 3
        const temperature_2mV = (data.hourly.temperature_2m[10] + data.hourly.temperature_2m[11]
            + data.hourly.temperature_2m[15] + data.hourly.temperature_2m[16]) / 4;
        const rainV = (data.hourly.rain[10] + data.hourly.rain[11]
            + data.hourly.rain[15] + data.hourly.rain[16]) / 4;
        const relative_humidity_2mV = (data.hourly.relative_humidity_2m[10] + data.hourly.relative_humidity_2m[11]
            + data.hourly.relative_humidity_2m[15] + data.hourly.temperature_2m[16]) / 4;
        const wind_speed_10mV = (data.hourly.wind_speed_10m[10] + data.hourly.wind_speed_10m[11]
            + data.hourly.wind_speed_10m[15] + data.hourly.wind_speed_10m[16]) / 4;

        const temperature_2mS = (data.hourly.temperature_2m[10] + data.hourly.temperature_2m[11]
            + data.hourly.temperature_2m[15]) / 3;
        const rainS = (data.hourly.rain[10] + data.hourly.rain[11] + data.hourly.rain[15]) / 3;
        const relative_humidity_2mS = (data.hourly.relative_humidity_2m[10] + data.hourly.relative_humidity_2m[11]
            + data.hourly.relative_humidity_2m[15]) / 3;
        const wind_speed_10mS = (data.hourly.wind_speed_10m[10] + data.hourly.wind_speed_10m[11]
            + data.hourly.wind_speed_10m[15]) / 3;


        const datosEntrenos = {
            temperature_2mV,
            rainV,
            relative_humidity_2mV,
            wind_speed_10mV,
            temperature_2mS,
            rainS,
            relative_humidity_2mS,
            wind_speed_10mS
        };
        this.#mostrarDatosEntrenos2(datosEntrenos);
    }

    #mostrarDatosEntrenos2(datosEntrenos) {
        console.log(datosEntrenos);
    }



}