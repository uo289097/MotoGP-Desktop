<?php

session_start();
class Cronometro
{

    private $tiempo;
    private $inicio;

    public function __construct()
    {
        $this->tiempo = 0;
    }

    public function arrancar()
    {
        $this->inicio = microtime(true);
    }

    public function parar()
    {
        $actual = microtime(true);
        $this->tiempo = $actual - $this->inicio;
    }

    public function mostrar()
    {
        $totalSegundos = $this->tiempo;

        $minutos = floor($totalSegundos / 60);

        $segundos = $totalSegundos - ($minutos * 60);

        return sprintf("%02d:%04.1f", $minutos, $segundos);
    }
}

if (!isset($_SESSION['cronometro'])) {
    $_SESSION['cronometro'] = new Cronometro();
}

$c = $_SESSION['cronometro'];
$tiempoFinal = "";

if (count($_POST) > 0) {

    if (isset($_POST['botonArrancar']))
        $c->arrancar();
    if (isset($_POST['botonParar']))
        $c->parar();
    if (isset($_POST['botonMostrar']))
        $tiempoFinal = $c->mostrar();

    $_SESSION['cronometro'] = $c;
}
?>

<!DOCTYPE HTML>

<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Cronómetro PHP</title>

    <meta name="author" content="Gabriel García Martínez" />
    <meta name="description" content="Cronómetro PHP de MotoGP-Desktop: inicia, detén y muestra el tiempo. 
        Hecho en PHP." />
    <meta name="keywords" content="cronómetro PHP, medir tiempo PHP, cronómetro MotoGP Desktop" />
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
            <a href="clasificaciones.php" title="Información de las clasificaciones">Clasificaciones</a>
            <a href="juegos.html" title="Juegos de MotoGP" class="active">Juegos</a>
            <a href="ayuda.html" title="Ayuda del proyecto">Ayuda</a>
        </nav>
    </header>

    <p>Estás en [<a href="index.html" title="Documento inicial">Inicio</a>] |
        [<a href="juegos.html" title="Juegos">Juegos</a>] |
        [<strong>Cronometro PHP</strong>] </p>
    <main>
        <h2>Cronómetro PHP</h2>
        <p><?php echo $tiempoFinal ?></p>
        <form action="#" method="post" name="cronometro">
            <input type="submit" name="botonArrancar" value="Arrancar" />
            <input type="submit" name="botonParar" value="Parar" />
            <input type="submit" name="botonMostrar" value="Mostrar" />
        </form>
    </main>

</body>

</html>