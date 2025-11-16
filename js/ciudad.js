class Ciudad {

    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #longitud;
    #latitud;

    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;

    }

    inicializar(poblacion, longitud, latitud) {
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

    getMetereologiaCarrera(fechaCarrera) {
        const lat = this.#latitud;
        const lon = this.#longitud;

        // Configurar fecha en formato YYYY-MM-DD
        const fecha = fechaCarrera;
        // El servicio histórico de Open-Meteo devuelve datos para start_date = end_date

        const url = "https://historical-forecast-api.open-meteo.com/v1/forecast";

        jsonMet = $.ajax({
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

            // Identificación clara de datos horarios y diarios
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

            // Resultado final
            return {
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

        if (!jsonMet) {
            console.error("JSON meteorológico inválido o vacío");
            return null;
        }

        const datosHorarios = jsonMet.datosHorarios;
        const datosDiarios = jsonMet.datosDiarios;

        // Procesar datos horarios combinando cada hora con los valores correspondientes
        const registrosHorarios = datosHorarios.horas.map((hora, i) => ({
            hora: hora,
            temperatura: datosHorarios.temperatura[i],
            sensacionTermica: datosHorarios.sensacionTermica[i],
            lluvia: datosHorarios.lluvia[i],
            humedad: datosHorarios.humedad[i],
            vientoVelocidad: datosHorarios.vientoVelocidad[i],
            vientoDireccion: datosHorarios.vientoDireccion[i]
        }));

        // Procesar datos diarios
        const registroDiario = {
            fecha: datosDiarios.fecha,
            salidaSol: datosDiarios.salidaSol,
            puestaSol: datosDiarios.puestaSol
        };

        // Devolver un JSON limpio y listo para imprimir en UI
        return {
            ciudad: jsonMet.ciudad,
            pais: jsonMet.pais,
            coordenadas: jsonMet.coordenadas,
            diario: registroDiario,
            horario: registrosHorarios
        };
    }

}