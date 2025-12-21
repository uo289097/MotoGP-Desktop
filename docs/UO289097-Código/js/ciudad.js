class Ciudad {

    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #longitud;
    #latitud;
    #fechaCarrera = "2025-10-05";
    #startDate = "2025-10-03";
    #endDate = "2025-10-04";
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

    getMeteorologiaCarrera(callback) {
        const urlBase = "https://historical-forecast-api.open-meteo.com/v1/forecast";
        const url = `${urlBase}?latitude=${this.#latitud}&longitude=${this.#longitud}` +
            `&start_date=${this.#fechaCarrera}&end_date=${this.#fechaCarrera}&timezone=Asia/Singapore` +
            `&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,` +
            `wind_direction_10m,rain&daily=sunrise,sunset`;
        $.ajax({
            url: url,
            dataType: "json"
            , success: (data) => {
                this.#procesarJSONCarrera(data);
                if (callback) callback()
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
        section.append($("<h3>").text(`Datos meteorológicos de la carrera (${this.#fechaCarrera})`));

        const lista = $("<ul>");
        lista.append($("<li>").text(`Temperatura: ${datosCarrera.temperature_2m} ºC`));
        lista.append($("<li>").text(`Sensación térmica: ${datosCarrera.apparent_temperature} ºC`));
        lista.append($("<li>").text(`Humedad: ${datosCarrera.relative_humidity_2m} % `));
        lista.append($("<li>").text(`Lluvia: ${datosCarrera.rain} mm`));
        lista.append($("<li>").text(`Viento: ${datosCarrera.wind_speed_10m} km/h`));
        lista.append($("<li>").text(`Dirección del viento: ${datosCarrera.wind_direction_10m}º`));
        lista.append($("<li>").text(`Amanecer: ${datosCarrera.sunrise[0].split("T")[1]}`));
        lista.append($("<li>").text(`Atardecer: ${datosCarrera.sunset[0].split("T")[1]}`));

        section.append(lista);

        $("main").append(section);
    }

    getMeteorologiaEntrenos() {
        const urlBase = "https://historical-forecast-api.open-meteo.com/v1/forecast";
        const url = `${urlBase}?latitude=${this.#latitud}&longitude=${this.#longitud}` +
            `&start_date=${this.#startDate}&end_date=${this.#endDate}&timezone=Asia/Singapore` +
            `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,rain`;
        $.ajax({
            url: url,
            dataType: "json"
            , success: (data) => {
                this.#procesarJSONEntrenos(data);
            }, error: () => {
                console.error("Error al obtener los datos de la API");
            }
        });
    }

    #procesarJSONEntrenos(data) {
        //ENTRENOS 1 -> 10 - 11 (03)
        //ENTRENOS 2 -> 15 - 16 (03)
        //ENTRENOS 3 -> 10 - 11 (04)
        //SPRINT -> 15 (04) 
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
            temperature_2mV: temperature_2mV.toFixed(2),
            rainV: rainV.toFixed(2),
            relative_humidity_2mV: relative_humidity_2mV.toFixed(2),
            wind_speed_10mV: wind_speed_10mV.toFixed(2),

            temperature_2mS: temperature_2mS.toFixed(2),
            rainS: rainS.toFixed(2),
            relative_humidity_2mS: relative_humidity_2mS.toFixed(2),
            wind_speed_10mS: wind_speed_10mS.toFixed(2)
        };
        this.#mostrarDatosEntrenos(datosEntrenos);
    }

    #mostrarDatosEntrenos(datosEntrenos) {
        const section = $("<section>");
        section.append($("<h3>")
            .text(`Media de los datos meteorológicos de los entrenos del viernes (${this.#startDate})`));

        const listaV = $("<ul>");
        listaV.append($("<li>").text(`Temperatura: ${datosEntrenos.temperature_2mV} ºC`));
        listaV.append($("<li>").text(`Humedad: ${datosEntrenos.relative_humidity_2mV} % `));
        listaV.append($("<li>").text(`Lluvia: ${datosEntrenos.rainV} mm`));
        listaV.append($("<li>").text(`Viento: ${datosEntrenos.wind_speed_10mV} km/h`));

        section.append(listaV);

        const section2 = $("<section>");
        section2.append($("<h3>")
            .text(`Media de los datos meteorológicos de los entrenos del sábado (${this.#endDate})`));
        const listaS = $("<ul>");
        listaS.append($("<li>").text(`Temperatura: ${datosEntrenos.temperature_2mS} ºC`));
        listaS.append($("<li>").text(`Humedad: ${datosEntrenos.relative_humidity_2mS} % `));
        listaS.append($("<li>").text(`Lluvia: ${datosEntrenos.rainS} mm`));
        listaS.append($("<li>").text(`Viento: ${datosEntrenos.wind_speed_10mS} km/h`));

        section2.append(listaS);

        $("main").append(section);
        $("main").append(section2);
    }



}