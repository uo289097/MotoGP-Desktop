<?php
class Clasificacion
{

    private $documento;
    public function __construct()
    {
        $this->documento = "xml/circuitoEsquema.xml";
    }

    public function consultar()
    {
        $datos = file_get_contents($this->documento);
        if ($datos != null) {
            $xml = new SimpleXMLElement($datos);
            $duracion = $xml->vencedor['duracion'];
            $duracion = substr($duracion, 2, 5);
            $duracion = str_replace("M", ":", $duracion);
            echo "<h3>Vencedor y duración</h3>";
            echo "<p>Vencedor: {$xml->vencedor}. Duración: {$duracion}</p>";
            $primero = $xml->clasificacion->piloto;
            echo "<h3>Clasificación general tras la carrera de Mandalika</h3>";
            echo "<ol>";
            echo "<li>{$xml->clasificacion->piloto[0]} ({$xml->clasificacion->piloto[0]['puntos']} puntos)";
            echo "<li>{$xml->clasificacion->piloto[1]} ({$xml->clasificacion->piloto[1]['puntos']} puntos)";
            echo "<li>{$xml->clasificacion->piloto[2]} ({$xml->clasificacion->piloto[2]['puntos']} puntos)";
            echo "</ol>";

        }
    }
}
$clasificacion = new Clasificacion();
?>

<!DOCTYPE HTML>

<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>

    <meta name="author" content="Gabriel García Martínez" />
    <meta name="description" content="clasificaciones de la temporada 2025 de MotoGP tras la carrera de 
        Mandalika. Información sobre el vencedor, duración de la carrera y la clasificación general de 
        pilotos." />
    <meta name="keywords" content="MotoGP, clasificaciones 2025, carrera Mandalika, piloto ganador, 
        duración carrera, clasificación general, resultados MotoGP" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />

    <link rel="icon" type="img/ico" href="multimedia/favicon.ico" />
</head>

<body>
    <header>
        <h1><a href="index.html" title="MotoGP Desktop">MotoGP Desktop</a></h1>
        <nav>
            <a href="index.html" title="Documento inicial">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de la meteorología">Metereología</a>
            <a href="clasificaciones.php" title="Información de las clasificaciones" class="active">Clasificaciones</a>
            <a href="juegos.html" title="Juegos de MotoGP">Juegos</a>
            <a href="ayuda.html" title="Ayuda del proyecto">Ayuda</a>
        </nav>
    </header>
    <p>Estás en [<a href="index.html" title="Documento inicial">Inicio</a>] | [<strong>Clasificaciones</strong>]
    </p>
    <h2>Clasificaciones de MotoGP</h2>
    <main>
        <?php
        $clasificacion->consultar();
        ?>
    </main>
</body>

</html>