<?php
require_once "configuracion.php";

$c = new Configuracion();

if (count($_POST) > 0) {
    if (isset($_POST['botonReiniciar']))
        $c->reiniciar();
    if (isset($_POST['botonEliminar']))
        $c->eliminar();
    if (isset($_POST['botonExportar']))
        $c->exportar();
    if (isset($_POST['botonInicializar']))
        $c->inicializar();
}
?>

<!DOCTYPE HTML>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Configuración</title>
    <link rel="stylesheet" href="../estilo/estilo.css">
    <link rel="stylesheet" href="../estilo/layout.css">
    <link rel="icon" type="img/ico" href="../multimedia/favicon.ico" />
</head>

<body>
    <main>
        <header>
            <h1><a href="../index.html" title="MotoGP Desktop">MotoGP Desktop</a></h1>
        </header>
        <h2>Configuración</h2>
        <form action="#" method="post" name="configuración">
            <input type="submit" name="botonReiniciar" value="Reiniciar BD" />
            <input type="submit" name="botonEliminar" value="Eliminar BD" />
            <input type="submit" name="botonExportar" value="Exportar BD" />
            <input type="submit" name="botonInicializar" value="Inicializar BD" />
        </form>
    </main>
</body>

</html>