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

    getMetereologiaCarrera() {
        const lat = this.#latitud;
        const lon = this.#longitud;

        const fecha = "2023-09-15";

        const url = "https://historical-forecast-api.open-meteo.com/v1/forecast";

        return $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: {
                latitude: lat,
                longitude: lon,
                start_date: fecha,
                end_date: fecha,
                hourly: [
                    "temperature_2m",
                    "apparent_temperature",
                    "precipitation",
                    "relative_humidity_2m",
                    "wind_speed_10m",
                    "wind_direction_10m"
                ].join(","),
                daily: [
                    "sunrise",
                    "sunset"
                ].join(","),
                timezone: "auto"
            }
        }).then(response => {

            const datosHorarios = {
                horas: response.hourly.time,
                temperatura: response.hourly.temperature_2m,
                sensacionTermica: response.hourly.apparent_temperature,
                lluvia: response.hourly.precipitation,
                humedad: response.hourly.relative_humidity_2m,
                vientoVelocidad: response.hourly.wind_speed_10m,
                vientoDireccion: response.hourly.wind_direction_10m
            };

            const datosDiarios = {
                fecha: response.daily.time[0],
                salidaSol: response.daily.sunrise[0],
                puestaSol: response.daily.sunset[0]
            };

            this.#meteorologia = {
                ciudad: this.#nombre,
                pais: this.#pais,
                coordenadas: { latitud: lat, longitud: lon },
                datosHorarios: datosHorarios,
                datosDiarios: datosDiarios
            };
        }).catch(err => {
            console.error("Error obteniendo meteorología:", err);
            return null;
        });
    }

    procesarJSONCarrera() {

        const datosMet = this.#meteorologia;

        if (!datosMet) {
            console.error("JSON meteorológico inválido o vacío");
            return null;
        }

        const datosHorarios = datosMet.datosHorarios;
        const datosDiarios = datosMet.datosDiarios;

        const registrosHorarios = datosHorarios.horas.map((hora, i) => ({
            hora: hora,
            temperatura: datosHorarios.temperatura[i],
            sensacionTermica: datosHorarios.sensacionTermica[i],
            lluvia: datosHorarios.lluvia[i],
            humedad: datosHorarios.humedad[i],
            vientoVelocidad: datosHorarios.vientoVelocidad[i],
            vientoDireccion: datosHorarios.vientoDireccion[i]
        }));

        const registroDiario = {
            fecha: datosDiarios.fecha,
            salidaSol: datosDiarios.salidaSol,
            puestaSol: datosDiarios.puestaSol
        };

        return {
            ciudad: datosMet.ciudad,
            pais: datosMet.pais,
            coordenadas: datosMet.coordenadas,
            diario: registroDiario,
            horario: registrosHorarios
        };
    }

    mostrarDatosCarrera() {

        const contenedor = document.querySelector("main section");

        const cargarDatos = this.#meteorologia
            ? Promise.resolve()
            : this.getMetereologiaCarrera();

        cargarDatos.then(() => {

            const datos = this.procesarJSONCarrera();
            if (!datos) return;

            const h3Diario = document.createElement("h3");
            h3Diario.textContent = "Datos del día de la carrera";
            contenedor.appendChild(h3Diario);

            const ulDiario = document.createElement("ul");

            const liFecha = document.createElement("li");
            liFecha.textContent = `Fecha: ${datos.diario.fecha}`;
            ulDiario.appendChild(liFecha);

            const liSalida = document.createElement("li");
            liSalida.textContent = `Salida del sol: ${datos.diario.salidaSol}`;
            ulDiario.appendChild(liSalida);

            const liPuesta = document.createElement("li");
            liPuesta.textContent = `Puesta del sol: ${datos.diario.puestaSol}`;
            ulDiario.appendChild(liPuesta);

            contenedor.appendChild(ulDiario);

            const reg = datos.horario[14];
            const h4 = document.createElement("h4");
            h4.textContent = `Hora: ${reg.hora}`;
            contenedor.appendChild(h4);

            const ul = document.createElement("ul");

            const liTemp = document.createElement("li");
            liTemp.textContent = `Temperatura: ${reg.temperatura} °C`;
            ul.appendChild(liTemp);

            const liSens = document.createElement("li");
            liSens.textContent = `Sensación térmica: ${reg.sensacionTermica} °C`;
            ul.appendChild(liSens);

            const liLluvia = document.createElement("li");
            liLluvia.textContent = `Lluvia: ${reg.lluvia} mm`;
            ul.appendChild(liLluvia);

            const liHumedad = document.createElement("li");
            liHumedad.textContent = `Humedad: ${reg.humedad} %`;
            ul.appendChild(liHumedad);

            const liViento = document.createElement("li");
            liViento.textContent = `Viento: ${reg.vientoVelocidad} km/h, dirección ${reg.vientoDireccion}°`;
            ul.appendChild(liViento);

            contenedor.appendChild(ul);
        });

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



}